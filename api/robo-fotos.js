import { getValidBlingToken } from './_blingAuth.js'; 

export default async function handler(req, res) {
  try {
    const accessToken = await getValidBlingToken();

    // Busca os 50 primeiros produtos
    const produtosRes = await fetch('https://www.bling.com.br/Api/v3/produtos?limite=50', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const produtosData = await produtosRes.json();

    if (!produtosData.data) return res.status(400).json({ erro: "Falha ao conectar no Bling" });

    // O Scanner: Vai abrir um por um até achar uma foto escondida
    for (const produto of produtosData.data) {
      const detalheRes = await fetch(`https://www.bling.com.br/Api/v3/produtos/${produto.id}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const detalheData = await detalheRes.json();
      
      const produtoCru = detalheData.data;
      
      // Transforma tudo em texto para procurar links de imagem
      const jsonString = JSON.stringify(produtoCru);

      // Se tiver qualquer URL de imagem no meio desse caos, ele para e mostra!
      if (jsonString.includes('http') && (jsonString.includes('.jpg') || jsonString.includes('.png') || jsonString.includes('.webp') || jsonString.includes('imagem'))) {
        return res.status(200).json({
          mensagem: "🚨 ACHEI A FOTO! Copie tudo que está abaixo de 'produtoRaioX' e mande para o Gemini mapear:",
          produtoRaioX: produtoCru
        });
      }
      
      // Freio rápido
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return res.status(200).json({ aviso: "Nenhum dos 50 primeiros produtos possuía um link de imagem legível." });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}