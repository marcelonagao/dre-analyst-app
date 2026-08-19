import { createClient } from '@supabase/supabase-js';
import { getValidBlingToken } from './_blingAuth.js'; // Usando o nosso gerente de chaves!

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export default async function handler(req, res) {
  // Proteção básica para não rodarem o robô sem querer
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const accessToken = await getValidBlingToken();
    let fotosSincronizadas = 0;
    let produtosSemFoto = 0;

    // 1. Pega a lista geral de produtos
    const produtosRes = await fetch('https://www.bling.com.br/Api/v3/produtos?limite=100', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const produtosData = await produtosRes.json();

    if (!produtosData.data) throw new Error("Não foi possível listar os produtos do Bling.");

    // 2. O Loop Inteligente: Consulta a rota individual para pegar o HD
    for (const produto of produtosData.data) {
      try {
        // 🌟 A MÁGICA DA DOCUMENTAÇÃO: Busca o detalhe do produto (GET /produtos/{id})
        const detalheRes = await fetch(`https://www.bling.com.br/Api/v3/produtos/${produto.id}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        const detalheData = await detalheRes.json();
        const produtoDetalhado = detalheData.data;

        // Verifica se o produto tem imagens no cadastro detalhado
        if (produtoDetalhado && produtoDetalhado.imagens && produtoDetalhado.imagens.length > 0) {
          
          // Pega o link original da primeira imagem (sem as reduções do /t/)
          let urlHD = produtoDetalhado.imagens[0].link;
          
          // Se ainda assim vier algum parâmetro de redução na string (ex: ?w=200), nós limpamos
          if (urlHD.includes('?')) {
            urlHD = urlHD.split('?')[0]; 
          }

          // Baixa a imagem original
          const imgResponse = await fetch(urlHD);
          if (!imgResponse.ok) throw new Error(`Falha no download da imagem: ${imgResponse.statusText}`);
          
          const arrayBuffer = await imgResponse.arrayBuffer();
          const nomeArquivo = `${produtoDetalhado.codigo}.jpg`; // Ex: SKU123.jpg

          // Faz o upload para o Supabase (sobrescrevendo a velha)
          const { error: uploadError } = await supabase.storage
            .from('fotos-b2b')
            .upload(nomeArquivo, arrayBuffer, { 
              contentType: 'image/jpeg',
              upsert: true 
            });

          if (uploadError) throw uploadError;
          fotosSincronizadas++;
        } else {
          produtosSemFoto++;
        }

        // 🛑 FREIO DE SEGURANÇA: Espera 400ms para não estourar o limite da API do Bling (3 req/s)
        await new Promise(resolve => setTimeout(resolve, 400));

      } catch (errProduto) {
        console.error(`Erro ao processar a foto HD do produto ${produto.id}:`, errProduto.message);
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Robô finalizou! ${fotosSincronizadas} fotos HD atualizadas no Supabase. ${produtosSemFoto} produtos não possuíam fotos.` 
    });

  } catch (error) {
    console.error("Erro crítico no Robô de Fotos:", error);
    return res.status(500).json({ error: error.message });
  }
}