import { getValidBlingToken } from './_blingAuth.js'; 

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Use GET.' });

  try {
    const accessToken = await getValidBlingToken();
    const pagina = req.query.pagina || 1;
    const busca = req.query.busca || '';

    // Monta a URL base: Produtos Ativos (situacao=A), Com Estoque (criterio=5), Limite de 100
    let urlBling = `https://www.bling.com.br/Api/v3/produtos?situacao=A&criterio=5&limite=100&pagina=${pagina}`;
    
    // Filtro Server-Side: Se houver busca, filtra direto no Bling
    if (busca && busca !== 'Todas') {
      urlBling += `&nome=${encodeURIComponent(busca)}`;
    }

    const resProdutos = await fetch(urlBling, {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
    });
    
    const produtosData = await resProdutos.json();
    if (produtosData.error) throw new Error(produtosData.error.message);

    const produtosBling = produtosData.data || [];
    const projetoSupabase = process.env.VITE_SUPABASE_URL;

    const catalogoLimpo = produtosBling.map(p => ({
      id: p.id,
      sku: p.codigo,
      nome: p.nome,
      preco: p.preco,
      // URL apontando sempre para o Supabase (O Fallback no front-end garante a segurança)
      imagemUrl: `${projetoSupabase}/storage/v1/object/public/fotos-b2b/${p.codigo}.jpg`, 
    }));

    // Se vieram 100 itens, assumimos que há uma próxima página
    const temMais = produtosBling.length === 100;

    return res.status(200).json({ success: true, produtos: catalogoLimpo, temMais });

  } catch (error) {
    console.error("Erro no Catálogo:", error);
    return res.status(500).json({ error: error.message });
  }
}