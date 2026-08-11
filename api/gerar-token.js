export default async function handler(req, res) {
    const { code, clientId, clientSecret } = req.query;
  
    if (!code || !clientId || !clientSecret) {
      return res.status(400).json({ erro: "Faltam parâmetros na URL." });
    }
  
    try {
      const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      
      const tokenResponse = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code
        })
      });
  
      const data = await tokenResponse.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  }