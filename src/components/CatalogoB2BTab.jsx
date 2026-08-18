import React, { useState, useEffect, useMemo } from 'react';

export default function CatalogoB2BTab() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [carrinho, setCarrinho] = useState({});
  const [busca, setBusca] = useState('');
  const [marcaSelecionada, setMarcaSelecionada] = useState('Todas');
  const [modalCarrinhoAberto, setModalCarrinhoAberto] = useState(false);

  // ESTADOS DO CLIENTE B2B E CHECKOUT
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [clientesResultados, setClientesResultados] = useState([]);
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  
  // NOVOS ESTADOS DO MODAL DE SUCESSO E LOADING
  const [enviandoPedido, setEnviandoPedido] = useState(false);
  const [pedidoSucesso, setPedidoSucesso] = useState(null); // Vai guardar o ID do pedido

  useEffect(() => {
    buscarCatalogo();
  }, []);

  const buscarCatalogo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/catalogo-b2b');
      const data = await res.json();
      if (data.success) setProdutos(data.produtos);
      else setError(data.error || "Erro ao carregar o catálogo.");
    } catch (err) {
      setError("Falha de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const buscarClientesBling = async () => {
    if (buscaCliente.length < 3) return alert("Digite pelo menos 3 letras ou números do CNPJ.");
    
    try {
      setBuscandoCliente(true);
      const res = await fetch(`/api/buscar-clientes?q=${encodeURIComponent(buscaCliente)}`);
      const data = await res.json();
      
      if (data.success) {
        setClientesResultados(data.clientes);
        if (data.clientes.length === 0) alert("Nenhum cliente encontrado no Bling.");
      } else {
        alert("Erro na busca: " + data.error);
      }
    } catch (err) {
      alert("Falha ao buscar cliente.");
    } finally {
      setBuscandoCliente(false);
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
    if (!clienteSelecionado) return alert("⚠️ Você precisa selecionar um Cliente antes de fechar o pedido!");

    try {
      setEnviandoPedido(true); // Ativa o estado de carregamento no botão
      const res = await fetch('/api/create-order-b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          itens: itensCarrinho,
          clienteId: clienteSelecionado.id
        })
      });

      const data = await res.json();

      if (data.success) {
        // Exibe o modal de sucesso com o ID do pedido!
        setPedidoSucesso(data.pedidoBlingId || 'Registrado'); 
        
        // Limpa o carrinho e formulário
        setCarrinho({});
        setClienteSelecionado(null);
        setBuscaCliente('');
        setClientesResultados([]);
        setModalCarrinhoAberto(false);
      } else {
        alert(`❌ Erro ao fechar pedido: ${data.error}`);
      }
    } catch (err) {
      alert("❌ Falha de comunicação ao tentar enviar o pedido.");
    } finally {
      setEnviandoPedido(false); // Desliga o carregamento do botão
    }
  };

  const marcas = useMemo(() => {
    const listaMarcas = produtos.map(p => {
      const partes = p.nome.split('-');
      return partes.length > 1 ? partes[0].trim() : 'Outros';
    });
    const unicas = [...new Set(listaMarcas)].filter(m => m.length > 1);
    return ['Todas', ...unicas.sort()];
  }, [produtos]);

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

  if (loading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-emerald-500 rounded-full animate-spin"></div></div>;
  if (error) return <div className="p-8 bg-red-50 text-red-700 text-center font-bold">❌ {error}</div>;

  const sidebarProps = {
    itensCarrinho, quantidadeTotal, valorTotal, removerDoCarrinho, adicionarAoCarrinho, finalizarPedido,
    clienteSelecionado, setClienteSelecionado, buscaCliente, setBuscaCliente, clientesResultados, setClientesResultados, buscarClientesBling, buscandoCliente, enviandoPedido
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative">
      
      {/* ========================================== */}
      {/* VITRINE ESQUERDA */}
      {/* ========================================== */}
      <div className="flex-1 min-w-0 pb-32 lg:pb-0">
        <div className="mb-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <span className="pl-4 text-slate-400">🔍</span>
          <input type="text" placeholder="Buscar por nome ou SKU..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full p-2.5 bg-transparent text-sm text-slate-700 focus:outline-none font-medium"/>
        </div>

        <div className="mb-6 flex overflow-x-auto gap-2 pb-2 scrollbar-none w-full" style={{ scrollbarWidth: 'none' }}>
          {marcas.map(marca => (
            <button key={marca} onClick={() => setMarcaSelecionada(marca)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${marcaSelecionada === marca ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              {marca}
            </button>
          ))}
        </div>
        
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium">Nenhum produto encontrado.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {produtosFiltrados.map((produto) => {
              const qtdNoCarrinho = carrinho[produto.sku]?.quantidade || 0;
              return (
                <div key={produto.sku} className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative group">
                  {qtdNoCarrinho > 0 && <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 font-black text-xs w-6 h-6 rounded-full flex items-center justify-center z-10 shadow-sm">{qtdNoCarrinho}</div>}
                  <div className="w-full h-36 sm:h-44 bg-white rounded-xl mb-3 flex items-center justify-center border border-slate-100 overflow-hidden relative p-2">
                    {produto.imagemUrl ? <img src={produto.imagemUrl} alt={produto.nome} loading="lazy" className="max-h-full max-w-full object-scale-down transform group-hover:scale-105 transition-transform duration-300" /> : <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">Sem Imagem</span>}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider uppercase">SKU: {produto.sku}</div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-3">{produto.nome}</div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div>
                        <span className="text-[10px] text-slate-400 block leading-none">Preço B2B</span>
                        <span className="text-sm sm:text-base font-black text-emerald-600">R$ {Number(produto.preco).toFixed(2).replace('.', ',')}</span>
                      </div>
                      <button onClick={() => adicionarAoCarrinho(produto)} className="h-9 w-9 flex items-center justify-center bg-slate-100 text-slate-700 rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition-colors shadow-xs active:scale-95 font-bold text-lg">+</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* CARRINHO DESKTOP */}
      {/* ========================================== */}
      <div className="hidden lg:block w-80 xl:w-96 shrink-0">
        <CarrinhoSidebar {...sidebarProps} />
      </div>

      {/* ========================================== */}
      {/* BARRA MOBILE */}
      {/* ========================================== */}
      {quantidadeTotal > 0 && !pedidoSucesso && (
        <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
          <button onClick={() => setModalCarrinhoAberto(true)} className="w-full bg-slate-900 text-white rounded-2xl p-4 flex justify-between items-center shadow-2xl shadow-slate-900/50 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500 text-slate-950 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs">{quantidadeTotal}</span>
              <span className="font-bold text-sm">Ver Carrinho</span>
            </div>
            <span className="font-black text-emerald-400 text-base">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>
      )}

      {/* MODAL CARRINHO MOBILE */}
      {modalCarrinhoAberto && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-end animate-fade-in">
          <div className="bg-white w-full h-[90vh] rounded-t-3xl shadow-2xl flex flex-col p-6 pb-28 overflow-hidden">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4 shrink-0">
              <div>
                <h3 className="text-lg font-black text-slate-900">Seu Pedido B2B</h3>
                <p className="text-xs text-slate-400">{quantidadeTotal} itens selecionados</p>
              </div>
              <button onClick={() => setModalCarrinhoAberto(false)} className="w-8 h-8 bg-slate-100 rounded-full font-bold text-slate-600 flex items-center justify-center">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              <CarrinhoSidebar {...sidebarProps} isMobile />
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 🌟 NOVO: MODAL DE SUCESSO ANIMADO */}
      {/* ========================================== */}
      {pedidoSucesso && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100">
            
            {/* Ícone de Check Verde */}
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white outline outline-2 outline-emerald-50">
              <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 mb-2">Venda Fechada!</h2>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              O pedido foi processado com sucesso e já está integrado diretamente no seu painel do Bling.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Cód. do Pedido (Bling)</p>
              <p className="text-xl font-black text-slate-800">#{pedidoSucesso}</p>
            </div>

            <button 
              onClick={() => setPedidoSucesso(null)}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
            >
              Começar Nova Venda
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// COMPONENTE DO CARRINHO
function CarrinhoSidebar({ 
  itensCarrinho, quantidadeTotal, valorTotal, removerDoCarrinho, adicionarAoCarrinho, finalizarPedido, isMobile = false,
  clienteSelecionado, setClienteSelecionado, buscaCliente, setBuscaCliente, clientesResultados, setClientesResultados, buscarClientesBling, buscandoCliente, enviandoPedido
}) {
  return (
    <div className={`bg-white ${!isMobile ? 'border border-slate-200 rounded-2xl p-6 sticky top-24 shadow-xl shadow-slate-200/50' : 'pb-6'}`}>
      
      {/* 1. SELEÇÃO DE CLIENTE */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
          <span className="bg-slate-100 w-5 h-5 flex items-center justify-center rounded text-xs">1</span> 
          Cliente do Pedido
        </h3>
        
        {clienteSelecionado ? (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex justify-between items-center shadow-sm">
            <div className="min-w-0 pr-3">
              <p className="font-bold text-emerald-900 text-sm truncate">{clienteSelecionado.nome}</p>
              <p className="text-xs text-emerald-700 font-medium">Doc: {clienteSelecionado.documento}</p>
            </div>
            <button onClick={() => { setClienteSelecionado(null); setClientesResultados([]); setBuscaCliente(''); }} className="text-emerald-600 text-xs font-bold underline shrink-0 hover:text-emerald-800">
              Trocar
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nome ou CNPJ..." 
                value={buscaCliente} 
                onChange={(e) => setBuscaCliente(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && buscarClientesBling()}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
              <button 
                onClick={buscarClientesBling}
                disabled={buscandoCliente}
                className="bg-slate-800 text-white px-3 rounded-lg text-sm font-bold hover:bg-slate-700 disabled:opacity-50"
              >
                {buscandoCliente ? '...' : 'Buscar'}
              </button>
            </div>
            
            {clientesResultados.length > 0 && (
              <div className="mt-2 border border-slate-200 rounded-lg max-h-40 overflow-y-auto bg-white shadow-lg absolute z-20 w-full left-0 lg:static">
                {clientesResultados.map(cliente => (
                  <div 
                    key={cliente.id} 
                    onClick={() => { setClienteSelecionado(cliente); setClientesResultados([]); }}
                    className="p-2 border-b border-slate-50 hover:bg-emerald-50 cursor-pointer transition-colors"
                  >
                    <p className="text-sm font-bold text-slate-700 truncate">{cliente.nome}</p>
                    <p className="text-[10px] text-slate-400">{cliente.documento}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. RESUMO DOS ITENS */}
      <div>
        <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
          <span className="bg-slate-100 w-5 h-5 flex items-center justify-center rounded text-xs">2</span> 
          Itens ({quantidadeTotal})
        </h3>
        
        <div className={`${!isMobile ? 'max-h-48' : 'max-h-[30vh]'} overflow-y-auto mb-6 pr-1 space-y-3`}>
          {itensCarrinho.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">O carrinho está vazio.</div>
          ) : (
            itensCarrinho.map((item) => (
              <div key={item.sku} className="flex justify-between items-center text-sm group border-b border-slate-50 pb-2">
                <div className="flex-1 pr-2 min-w-0">
                  <p className="font-bold text-slate-700 text-xs truncate">{item.nome}</p>
                  <p className="text-[10px] text-slate-400">R$ {Number(item.preco).toFixed(2).replace('.', ',')} / un</p>
                </div>
                
                <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded p-1 shrink-0">
                  <button onClick={() => removerDoCarrinho(item.sku)} className="w-5 h-5 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 hover:text-red-600 font-bold text-xs">-</button>
                  <span className="w-5 text-center font-black text-[10px] text-slate-700">{item.quantidade}</span>
                  <button onClick={() => adicionarAoCarrinho(item)} className="w-5 h-5 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 hover:text-emerald-600 font-bold text-xs">+</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. TOTAL E BOTÃO DE FINALIZAR */}
      <div className="pt-4 border-t border-slate-100 mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-slate-500 text-sm font-bold">Total Líquido</span>
          <span className="text-xl font-black text-emerald-600">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <button 
        onClick={finalizarPedido}
        disabled={quantidadeTotal === 0 || enviandoPedido}
        className={`w-full py-4 rounded-xl font-black text-sm transition-all duration-300 uppercase tracking-wide flex justify-center items-center gap-2 ${
          quantidadeTotal > 0 && !enviandoPedido
            ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 active:scale-95 cursor-pointer' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        {enviandoPedido ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin"></div>
            Processando...
          </>
        ) : (
          'Finalizar Pedido B2B'
        )}
      </button>
    </div>
  );
}