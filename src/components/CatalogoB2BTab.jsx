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

  const finalizarPedido = async () => {
    if (quantidadeTotal === 0) return alert("Adicione produtos ao carrinho primeiro!");

    try {
      const res = await fetch('/api/create-order-b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itens: itensCarrinho })
      });

      const data = await res.json();

      if (data.success) {
        alert("🎉 Pedido criado com sucesso no Bling!");
        setCarrinho({});
        setModalCarrinhoAberto(false);
      } else {
        alert(`❌ Erro ao fechar pedido: ${data.error}`);
      }
    } catch (err) {
      alert("❌ Falha de comunicação ao tentar enviar o pedido.");
    }
  };

  // Extrai marcas dinamicamente
  const marcas = useMemo(() => {
    const listaMarcas = produtos.map(p => {
      const partes = p.nome.split('-');
      return partes.length > 1 ? partes[0].trim() : 'Outros';
    });
    const unicas = [...new Set(listaMarcas)].filter(m => m.length > 1);
    return ['Todas', ...unicas.sort()];
  }, [produtos]);

  // Filtra produtos
  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) || p.sku.toLowerCase().includes(busca.toLowerCase());
      const marcaDoProduto = p.nome.includes('-') ? p.nome.split('-')[0].trim() : 'Outros';
      const matchMarca = marcaSelecionada === 'Todas' || marcaDoProduto === marcaSelecionada;
      
      return matchBusca && matchMarca;
    });
  }, [produtos, busca, marcaSelecionada]);

  const itensCarrinho = Object.values(carrinho);
  const quantidadeTotal = itensCarrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const valorTotal = itensCarrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

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
      {/* LADO ESQUERDO: VITRINE & FILTROS */}
      {/* A classe 'min-w-0' aqui é o que resolve o bug do layout estourado no desktop! */}
      {/* ========================================== */}
      <div className="flex-1 min-w-0 pb-32 lg:pb-0">
        
        {/* BARRA DE PESQUISA */}
        <div className="mb-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <span className="pl-4 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nome ou SKU..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full p-2.5 bg-transparent text-sm text-slate-700 focus:outline-none font-medium"
          />
        </div>

        {/* FILTRO DE MARCAS (PILLS) */}
        <div className="mb-6 flex overflow-x-auto gap-2 pb-2 scrollbar-none w-full" style={{ scrollbarWidth: 'none' }}>
          {marcas.map(marca => (
            <button
              key={marca}
              onClick={() => setMarcaSelecionada(marca)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                marcaSelecionada === marca 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {marca}
            </button>
          ))}
        </div>
        
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium">Nenhum produto encontrado.</div>
        ) : (
          /* GRID RESPONSIVA AJUSTADA PARA O CARRINHO NÃO ESMAGAR OS CARDS */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {produtosFiltrados.map((produto) => {
              const qtdNoCarrinho = carrinho[produto.sku]?.quantidade || 0;
              
              return (
                <div key={produto.sku} className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative group">
                  
                  {/* Badge de Quantidade no Carrinho */}
                  {qtdNoCarrinho > 0 && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 font-black text-xs w-6 h-6 rounded-full flex items-center justify-center z-10 shadow-sm">
                      {qtdNoCarrinho}
                    </div>
                  )}

                  {/* IMAGEM COM TRATAMENTO ANTI-BORRÃO */}
                  <div className="w-full h-36 sm:h-44 bg-white rounded-xl mb-3 flex items-center justify-center border border-slate-100 overflow-hidden relative p-2">
                    {produto.imagemUrl ? (
                      <img 
                        src={produto.imagemUrl} 
                        alt={produto.nome} 
                        loading="lazy"
                        className="max-h-full max-w-full object-scale-down transform group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">Sem Imagem</span>
                    )}
                  </div>
                  
                  {/* INFORMAÇÕES DO PRODUTO */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider uppercase">SKU: {produto.sku}</div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-3">
                        {produto.nome}
                      </div>
                    </div>

                    {/* PREÇO E BOTÃO DE ADICIONAR */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div>
                        <span className="text-[10px] text-slate-400 block leading-none">Preço B2B</span>
                        <span className="text-sm sm:text-base font-black text-emerald-600">
                          R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <button 
                        onClick={() => adicionarAoCarrinho(produto)}
                        className="h-9 w-9 flex items-center justify-center bg-slate-100 text-slate-700 rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition-colors shadow-xs active:scale-95 font-bold text-lg"
                        title="Adicionar"
                      >
                        +
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
      {/* O Carrinho agora ficará 100% visível! */}
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
      {/* BARRA FLUTUANTE (MOBILE) */}
      {/* ========================================== */}
      {quantidadeTotal > 0 && (
        <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
          <button 
            onClick={() => setModalCarrinhoAberto(true)}
            className="w-full bg-slate-900 text-white rounded-2xl p-4 flex justify-between items-center shadow-2xl shadow-slate-900/50 border border-slate-800"
          >
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500 text-slate-950 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs">
                {quantidadeTotal}
              </span>
              <span className="font-bold text-sm">Ver Carrinho</span>
            </div>
            <span className="font-black text-emerald-400 text-base">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>
      )}

      {/* MODAL BOTTOM SHEET (MOBILE) */}
      {modalCarrinhoAberto && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-end animate-fade-in">
          <div className="bg-white w-full h-[85vh] rounded-t-3xl shadow-2xl flex flex-col p-6 pb-28 overflow-hidden">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4 shrink-0">
              <div>
                <h3 className="text-lg font-black text-slate-900">Seu Pedido B2B</h3>
                <p className="text-xs text-slate-400">{quantidadeTotal} itens selecionados</p>
              </div>
              <button onClick={() => setModalCarrinhoAberto(false)} className="w-8 h-8 bg-slate-100 rounded-full font-bold text-slate-600 flex items-center justify-center">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
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

function CarrinhoSidebar({ itensCarrinho, quantidadeTotal, valorTotal, removerDoCarrinho, adicionarAoCarrinho, finalizarPedido, isMobile = false }) {
  return (
    <div className={`bg-white ${!isMobile ? 'border border-slate-200 rounded-2xl p-6 sticky top-24 shadow-xl shadow-slate-200/50' : 'pb-6'}`}>
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
      
      <div className={`${!isMobile ? 'max-h-[50vh]' : 'max-h-[42vh]'} overflow-y-auto mb-6 pr-1 space-y-4`}>
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
                <button onClick={() => removerDoCarrinho(item.sku)} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-bold">-</button>
                <span className="w-6 text-center font-black text-xs text-slate-700">{item.quantidade}</span>
                <button onClick={() => adicionarAoCarrinho(item)} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-bold">+</button>
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
            ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 active:scale-95 cursor-pointer' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        Finalizar Pedido B2B
      </button>
    </div>
  );
}