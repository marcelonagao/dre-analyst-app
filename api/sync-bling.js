import { createClient } from '@supabase/supabase-js';

// 1. FORÇANDO A CHAVE DE SUPERADMIN (Ignora o bloqueio de permissão)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error("⚠️ CHAVE SERVICE_ROLE NÃO ENCONTRADA NAS VARIÁVEIS DA VERCEL!");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// 2. FUNÇÃO QUE BUSCA NO BLING E SALVA O TOKEN NOVO
async function buscarProdutosBling(clientId, clientSecret, envRefreshToken, contaNome) {
  if (!clientId || !clientSecret) return [];

  try {
    // Tenta ler o token atualizado do banco de dados
    let { data: tokenData } = await supabase
      .from('bling_tokens')
      .select('refresh_token')
      .eq('conta', contaNome)
      .single();

    let tokenParaUsar = tokenData ? tokenData.refresh_token : envRefreshToken;

    if (!tokenParaUsar) {
      console.warn(`⚠️ Nenhum Refresh Token para a conta ${contaNome}.`);
      return [];
    }

    // Solicita o acesso ao Bling
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokenParaUsar
      })
    });

    const tokenInfo = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error(`❌ Erro OAuth no Bling ${contaNome}:`, tokenInfo);
      return [];
    }

    // 3. PRIORIDADE MÁXIMA: TENTA SALVAR O TOKEN IMEDIATAMENTE (E ISOLA O ERRO)
    try {
      const { error: dbError } = await supabase
        .from('bling_tokens')
        .upsert({ conta: contaNome, refresh_token: tokenInfo.refresh_token });

      if (dbError) {
        console.error(`❌ ALERTA: Supabase recusou salvar o token do ${contaNome}! Motivo:`, dbError.message);
      } else {
        console.log(`💾 Novo Refresh Token do ${contaNome} salvo com sucesso no banco!`);
      }
    } catch (err) {
      console.error(`❌ Erro crítico ao conectar com Supabase para salvar token:`, err);
    }

    const accessToken = tokenInfo.access_token;

    // Busca os produtos e estoques
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

// 4. FUNÇÃO PRINCIPAL QUE RODA NA VERCEL
export default async function handler(req, res) {
  try {
    console.log("🚀 Iniciando Sincronização Dupla Bling (B2B + B2C) ➔ Supabase...");

    // Executa as duas consultas usando os nomes EXATOS das variáveis da sua Vercel
    const [prodsB2B, prodsB2C] = await Promise.all([
      buscarProdutosBling(
        process.env.BLING_B2B_CLIENT_ID,
        process.env.BLING_B2B_CLIENT_SECRET,
        process.env.BLING_REFRESH_TOKEN_B2B,
        'B2B'
      ),
      buscarProdutosBling(
        process.env.BLING_CLIENT_ID_B2C,
        process.env.BLING_CLIENT_SECRET_B2C,
        process.env.BLING_REFRESH_TOKEN_B2C,
        'B2C'
      )
    ]);

    const estoqueConsolidadoMap = new Map();

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

    for (const p of prodsB2C) {
      if (estoqueConsolidadoMap.has(p.sku)) {
        const itemExistente = estoqueConsolidadoMap.get(p.sku);
        itemExistente.estoque_atual += p.estoque;
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
      // GRAVANDO NO BANCO (Agora com a chave de Superadmin garantida)
      const { error: errSupabase } = await supabase
        .from('produtos')
        .upsert(produtosParaAtualizar, { onConflict: 'sku' });

      if (errSupabase) throw errSupabase;

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