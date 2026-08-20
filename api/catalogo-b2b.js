import { getValidBlingToken } from './_blingAuth.js'; 

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Use GET.' });

  try {
    // 1. Usa o Gerenciador Centralizado de Tokens (Evita quebrar o token no checkout!)
    const accessToken = await getValidBlingToken();

    // 2. Pega a página que o front-end pediu (se não enviar nada, carrega a 1)
    const pagina = req.query.pagina || 1;

    // 3. Busca no Bling (situacao=A para Ativos, criterio=5 para Estoque, limite=100, página dinâmica)
    const resProdutos = await fetch(`https://www.bling.com.br/Api/v3/produtos?situacao=A&criterio=5&limite=100&pagina=${pagina}`, {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
    });
    
    const produtosData = await resProdutos.json();
    
    if (produtosData.error) {
      throw new Error(produtosData.error.message || "Erro ao buscar produtos.");
    }

    const produtosBling = produtosData.data || [];
    const projetoSupabase = process.env.VITE_SUPABASE_URL;

    // 4. Mantém a SUA lógica original de limpar e formatar o catálogo!
    const catalogoLimpo = produtosBling.map(p => {
      // Aponta direto para o Supabase usando o SKU. O Front-end cuida do Fallback se não existir.
      const fotoPermanente = `${projetoSupabase}/storage/v1/object/public/fotos-b2b/${p.codigo}.jpg`;

      return {
        id: p.id,
        sku: p.codigo,
        nome: p.nome,
        preco: p.preco,
        imagemUrl: fotoPermanente, 
      };
    });

    // 5. O truque da rolagem infinita: avisa o front-end se a página veio cheia
    const temMais = produtosBling.length === 100;

    // Retorna exatamente no formato que o seu front-end já está acostumado
    return res.status(200).json({ success: true, produtos: catalogoLimpo, temMais });

  } catch (error) {
    console.error("Erro no Catálogo B2B:", error);
    return res.status(500).json({ error: error.message });
  }
}