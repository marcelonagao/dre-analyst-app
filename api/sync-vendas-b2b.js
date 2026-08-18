import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

function formatarDataECompetencia(dataString) {
  if (!dataString) return { dataVenda: new Date().toISOString(), competencia: "N/A" };
  const d = new Date(dataString);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return { dataVenda: d.toISOString(), competencia: `${mes}/${ano}` };
}

export default async function handler(req, res) {
  console.log("🚀 Iniciando Sync B2B com Regras de Venda Externa...");

  try {
    // 1. RENOVAR TOKEN B2B
    let { data: tokenData } = await supabase.from('bling_tokens').select('refresh_token').eq('conta', 'B2B').single();
    if (!tokenData) throw new Error("Token B2B não encontrado.");

    const credentials = Buffer.from(`${process.env.BLING_B2B_CLIENT_ID}:${process.env.BLING_B2B_CLIENT_SECRET}`).toString('base64');
    
    const tokenResponse = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${credentials}` },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: tokenData.refresh_token })
    });
    const tokenInfo = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error("Erro ao renovar token B2B");

    await supabase.from('bling_tokens').upsert({ conta: 'B2B', refresh_token: tokenInfo.refresh_token });
    const accessToken = tokenInfo.access_token;

    // 2. CARREGAR KITS E CUSTOS DO SUPABASE
    const { data: kitsData } = await supabase.from('kits').select('*');
    const mapaKits = {};
    if (kitsData) {
      kitsData.forEach(k => {
        if (!mapaKits[k.sku_kit]) mapaKits[k.sku_kit] = [];
        mapaKits[k.sku_kit].push({ skuComp: k.sku_componente, qtdComp: Number(k.quantidade_componente) });
      });
    }

    const { data: produtosData } = await supabase.from('produtos').select('sku, custo_unitario');
    const mapaCustos = {};
    if (produtosData) {
      produtosData.forEach(p => {
        mapaCustos[p.sku] = Number(p.custo_unitario) || 0;
      });
    }

    // 3. BUSCAR ÚLTIMOS PEDIDOS BLING B2B
    const resPedidos = await fetch(`https://www.bling.com.br/Api/v3/pedidos/vendas?limite=20`, {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
    });
    const pedidosData = await resPedidos.json();

    if (pedidosData.error) throw new Error(`Erro do Bling: ${pedidosData.error.message || JSON.stringify(pedidosData.error)}`);

    const pedidosList = pedidosData.data || [];
    if (pedidosList.length === 0) return res.status(200).json({ success: true, message: "Sem pedidos B2B novos." });

    let linhasParaInserir = [];
    let orderIdsProcessados = [];

    // 4. PROCESSAR REGRAS ESPECÍFICAS DE B2B
    for (const pedidoBling of pedidosList) {
      const orderId = String(pedidoBling.numero);
      orderIdsProcessados.push(orderId);

      const resDetalhe = await fetch(`https://www.bling.com.br/Api/v3/pedidos/vendas/${pedidoBling.id}`, {
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
      });
      const detalheData = await resDetalhe.json();
      const pedidoCompleto = detalheData.data;
      if (!pedidoCompleto || !pedidoCompleto.itens) continue;

      const { dataVenda, competencia } = formatarDataECompetencia(pedidoCompleto.data);
      const statusDesc = pedidoCompleto.situacao.id === 12 ? "Cancelado" : "Atendido"; 

      // REGRA 1: Valida se a Nota Fiscal foi emitida no Bling
      const temNF = !!(pedidoCompleto.notaFiscal && pedidoCompleto.notaFiscal.id);

      for (const item of pedidoCompleto.itens) {
        const skuVendido = String(item.codigo).trim();
        const quantidadeVendida = Number(item.quantidade) || 1;
        const faturamentoItem = Number(item.valor) * quantidadeVendida;

        const componentesKit = mapaKits[skuVendido];
        
        // REGRA 3: Explosão de Kits continua ativa
        if (componentesKit && componentesKit.length > 0) {
          for (const comp of componentesKit) {
            const proporcaoFaturamento = 1 / componentesKit.length; 
            const qtdEfetiva = quantidadeVendida * comp.qtdComp;
            
            const custoUnitarioComp = mapaCustos[comp.skuComp] || 0;
            const custoTotalProduto = custoUnitarioComp * qtdEfetiva;
            const fatProporcional = faturamentoItem * proporcaoFaturamento;
            
            // APLICANDO AS NOVAS REGRAS
            const imposto = temNF ? (fatProporcional * 0.11) : 0;
            const embalagem = 0; // REGRA 2: Custo Zero
            const lucroLiquido = fatProporcional - imposto - embalagem - custoTotalProduto; 
            
            linhasParaInserir.push({
              order_id: orderId, plataforma: "B2B", status: statusDesc, competencia: competencia,
              sku: comp.skuComp, quantidade: qtdEfetiva, faturamento_bruto: fatProporcional,
              taxas_plataforma: 0, imposto: imposto, custo_embalagem: embalagem,
              custo_unitario: custoUnitarioComp, custo_total_produto: custoTotalProduto, lucro_liquido: lucroLiquido,
              data_venda: dataVenda
            });
          }
        } else {
          // PRODUTO SIMPLES
          const custoUnitarioProd = mapaCustos[skuVendido] || 0;
          const custoTotalProduto = custoUnitarioProd * quantidadeVendida;
          
          // APLICANDO AS NOVAS REGRAS
          const imposto = temNF ? (faturamentoItem * 0.11) : 0;
          const embalagem = 0; // REGRA 2: Custo Zero
          const lucroLiquido = faturamentoItem - imposto - embalagem - custoTotalProduto;

          linhasParaInserir.push({
            order_id: orderId, plataforma: "B2B", status: statusDesc, competencia: competencia,
            sku: skuVendido, quantidade: quantidadeVendida, faturamento_bruto: faturamentoItem,
            taxas_plataforma: 0, imposto: imposto, custo_embalagem: embalagem,
            custo_unitario: custoUnitarioProd, custo_total_produto: custoTotalProduto, lucro_liquido: lucroLiquido,
            data_venda: dataVenda
          });
        }
      }
    }

    if (linhasParaInserir.length > 0) {
      await supabase.from('vendas').delete().in('order_id', orderIdsProcessados).eq('plataforma', 'B2B');
      const { error: insertError } = await supabase.from('vendas').insert(linhasParaInserir);
      if (insertError) throw insertError;
    }

    return res.status(200).json({ success: true, message: `${linhasParaInserir.length} linhas calculadas com as Novas Regras B2B!`});

  } catch (error) {
    console.error("Erro B2B:", error);
    return res.status(500).json({ error: error.message });
  }
}