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
// 🧠 INTELIGÊNCIA DE CATEGORIAS: Regras Fixas (Hardcoded)
// ============================================================================

function limparTexto(texto) {
    if (!texto) return '';
    return texto
        .normalize('NFD') // Separa o caractere do acento
        .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
        .trim()
        .toUpperCase(); // Deixa tudo em maiúsculo para não falhar
}

// Suas 86 regras otimizadas!
const regrasCategorizacao = [
  { palavra_chave: 'Mousse', categoria: 'Cuidados Faciais', subcategoria: 'Limpeza Facial' },
  { palavra_chave: 'Body Splash', categoria: 'Perfumaria', subcategoria: 'Body Splash' },
  { palavra_chave: 'Demaquilante', categoria: 'Cuidados Faciais', subcategoria: 'Limpeza Facial' },
  { palavra_chave: 'Skincare', categoria: 'Cuidados Faciais', subcategoria: 'Tratamento Facial' },
  { palavra_chave: 'Esfoliante', categoria: 'Cuidados Corporais', subcategoria: 'Esfoliação Corporal' },
  { palavra_chave: 'Sérum', categoria: 'Cuidados Faciais', subcategoria: 'Tratamento Facial' },
  { palavra_chave: 'Gloss', categoria: 'Maquiagem', subcategoria: 'Lábios' },
  { palavra_chave: 'Gelatina', categoria: 'Cabelos', subcategoria: 'Finalizadores' },
  { palavra_chave: 'Bruma', categoria: 'Maquiagem', subcategoria: 'Fixadores e Preparadores' },
  { palavra_chave: 'Glitter', categoria: 'Maquiagem', subcategoria: 'Olhos e Rosto' },
  { palavra_chave: 'Máscara Facial', categoria: 'Cuidados Faciais', subcategoria: 'Tratamento Facial' },
  { palavra_chave: 'Pó Facial', categoria: 'Maquiagem', subcategoria: 'Rosto' },
  { palavra_chave: 'Lip Tint', categoria: 'Maquiagem', subcategoria: 'Lábios' },
  { palavra_chave: 'Hidratante', categoria: 'Cuidados Faciais', subcategoria: 'Hidratação Facial' },
  { palavra_chave: 'Óleo', categoria: 'Cuidados Faciais', subcategoria: 'Tratamento Facial' },
  { palavra_chave: 'Cílios', categoria: 'Maquiagem', subcategoria: 'Olhos' },
  { palavra_chave: 'Delineador', categoria: 'Maquiagem', subcategoria: 'Olhos' },
  { palavra_chave: 'Corretivo', categoria: 'Maquiagem', subcategoria: 'Rosto' },
  { palavra_chave: 'Água Micelar', categoria: 'Cuidados Faciais', subcategoria: 'Limpeza Facial' },
  { palavra_chave: 'Sabonete', categoria: 'Cuidados Faciais', subcategoria: 'Limpeza Facial' },
  { palavra_chave: 'Amolecedor', categoria: 'Cuidados com as Unhas', subcategoria: 'Tratamento para Unhas' },
  { palavra_chave: 'Fixador', categoria: 'Maquiagem', subcategoria: 'Fixadores e Preparadores' },
  { palavra_chave: 'Base', categoria: 'Maquiagem', subcategoria: 'Rosto' },
  { palavra_chave: 'Blush', categoria: 'Maquiagem', subcategoria: 'Rosto' },
  { palavra_chave: 'Iluminador', categoria: 'Maquiagem', subcategoria: 'Rosto' },
  { palavra_chave: 'Batom', categoria: 'Maquiagem', subcategoria: 'Lábios' },
  { palavra_chave: 'Contorno', categoria: 'Maquiagem', subcategoria: 'Rosto' },
  { palavra_chave: 'Tônico', categoria: 'Cuidados Faciais', subcategoria: 'Limpeza e Tonificação' },
  { palavra_chave: 'Adstringente', categoria: 'Cuidados Faciais', subcategoria: 'Limpeza Facial' },
  { palavra_chave: 'Blindagem', categoria: 'Maquiagem', subcategoria: 'Fixadores e Preparadores' },
  { palavra_chave: 'Navalha', categoria: 'Acessórios de Beleza', subcategoria: 'Depilação' },
  { palavra_chave: 'Gel', categoria: 'Maquiagem', subcategoria: 'Olhos' },
  { palavra_chave: 'Balm', categoria: 'Cuidados Faciais', subcategoria: 'Hidratação Labial' },
  { palavra_chave: 'Henna', categoria: 'Maquiagem', subcategoria: 'Sobrancelhas' },
  { palavra_chave: 'Sabonete Íntimo', categoria: 'Cuidados Pessoais', subcategoria: 'Higiene Íntima' },
  { palavra_chave: 'Lenço', categoria: 'Cuidados Faciais', subcategoria: 'Limpeza Facial' },
  { palavra_chave: 'Maquiagem', categoria: 'Cuidados Pessoais', subcategoria: 'Kits' },
  { palavra_chave: 'Cuidados', categoria: 'Cuidados Corporais', subcategoria: 'Kits' },
  { palavra_chave: 'Espuma', categoria: 'Cuidados Faciais', subcategoria: 'Limpeza Facial' },
  { palavra_chave: 'Protetor', categoria: 'Cuidados Faciais', subcategoria: 'Proteção Solar' },
  { palavra_chave: 'Creme', categoria: 'Cuidados Pessoais', subcategoria: 'Tratamento Multiuso' },
  { palavra_chave: 'Olheiras', categoria: 'Cuidados Faciais', subcategoria: 'Tratamento Facial' },
  { palavra_chave: 'Primer', categoria: 'Maquiagem', subcategoria: 'Fixadores e Preparadores' },
  { palavra_chave: 'Perfume', categoria: 'Perfumaria', subcategoria: 'Deo Colônia / Perfumes' },
  { palavra_chave: 'Lápis', categoria: 'Maquiagem', subcategoria: 'Olhos' },
  { palavra_chave: 'Pente', categoria: 'Cabelos', subcategoria: 'Acessórios para Cabelo' },
  { palavra_chave: 'Barbear', categoria: 'Cuidados Pessoais', subcategoria: 'Barbear e Depilação' },
  { palavra_chave: 'Tesoura', categoria: 'Utilidades Domésticas', subcategoria: 'Papelaria e Escritório' },
  { palavra_chave: 'Pinça', categoria: 'Maquiagem', subcategoria: 'Sobrancelhas' },
  { palavra_chave: 'Cortador', categoria: 'Cuidados com as Unhas', subcategoria: 'Manicure e Pedicure' },
  { palavra_chave: 'Etiquetadora', categoria: 'Utilidades Domésticas', subcategoria: 'Papelaria e Escritório' },
  { palavra_chave: 'Elástico', categoria: 'Cabelos', subcategoria: 'Acessórios para Cabelo' },
  { palavra_chave: 'Escova', categoria: 'Cuidados Orais', subcategoria: 'Higiene Bucal' },
  { palavra_chave: 'Pincel', categoria: 'Cuidados Pessoais', subcategoria: 'Barbear e Depilação' },
  { palavra_chave: 'Palito', categoria: 'Cuidados com as Unhas', subcategoria: 'Manicure e Pedicure' },
  { palavra_chave: 'Esponja', categoria: 'Maquiagem', subcategoria: 'Acessórios de Maquiagem' },
  { palavra_chave: 'Alicate', categoria: 'Cuidados com as Unhas', subcategoria: 'Manicure e Pedicure' },
  { palavra_chave: 'Estilete', categoria: 'Utilidades Domésticas', subcategoria: 'Ferramentas e Utilidades' },
  { palavra_chave: 'Manicure', categoria: 'Cuidados com as Unhas', subcategoria: 'Manicure e Pedicure' },
  { palavra_chave: 'Espátula', categoria: 'Cuidados com as Unhas', subcategoria: 'Manicure e Pedicure' },
  { palavra_chave: 'Cadeado', categoria: 'Utilidades Domésticas', subcategoria: 'Ferramentas e Utilidades' },
  { palavra_chave: 'Touca', categoria: 'Banho e Corpo', subcategoria: 'Acessórios de Banho' },
  { palavra_chave: 'Espelho', categoria: 'Maquiagem', subcategoria: 'Acessórios de Maquiagem' },
  { palavra_chave: 'Presilha', categoria: 'Cabelos', subcategoria: 'Acessórios para Cabelo' },
  { palavra_chave: 'Piranha', categoria: 'Cabelos', subcategoria: 'Acessórios para Cabelo' },
  { palavra_chave: 'Acessórios', categoria: 'Cabelos', subcategoria: 'Acessórios para Cabelo' },
  { palavra_chave: 'Frasco', categoria: 'Cuidados Pessoais', subcategoria: 'Acessórios de Viagem' },
  { palavra_chave: 'Faixa', categoria: 'Maquiagem', subcategoria: 'Acessórios de Maquiagem' },
  { palavra_chave: 'Chocalho', categoria: 'Brinquedos', subcategoria: 'Brinquedos Infantis' },
  { palavra_chave: 'Trena', categoria: 'Utilidades Domésticas', subcategoria: 'Ferramentas e Utilidades' },
  { palavra_chave: 'Lixa', categoria: 'Cuidados Corporais', subcategoria: 'Mãos e Pés' },
  { palavra_chave: 'Design', categoria: 'Maquiagem', subcategoria: 'Sobrancelhas' },
  { palavra_chave: 'Etiqueta', categoria: 'Utilidades Domésticas', subcategoria: 'Papelaria e Escritório' },
  { palavra_chave: 'Mangueira', categoria: 'Utilidades Domésticas', subcategoria: 'Jardinagem e Limpeza' },
  { palavra_chave: 'Brinquedo', categoria: 'Brinquedos', subcategoria: 'Brinquedos Infantis' },
  { palavra_chave: 'Capacho', categoria: 'Utilidades Domésticas', subcategoria: 'Decoração e Utilidades' },
  { palavra_chave: 'Kit', categoria: 'Cuidados Pessoais', subcategoria: 'Kits' },
  { palavra_chave: 'Colher', categoria: 'Utilidades Domésticas', subcategoria: 'Utensílios de Cozinha' },
  { palavra_chave: 'Triturador', categoria: 'Utilidades Domésticas', subcategoria: 'Utensílios de Cozinha' },
  { palavra_chave: 'Faca', categoria: 'Utilidades Domésticas', subcategoria: 'Utensílios de Cozinha' },
  { palavra_chave: 'Carga', categoria: 'Cuidados Pessoais', subcategoria: 'Barbear e Depilação' },
  { palavra_chave: 'Fita Dupla Face', categoria: 'Utilidades Domésticas', subcategoria: 'Papelaria e Escritório' },
  { palavra_chave: 'Chaveiro', categoria: 'Utilidades Domésticas', subcategoria: 'Utensílios de Cozinha' },
  { palavra_chave: 'Kit Churrasco', categoria: 'Utilidades Domésticas', subcategoria: 'Utensílios de Cozinha' },
  { palavra_chave: 'Pino', categoria: 'Utilidades Domésticas', subcategoria: 'Papelaria e Escritório' },
  { palavra_chave: 'Lanterna', categoria: 'Utilidades Domésticas', subcategoria: 'Ferramentas e Utilidades' },
];

function processarProdutoBling(nomeProdutoBling) {
    const nomeLimpo = limparTexto(nomeProdutoBling);
    
    for (const regra of regrasCategorizacao) {
        const palavraLimpa = limparTexto(regra.palavra_chave);
        if (nomeLimpo.includes(palavraLimpa)) {
            return {
                categoria: regra.categoria,
                subcategoria: regra.subcategoria
            };
        }
    }

    return { categoria: 'Outros', subcategoria: 'Não Classificado' };
}

// 2. FUNÇÃO QUE BUSCA NO BLING E CLASSIFICA OS PRODUTOS
async function buscarProdutosBling(clientId, clientSecret, envRefreshToken, contaNome) {
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

        // 🧠 APLICA A INTELIGÊNCIA AQUI
        const classificacao = processarProdutoBling(nomeProd);

        produtosConta.push({
          sku,
          nome: nomeProd,
          marca: prod.brand || prod.marca || 'Sem Marca',
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
    console.log("🚀 Iniciando Sincronização e Categorização Direta...");

    const [prodsB2B, prodsB2C] = await Promise.all([
      buscarProdutosBling(process.env.BLING_B2B_CLIENT_ID, process.env.BLING_B2B_CLIENT_SECRET, process.env.BLING_REFRESH_TOKEN_B2B, 'B2B'),
      buscarProdutosBling(process.env.BLING_CLIENT_ID_B2C, process.env.BLING_CLIENT_SECRET_B2C, process.env.BLING_REFRESH_TOKEN_B2C, 'B2C')
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