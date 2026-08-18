import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export default async function handler(req, res) {
  try {
    // 1. RENOVAR TOKEN B2B (Igual fizemos nas vendas)
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

    // 2. BUSCAR PRODUTOS NO BLING (Trazendo o saldo de estoque junto)
    // O parâmetro situacao=A busca apenas produtos Ativos
    const resProdutos = await fetch(`https://www.bling.com.br/Api/v3/produtos?situacao=A&limite=100`, {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
    });
    
    const produtosData = await resProdutos.json();
    if (produtosData.error) throw new Error(produtosData.error.message || "Erro ao buscar produtos.");

    // 3. FILTRAR E FORMATAR PARA O FRONTEND (React)
    // 3. FILTRAR E FORMATAR PARA O FRONTEND (React)
    const catalogoLimpo = produtosData.data.map(p => {
        let fotoAltaQualidade = p.imagemURL || p.imagem || null;
        
        // O hack para o Bling: remove os sufixos de miniatura da URL para forçar o carregamento do arquivo original
        if (fotoAltaQualidade) {
          fotoAltaQualidade = fotoAltaQualidade
            .replace('_thumb', '')
            .replace('_mini', '')
            .replace('-thumb', '')
            .replace('-mini', '');
        }
  
        return {
          id: p.id,
          sku: p.codigo,
          nome: p.nome,
          preco: p.preco,
          imagemUrl: fotoAltaQualidade, 
        };
      });

    return res.status(200).json({ success: true, produtos: catalogoLimpo });

  } catch (error) {
    console.error("Erro no Catálogo B2B:", error);
    return res.status(500).json({ error: error.message });
  }
}