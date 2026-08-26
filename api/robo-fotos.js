import { createClient } from '@supabase/supabase-js';
import { getValidBlingToken } from './_blingAuth.js'; 

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Use GET ou POST.' });

  try {
    const accessToken = await getValidBlingToken();
    const pagina = req.query.pagina || 1;
    
    let fotosSincronizadas = 0;
    let produtosSemFoto = 0;

    // 🌟 O FILTRO MÁGICO DO ESTOQUE: criterio=5 (Traz APENAS produtos com estoque)
    const produtosRes = await fetch(`https://www.bling.com.br/Api/v3/produtos?limite=100&pagina=${pagina}&criterio=5`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const produtosData = await produtosRes.json();

    if (!produtosData.data || produtosData.data.length === 0) {
      return res.status(200).json({ success: true, message: `🚀 Sincronização concluída! A página ${pagina} está vazia. Todos os produtos em estoque foram processados.` });
    }

    for (const produto of produtosData.data) {
      try {
        const detalheRes = await fetch(`https://www.bling.com.br/Api/v3/produtos/${produto.id}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const detalheData = await detalheRes.json();
        const prod = detalheData.data;

        let urlHD = null;
        
        // 🌟 O MAPA DO TESOURO (Baseado no seu Raio-X)
        if (prod?.midia?.imagens?.externas?.length > 0) {
          urlHD = prod.midia.imagens.externas[0].link;
        } else if (prod?.midia?.imagens?.internas?.length > 0) {
          // Pegamos diretamente o 'link' (A foto original HD) e ignoramos o 'linkMiniatura'
          urlHD = prod.midia.imagens.internas[0].link; 
        }

        if (urlHD) {
          const imgResponse = await fetch(urlHD);
          if (imgResponse.ok) {
            const arrayBuffer = await imgResponse.arrayBuffer();
            const nomeArquivo = `${prod.codigo}.jpg`;

            await supabase.storage
              .from('fotos-b2b')
              .upload(nomeArquivo, arrayBuffer, { contentType: 'image/jpeg', upsert: true });

            fotosSincronizadas++;
          }
        } else {
          produtosSemFoto++;
        }

        // 🛑 Freio de segurança (400ms) para não derrubar a API do Bling
        await new Promise(resolve => setTimeout(resolve, 400));

      } catch (errProduto) {
        console.error(`Erro SKU ${produto.codigo}:`, errProduto.message);
      }
    }

    const proxPagina = Number(pagina) + 1;
    
    return res.status(200).json({ 
      success: true, 
      fotos_sincronizadas: fotosSincronizadas, // 🌟 ADICIONE ESTA LINHA AQUI!
      message: `✅ Lote da Página ${pagina} (Com Estoque) concluído! ${fotosSincronizadas} fotos HD salvas. ${produtosSemFoto} sem foto. 👉 Para continuar, acesse a URL: /api/robo-fotos?pagina=${proxPagina}` 
    });

  } catch (error) {
    console.error("Erro no Robô:", error);
    return res.status(500).json({ error: error.message });
  }
}