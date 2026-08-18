import { createClient } from '@supabase/supabase-js';

// Conecta ao Supabase usando as chaves secretas da Vercel
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export default async function handler(req, res) {
  // Só aceitamos método POST (envio de dados)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    const { itens, clienteId } = req.body;
    
    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'O carrinho está vazio.' });
    }

    // 1. RENOVAR TOKEN B2B NO SUPABASE
    let { data: tokenData } = await supabase.from('bling_tokens').select('refresh_token').eq('conta', 'B2B').single();
    if (!tokenData) throw new Error("Token B2B não encontrado no Supabase.");

    const credentials = Buffer.from(`${process.env.BLING_B2B_CLIENT_ID}:${process.env.BLING_B2B_CLIENT_SECRET}`).toString('base64');
    
    const tokenResponse = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${credentials}` },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: tokenData.refresh_token })
    });
    
    const tokenInfo = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error("Erro ao renovar token B2B com o Bling.");

    // Salva o novo refresh token para a próxima vez
    await supabase.from('bling_tokens').upsert({ conta: 'B2B', refresh_token: tokenInfo.refresh_token });
    const accessToken = tokenInfo.access_token;

    // 2. MONTAR O PAYLOAD DO PEDIDO
    const idClienteB2B = clienteId || process.env.BLING_DEFAULT_B2B_CLIENT_ID;
    
    if (!idClienteB2B) {
      throw new Error("ID do cliente B2B não definido. Cadastre a variável BLING_DEFAULT_B2B_CLIENT_ID na Vercel.");
    }

    const pedidoBling = {
      contato: {
        id: Number(idClienteB2B)
      },
      itens: itens.map(item => ({
        codigo: String(item.sku),
        descricao: String(item.nome).substring(0, 120), // Descrição evita erros se o SKU não estiver mapeado igual
        quantidade: Number(item.quantidade),
        valor: Number(item.preco)
      }))
      // ⚠️ Removemos o campo 'situacao: { id: 0 }' que costuma bloquear pedidos na API v3
    };

    // 3. ENVIAR PEDIDO PARA A API DO BLING
    const blingRes = await fetch('https://www.bling.com.br/Api/v3/pedidos/vendas', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(pedidoBling)
    });

    const blingData = await blingRes.json();

    // Tratamento de erro AVANÇADO (Pegando os detalhes escondidos do Bling)
    if (!blingRes.ok || blingData.error) {
      // O Bling esconde a causa real dentro de "fields" ou "collection"
      const detalhesBling = blingData.error?.fields || blingData.error?.collection || blingData.error?.description || blingData;
      throw new Error(`Recusado pelo Bling. Motivo detalhado: ${JSON.stringify(detalhesBling)}`);
    }

    return res.status(200).json({ 
      success: true, 
      message: "Pedido gerado com sucesso no Bling!", 
      pedidoBlingId: blingData.data?.id 
    });

  } catch (error) {
    console.error("Erro na criação de pedido B2B:", error);
    return res.status(500).json({ error: error.message });
  }
}