import React, { useState, useEffect } from 'react';

export default function CatalogoB2BTab() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carrinho, setCarrinho] = useState({}); // Guarda os itens por SKU

  useEffect(() => {
    buscarCatalogo();
  }, []);

  const buscarCatalogo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/catalogo-b2b');
      const data = await res.json();
      
      if (data.success) {
        setProdutos(data.produtos);
      } else {
        setError(data.error || "Erro ao carregar o catálogo.");
      }
    } catch (err) {
      setError("Falha de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÕES DO CARRINHO ---
  const adicionarAoCarrinho = (produto) => {
    setCarrinho((prev) => {
      const qtdAtual = prev[produto.sku]?.quantidade || 0;
      return {
        ...prev,
        [produto.sku]: { ...produto, quantidade: qtdAtual + 1 }
      };
    });
  };

  const removerDoCarrinho = (sku) => {
    setCarrinho((prev) => {
      const novoCarrinho = { ...prev };
      if (novoCarrinho[sku] && novoCarrinho[sku].quantidade > 1) {
        novoCarrinho[sku].quantidade -= 1;
      } else {
        delete novoCarrinho[sku];
      }
      return novoCarrinho;
    });
  };

  // --- CÁLCULOS DO RESUMO ---
  const itensCarrinho = Object.values(carrinho);
  const quantidadeTotal = itensCarrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const valorTotal = itensCarrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  const finalizarPedido = () => {
    if (quantidadeTotal === 0) return alert("Adicione produtos ao carrinho primeiro!");
    console.log("Carrinho pronto para envio:", itensCarrinho);
    alert("Pronto para o Checkout! O próximo passo é enviar isso para a API do Bling.");
  };

  // --- TELAS DE ESTADO (Loading e Erro) ---
  if (loading) return <div className="p-8 text-center text-gray-500">⏳ Carregando catálogo B2B atualizado...</div>;
  if (error) return <div className="p-8 text-center text-red-500">❌ Erro: {error}</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      
      {/* LADO ESQUERDO: VITRINE DE PRODUTOS */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Vitrine B2B</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((produto) => (
            <div key={produto.sku} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              {/* Espaço para imagem futura */}
              <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
                {produto.imagemUrl ? <img src={produto.imagemUrl} alt={produto.nome} className="h-full object-contain" /> : "📷 Sem Imagem"}
              </div>
              
              <div className="text-sm text-gray-500 mb-1">SKU: {produto.sku}</div>
              <div className="font-semibold text-gray-800 mb-2 h-12 overflow-hidden">{produto.nome}</div>
              <div className="text-lg font-bold text-green-600 mb-4">
                R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
              </div>
              
              <button 
                onClick={() => adicionarAoCarrinho(produto)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-medium"
              >
                + Adicionar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* LADO DIREITO: CARRINHO LATERAL (STICKY) */}
      <div className="w-full md:w-80 lg:w-96">
        <div className="bg-gray-50 border rounded-lg p-6 sticky top-6">
          <h3 className="text-xl font-bold mb-4 flex justify-between">
            🛒 Carrinho 
            <span className="bg-blue-100 text-blue-800 text-sm py-1 px-2 rounded-full">{quantidadeTotal} itens</span>
          </h3>
          
          <div className="max-h-96 overflow-y-auto mb-4 border-b pb-4">
            {itensCarrinho.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Seu carrinho está vazio.</p>
            ) : (
              itensCarrinho.map((item) => (
                <div key={item.sku} className="flex justify-between items-center mb-3 text-sm">
                  <div className="flex-1 truncate pr-2">
                    <span className="font-medium">{item.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => removerDoCarrinho(item.sku)} className="bg-gray-200 px-2 rounded hover:bg-red-200">-</button>
                    <span className="w-4 text-center">{item.quantidade}</span>
                    <button onClick={() => adicionarAoCarrinho(item)} className="bg-gray-200 px-2 rounded hover:bg-green-200">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center mb-6 font-bold text-lg">
            <span>Total:</span>
            <span className="text-green-600">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
          </div>

          <button 
            onClick={finalizarPedido}
            disabled={quantidadeTotal === 0}
            className={`w-full py-3 rounded font-bold text-white transition-colors ${quantidadeTotal > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Finalizar Pedido
          </button>
        </div>
      </div>

    </div>
  );
}