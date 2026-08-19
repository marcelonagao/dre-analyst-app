import { getValidBlingToken } from './_blingAuth.js'; 

export default async function handler(req, res) {
  try {
    const accessToken = await getValidBlingToken();

    // 🌟 COLOQUE AQUI O SKU DE UM PRODUTO QUE VOCÊ TEM CERTEZA QUE TEM FOTO NO BLING
    const skuAlvo = "N51029"; // Exemplo: "13022" ou "SnuggManguitoM"

    // 1. Busca o produto exato pelo SKU
    const buscaRes = await fetch(`https://www.bling.com.br/Api/v3/produtos?codigo=${skuAlvo}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const buscaData = await buscaRes.json();

    if (!buscaData.data || buscaData.data.length === 0) {
      return res.status(404).json({ erro: `Não achei nenhum produto com o código: ${skuAlvo}` });
    }

    const idProduto = buscaData.data[0].id;

    // 2. Tira um Raio-X completo e profundo desse produto específico
    const detalheRes = await fetch(`https://www.bling.com.br/Api/v3/produtos/${idProduto}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const detalheData = await detalheRes.json();

    // Entrega o mapa do tesouro na tela
    return res.status(200).json({
      mensagem: `🚨 RAIO-X DO PRODUTO ${skuAlvo} CONCLUÍDO! Copie TUDO que está abaixo e mande pro Gemini:`,
      produtoRaioX: detalheData.data
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}