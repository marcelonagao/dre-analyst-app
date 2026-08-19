import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export default async function handler(req, res) {
  // Esse robô pode ser acionado por GET direto no navegador
  try {
    // 1. RENOVAR TOKEN DO BLING
    let { data: tokenData } = await supabase.from('bling_tokens').select('refresh_token').eq('conta', 'B2B').single();
    if (!tokenData) throw new Error("Token B2B não encontrado.");

    const credentials = Buffer.from(`${process.env.BLING_B2B_CLIENT_ID}:${process.env.BLING_B2B_CLIENT_SECRET}`).toString('base64');
    
    const tokenResponse = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${credentials}` },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: tokenData.refresh_token })
    });
    
    const tokenInfo = await tokenResponse.json();
    await supabase.from('bling_tokens').upsert({ conta: 'B2B', refresh_token: tokenInfo.refresh_token });
    const accessToken = tokenInfo.access_token;

    // 2. BUSCAR TODOS OS PRODUTOS DO BLING
    const blingRes = await fetch('https://www.bling.com.br/Api/v3/produtos?limite=100', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
    });
    const produtosData = await blingRes.json();
    
    if (!blingRes.ok) throw new Error("Erro ao buscar produtos.");

    let fotosSincronizadas = 0;

    // 3. O ROBÔ ENTRA EM AÇÃO (Baixar e Upar para o Supabase)
    for (const produto of produtosData.data) {
      if (produto.imagemURL) {
        try {
          // 🌟 O PULO DO GATO: Forçar o link em Alta Definição (HD)
          // Tira a pasta "/t/" (thumbnail) do meio do link do Bling
          let urlHD = produto.imagemURL.replace(/\/t\//g, '/');
          
          // Baixa a imagem da Amazon/Bling já na versão original
          const imgResponse = await fetch(urlHD);
          const arrayBuffer = await imgResponse.arrayBuffer();
          
          const nomeArquivo = `${produto.codigo}.jpg`;

          // Faz o upload para o seu Supabase
          await supabase.storage
            .from('fotos-b2b')
            .upload(nomeArquivo, arrayBuffer, { 
              contentType: 'image/jpeg',
              upsert: true // Sobrescreve a miniatura borrada pela foto HD
            });

          fotosSincronizadas++;
        } catch (imgError) {
          console.error(`Erro ao salvar foto HD do SKU ${produto.codigo}:`, imgError);
        }
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Robô finalizou! ${fotosSincronizadas} fotos foram salvas com sucesso na sua nuvem.` 
    });

  } catch (error) {
    console.error("Erro no robô de fotos:", error);
    return res.status(500).json({ error: error.message });
  }
}