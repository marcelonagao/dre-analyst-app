import React, { useState, useMemo } from 'react';
import { formatBRL, formatPercent } from '../utils/formatters';
import { IconShoppingCart, IconBrain, IconChevronDown, IconChevronRight, IconPackage, IconAlertTriangle, IconRefreshCw } from './Icons';

export default function InteligenciaTab({ produtos, margemAtual }) {
  const [abaPrincipal, setAbaPrincipal] = useState('compras'); // 'compras' | 'parado'
  const [aumentoAltaMargem, setAumentoAltaMargem] = useState(20);
  const [reducaoBaixaMargem, setReducaoBaixaMargem] = useState(-30);
  const [expandedBrand, setExpandedBrand] = useState(null);

  const margemSimulada = margemAtual + (aumentoAltaMargem * 0.08) + (Math.abs(reducaoBaixaMargem) * 0.05);

  const produtosComClasse = useMemo(() => {
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

      return { ...p, classe };
    });
  }, [produtos]);

  const analiseEstoque = useMemo(() => {
    let totalFisico = 0, valorTotal = 0;
    let fisicoRodando = 0, valorRodando = 0;
    let fisicoParado = 0, valorParado = 0;

    produtosComClasse.forEach(p => {
      const qtd = p.estoqueAtual || 0;
      if (qtd <= 0) return;

      const precoVenda = p.quantidadeVendida > 0 ? p.faturamentoBruto / p.quantidadeVendida : 0;
      const custoUnitario = p.custoUnitario || (precoVenda * 0.45);
      const valor = qtd * custoUnitario;

      totalFisico += qtd;
      valorTotal += valor;

      if (p.quantidadeVendida > 0) {
        fisicoRodando += qtd; valorRodando += valor;
      } else {
        fisicoParado += qtd; valorParado += valor;
      }
    });

    return { totalFisico, valorTotal, fisicoRodando, valorRodando, fisicoParado, valorParado };
  }, [produtosComClasse]);

  // MOTOR DE COMPRAS (Para a aba de Compras)
  const comprasPorMarca = useMemo(() => {
    const map = {};
    let totalItensComprar = 0;
    let valorTotalComprar = 0;

    const fatorAumentoA = 1 + (aumentoAltaMargem / 100);
    const fatorReducaoC = 1 + (reducaoBaixaMargem / 100);

    produtosComClasse.forEach(p => {
      const precoVenda = p.quantidadeVendida > 0 ? p.faturamentoBruto / p.quantidadeVendida : 0;
      const custoUnitario = p.custoUnitario || (precoVenda * 0.45);
      
      let novaVendaDiaria = p.vendaDiaria || 0;
      if (p.classe === 'A') novaVendaDiaria *= fatorAumentoA;
      if (p.classe === 'C') novaVendaDiaria *= Math.max(0, fatorReducaoC);

      const coberturaDesejada = (p.leadTime || 0) + 30; 
      let novaSugestaoCompra = Math.ceil((novaVendaDiaria * coberturaDesejada) - (p.estoqueAtual || 0));
      novaSugestaoCompra = Math.max(0, novaSugestaoCompra);

      if (novaSugestaoCompra > 0) {
        totalItensComprar += novaSugestaoCompra;
        valorTotalComprar += novaSugestaoCompra * custoUnitario;

        const brand = p.marca || "Outras Marcas";
        if (!map[brand]) map[brand] = { marca: brand, totalComprar: 0, valorComprar: 0, produtos: [] };
        
        map[brand].totalComprar += novaSugestaoCompra;
        map[brand].valorComprar += novaSugestaoCompra * custoUnitario;
        map[brand].produtos.push({ ...p, vendaDiariaSimulada: novaVendaDiaria, sugestaoCompraSimulada: novaSugestaoCompra, custoUnitario });
      }
    });

    const marcas = Object.values(map).sort((a, b) => b.totalComprar - a.totalComprar);
    return { marcas, totalItensComprar, valorTotalComprar };
  }, [produtosComClasse, aumentoAltaMargem, reducaoBaixaMargem]);

  // MOTOR DE ESTOQUE PARADO (Para a aba de Ações)
  const estoqueParadoPorMarca = useMemo(() => {
    const map = {};
    
    produtosComClasse.forEach(p => {
      const qtd = p.estoqueAtual || 0;
      if (qtd > 0 && p.quantidadeVendida === 0) {
        const precoVenda = p.quantidadeVendida > 0 ? p.faturamentoBruto / p.quantidadeVendida : 0;
        const custoUnitario = p.custoUnitario || (precoVenda * 0.45);
        const valorParado = qtd * custoUnitario;

        const brand = p.marca || "Outras Marcas";
        if (!map[brand]) map[brand] = { marca: brand, totalItens: 0, valorTotalParado: 0, produtos: [] };
        
        map[brand].totalItens += qtd;
        map[brand].valorTotalParado += valorParado;
        map[brand].produtos.push({ ...p, valorParado, custoUnitario });
      }
    });

    // Ordena as marcas pelo Valor Financeiro Parado (Maior para Menor)
    return Object.values(map).sort((a, b) => b.valorTotalParado - a.valorTotalParado);
  }, [produtosComClasse]);

  return (
    <div className="space-y-6 w-full">
      
      {/* KPIs GLOBAIS DE ESTOQUE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <IconPackage className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estoque Total</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">{analiseEstoque.totalFisico} <span className="text-xs font-medium text-slate-500">un</span></h3>
            <span className="text-xs font-bold text-slate-400">{formatBRL(analiseEstoque.valorTotal)}</span>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 shadow-sm border border-emerald-200 flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <IconRefreshCw className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Estoque Rodando (Giro)</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-emerald-900">{analiseEstoque.fisicoRodando} <span className="text-xs font-medium text-emerald-700">un</span></h3>
            <span className="text-xs font-bold text-emerald-600">{formatBRL(analiseEstoque.valorRodando)}</span>
          </div>
        </div>

        <div className="bg-rose-50 rounded-2xl p-5 shadow-sm border border-rose-200 flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <IconAlertTriangle className="w-4 h-4 text-rose-500" />
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Estoque Parado (0 Vendas)</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-rose-900">{analiseEstoque.fisicoParado} <span className="text-xs font-medium text-rose-700">un</span></h3>
            <span className="text-xs font-bold text-rose-600">{formatBRL(analiseEstoque.valorParado)}</span>
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO INTERNA DA ABA DE INTELIGÊNCIA */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button onClick={() => {setAbaPrincipal('compras'); setExpandedBrand(null);}} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all ${abaPrincipal === 'compras' ? 'border-blue-500 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>
          Planejamento & Compras
        </button>
        <button onClick={() => {setAbaPrincipal('parado'); setExpandedBrand(null);}} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all ${abaPrincipal === 'parado' ? 'border-rose-500 text-rose-700 bg-rose-50/50' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>
          Ações de Estoque Parado
        </button>
      </div>

      {/* ========================================== */}
      {/* VISÃO 1: PLANEJAMENTO E COMPRAS            */}
      {/* ========================================== */}
      {abaPrincipal === 'compras' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><IconBrain className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-base font-black text-blue-900">Simulador Global de Margem & Compras</h4>
                  <p className="text-xs text-blue-700 mt-1">Ajuste o volume para ver o impacto na margem global e nas necessidades de compra.</p>
                </div>
              </div>
              <div className="text-right bg-white p-4 rounded-xl border border-blue-200 shadow-sm min-w-[160px]">
                <span className="text-[10px] uppercase font-bold text-blue-500 block">Margem Simulada</span>
                <span className={`text-3xl font-black ${margemSimulada >= 15 ? 'text-emerald-500' : 'text-blue-700'}`}>
                  {formatPercent(margemSimulada)}
                </span>
              </div>
            </div>
            
            <div className="space-y-5 pt-4 border-t border-blue-200/50 max-w-3xl">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Aumentar volume de produtos Classe A (Alta Margem)</span>
                  <span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">+{aumentoAltaMargem}%</span>
                </div>
                <input type="range" className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" min="0" max="100" value={aumentoAltaMargem} onChange={(e) => setAumentoAltaMargem(Number(e.target.value))} />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Reduzir volume de produtos Classe C (Baixa Margem)</span>
                  <span className="text-rose-600 bg-rose-100 px-2 py-0.5 rounded">{reducaoBaixaMargem}%</span>
                </div>
                <input type="range" className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" min="-100" max="0" value={reducaoBaixaMargem} onChange={(e) => setReducaoBaixaMargem(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-4">
            Sugestão de Compras por Fornecedor (Atualizado com Simulação)
          </h3>

          {comprasPorMarca.marcas.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200/80">
              Estoque saudável após simulação. Nenhuma sugestão de compra no momento.
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {comprasPorMarca.marcas.map((b) => {
                const isExpanded = expandedBrand === b.marca;
                return (
                  <div key={b.marca} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden transition-all">
                    <div onClick={() => setExpandedBrand(isExpanded ? null : b.marca)} className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl font-black text-xs border border-amber-200">FORNECEDOR</div>
                        <div>
                          <h4 className="text-base font-extrabold text-slate-900">{b.marca}</h4>
                          <p className="text-xs text-slate-400">{b.produtos.length} SKU(s) precisam de reposição</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-slate-400 font-bold block">Orçamento Est.</span>
                          <span className="text-sm font-black text-amber-600">{formatBRL(b.valorComprar)}</span>
                        </div>
                        {isExpanded ? <IconChevronDown className="w-5 h-5 text-slate-400" /> : <IconChevronRight className="w-5 h-5 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-0 bg-slate-50/50 overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                          <thead className="bg-slate-100 text-slate-500 uppercase font-bold text-[10px]">
                            <tr>
                              <th className="p-4">SKU / Produto</th>
                              <th className="p-4 text-center">Venda Diária (Simulada)</th>
                              <th className="p-4 text-center">Estoque Atual</th>
                              <th className="p-4 text-center">Custo Unitário</th>
                              <th className="p-4 text-right text-amber-700">Sugestão Compra</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {b.produtos.map((p, i) => (
                              <tr key={i} className="hover:bg-white">
                                <td className="p-4">
                                  <span className="font-bold text-slate-800 block truncate max-w-[250px]">{p.produto}</span>
                                  <span className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] text-slate-400 font-mono">{p.sku}</span>
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${p.classe === 'A' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : p.classe === 'B' ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>Classe {p.classe}</span>
                                  </span>
                                </td>
                                <td className="p-4 text-center font-medium">
                                  {p.vendaDiariaSimulada.toFixed(1)} un/dia
                                </td>
                                <td className="p-4 text-center font-bold text-slate-600">{p.estoqueAtual} un</td>
                                <td className="p-4 text-center text-slate-500">{formatBRL(p.custoUnitario)}</td>
                                <td className="p-4 text-right">
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

      {/* ========================================== */}
      {/* VISÃO 2: AÇÕES DE ESTOQUE PARADO           */}
      {/* ========================================== */}
      {abaPrincipal === 'parado' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 space-y-2">
            <h4 className="text-sm font-black text-rose-900 flex items-center gap-2">
              <IconAlertTriangle className="w-5 h-5 text-rose-600" />
              Plano de Ação: Capital Congelado
            </h4>
            <p className="text-xs text-rose-700">
              Os produtos abaixo possuem estoque físico, mas <strong>não tiveram nenhuma venda</strong> no período selecionado. 
              Eles estão ordenados pelo <strong>Valor Financeiro (R$)</strong> que está travado na prateleira.
            </p>
          </div>

          {estoqueParadoPorMarca.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200/80">
              Excelente! Não há capital congelado em estoque parado neste período.
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {estoqueParadoPorMarca.map((b) => {
                const isExpanded = expandedBrand === b.marca;
                // Ordena os produtos parados do mais caro para o mais barato
                const produtosOrdenados = [...b.produtos].sort((p1, p2) => p2.valorParado - p1.valorParado);

                return (
                  <div key={b.marca} className="bg-white rounded-2xl shadow-sm border border-rose-200/60 overflow-hidden transition-all">
                    <div onClick={() => setExpandedBrand(isExpanded ? null : b.marca)} className="p-5 flex items-center justify-between cursor-pointer hover:bg-rose-50/30 transition-colors border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl font-black text-xs border border-rose-200">MARCA</div>
                        <div>
                          <h4 className="text-base font-extrabold text-slate-900">{b.marca}</h4>
                          <p className="text-xs text-slate-400">{b.produtos.length} SKU(s) encalhados</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-rose-400 font-bold block">Capital Congelado</span>
                          <span className="text-sm font-black text-rose-600">{formatBRL(b.valorTotalParado)}</span>
                        </div>
                        {isExpanded ? <IconChevronDown className="w-5 h-5 text-slate-400" /> : <IconChevronRight className="w-5 h-5 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-0 bg-slate-50/50 overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                          <thead className="bg-rose-50/50 text-slate-500 uppercase font-bold text-[10px]">
                            <tr>
                              <th className="p-4">SKU / Produto</th>
                              <th className="p-4 text-center">Estoque Parado</th>
                              <th className="p-4 text-center">Custo Unitário</th>
                              <th className="p-4 text-right text-rose-700">Valor Congelado</th>
                              <th className="p-4 text-center">Ação Sugerida</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {produtosOrdenados.map((p, i) => (
                              <tr key={i} className="hover:bg-white">
                                <td className="p-4">
                                  <span className="font-bold text-slate-800 block truncate max-w-[250px]">{p.produto}</span>
                                  <span className="text-[9px] text-slate-400 font-mono">{p.sku}</span>
                                </td>
                                <td className="p-4 text-center font-bold text-slate-600">{p.estoqueAtual} un</td>
                                <td className="p-4 text-center text-slate-500">{formatBRL(p.custoUnitario)}</td>
                                <td className="p-4 text-right font-black text-rose-600">
                                  {formatBRL(p.valorParado)}
                                </td>
                                <td className="p-4 text-center">
                                  <span className="px-2 py-1 rounded-md font-bold text-[9px] uppercase tracking-wider bg-slate-800 text-white">
                                    {p.valorParado > 500 ? 'Liquidação Agressiva' : 'Criar Kit (Bundling)'}
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