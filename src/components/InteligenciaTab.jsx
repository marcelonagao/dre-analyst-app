import React, { useState, useMemo } from 'react';
import { formatBRL, formatPercent } from '../utils/formatters';
// IMPORT CORRIGIDO: Adicionado o IconPackage aqui 👇
import { IconShoppingCart, IconBrain, IconChevronDown, IconChevronRight, IconPackage } from './Icons';

export default function InteligenciaTab({ produtos, margemAtual }) {
  const [aumentoAltaMargem, setAumentoAltaMargem] = useState(20);
  const [reducaoBaixaMargem, setReducaoBaixaMargem] = useState(-30);
  const [expandedBrand, setExpandedBrand] = useState(null);

  const margemSimulada = margemAtual + (aumentoAltaMargem * 0.08) + (Math.abs(reducaoBaixaMargem) * 0.05);

  // Agrupa apenas produtos que precisam de compra (sugestaoCompra > 0) por Marca
  const comprasPorMarca = useMemo(() => {
    const map = {};
    let totalItensComprar = 0;
    let totalEstoqueFisico = 0;

    produtos.forEach(p => {
      totalEstoqueFisico += p.estoqueAtual || 0;
      
      if (p.sugestaoCompra > 0) {
        totalItensComprar += p.sugestaoCompra;
        const brand = p.marca || "Outras Marcas";
        if (!map[brand]) map[brand] = { marca: brand, totalComprar: 0, produtos: [] };
        map[brand].totalComprar += p.sugestaoCompra;
        map[brand].produtos.push(p);
      }
    });

    const marcas = Object.values(map).sort((a, b) => b.totalComprar - a.totalComprar);
    return { marcas, totalItensComprar, totalEstoqueFisico };
  }, [produtos]);

  return (
    <div className="space-y-6 w-full">
      
      {/* KPIs GLOBAIS DE ESTOQUE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-4 bg-slate-100 text-slate-600 rounded-2xl"><IconPackage className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estoque Físico Global</p>
            <h3 className="text-2xl font-black text-slate-800">{comprasPorMarca.totalEstoqueFisico} <span className="text-sm font-medium text-slate-500">unidades</span></h3>
          </div>
        </div>
        <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border border-amber-200 flex items-center space-x-4">
          <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl"><IconShoppingCart className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Necessidade de Compra (30 dias)</p>
            <h3 className="text-2xl font-black text-amber-900">{comprasPorMarca.totalItensComprar} <span className="text-sm font-medium text-amber-700">unidades</span></h3>
          </div>
        </div>
      </div>

      {/* SIMULADOR GLOBAL */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><IconBrain className="w-5 h-5" /></div>
            <div>
              <h4 className="text-base font-black text-blue-900">Simulador Global de Margem</h4>
              <p className="text-xs text-blue-700 mt-1">Ajuste o mix de vendas global para simular o atingimento da meta de 15%.</p>
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
              <span>Reduzir Ads/Volume de produtos Classe C (Baixa Margem)</span>
              <span className="text-rose-600 bg-rose-100 px-2 py-0.5 rounded">{reducaoBaixaMargem}%</span>
            </div>
            <input type="range" className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" min="-100" max="0" value={reducaoBaixaMargem} onChange={(e) => setReducaoBaixaMargem(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* SUGESTÃO DE COMPRAS POR MARCA */}
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-4">
        Sugestão de Compras por Marca (Baseado no Run Rate)
      </h3>

      {comprasPorMarca.marcas.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200/80">
          Estoque saudável. Nenhuma sugestão de compra no momento.
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
                      <p className="text-xs text-slate-400">{b.produtos.length} SKU(s) com baixo estoque</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Comprar</span>
                      <span className="text-sm font-black text-amber-600">{b.totalComprar} un</span>
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
                          <th className="p-4 text-center">Venda Diária</th>
                          <th className="p-4 text-center">Estoque Atual</th>
                          <th className="p-4 text-center">Dias Restantes</th>
                          <th className="p-4 text-right text-amber-700">Sugestão Compra</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {b.produtos.map((p, i) => (
                          <tr key={i} className="hover:bg-white">
                            <td className="p-4">
                              <span className="font-bold text-slate-800 block truncate max-w-[250px]">{p.produto}</span>
                              <span className="text-[9px] text-slate-400 font-mono">{p.sku}</span>
                            </td>
                            <td className="p-4 text-center font-medium">{p.vendaDiaria} un/dia</td>
                            <td className="p-4 text-center font-bold">{p.estoqueAtual} un</td>
                            <td className="p-4 text-center">
                              <span className="px-2 py-1 rounded-md font-bold bg-rose-100 text-rose-700">{p.diasDeEstoque} dias</span>
                            </td>
                            <td className="p-4 text-right font-black text-amber-600">
                              + {p.sugestaoCompra} un
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
  );
}