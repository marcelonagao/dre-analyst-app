import React, { useState, useEffect } from 'react';

export default function CatalogoB2BTab() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carrinho, setCarrinho] = useState({});
  const [busca, setBusca] = useState(''); // Novo estado para a barra de pesquisa

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

  const finalizarPedido = () => {
    if (quantidadeTotal === 0) return alert("Adicione produtos ao carrinho primeiro!");
    console.log("Carrinho pronto para envio:", itensCarrinho);
    alert("Pronto para o Checkout! Próximo passo: integrar a rota B2B na Vercel.");
  };

  // Filtra os produtos com base no que foi digitado na busca
  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || 
    p.sku.toLowerCase().includes(busca.toLowerCase())
  );

  const itensCarrinho = Object.values(carrinho);
  const quantidadeTotal = itensCarrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const valorTotal = itensCarrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-slate-500 font-bold text-sm uppercase tracking-widest">
          Sincronizando Catálogo...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-2xl border border-red-200 text-center">
        <p className="text-red-700 font-bold text-sm">❌ Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* ESQUERDA: VITRINE DE PRODUTOS */}
      <div className="flex-1">
        {/* Barra de Pesquisa */}
        <div className="mb-6 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <span className="pl-4 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nome ou SKU..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full p-3 bg-transparent text-sm text-slate-700 focus:outline-none"
          />
        </div>
        
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-medium">Nenhum produto encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {produtosFiltrados.map((produto) => (
              <div key={produto.sku} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 group">
                
                {/* Imagem (com background neutro) */}
                <div className="h-40 bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-slate-300 border border-slate-100 overflow-hidden">
                  {produto.imagemUrl ? (
                    <img src={produto.imagemUrl} alt={produto.nome} className="h-full w-full object-contain mix-blend-multiply p-2" />
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-widest">Sem Imagem</span>
                  )}
                </div>
                
                {/* Informações do Produto */}
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider uppercase">SKU: {produto.sku}</div>
                  <div className="text-sm font-bold text-slate-800 mb-2 line-clamp-2 leading-tight min-h-[2.5rem]">
                    {produto.nome}
                  </div>
                </div>

                {/* Preço e Botão */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-black text-emerald-600">
                    R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                  </div>
                  <button 
                    onClick={() => adicionarAoCarrinho(produto)}
                    className="h-10 w-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-colors shadow-sm"
                    title="Adicionar ao Carrinho"
                  >
                    <span className="text-xl font-bold leading-none">+</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DIREITA: CARRINHO (STICKY) */}
      <div className="w-full lg:w-80 xl:w-96 shrink-0">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Resumo do Pedido</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Portal B2B</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold py-1 px-3 rounded-full">
              {quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'}
            </span>
          </div>
          
          <div className="max-h-72 overflow-y-auto mb-6 pr-2 space-y-4">
            {itensCarrinho.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                <span className="text-3xl block mb-2">🛒</span>
                Seu carrinho está vazio.
              </div>
            ) : (
              itensCarrinho.map((item) => (
                <div key={item.sku} className="flex justify-between items-center text-sm group">
                  <div className="flex-1 truncate pr-3">
                    <p className="font-bold text-slate-700 truncate">{item.nome}</p>
                    <p className="text-[10px] text-slate-400">R$ {Number(item.preco).toFixed(2).replace('.', ',')}</p>
                  </div>
                  
                  {/* Controles de Quantidade */}
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <button onClick={() => removerDoCarrinho(item.sku)} className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">-</button>
                    <span className="w-5 text-center font-bold text-xs text-slate-700">{item.quantidade}</span>
                    <button onClick={() => adicionarAoCarrinho(item)} className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-500 text-sm font-bold">Total Liquido</span>
              <span className="text-xl font-black text-emerald-600">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <button 
            onClick={finalizarPedido}
            disabled={quantidadeTotal === 0}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              quantidadeTotal > 0 
                ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 hover:scale-[1.02]' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Finalizar Pedido B2B
          </button>
        </div>
      </div>

    </div>
  );
}