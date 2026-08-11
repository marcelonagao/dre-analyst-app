import React, { useState, useMemo } from 'react';
import { 
  IconPackage, IconShoppingCart, IconCheckCircle2, IconAlertCircle, 
  IconSearch, IconDownload, IconLayers, IconTrendingUp, IconFilter 
} from './Icons';

export default function InteligenciaTab({ produtos = [], margemAtual = 0 }) {
  const [subTab, setSubTab] = useState('balanco'); // 'balanco' | 'compras' | 'posicao'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('todas');
  const [selectedItems, setSelectedItems] = useState({});
  const [qtdsAjustadas, setQtdsAjustadas] = useState({});

  // 1. Tratamento de Nomes Elegantes
  const formatNomeProduto = (nome) => {
    if (!nome) return 'Produto Sem Descrição';
    return nome
      .toLowerCase()
      .replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  };

  // 2. Marcas Únicas Disponíveis
  const marcasDisponiveis = useMemo(() => {
    const setM = new Set(produtos.map(p => p.marca).filter(Boolean));
    return ['todas', ...Array.from(setM).sort()];
  }, [produtos]);

  // 3. Filtro Base de Produtos por Marca e Busca
  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      const matchMarca = selectedMarca === 'todas' || p.marca === selectedMarca;
      const matchBusca = searchQuery === '' || 
        p.produto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.marca.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMarca && matchBusca;
    });
  }, [produtos, selectedMarca, searchQuery]);

  // 4. Métrica de Balanço Financeiro do Estoque
  const balancoEstoque = useMemo(() => {
    let custoTotal = 0;
    let unidadesTotais = 0;
    let capitalAtivoCusto = 0;
    let capitalCongeladoCusto = 0;
    let unidadesParadas = 0;

    produtosFiltrados.forEach(p => {
      const imob = (p.estoqueAtual || 0) * (p.custoUnitario || 0);
      custoTotal += imob;
      unidadesTotais += (p.estoqueAtual || 0);

      // Critério de Estoque Parado: 0 vendas no período ou > 90 dias de estoque
      if (p.quantidadeVendida === 0 || p.diasDeEstoque > 90) {
        capitalCongeladoCusto += imob;
        unidadesParadas += (p.estoqueAtual || 0);
      } else {
        capitalAtivoCusto += imob;
      }
    });

    return {
      custoTotal,
      unidadesTotais,
      capitalAtivoCusto,
      capitalCongeladoCusto,
      unidadesParadas,
      unidadesRodando: unidadesTotais - unidadesParadas
    };
  }, [produtosFiltrados]);

  // 5. Produtos Sugeridos para Compra (Motor de Compras)
  const produtosSugestao = useMemo(() => {
    return produtosFiltrados.filter(p => p.sugestaoCompra > 0);
  }, [produtosFiltrados]);

  // Handler para Checkbox de Seleção
  const toggleSelectItem = (sku) => {
    setSelectedItems(prev => ({ ...prev, [sku]: !prev[sku] }));
  };

  const toggleSelectAll = () => {
    const allSelected = produtosSugestao.every(p => selectedItems[p.sku]);
    const nextState = {};
    produtosSugestao.forEach(p => {
      nextState[p.sku] = !allSelected;
    });
    setSelectedItems(nextState);
  };

  // Resumo do Pedido do CEO/Compras
  const resumoPedido = useMemo(() => {
    let totalPecas = 0;
    let custoTotalPedido = 0;
    let itensContados = 0;

    produtosSugestao.forEach(p => {
      if (selectedItems[p.sku]) {
        const qtdFinal = qtdsAjustadas[p.sku] !== undefined ? qtdsAjustadas[p.sku] : p.sugestaoCompra;
        totalPecas += qtdFinal;
        custoTotalPedido += (qtdFinal * p.custoUnitario);
        itensContados += 1;
      }
    });

    return { totalPecas, custoTotalPedido, itensContados };
  }, [produtosSugestao, selectedItems, qtdsAjustadas]);

  // Gerador de Texto para Pedido
  const gerarPedidoTexto = () => {
    let txt = `*PEDIDO DE REPOSIÇÃO - FORNECEDOR / MARCA: ${selectedMarca.toUpperCase()}*\n`;
    txt += `Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    txt += `--------------------------------------------------\n\n`;

    produtosSugestao.forEach(p => {
      if (selectedItems[p.sku]) {
        const qtdFinal = qtdsAjustadas[p.sku] !== undefined ? qtdsAjustadas[p.sku] : p.sugestaoCompra;
        const totalItem = (qtdFinal * p.custoUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        txt += `• *[${p.sku}]* ${formatNomeProduto(p.produto)}\n   Qtd: *${qtdFinal} un* | Custo Unit: R$ ${p.custoUnitario.toFixed(2)} | Subtotal: ${totalItem}\n\n`;
      }
    });

    txt += `--------------------------------------------------\n`;
    txt += `*TOTAL DE ITENS:* ${resumoPedido.itensContados}\n`;
    txt += `*TOTAL PEÇAS:* ${resumoPedido.totalPecas} un\n`;
    txt += `*VALOR TOTAL DO PEDIDO:* ${resumoPedido.custoTotalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;

    navigator.clipboard.writeText(txt);
    alert('✅ Pedido copiado para a área de transferência! Pode colar no WhatsApp do Fornecedor.');
  };

  return (
    <div className="space-y-6">
      
      {/* 🟢 BARRA SUPERIOR DE SUB-NAVEGAÇÃO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
          <button 
            onClick={() => setSubTab('balanco')} 
            className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${subTab === 'balanco' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <IconLayers className="w-4 h-4" />
            <span>Balanço de Estoque</span>
          </button>
          
          <button 
            onClick={() => setSubTab('compras')} 
            className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 relative ${subTab === 'compras' ? 'bg-emerald-500 text-slate-950 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <IconShoppingCart className="w-4 h-4" />
            <span>Motor de Compras</span>
            {produtosSugestao.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full ml-1">
                {produtosSugestao.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setSubTab('posicao')} 
            className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${subTab === 'posicao' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <IconPackage className="w-4 h-4" />
            <span>Posição Físico-Financeira</span>
          </button>
        </div>

        {/* Filtro por Marca e Busca */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <IconFilter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={selectedMarca} 
              onChange={(e) => setSelectedMarca(e.target.value)}
              className="bg-transparent text-slate-700 font-bold focus:outline-none cursor-pointer capitalize"
            >
              {marcasDisponiveis.map(m => (
                <option key={m} value={m} className="capitalize">{m === 'todas' ? 'Todas as Marcas' : m}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <IconSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Buscar SKU ou Produto..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 📊 ABA 1: BALANÇO FINANCEIRO DE ESTOQUE */}
      {/* ------------------------------------------------------------------ */}
      {subTab === 'balanco' && (
        <div className="space-y-6">
          {/* CARDS KPIS DE BALANÇO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Ativo Circulante Total */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ativo Circulante (Estoque a Custo)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-400">
                  {balancoEstoque.custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="text-xs text-slate-400 font-bold">{balancoEstoque.unidadesTotais.toLocaleString('pt-BR')} un</span>
              </div>
              <p className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                Valor patrimonial total em mercadorias a preço de custo.
              </p>
            </div>

            {/* Card 2: Capital Ativo em Giro */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Estoque Rodando (Capital Ativo)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">
                  {balancoEstoque.capitalAtivoCusto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="text-xs text-emerald-600 font-bold">{balancoEstoque.unidadesRodando.toLocaleString('pt-BR')} un</span>
              </div>
              <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                Mercadorias com giro saudável de vendas (&le; 90 dias).
              </p>
            </div>

            {/* Card 3: Capital Congelado */}
            <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100 space-y-2">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider block">Capital Congelado (Encalhado)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-red-600">
                  {balancoEstoque.capitalCongeladoCusto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="text-xs text-red-700 font-bold">{balancoEstoque.unidadesParadas.toLocaleString('pt-BR')} un</span>
              </div>
              <p className="text-[11px] text-red-500 border-t border-red-100/60 pt-2">
                Mercadorias com 0 vendas ou estoque &gt; 90 dias.
              </p>
            </div>
          </div>

          {/* TABELA RESUMO POR MARCA PARA O BALANÇO */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Valuation de Estoque por Marca / Fornecedor
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Marca / Fornecedor</th>
                    <th className="pb-3 text-right">SKUs Listados</th>
                    <th className="pb-3 text-right">Físico Total</th>
                    <th className="pb-3 text-right">Ativo Imobilizado (Custo)</th>
                    <th className="pb-3 text-right">Proporção do Estoque</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {marcasDisponiveis.filter(m => m !== 'todas').map(marca => {
                    const prodsM = produtos.filter(p => p.marca === marca);
                    const fisM = prodsM.reduce((a, b) => a + (b.estoqueAtual || 0), 0);
                    const imobM = prodsM.reduce((a, b) => a + ((b.estoqueAtual || 0) * (b.custoUnitario || 0)), 0);
                    const pctM = balancoEstoque.custoTotal > 0 ? (imobM / balancoEstoque.custoTotal) * 100 : 0;

                    return (
                      <tr key={marca} className="hover:bg-slate-50">
                        <td className="py-3 font-bold text-slate-800 capitalize">{marca}</td>
                        <td className="py-3 text-right text-slate-500 font-medium">{prodsM.length}</td>
                        <td className="py-3 text-right font-bold text-slate-700">{fisM.toLocaleString('pt-BR')} un</td>
                        <td className="py-3 text-right font-black text-slate-900">
                          {imobM.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <span className="font-bold text-slate-600">{pctM.toFixed(1)}%</span>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${pctM}%` }}></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 🛒 ABA 2: MOTOR DE COMPRAS (CARRINHO DO CEO / COMPRAS) */}
      {/* ------------------------------------------------------------------ */}
      {subTab === 'compras' && (
        <div className="space-y-6 relative pb-28">
          
          {/* ALERTA INFORMATIVO */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-800">
            <div className="flex items-center space-x-3">
              <IconAlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="font-bold block">Motor de Sugestão de Reposição Inteligente</strong>
                <span>Produtos abaixo do Ponto de Pedido (Estoque &lt; Lead Time + 7 dias). Marque os itens e exporte o pedido.</span>
              </div>
            </div>
            
            <button 
              onClick={toggleSelectAll} 
              className="px-3 py-1.5 bg-amber-200/60 hover:bg-amber-200 text-amber-900 font-bold rounded-lg transition-colors shrink-0"
            >
              Selecionar / Desmarcar Todos
            </button>
          </div>

          {/* LISTA DE CARDS INTERATIVOS DE COMPRA */}
          <div className="grid grid-cols-1 gap-3">
            {produtosSugestao.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                <IconCheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">Estoque Saudável!</h4>
                <p className="text-xs text-slate-400">Nenhum produto necessita de compra para o filtro de marca selecionado.</p>
              </div>
            ) : (
              produtosSugestao.map(p => {
                const isSelected = !!selectedItems[p.sku];
                const qtdComprar = qtdsAjustadas[p.sku] !== undefined ? qtdsAjustadas[p.sku] : p.sugestaoCompra;
                const subtotalItem = qtdComprar * p.custoUnitario;

                return (
                  <div 
                    key={p.sku} 
                    className={`bg-white p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${isSelected ? 'border-emerald-500 shadow-xs bg-emerald-50/10' : 'border-slate-200 opacity-75'}`}
                  >
                    {/* ESQUERDA: Checkbox + Produto */}
                    <div className="flex items-center space-x-3 min-w-0">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelectItem(p.sku)}
                        className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                      />
                      
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded uppercase">
                            {p.sku}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full capitalize">
                            {p.marca}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 capitalize truncate" title={p.produto}>
                          {formatNomeProduto(p.produto)}
                        </h4>

                        <p className="text-[11px] text-slate-400">
                          Estoque Atual: <strong className="text-slate-700">{p.estoqueAtual} un</strong> | Venda Diária: <strong className="text-slate-700">{p.vendaDiaria} un/dia</strong> | Cobertura: <strong className="text-red-500">{p.diasDeEstoque} dias</strong>
                        </p>
                      </div>
                    </div>

                    {/* DIREITA: Inputs de Ajuste de Quantidade e Valor */}
                    <div className="flex items-center justify-between md:justify-end space-x-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Custo Unitário</span>
                        <span className="text-xs font-bold text-slate-700">
                          {p.custoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] text-emerald-700 font-bold uppercase block">Qtd a Pedir</span>
                        <input 
                          type="number" 
                          value={qtdComprar}
                          onChange={(e) => setQtdsAjustadas({ ...qtdsAjustadas, [p.sku]: Math.max(0, parseInt(e.target.value) || 0) })}
                          className="w-20 bg-slate-50 border border-slate-300 font-black text-slate-900 text-xs rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="text-right min-w-[100px]">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Subtotal</span>
                        <span className="text-sm font-black text-emerald-600">
                          {subtotalItem.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 🟢 BARRA FLUTUANTE DE RESUMO DO PEDIDO (CEO/COMPRAS) */}
          {resumoPedido.itensContados > 0 && (
            <div className="fixed bottom-4 left-4 right-4 md:left-80 md:right-8 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 z-40 animate-fadeIn">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Itens Selecionados</span>
                  <span className="text-base font-black text-white">{resumoPedido.itensContados} SKUs ({resumoPedido.totalPecas.toLocaleString('pt-BR')} pe&ccedil;as)</span>
                </div>

                <div className="border-l border-slate-800 pl-6">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Valor Total do Pedido</span>
                  <span className="text-xl font-black text-emerald-400">
                    {resumoPedido.custoTotalPedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              <button 
                onClick={gerarPedidoTexto}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
              >
                <IconDownload className="w-4 h-4" />
                <span>EXPORTAR PEDIDO (WHATSAPP)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 📋 ABA 3: POSIÇÃO FÍSICO-FINANCEIRA DETALHADA */}
      {/* ------------------------------------------------------------------ */}
      {subTab === 'posicao' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Detalhamento de SKUs e Giro de Estoque
            </h3>
            <span className="text-xs text-slate-400 font-bold">{produtosFiltrados.length} SKUs encontrados</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">SKU / Produto</th>
                  <th className="pb-3 text-center">Marca</th>
                  <th className="pb-3 text-right">Estoque Físico</th>
                  <th className="pb-3 text-right">Custo Unit.</th>
                  <th className="pb-3 text-right">Valor Imobilizado</th>
                  <th className="pb-3 text-right">Cobertura</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {produtosFiltrados.map(p => {
                  const imob = (p.estoqueAtual || 0) * (p.custoUnitario || 0);
                  let statusBg = 'bg-slate-100 text-slate-600';
                  let statusTxt = 'Saudável';

                  if (p.estoqueAtual === 0) {
                    statusBg = 'bg-red-100 text-red-700 font-bold';
                    statusTxt = 'Ruptura (Sem Estoque)';
                  } else if (p.diasDeEstoque > 90) {
                    statusBg = 'bg-amber-100 text-amber-800 font-bold';
                    statusTxt = 'Excesso / Congelado';
                  } else if (p.sugestaoCompra > 0) {
                    statusBg = 'bg-emerald-100 text-emerald-800 font-bold';
                    statusTxt = 'Comprar Reposição';
                  }

                  return (
                    <tr key={p.sku} className="hover:bg-slate-50">
                      <td className="py-3 max-w-[280px]">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{p.sku}</span>
                          <span className="font-bold text-slate-700 capitalize truncate" title={p.produto}>
                            {formatNomeProduto(p.produto)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-center font-bold text-slate-500 capitalize">{p.marca}</td>
                      <td className="py-3 text-right font-bold text-slate-800">{p.estoqueAtual.toLocaleString('pt-BR')} un</td>
                      <td className="py-3 text-right text-slate-600">
                        {p.custoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="py-3 text-right font-black text-slate-900">
                        {imob.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="py-3 text-right font-bold text-slate-600">
                        {p.diasDeEstoque === 999 ? '∞ dias' : `${p.diasDeEstoque} dias`}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBg}`}>
                          {statusTxt}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}