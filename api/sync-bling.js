import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Função auxiliar para autenticar e buscar produtos de UMA conta Bling
async function buscarProdutosBling(clientId, clientSecret, refreshToken, contaNome) {
  if (!clientId || !clientSecret || !refreshToken) {
    console.warn(`⚠️ Credenciais da conta ${contaNome} não foram totalmente configuradas.`);
    return [];
  }

  try {
    // 1. OBTÉM ACCESS TOKEN VIA OAUTH2
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const tokenResponse = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error(`❌ Erro OAuth no Bling ${contaNome}:`, tokenData);
      return [];
    }

    const accessToken = tokenData.access_token;

    // 2. BUSCA PAGINADA DE PRODUTOS E ESTOQUES
    let pagina = 1;
    let temMaisPaginas = true;
    let produtosConta = [];

    while (temMaisPaginas && pagina <= 10) {
      const blingRes = await fetch(`https://www.bling.com.br/Api/v3/produtos?pagina=${pagina}&limite=100&tipo=P`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!blingRes.ok) break;

      const blingData = await blingRes.json();
      const listaProdutos = blingData.data || [];

      if (listaProdutos.length === 0) {
        temMaisPaginas = false;
        break;
      }

      for (const prod of listaProdutos) {
        if (!prod.codigo) continue;

        const sku = String(prod.codigo).trim();
        const estoqueFisico = Math.round(Number(prod.estoque?.saldoFisicoTotal || prod.estoque?.saldoVirtualTotal) || 0);
        const custoUnitario = Number(prod.precoCusto || prod.preco) || 0;

        produtosConta.push({
          sku,
          nome: prod.nome || 'Produto Sem Nome',
          marca: prod.brand || prod.marca || 'Sem Marca',
          custoUnitario,
          estoque: estoqueFisico
        });
      }

      pagina++;
    }

    console.log(`✅ Bling ${contaNome}: ${produtosConta.length} SKUs encontrados.`);
    return produtosConta;

  } catch (err) {
    console.error(`Erro ao consultar Bling ${contaNome}:`, err);
    return [];
  }
}

export default async function handler(req, res) {
  try {
    console.log("🚀 Iniciando Sincronização Dupla Bling (B2B + B2C) ➔ Supabase...");

    // Executa as duas consultas em paralelo para máxima velocidade
    const [prodsB2B, prodsB2C] = await Promise.all([
      buscarProdutosBling(
        process.env.BLING_B2B_CLIENT_ID,
        process.env.BLING_B2B_CLIENT_SECRET,
        process.env.BLING_B2B_REFRESH_TOKEN,
        'B2B'
      ),
      buscarProdutosBling(
        process.env.BLING_B2C_CLIENT_ID,
        process.env.BLING_B2C_CLIENT_SECRET,
        process.env.BLING_B2C_REFRESH_TOKEN,
        'B2C'
      )
    ]);

    // MAPA DE CONSOLIDAÇÃO POR SKU
    const estoqueConsolidadoMap = new Map();

    // 1. Processa B2B
    for (const p of prodsB2B) {
      estoqueConsolidadoMap.set(p.sku, {
        sku: p.sku,
        nome: p.nome,
        marca: p.marca,
        custo_unitario: p.custoUnitario,
        estoque_atual: p.estoque,
        lead_time: 15
      });
    }

    // 2. Processa B2C (Soma estoque se o SKU já existir no B2B)
    for (const p of prodsB2C) {
      if (estoqueConsolidadoMap.has(p.sku)) {
        const itemExistente = estoqueConsolidadoMap.get(p.sku);
        itemExistente.estoque_atual += p.estoque; // Soma o estoque B2B + B2C
        if (p.custoUnitario > 0) itemExistente.custo_unitario = p.custoUnitario;
      } else {
        estoqueConsolidadoMap.set(p.sku, {
          sku: p.sku,
          nome: p.nome,
          marca: p.marca,
          custo_unitario: p.custoUnitario,
          estoque_atual: p.estoque,
          lead_time: 15
        });
      }
    }

    const produtosParaAtualizar = Array.from(estoqueConsolidadoMap.values());

    if (produtosParaAtualizar.length > 0) {
      const { error: errSupabase } = await supabase
        .from('produtos')
        .upsert(produtosParaAtualizar, { onConflict: 'sku' });

      if (errSupabase) throw errSupabase;

      console.log(`🎉 Sincronização concluída com sucesso! ${produtosParaAtualizar.length} SKUs consolidados.`);

      return res.status(200).json({
        success: true,
        mensagem: `${produtosParaAtualizar.length} produtos consolidados entre B2B e B2C.`,
        skusConsolidados: produtosParaAtualizar.length,
        totalB2B: prodsB2B.length,
        totalB2C: prodsB2C.length
      });
    }

    return res.status(200).json({ success: true, mensagem: "Nenhum dado retornado dos Blings." });

  } catch (error) {
    console.error("Erro na sincronização B2B/B2C:", error);
    return res.status(500).json({ error: error.message });
  }
}