import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });

  try {
    const { itens, clienteCnpj, clienteNome } = req.body;

    if (!itens || itens.length === 0) return res.status(400).json({ error: 'O carrinho está vazio.' });

    // 1. RENOVAR TOKEN B2B NO SUPABASE
    let { data: tokenData } = await supabase.from('bling_tokens').select('refresh_token').eq('conta', 'B2B').single();
    if (!tokenData) throw new Error("Token B2B não encontrado.");

    const credentials = Buffer.from(`${process.env.BLING_B2B_CLIENT_ID}:${process.env.BLING_B2B_CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${credentials}` },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: tokenData.refresh_token })
    });

    const tokenInfo = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error("Erro ao renovar token B2B.");
    await supabase.from('bling_tokens').upsert({ conta: 'B2B', refresh_token: tokenInfo.refresh_token });
    const accessToken = tokenInfo.access_token;

    // ==========================================================
    // 2. INTELIGÊNCIA B2B: DESCOBRIR OU CRIAR CLIENTE NO BLING
    // ==========================================================
    let idClienteBling = process.env.BLING_DEFAULT_B2B_CLIENT_ID; // Fallback (Plano B)

    if (clienteCnpj) {
      // Limpa pontos e traços do CNPJ
      const cnpjLimpo = String(clienteCnpj).replace(/\D/g, '');

      if (cnpjLimpo.length >= 11) {
        // PASSO A: Pergunta ao Bling se esse CNPJ já existe
        const buscaRes = await fetch(`https://www.bling.com.br/Api/v3/contatos?numeroDocumento=${cnpjLimpo}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const buscaData = await buscaRes.json();

        if (buscaData.data && buscaData.data.length > 0) {
          // 🎉 CLIENTE EXISTE! Pega o ID dele.
          idClienteBling = buscaData.data[0].id;
        } else if (clienteNome) {
          // ✨ CLIENTE NÃO EXISTE! Vamos criar ele no Bling automaticamente.
          const createRes = await fetch('https://www.bling.com.br/Api/v3/contatos', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nome: clienteNome,
              numeroDocumento: cnpjLimpo,
              tipo: cnpjLimpo.length === 14 ? 'J' : 'F' // Jurídica (14) ou Física (11)
            })
          });
          const createData = await createRes.json();
          
          if (createData.data && createData.data.id) {
            idClienteBling = createData.data.id;
          }
        }
      }
    }

    if (!idClienteBling) throw new Error("Não foi possível definir um Cliente para o pedido no Bling.");

    // ==========================================================
    // 3. MONTAR E ENVIAR O PEDIDO PARA O BLING
    // ==========================================================
    const dataHoje = new Date().toISOString().split('T')[0];

    const pedidoBling = {
      data: dataHoje,
      dataSaida: dataHoje,
      contato: { id: Number(idClienteBling) }, // Agora usa o cliente exato!
      itens: itens.map(item => ({
        produto: { id: Number(item.id) },
        quantidade: Number(item.quantidade),
        valor: Number(item.preco)
      }))
    };

    const blingRes = await fetch('https://www.bling.com.br/Api/v3/pedidos/vendas', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoBling)
    });

    const blingData = await blingRes.json();

    if (!blingRes.ok || blingData.error) {
      const detalhesBling = blingData.error?.fields || blingData.error?.collection || blingData.error?.description || blingData;
      throw new Error(`Recusado pelo Bling: ${JSON.stringify(detalhesBling)}`);
    }

    return res.status(200).json({ success: true, pedidoBlingId: blingData.data?.id });

  } catch (error) {
    console.error("Erro na criação de pedido B2B:", error);
    return res.status(500).json({ error: error.message });
  }
}