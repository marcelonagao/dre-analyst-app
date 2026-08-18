import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.ML_APP_ID;
  const clientSecret = process.env.ML_SECRET_KEY;
  const redirectUri = 'https://dre-analyst-app.vercel.app/api/auth-ml';

  // 1. Se não tem código na URL, redireciona para a tela de permissão do Mercado Livre
  if (!code) {
    if (!clientId) return res.status(500).send("Falta a variável ML_APP_ID na Vercel.");
    const authUrl = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    return res.redirect(authUrl);
  }

  // 2. Se o Mercado Livre devolveu o código, vamos trocá-lo pelo Refresh Token
  try {
    const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(`Mercado Livre recusou a troca: ${tokenData.error_description || JSON.stringify(tokenData.error)}`);
    }

    // 3. Salva o Refresh Token no Supabase com o nome 'MercadoLivre'
    const { error: dbError } = await supabase
      .from('bling_tokens') 
      .upsert({ 
        conta: 'MercadoLivre', 
        refresh_token: tokenData.refresh_token 
      });

    if (dbError) throw dbError;

    // 4. Mostra uma mensagem bonita de sucesso na tela!
    return res.status(200).send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #f4f4f9;">
          <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; margin: auto;">
            <h1 style="color: #4CAF50;">✅ Autorização Concluída!</h1>
            <p style="font-size: 18px; color: #333;">O robô foi conectado com sucesso ao Mercado Livre.</p>
            <p style="color: #666;">O Token de acesso contínuo foi salvo de forma segura no Supabase na conta <b>MercadoLivre</b>.</p>
            <p style="margin-top: 30px; font-weight: bold;">Você já pode fechar esta janela.</p>
          </div>
        </body>
      </html>
    `);

  } catch (error) {
    console.error("Erro no Auth ML:", error);
    return res.status(500).send(`Erro ao processar autorização: ${error.message}`);
  }
}