import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export async function getValidBlingToken() {
  // 1. Consulta o cofre no Supabase
  const { data: tokenData, error } = await supabase
    .from('bling_tokens')
    .select('refresh_token, access_token, expires_at')
    .eq('conta', 'B2B')
    .single();

  if (error || !tokenData) throw new Error("Registro de token não encontrado no banco.");

  // 2. Verifica se a chave atual ainda está na validade (margem de 5 minutos)
  const agora = new Date();
  const expiracao = tokenData.expires_at ? new Date(tokenData.expires_at) : new Date(0);

  if (tokenData.access_token && expiracao.getTime() > agora.getTime() + (5 * 60 * 1000)) {
    console.log("⚡ Reusando token válido do Bling. Acesso rápido!");
    return tokenData.access_token; // Retorna na hora!
  }

  // 3. Se expirou (ou não existe), pede uma chave NOVA para o Bling
  console.log("🔄 Token expirado ou ausente. Gerando um novo...");
  const credentials = Buffer.from(`${process.env.BLING_B2B_CLIENT_ID}:${process.env.BLING_B2B_CLIENT_SECRET}`).toString('base64');

  const tokenResponse = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${credentials}` },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: tokenData.refresh_token })
  });

  const tokenInfo = await tokenResponse.json();
  
  if (!tokenResponse.ok) {
    throw new Error(`Erro ao renovar no Bling: ${JSON.stringify(tokenInfo)}`);
  }

  // Calcula a validade (Bling envia em segundos, geralmente 3600 = 1 hora)
  const validadeSegundos = tokenInfo.expires_in || 3600;
  const novaExpiracao = new Date(agora.getTime() + (validadeSegundos * 1000)).toISOString();

  // 4. Guarda a chave nova, a validade e o novo refresh_token no Cofre
  await supabase.from('bling_tokens').upsert({
    conta: 'B2B',
    refresh_token: tokenInfo.refresh_token,
    access_token: tokenInfo.access_token,
    expires_at: novaExpiracao
  });

  return tokenInfo.access_token;
}