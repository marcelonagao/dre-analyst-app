// Importamos o nosso novo Gerente Inteligente!
import { getValidBlingToken } from './_blingAuth.js'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });

  try {
    const { itens, clienteCnpj, clienteNome } = req.body;

    if (!itens || itens.length === 0) return res.status(400).json({ error: 'O carrinho está vazio.' });

    // 1. PEGAR A CHAVE (O Gerente decide se usa a salva ou se pede uma nova)
    const accessToken = await getValidBlingToken();

    // ==========================================================
    // 2. INTELIGÊNCIA B2B: DESCOBRIR OU CRIAR CLIENTE NO BLING
    // ==========================================================
    let idClienteBling = process.env.BLING_DEFAULT_B2B_CLIENT_ID;

    if (clienteCnpj) {
      const cnpjLimpo = String(clienteCnpj).replace(/\D/g, '');

      if (cnpjLimpo.length >= 11) {
        const buscaRes = await fetch(`https://www.bling.com.br/Api/v3/contatos?numeroDocumento=${cnpjLimpo}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const buscaData = await buscaRes.json();

        if (buscaData.data && buscaData.data.length > 0) {
          idClienteBling = buscaData.data[0].id;
        } else if (clienteNome) {
          const createRes = await fetch('https://www.bling.com.br/Api/v3/contatos', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nome: clienteNome,
              numeroDocumento: cnpjLimpo,
              tipo: cnpjLimpo.length === 14 ? 'J' : 'F'
            })
          });
          const createData = await createRes.json();
          if (createData.data && createData.data.id) idClienteBling = createData.data.id;
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
      contato: { id: Number(idClienteBling) },
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