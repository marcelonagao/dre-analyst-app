import { getValidBlingToken } from './_blingAuth.js'; 

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Use GET.' });

  try {
    const accessToken = await getValidBlingToken();
    
    let todosOsProdutos = [];
    let pagina = 1;
    let temMaisProdutos = true;

    // 🔄 O Loop de Coleta: Vai rodar até o Bling dizer que a página está vazia
    while (temMaisProdutos) {
      const response = await fetch(`https://www.bling.com.br/Api/v3/produtos?limite=100&pagina=${pagina}&criterio=5`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      const data = await response.json();
      const produtosDestaPagina = data.data || [];

      if (produtosDestaPagina.length > 0) {
        // Junta os produtos novos com os que já coletamos
        todosOsProdutos = todosOsProdutos.concat(produtosDestaPagina);
        pagina++;
        
        // 🛑 Freio de segurança (350ms) para respeitar o limite do Bling (3 req/s)
        await new Promise(resolve => setTimeout(resolve, 350));
      } else {
        // A página veio vazia? Acabou o estoque, saímos do loop!
        temMaisProdutos = false;
      }
    }

    // 🚀 Entrega o Catálogo COMPLETO para a Vitrine
    return res.status(200).json({ produtos: todosOsProdutos });

  } catch (error) {
    console.error("Erro crítico na agregação do Catálogo:", error);
    return res.status(500).json({ error: error.message });
  }
}