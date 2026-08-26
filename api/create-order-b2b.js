// Importamos o nosso novo Gerente Inteligente!
import { getValidBlingToken } from './_blingAuth.js'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });

  try {
    // 🌟 1. Recebendo o numeroPedidoApp que veio do Front-end (Supabase)
    const { itens, clienteCnpj, clienteNome, numeroPedidoApp, vendedorId } = req.body;

    if (!itens || itens.length === 0) return res.status(400).json({ error: 'O carrinho está vazio.' });

    // PEGAR A CHAVE (O Gerente decide se usa a salva ou se pede uma nova)
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
          // ✨ CLIENTE NÃO EXISTE! Vamos tentar criar no Bling
          const payloadContato = {
            nome: clienteNome,
            numeroDocumento: cnpjLimpo,
            tipo: cnpjLimpo.length === 14 ? 'J' : 'F', 
            situacao: 'A' 
          };

          const createRes = await fetch('https://www.bling.com.br/Api/v3/contatos', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadContato)
          });
          
          const createData = await createRes.json();
          
          if (!createRes.ok || createData.error) {
            const detalhesErro = createData.error?.fields || createData.error?.description || createData.error || createData;
            console.error("❌ ERRO DETALHADO DO BLING (CONTATO):", JSON.stringify(detalhesErro));
            throw new Error(`Bling recusou o cadastro do CNPJ ${cnpjLimpo}. Motivo: ${JSON.stringify(detalhesErro)}`);
          }
          
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
      numeroLoja: numeroPedidoApp, // 🔗 AMARRAÇÃO DE OURO: O Bling guarda o ID do Supabase!
      contato: { id: Number(idClienteBling) },
      itens: itens.map(item => ({
        codigo: item.id, // 🌟 CORREÇÃO: Usamos o SKU (codigo) em vez do ID interno para evitar o erro NaN
        descricao: item.name, 
        quantidade: Number(item.quantidade || item.quantity || 1),
        valor: Number(item.preco || item.price)
      }))
    };

    // 🌟 AMARRAÇÃO DO REPRESENTANTE: Se tiver vendedor, enviamos para o Bling!
    if (vendedorId) {
      pedidoBling.vendedor = { id: Number(vendedorId) };
    }

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