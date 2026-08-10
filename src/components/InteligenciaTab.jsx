import React, { useState, useMemo } from 'react';
import { formatBRL, formatPercent } from '../utils/formatters';
// Importamos apenas os ícones que já tínhamos certeza que existiam
import { IconShoppingCart, IconBrain, IconChevronDown, IconChevronRight, IconPackage, IconAlertTriangle, IconRefreshCw } from './Icons';

// Ícones embutidos para garantir que não vai dar erro de compilação
const IconDownloadLocal = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const IconSearchLocal = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default function InteligenciaTab({ produtos, margemAtual }) {
  const [abaPrincipal, setAbaPrincipal] = useState('posicao'); 
  const [aumentoAltaMargem, setAumentoAltaMargem] = useState(20);
  const [reducaoBaixaMargem, setReducaoBaixaMargem] = useState(-30);
  const [expandedBrand, setExpandedBrand] = useState(null);

  // ESTADOS DO NOVO FILTRO/ORDENAÇÃO
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortConfig, setSortConfig] = useState('imobilizado_desc');

  const margemSimulada = margemAtual + (aumentoAltaMargem * 0.08) + (Math.abs(reducaoBaixaMargem) * 0.05);

  // 1. CLASSIFICADOR ABC & STATUS
  const produtosComClasseEStatus = useMemo(() => {
    if (!produtos || produtos.length === 0) return [];
    const sorted = [...produtos].sort((a, b) => (b.faturamentoBruto || 0) - (a.faturamentoBruto || 0));
    const totalFat = sorted.reduce((acc, p) => acc + (p.faturamentoBruto || 0), 0);
    
    let acumulado = 0;
    return sorted.map(p => {
      const fat = p.faturamentoBruto || 0;
      acumulado += fat;
      const percAcumulado = totalFat > 0 ? (acumulado / totalFat) * 100 : 100;
      
      let classe = 'C';
      if (percAcumulado <= 80 || (acumulado - fat) / totalFat < 0.8) classe = 'A';
      else if (percAcumulado <= 95) classe = 'B';

      let status = { label: 'Saudável', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' };
      if (p.estoqueAtual <= 0) {
        status = { label: 'Esgotado', color: 'bg-rose-100 text-rose-700 border-rose-300' };
      } else if (p.quantidadeVendida === 0) {
        status = { label: 'Parado', color: 'bg-slate-100 text-slate-600 border-slate-300' };
      } else if (p.diasDeEstoque < p.leadTime) {
        status = { label: 'Risco Ruptura', color: 'bg-orange-100 text-orange-800 border-orange-300' };
      } else if (p.diasDeEstoque > p.leadTime + 45) {
        status = { label: 'Excesso', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      }

      const precoVenda = p.quantidadeVendida > 0 ? p.faturamentoBruto / p.quantidadeVendida : 0;
      const custoUnitario = p.custoUnitario || (precoVenda * 0.45);
      const imobilizado = (p.estoqueAtual || 0) * custoUnitario;

      return { ...p, classe, statusEstoque: status, imobilizado, custoUnitario };
    });
  }, [produtos]);

  // 2. ANÁLISE MACRO DE ESTOQUE
  const analiseEstoque = useMemo(() => {
    let totalFisico = 0, valorTotal = 0, fisicoRodando = 0, valorRodando = 0, fisicoParado = 0, valorParado = 0;
    produtosComClasseEStatus.forEach(p => {
      const qtd = p.estoqueAtual || 0;
      if (qtd <= 0) return;
      const valor = p.imobilizado;
      totalFisico += qtd; valorTotal += valor;
      if (p.quantidadeVendida > 0) { fisicoRodando += qtd; valorRodando += valor; } 
      else { fisicoParado += qtd; valorParado += valor; }
    });
    return { totalFisico, valorTotal, fisicoRodando, valorRodando, fisicoParado, valorParado };
  }, [produtosComClasseEStatus]);

  // 3. AGRUPAMENTO, FILTRO E ORDENAÇÃO (Posição de Estoque)
  const posicaoPorMarca = useMemo(() => {
    const produtosFiltrados = produtosComClasseEStatus.filter(p => {
      const matchesSearch = p.produto.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || p.statusEstoque.label === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const map = {};
    produtosFiltrados.forEach(p => {
      const brand = p.marca || "Outras Marcas";
      if (!map[brand]) map[brand] = { marca: brand, valorTotal: 0, produtos: [] };
      map[brand].valorTotal += p.imobilizado;
      map[brand].produtos.push(p);
    });

    Object.values(map).forEach(b => {
      b.produtos.sort((p1, p2) => {
        if (sortConfig === 'imobilizado_desc') return p2.imobilizado - p1.imobilizado;
        if (sortConfig === 'imobilizado_asc') return p1.imobilizado - p2.imobilizado;
        if (sortConfig === 'fisico_desc') return p2.estoqueAtual - p1.estoqueAtual;
        if (sortConfig === 'dias_desc') return p2.diasDeEstoque - p1.diasDeEstoque;
        return 0;
      });
    });

    return Object.values(map).sort((a, b) => b.valorTotal - a.valorTotal);
  }, [produtosComClasseEStatus, searchTerm, statusFilter, sortConfig]);

  // 4. FUNÇÃO DE EXPORTAÇÃO CSV
  const exportarCSV = () => {
    let csv = "Marca;SKU;Produto;Físico;Custo Unitário (R$);Valor Imobilizado (R$);Dias de Cobertura;Status Logístico\n";
    posicaoPorMarca.forEach(b => {
      b.produtos.forEach(p => {
        const nomeLimpo = p.produto.replace(/"/g, '""'); 
        csv += `"${b.marca}";"${p.sku}";"${nomeLimpo}";${p.estoqueAtual};${p.custoUnitario.toFixed(2)};${p.imobilizado.toFixed(2)};${p.diasDeEstoque};"${p.statusEstoque.label}"\n`;
      });
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' }); 
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Relatorio_Estoque_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 5. MOTOR DE COMPRAS
  const comprasPorMarca = useMemo(() => {
    const map = {};
    let totalItensComprar = 0, valorTotalComprar = 0;
    const fatorAumentoA = 1 + (aumentoAltaMargem / 100);
    const fatorReducaoC = 1 + (reducaoBaixaMargem / 100);

    produtosComClasseEStatus.forEach(p => {
      let novaVendaDiaria = p.vendaDiaria || 0;
      if (p.classe === 'A') novaVendaDiaria *= fatorAumentoA;
      if (p.classe === 'C') novaVendaDiaria *= Math.max(0, fatorReducaoC);

      const coberturaDesejada = (p.leadTime || 0) + 30; 
      let novaSugestaoCompra = Math.ceil((novaVendaDiaria * coberturaDesejada) - (p.estoqueAtual || 0));
      novaSugestaoCompra = Math.max(0, novaSugestaoCompra);

      if (novaSugestaoCompra > 0) {
        totalItensComprar += novaSugestaoCompra;
        valorTotalComprar += novaSugestaoCompra * p.custoUnitario;

        const brand = p.marca || "Outras Marcas";
        if (!map[brand]) map[brand] = { marca: brand, totalComprar: 0, valorComprar: 0, produtos: [] };
        
        map[brand].totalComprar += novaSugestaoCompra;
        map[brand].valorComprar += novaSugestaoCompra * p.custoUnitario;
        map[brand].produtos.push({ ...p, vendaDiariaSimulada: novaVendaDiaria, sugestaoCompraSimulada: novaSugestaoCompra });
      }
    });

    return { marcas: Object.values(map).sort((a, b) => b.totalComprar - a.totalComprar), totalItensComprar, valorTotalComprar };
  }, [produtosComClasseEStatus, aumentoAltaMargem, reducaoBaixaMargem]);

  // 6. MOTOR DE ESTOQUE PARADO
  const estoqueParadoPorMarca = useMemo(() => {
    const map = {};
    produtosComClasseEStatus.forEach(p => {
      const qtd = p.estoqueAtual || 0;
      if (qtd > 0 && p.quantidadeVendida === 0) {
        const valorParado = qtd * p.custoUnitario;
        const brand = p.marca || "Outras Marcas";
        if (!map[brand]) map[brand] = { marca: brand, totalItens: 0, valorTotalParado: 0, produtos: [] };
        map[brand].totalItens += qtd; map[brand].valorTotalParado += valorParado;
        map[brand].produtos.push({ ...p, valorParado });
      }
    });
    return Object.values(map).sort((a, b) => b.valorTotalParado - a.valorTotalParado);
  }, [produtosComClasseEStatus]);

  return (
    <div className="space-y-6 w-full">
      
      {/* KPIs GLOBAIS DE ESTOQUE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <IconPackage className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estoque Físico Total</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">{analiseEstoque.totalFisico} <span className="text-xs font-medium text-slate-500">un</span></h3>
            <span className="text-xs font-bold text-slate-400">Total Imobilizado: {formatBRL(analiseEstoque.valorTotal)}</span>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 shadow-sm border border-emerald-200 flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <IconRefreshCw className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Estoque Rodando (Giro)</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-emerald-900">{analiseEstoque.fisicoRodando} <span className="text-xs font-medium text-emerald-700">un</span></h3>
            <span className="text-xs font-bold text-emerald-600">Capital Ativo: {formatBRL(analiseEstoque.valorRodando)}</span>
          </div>
        </div>

        <div className="bg-rose-50 rounded-2xl p-5 shadow-sm border border-rose-200 flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <IconAlertTriangle className="w-4 h-4 text-rose-500" />
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Estoque Parado (0 Vendas)</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-rose-900">{analiseEstoque.fisicoParado} <span className="text-xs font-medium text-rose-700">un</span></h3>
            <span className="text-xs font-bold text-rose-600">Capital Congelado: {formatBRL(analiseEstoque.valorParado)}</span>
          </div>
        </div>
      </div>

      {/* SUB-NAVEGAÇÃO INTERNA */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button onClick={() => {setAbaPrincipal('posicao'); setExpandedBrand(null);}} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all ${abaPrincipal === 'posicao' ? 'border-slate-800 text-slate-900 bg-slate-200/50' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>
          Posição Físico-Financeira
        </button>
        <button onClick={() => {setAbaPrincipal('compras'); setExpandedBrand(null);}} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all ${abaPrincipal === 'compras' ? 'border-blue-500 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>
          Motor de Compras
        </button>
        <button onClick={() => {setAbaPrincipal('parado'); setExpandedBrand(null);}} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all ${abaPrincipal === 'parado' ? 'border-rose-500 text-rose-700 bg-rose-50/50' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>
          Capital Congelado
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VISÃO 1: POSIÇÃO DE ESTOQUE (COM FILTROS, ORDENAÇÃO E EXPORTAÇÃO) */}
      {/* ========================================================================= */}
      {abaPrincipal === 'posicao' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* BARRA DE FERRAMENTAS (TOOLBAR) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-1">
              
              {/* Busca */}
              <div className="relative flex-1 max-w-xs">
                <IconSearchLocal className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input type="text" placeholder="Buscar SKU ou Produto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-slate-400 focus:outline-none" />
              </div>

              {/* Filtro de Status */}
              <div className="flex flex-col">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer">
                  <option value="Todos">Todos os Status</option>
                  <option value="Saudável">✅ Saudável</option>
                  <option value="Excesso">⚠️ Excesso</option>
                  <option value="Risco Ruptura">🔥 Risco Ruptura</option>
                  <option value="Parado">❄️ Parado</option>
                  <option value="Esgotado">❌ Esgotado</option>
                </select>
              </div>

              {/* Ordenação */}
              <div className="flex flex-col">
                <select value={sortConfig} onChange={(e) => setSortConfig(e.target.value)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer">
                  <option value="imobilizado_desc">Maior Imobilizado (R$)</option>
                  <option value="imobilizado_asc">Menor Imobilizado (R$)</option>
                  <option value="fisico_desc">Maior Qtd Física</option>
                  <option value="dias_desc">Maior Cobertura (Dias)</option>
                </select>
              </div>
            </div>

            {/* Botão de Exportar CSV */}
            <button onClick={exportarCSV} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm whitespace-nowrap">
              <IconDownloadLocal className="w-4 h-4" /> Exportar CSV
            </button>
          </div>

          {posicaoPorMarca.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-slate-400 border border-slate-200">
              Nenhum produto encontrado para os filtros selecionados.
            </div>
          ) : (
            posicaoPorMarca.map((b) => {
              const isExpanded = expandedBrand === b.marca;
              return (
                <div key={b.marca} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div onClick={() => setExpandedBrand(isExpanded ? null : b.marca)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3 w-1/2">
                      <div className="p-2 bg-slate-100 text-slate-600 rounded-lg font-black text-[10px] border border-slate-200">MARCA</div>
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{b.marca}</h4>
                        <p className="text-[10px] text-slate-400">{b.produtos.length} SKUs listados (Filtrado)</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-4 w-1/2">
                      <div className="text-right">
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">Imobilizado Filtrado</span>
                        <span className="text-sm font-black text-slate-700">{formatBRL(b.valorTotal)}</span>
                      </div>
                      {isExpanded ? <IconChevronDown className="w-4 h-4 text-slate-400" /> : <IconChevronRight className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-slate-50/80 border-t border-slate-100 p-0 overflow-x-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-slate-100 text-slate-500 uppercase font-bold text-[9px]">
                          <tr>
                            <th className="p-3 pl-4">Produto / SKU Base</th>
                            <th className="p-3 text-center">Físico</th>
                            <th className="p-3 text-right">Custo Unit.</th>
                            <th className="p-3 text-right">Valor Imobilizado</th>
                            <th className="p-3 text-center">Dias Estoque</th>
                            <th className="p-3 text-center pr-4">Status Logístico</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {b.produtos.map((p, i) => (
                            <tr key={i} className="hover:bg-white transition-colors">
                              <td className="p-3 pl-4 max-w-[250px] truncate">
                                <span className="font-bold text-slate-700 block truncate" title={p.produto}>{p.produto}</span>
                                <span className="text-[9px] text-slate-400 font-mono">{p.sku}</span>
                              </td>
                              <td className="p-3 text-center font-black text-slate-600">{p.estoqueAtual} un</td>
                              <td className="p-3 text-right text-slate-500">{formatBRL(p.custoUnitario)}</td>
                              <td className="p-3 text-right font-bold text-slate-700">{formatBRL(p.imobilizado)}</td>
                              <td className="p-3 text-center font-medium text-slate-500">{p.diasDeEstoque > 900 ? '∞' : p.diasDeEstoque} dias</td>
                              <td className="p-3 pr-4 text-center">
                                <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border ${p.statusEstoque.color}`}>
                                  {p.statusEstoque.label}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISÃO 2: MOTOR DE COMPRAS */}
      {/* ========================================================================= */}
      {abaPrincipal === 'compras' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="text-sm font-black text-blue-900 flex items-center gap-2"><IconBrain className="w-5 h-5 text-blue-600" /> Simulador de Abastecimento</h4>
                <p className="text-xs text-blue-700 mt-1">Ajuste o mix para gerar a Ordem de Compra baseada no Lead Time.</p>
              </div>
              <div className="text-right bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
                <span className="text-[9px] uppercase font-bold text-blue-500 block">Orçamento Total Projetado</span>
                <span className="text-xl font-black text-blue-700">{formatBRL(comprasPorMarca.valorTotalComprar)}</span>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-blue-200/50">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Acelerar volume de produtos Classe A</span>
                  <span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">+{aumentoAltaMargem}%</span>
                </div>
                <input type="range" className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" min="0" max="100" value={aumentoAltaMargem} onChange={(e) => setAumentoAltaMargem(Number(e.target.value))} />
              </div>
            </div>
          </div>

          {comprasPorMarca.marcas.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200/80">Estoque saudável. Nenhuma compra sugerida.</div>
          ) : (
            <div className="space-y-4 w-full">
              {comprasPorMarca.marcas.map((b) => {
                const isExpanded = expandedBrand === b.marca;
                return (
                  <div key={b.marca} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div onClick={() => setExpandedBrand(isExpanded ? null : b.marca)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                      <div className="flex items-center space-x-3 w-1/2">
                        <div className="p-2 bg-amber-50 text-amber-700 rounded-lg font-black text-[10px] border border-amber-200">FORNECEDOR</div>
                        <div className="truncate">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{b.marca}</h4>
                          <p className="text-[10px] text-slate-400">{b.produtos.length} SKUs para reposição</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-4 w-1/2">
                        <div className="text-right">
                          <span className="text-[9px] uppercase text-slate-400 font-bold block">Comprar (R$)</span>
                          <span className="text-sm font-black text-amber-600">{formatBRL(b.valorComprar)}</span>
                        </div>
                        {isExpanded ? <IconChevronDown className="w-4 h-4 text-slate-400" /> : <IconChevronRight className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="bg-slate-50/80 border-t border-slate-100 p-0 overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                          <thead className="bg-slate-100 text-slate-500 uppercase font-bold text-[9px]">
                            <tr>
                              <th className="p-3 pl-4">Produto</th>
                              <th className="p-3 text-center">Físico</th>
                              <th className="p-3 text-center">Run Rate/dia</th>
                              <th className="p-3 text-right">Custo Un.</th>
                              <th className="p-3 text-right text-amber-700 pr-4">Sugestão Compra</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {b.produtos.map((p, i) => (
                              <tr key={i} className="hover:bg-white">
                                <td className="p-3 pl-4 max-w-[200px] truncate"><span className="font-bold text-slate-700 block truncate">{p.produto}</span><span className="text-[9px] text-slate-400 font-mono">{p.sku}</span></td>
                                <td className="p-3 text-center font-bold text-slate-600">{p.estoqueAtual} un</td>
                                <td className="p-3 text-center text-slate-500">{p.vendaDiariaSimulada.toFixed(1)} un</td>
                                <td className="p-3 text-right text-slate-500">{formatBRL(p.custoUnitario)}</td>
                                <td className="p-3 text-right pr-4">
                                  <span className="font-black text-amber-600 block">+ {p.sugestaoCompraSimulada} un</span>
                                  <span className="text-[9px] text-slate-400 block">{formatBRL(p.sugestaoCompraSimulada * p.custoUnitario)}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISÃO 3: CAPITAL CONGELADO */}
      {/* ========================================================================= */}
      {abaPrincipal === 'parado' && (
        <div className="space-y-6 animate-fadeIn">
          {estoqueParadoPorMarca.length === 0 ? (
             <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200/80">Sem estoque parado neste período!</div>
          ) : (
            <div className="space-y-4 w-full">
              {estoqueParadoPorMarca.map((b) => {
                const isExpanded = expandedBrand === b.marca;
                return (
                  <div key={b.marca} className="bg-white rounded-xl shadow-sm border border-rose-200/60 overflow-hidden transition-all">
                    <div onClick={() => setExpandedBrand(isExpanded ? null : b.marca)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-rose-50/30">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-rose-50 text-rose-700 rounded-lg font-black text-[10px] border border-rose-200">MARCA</div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{b.marca}</h4>
                          <p className="text-[10px] text-slate-400">{b.produtos.length} SKUs sem giro</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-[9px] uppercase text-rose-400 font-bold block">Capital Preso</span>
                          <span className="text-sm font-black text-rose-600">{formatBRL(b.valorTotalParado)}</span>
                        </div>
                        {isExpanded ? <IconChevronDown className="w-4 h-4 text-slate-400" /> : <IconChevronRight className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="bg-slate-50/80 border-t border-slate-100 p-0 overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                          <thead className="bg-rose-50/50 text-slate-500 uppercase font-bold text-[9px]">
                            <tr>
                              <th className="p-3 pl-4">Produto</th>
                              <th className="p-3 text-center">Físico Parado</th>
                              <th className="p-3 text-right">Valor Congelado</th>
                              <th className="p-3 text-center pr-4">Ação Sugerida</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {b.produtos.map((p, i) => (
                              <tr key={i} className="hover:bg-white">
                                <td className="p-3 pl-4 max-w-[250px] truncate"><span className="font-bold text-slate-800 block truncate">{p.produto}</span><span className="text-[9px] text-slate-400 font-mono">{p.sku}</span></td>
                                <td className="p-3 text-center font-bold text-slate-600">{p.estoqueAtual} un</td>
                                <td className="p-3 text-right font-black text-rose-600">{formatBRL(p.valorParado)}</td>
                                <td className="p-3 text-center pr-4">
                                  <span className="px-2 py-1 rounded-md font-bold text-[9px] uppercase bg-slate-800 text-white">
                                    {p.valorParado > 500 ? 'Liquidação' : 'Bundling (Kits)'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}