import { createClient } from '@supabase/supabase-js';
import { getValidBlingToken } from './_blingAuth.js'; 

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

  try {
    const accessToken = await getValidBlingToken();
    
    // 🌟 1. PAGINAÇÃO INTELIGENTE (Pega a página da URL, padrão é 1)
    const pagina = req.query.pagina || 1;
    
    let fotosSincronizadas = 0;
    let produtosSemFoto = 0;

    // Busca apenas o Lote (Página) atual
    const produtosRes = await fetch(`https://www.bling.com.br/Api/v3/produtos?limite=100&pagina=${pagina}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const produtosData = await produtosRes.json();

    // Se a página vier vazia, significa que acabaram os produtos no ERP!
    if (!produtosData.data || produtosData.data.length === 0) {
      return res.status(200).json({ success: true, message: `Fim da linha! A página ${pagina} está vazia. O seu Supabase está 100% atualizado.` });
    }

    for (const produto of produtosData.data) {
      try {
        const detalheRes = await fetch(`https://www.bling.com.br/Api/v3/produtos/${produto.id}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const detalheData = await detalheRes.json();
        const prod = detalheData.data;

        let urlHD = null;
        
        // 🌟 2. O CAMINHO CORRETO DA MÍDIA NO BLING V3
        if (prod?.midia?.imagens?.externas?.length > 0) {
          // Se for link externo (ex: Shopee, ML)
          urlHD = prod.midia.imagens.externas[0].link;
        } else if (prod?.midia?.imagens?.internas?.length > 0) {
          // Se for foto hospedada no próprio Bling
          urlHD = prod.midia.imagens.internas[0].linkMiniatura;
          // Tenta limpar o /t/ para forçar a versão gigante
          if (urlHD) urlHD = urlHD.replace(/\/t\//g, '/');
        }

        if (urlHD) {
          // Limpa sujeiras de redimensionamento na URL (como a documentação pede)
          if (urlHD.includes('?')) urlHD = urlHD.split('?')[0]; 

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

        // 🛑 Freio de 0.4s para o Bling não bloquear o nosso IP
        await new Promise(resolve => setTimeout(resolve, 400));

      } catch (errProduto) {
        console.error(`Erro SKU ${produto.codigo}:`, errProduto.message);
      }
    }

    // Calcula a próxima página para facilitar a sua vida
    const proxPagina = Number(pagina) + 1;
    
    return res.status(200).json({ 
      success: true, 
      message: `✅ Lote da Página ${pagina} concluído! ${fotosSincronizadas} fotos HD salvas. ${produtosSemFoto} sem foto. 👉 Para continuar, acesse no navegador: /api/robo-fotos?pagina=${proxPagina}` 
    });

  } catch (error) {
    console.error("Erro no Robô:", error);
    return res.status(500).json({ error: error.message });
  }
}