import { createClient } from '@supabase/supabase-js';

// 1. FORÇANDO A CHAVE DE SUPERADMIN
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error("⚠️ CHAVE SERVICE_ROLE NÃO ENCONTRADA NAS VARIÁVEIS DA VERCEL!");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ============================================================================
// 🧠 INTELIGÊNCIA DINÂMICA: Avalia o produto com base nas regras do banco
// ============================================================================

// 🌟 NOVO: Função que tira acentos, cedilhas e deixa tudo maiúsculo
function normalizarTexto(texto) {
  if (!texto) return "";
  // Transforma "Sérum Facial " em "SERUM FACIAL"
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
}

function aplicarRegrasDinamicas(nomeProduto, regrasDaBase) {
  if (!nomeProduto) return { categoria: "Outros", subcategoria: "Diversos" };
  
  // Limpa o nome do produto que veio do Bling
  const nomeLimpo = normalizarTexto(nomeProduto);

  // Varre todas as regras cadastradas no Supabase
  for (const regra of regrasDaBase) {
    if (regra.palavra_chave) {
      // Limpa a palavra-chave que veio da sua tabela
      const palavraLimpa = normalizarTexto(regra.palavra_chave);
      
      // Verifica se a palavra da regra existe dentro do nome do produto
      if (nomeLimpo.includes(palavraLimpa)) {
        return { 
          categoria: regra.categoria || "Outros", 
          subcategoria: regra.subcategoria || "Diversos" 
        };
      }
    }
  }

  return { categoria: "Outros", subcategoria: "Não Classificado" };
}

// 2. FUNÇÃO QUE BUSCA NO BLING E CLASSIFICA OS PRODUTOS
async function buscarProdutosBling(clientId, clientSecret, envRefreshToken, contaNome, regrasDaBase) {
  if (!clientId || !clientSecret) return [];

  try {
    let { data: tokenData } = await supabase.from('bling_tokens').select('refresh_token').eq('conta', contaNome).single();
    let tokenParaUsar = tokenData ? tokenData.refresh_token : envRefreshToken;

    if (!tokenParaUsar) return [];

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${credentials}` },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: tokenParaUsar })
    });

    const tokenInfo = await tokenResponse.json();
    if (!tokenResponse.ok) return [];

    try {
      await supabase.from('bling_tokens').upsert({ conta: contaNome, refresh_token: tokenInfo.refresh_token });
    } catch (err) {
      console.error(`Erro ao salvar token:`, err);
    }

    const accessToken = tokenInfo.access_token;
    let pagina = 1;
    let temMaisPaginas = true;
    let produtosConta = [];

    // Busca até 100 páginas (10.000 produtos)
    while (temMaisPaginas && pagina <= 100) {
      const blingRes = await fetch(`https://www.bling.com.br/Api/v3/produtos?pagina=${pagina}&limite=100&tipo=P&situacao=A`, {
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
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
        const nomeProd = prod.nome || 'Produto Sem Nome';
        const estoqueFisico = Math.round(Number(prod.estoque?.saldoFisicoTotal || prod.estoque?.saldoVirtualTotal) || 0);
        const custoUnitario = Number(prod.precoCusto || prod.preco) || 0;

        // 🧠 APLICA A INTELIGÊNCIA DINÂMICA AQUI
        const classificacao = aplicarRegrasDinamicas(nomeProd, regrasDaBase);

        produtosConta.push({
          sku,
          nome: nomeProd,
          marca: prod.brand || prod.marca || 'Sem Marca', // A marca já vem do Bling
          custoUnitario,
          estoque: estoqueFisico,
          categoria: classificacao.categoria,
          subcategoria: classificacao.subcategoria
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

// 3. FUNÇÃO PRINCIPAL QUE RODA NA VERCEL
export default async function handler(req, res) {
  try {
    console.log("🚀 Iniciando Sincronização e Categorização Dinâmica...");

    // 🌟 NOVO: O robô baixa o "livro de regras" do Supabase antes de começar!
    const { data: regrasData, error: regrasError } = await supabase.from('regras_categorias').select('*');
    if (regrasError) console.error("Aviso: Erro ao baixar regras de categoria:", regrasError.message);
    const regrasDaBase = regrasData || [];

    // Executa as buscas passando o livro de regras para a função
    const [prodsB2B, prodsB2C] = await Promise.all([
      buscarProdutosBling(process.env.BLING_B2B_CLIENT_ID, process.env.BLING_B2B_CLIENT_SECRET, process.env.BLING_REFRESH_TOKEN_B2B, 'B2B', regrasDaBase),
      buscarProdutosBling(process.env.BLING_CLIENT_ID_B2C, process.env.BLING_CLIENT_SECRET_B2C, process.env.BLING_REFRESH_TOKEN_B2C, 'B2C', regrasDaBase)
    ]);

    const estoqueConsolidadoMap = new Map();

    const processarProdutos = (lista) => {
      for (const p of lista) {
        if (estoqueConsolidadoMap.has(p.sku)) {
          const item = estoqueConsolidadoMap.get(p.sku);
          item.estoque_atual += p.estoque;
          if (p.custoUnitario > 0) item.custo_unitario = p.custoUnitario;
        } else {
          estoqueConsolidadoMap.set(p.sku, {
            sku: p.sku,
            nome: p.nome,
            marca: p.marca,
            categoria: p.categoria,
            subcategoria: p.subcategoria,
            custo_unitario: p.custoUnitario,
            estoque_atual: p.estoque,
            lead_time: 15
          });
        }
      }
    };

    processarProdutos(prodsB2B);
    processarProdutos(prodsB2C);

    const produtosParaAtualizar = Array.from(estoqueConsolidadoMap.values());

    if (produtosParaAtualizar.length > 0) {
      const { error: errSupabase } = await supabase
        .from('produtos')
        .upsert(produtosParaAtualizar, { onConflict: 'sku' });

      if (errSupabase) throw errSupabase;

      return res.status(200).json({
        success: true,
        mensagem: `${produtosParaAtualizar.length} produtos sincronizados, consolidados e categorizados com sucesso!`,
      });
    }

    return res.status(200).json({ success: true, mensagem: "Nenhum dado retornado dos Blings." });

  } catch (error) {
    console.error("Erro na sincronização:", error);
    return res.status(500).json({ error: error.message });
  }
}