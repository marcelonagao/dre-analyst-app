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

    // 🚀 MAPEAMENTO BLINDADO DOS PREÇOS
    const catalogoLimpo = produtosBling.map(p => ({
      id: p.id,
      sku: p.codigo,
      nome: p.nome,
      // No Bling V3, 'p.preco' é sempre o preço de Venda B2C/B2B principal
      preco_venda: Number(p.preco) || 0,
      // Se você usar preço promocional lá no ERP, ele já puxa automático!
      preco_promocional: p.precoPromocional ? Number(p.precoPromocional) : null,
      
      imagemUrl: `${projetoSupabase}/storage/v1/object/public/fotos-b2b/${p.codigo}.jpg`, 
    }));

    const temMais = produtosBling.length === 100;

    return res.status(200).json({ success: true, produtos: catalogoLimpo, temMais });

  } catch (error) {
    console.error("Erro no Catálogo:", error);
    return res.status(500).json({ error: error.message });
  }
}