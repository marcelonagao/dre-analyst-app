import React, { useState, useEffect, useMemo } from 'react';

export default function CatalogoB2BTab() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [carrinho, setCarrinho] = useState({});
  const [busca, setBusca] = useState('');
  const [marcaSelecionada, setMarcaSelecionada] = useState('Todas');
  const [modalCarrinhoAberto, setModalCarrinhoAberto] = useState(false);

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
      return { ...prev, [produto.sku]: { ...produto, quantidade: qtdAtual + 1 } };
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
    setModalCarrinhoAberto(false);
  };

  // --- INTELIGÊNCIA DE DADOS ---
  
  // 1. Extrai as marcas dinamicamente baseando-se no texto antes do "-"
  const marcas = useMemo(() => {
    const listaMarcas = produtos.map(p => {
      const partes = p.nome.split('-');
      return partes.length > 1 ? partes[0].trim() : 'Outros';
    });
    const unicas = [...new Set(listaMarcas)].filter(m => m.length > 2);
    return ['Todas', ...unicas.sort()];
  }, [produtos]);

  // 2. Aplica Filtro de Busca + Marca
  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) || p.sku.toLowerCase().includes(busca.toLowerCase());
      const marcaDoProduto = p.nome.includes('-') ? p.nome.split('-')[0].trim() : 'Outros';
      const matchMarca = marcaSelecionada === 'Todas' || marcaDoProduto === marcaSelecionada;
      
      return matchBusca && matchMarca;
    });
  }, [produtos, busca, marcaSelecionada]);

  // 3. Cálculos do Carrinho
  const itensCarrinho = Object.values(carrinho);
  const quantidadeTotal = itensCarrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const valorTotal = itensCarrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  // --- TELAS DE ESTADO ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-slate-500 font-bold text-sm uppercase tracking-widest">Carregando Vitrine...</h2>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 bg-red-50 rounded-2xl border border-red-200 text-center"><p className="text-red-700 font-bold text-sm">❌ Erro: {error}</p></div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative">
      
      {/* ========================================== */}
      {/* LADO ESQUERDO: VITRINE & FILTROS (MOBILE/DESKTOP) */}
      {/* ========================================== */}
      <div className="flex-1 pb-24 lg:pb-0">
        
        {/* BUSCA */}
        <div className="mb-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <span className="pl-4 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nome ou SKU..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full p-3 bg-transparent text-sm text-slate-700 focus:outline-none font-medium"
          />
        </div>

        {/* FILTRO DE MARCAS (Scrolável no Mobile) */}
        <div className="mb-6 flex overflow-x-auto gap-2 pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {marcas.map(marca => (
            <button
              key={marca}
              onClick={() => setMarcaSelecionada(marca)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors border ${
                marcaSelecionada === marca 
                  ? 'bg-slate-800 text-white border-slate-800' 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {marca}
            </button>
          ))}
        </div>
        
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-medium">Nenhum produto encontrado.</div>
        ) : (
          /* GRID RESPONSIVO: Flex row no celular (lista), Grid flex col no Desktop */
          <div className="flex flex-col sm:grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {produtosFiltrados.map((produto) => {
              const qtdNoCarrinho = carrinho[produto.sku]?.quantidade || 0;
              
              return (
                <div key={produto.sku} className="bg-white border border-slate-200 sm:rounded-2xl rounded-xl p-3 flex flex-row sm:flex-col shadow-sm hover:shadow-md transition-shadow gap-4 items-center sm:items-stretch">
                  
                  {/* IMAGEM */}
                  <div className="w-24 h-24 sm:w-full sm:h-40 bg-slate-50 sm:rounded-xl rounded-lg flex-shrink-0 flex items-center justify-center text-slate-300 border border-slate-100 overflow-hidden relative">
                    {qtdNoCarrinho > 0 && (
                      <div className="absolute top-1 right-1 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center z-10">
                        {qtdNoCarrinho}
                      </div>
                    )}
                    {produto.imagemUrl ? (
                      <img src={produto.imagemUrl} alt={produto.nome} className="h-full w-full object-contain mix-blend-multiply p-2" />
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-center">Sem Imagem</span>
                    )}
                  </div>
                  
                  {/* INFORMAÇÕES */}
                  <div className="flex flex-col flex-1 min-w-0 justify-between sm:h-full">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 mb-0.5 tracking-wider uppercase">SKU: {produto.sku}</div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-2">
                        {produto.nome}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-sm sm:text-lg font-black text-emerald-600">
                        R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                      </div>
                      <button 
                        onClick={() => adicionarAoCarrinho(produto)}
                        className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 flex items-center justify-center bg-slate-100 text-slate-600 rounded-lg sm:rounded-xl hover:bg-emerald-500 hover:text-white transition-colors"
                      >
                        <span className="text-lg sm:text-xl font-bold leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* LADO DIREITO: CARRINHO (DESKTOP) */}
      {/* ========================================== */}
      <div className="hidden lg:block w-80 xl:w-96 shrink-0">
        <CarrinhoSidebar 
          itensCarrinho={itensCarrinho} 
          quantidadeTotal={quantidadeTotal} 
          valorTotal={valorTotal} 
          removerDoCarrinho={removerDoCarrinho} 
          adicionarAoCarrinho={adicionarAoCarrinho} 
          finalizarPedido={finalizarPedido} 
        />
      </div>

      {/* ========================================== */}
      {/* BARRA FLUTUANTE & MODAL DO CARRINHO (MOBILE) */}
      {/* ========================================== */}
      {quantidadeTotal > 0 && (
        <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
          <button 
            onClick={() => setModalCarrinhoAberto(true)}
            className="w-full bg-slate-900 text-white rounded-2xl p-4 flex justify-between items-center shadow-2xl shadow-slate-900/50"
          >
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500 text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">
                {quantidadeTotal}
              </span>
              <span className="font-bold text-sm">Ver Carrinho</span>
            </div>
            <span className="font-black text-emerald-400">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>
      )}

      {/* MODAL BOTTOM SHEET (MOBILE) */}
      {modalCarrinhoAberto && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-center items-end transition-opacity">
          <div className="bg-white w-full h-[85vh] rounded-t-3xl shadow-2xl flex flex-col animate-slide-up">
            <div className="p-4 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Seu Pedido</h3>
              <button onClick={() => setModalCarrinhoAberto(false)} className="w-8 h-8 bg-slate-100 rounded-full font-bold text-slate-500">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <CarrinhoSidebar 
                itensCarrinho={itensCarrinho} 
                quantidadeTotal={quantidadeTotal} 
                valorTotal={valorTotal} 
                removerDoCarrinho={removerDoCarrinho} 
                adicionarAoCarrinho={adicionarAoCarrinho} 
                finalizarPedido={finalizarPedido} 
                isMobile
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Sub-componente para isolar a lógica visual do carrinho e reaproveitar no Desktop e Mobile
function CarrinhoSidebar({ itensCarrinho, quantidadeTotal, valorTotal, removerDoCarrinho, adicionarAoCarrinho, finalizarPedido, isMobile = false }) {
  return (
    <div className={`bg-white ${!isMobile ? 'border border-slate-200 rounded-2xl p-6 sticky top-24 shadow-xl shadow-slate-200/50' : ''}`}>
      {!isMobile && (
        <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Resumo</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Portal B2B</p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold py-1 px-3 rounded-full">
            {quantidadeTotal} itens
          </span>
        </div>
      )}
      
      <div className={`${!isMobile ? 'max-h-72' : ''} overflow-y-auto mb-6 pr-2 space-y-4`}>
        {itensCarrinho.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">O carrinho está vazio.</div>
        ) : (
          itensCarrinho.map((item) => (
            <div key={item.sku} className="flex justify-between items-center text-sm group border-b border-slate-50 pb-3">
              <div className="flex-1 pr-3 min-w-0">
                <p className="font-bold text-slate-700 truncate">{item.nome}</p>
                <p className="text-[10px] text-slate-400">R$ {Number(item.preco).toFixed(2).replace('.', ',')} / un</p>
              </div>
              
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg p-1 shrink-0">
                <button onClick={() => removerDoCarrinho(item.sku)} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-bold">-</button>
                <span className="w-6 text-center font-black text-xs text-slate-700">{item.quantidade}</span>
                <button onClick={() => adicionarAoCarrinho(item)} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-bold">+</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-slate-500 text-sm font-bold">Total Líquido</span>
          <span className="text-xl font-black text-emerald-600">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <button 
        onClick={finalizarPedido}
        disabled={quantidadeTotal === 0}
        className={`w-full py-4 rounded-xl font-black text-sm transition-all duration-300 uppercase tracking-wide ${
          quantidadeTotal > 0 
            ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 active:scale-95' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        Finalizar Pedido B2B
      </button>
    </div>
  );
}