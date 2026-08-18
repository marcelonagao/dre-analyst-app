import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido. Use GET.' });
  }

  try {
    const { q } = req.query;
    if (!q || q.length < 3) {
      return res.status(400).json({ error: 'Digite pelo menos 3 letras para buscar.' });
    }

    // 1. RENOVAR TOKEN B2B
    let { data: tokenData } = await supabase.from('bling_tokens').select('refresh_token').eq('conta', 'B2B').single();
    if (!tokenData) throw new Error("Token B2B não encontrado.");

    const credentials = Buffer.from(`${process.env.BLING_B2B_CLIENT_ID}:${process.env.BLING_B2B_CLIENT_SECRET}`).toString('base64');
    
    const tokenResponse = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${credentials}` },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: tokenData.refresh_token })
    });
    
    const tokenInfo = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error("Erro ao renovar token B2B");

    await supabase.from('bling_tokens').upsert({ conta: 'B2B', refresh_token: tokenInfo.refresh_token });
    const accessToken = tokenInfo.access_token;

    // 2. BUSCAR CLIENTES NO BLING (Por nome, CPF ou CNPJ)
    const blingRes = await fetch(`https://www.bling.com.br/Api/v3/contatos?pesquisa=${encodeURIComponent(q)}&limite=10`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    const blingData = await blingRes.json();

    if (!blingRes.ok) {
      throw new Error("Erro ao consultar clientes no Bling.");
    }

    // 3. FORMATAR E RETORNAR
    const clientes = (blingData.data || []).map(c => ({
      id: c.id,
      nome: c.nome,
      documento: c.numeroDocumento || 'Sem documento'
    }));

    return res.status(200).json({ success: true, clientes });

  } catch (error) {
    console.error("Erro na busca de clientes:", error);
    return res.status(500).json({ error: error.message });
  }
}