import { getValidBlingToken } from './_blingAuth.js'; 

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Use GET.' });

  try {
    const accessToken = await getValidBlingToken();
    
    let todosOsProdutos = [];
    let pagina = 1;
    let temMaisProdutos = true;
    const MAX_PAGINAS = 15; // 🌟 Trava anti-timeout da Vercel (Máx 1.500 produtos em estoque)

    // O Loop com limite máximo de rodadas
    while (temMaisProdutos && pagina <= MAX_PAGINAS) {
      const response = await fetch(`https://www.bling.com.br/Api/v3/produtos?limite=100&pagina=${pagina}&criterio=5`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      const data = await response.json();
      
      // 🌟 Lupa de Erros: Se o Bling barrar a busca, paramos imediatamente
      if (data.error) {
        throw new Error(`Bling recusou a página ${pagina}: ${JSON.stringify(data.error)}`);
      }

      const produtosDestaPagina = data.data || [];

      if (produtosDestaPagina.length > 0) {
        todosOsProdutos = todosOsProdutos.concat(produtosDestaPagina);
        pagina++;
        
        // Freio rápido (350ms)
        await new Promise(resolve => setTimeout(resolve, 350));
      } else {
        temMaisProdutos = false;
      }
    }

    return res.status(200).json({ produtos: todosOsProdutos });

  } catch (error) {
    console.error("❌ ERRO NO CATÁLOGO:", error);
    // Garante que o erro retorne como texto legível para o Front-end
    return res.status(500).json({ error: error.message || JSON.stringify(error) });
  }
}