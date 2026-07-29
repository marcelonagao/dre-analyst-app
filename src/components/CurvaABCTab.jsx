import React, { useState, useMemo } from 'react';
import { formatBRL, formatPercent } from '../utils/formatters';
import { IconSearch, IconShieldAlert, IconChevronDown, IconChevronRight } from './Icons';

export default function CurvaABCTab({ produtos, searchQuery, setSearchQuery, filterLowMargin, setFilterLowMargin, factor }) {
  const [expandedBrand, setExpandedBrand] = useState(null);

  const filteredProdutos = useMemo(() => {
    if (!produtos) return [];
    return produtos.filter((item) => {
      const matchesSearch =
        item.produto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.marca.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMargin = filterLowMargin ? item.margemLiquida < 10 : true;
      return matchesSearch && matchesMargin;
    });
  }, [produtos, searchQuery, filterLowMargin]);

  const produtosComPareto = useMemo(() => {
    if (filteredProdutos.length === 0) return [];
    
    const sorted = [...filteredProdutos].sort((a, b) => (b.faturamentoBruto * factor) - (a.faturamentoBruto * factor));
    const totalFat = sorted.reduce((acc, p) => acc + (p.faturamentoBruto * factor), 0);

    let acumulado = 0;
    return sorted.map(p => {
      const fat = p.faturamentoBruto * factor;
      acumulado += fat;
      const percAcumulado = totalFat > 0 ? (acumulado / totalFat) * 100 : 100;
      
      let classe = 'C';
      if (percAcumulado <= 80 || (acumulado - fat) / totalFat < 0.8) {
        classe = 'A';
      } else if (percAcumulado <= 95) {
        classe = 'B';
      } else {
        classe = 'C';
      }

      return {
        ...p,
        faturamentoBruto: fat,
        lucroLiquido: p.lucroLiquido * factor,
        quantidadeVendida: p.quantidadeVendida * factor,
        classe,
        percAcumulado
      };
    });
  }, [filteredProdutos, factor]);

  const marcasAgrupadas = useMemo(() => {
    const map = {};
    produtosComPareto.forEach(p => {
      const brand = p.marca || "Outras Marcas";
      if (!map[brand]) map[brand] = { marca: brand, faturamento: 0, lucro: 0, quantidade: 0, produtos: [] };
      map[brand].faturamento += p.faturamentoBruto;
      map[brand].lucro += p.lucroLiquido;
      map[brand].quantidade += p.quantidadeVendida;
      map[brand].produtos.push(p);
    });

    return Object.values(map).map(b => ({
      ...b,
      margemMedia: b.faturamento > 0 ? (b.lucro / b.faturamento) * 100 : 0
    })).sort((a, b) => b.lucro - a.lucro);
  }, [produtosComPareto]);

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por Marca, SKU ou Nome de Produto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
          />
        </div>

        <button
          onClick={() => setFilterLowMargin(!filterLowMargin)}
          className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
            filterLowMargin ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <IconShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Apenas Margem &lt; 10%</span>
        </button>
      </div>

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Curva ABC por Marca (Clique para expandir os SKUs)
      </h3>

      {marcasAgrupadas.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200/80">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {marcasAgrupadas.map((b) => {
            const isExpanded = expandedBrand === b.marca;
            return (
              <div key={b.marca} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden transition-all">
                <div
                  onClick={() => setExpandedBrand(isExpanded ? null : b.marca)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors border-b border-slate-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-black text-xs border border-emerald-200">MARCA</div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{b.marca}</h4>
                      <p className="text-xs text-slate-400">{b.produtos.length} SKU(s) • {Math.round(b.quantidade)} un vendidas</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Lucro Total</span>
                      <span className="text-sm font-black text-emerald-600">{formatBRL(b.lucro)}</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-black">{formatPercent(b.margemMedia)}</span>
                    {isExpanded ? <IconChevronDown className="w-5 h-5 text-slate-400" /> : <IconChevronRight className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 bg-slate-50/50 space-y-3">
                    <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Produtos da Marca {b.marca}:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {b.produtos.map((prod, idx) => {
                        const isLow = prod.margemLiquida < 10;
                        const isClasseA = prod.classe === 'A';
                        const isClasseB = prod.classe === 'B';
                        return (
                          <div key={idx} className={`bg-white p-4 rounded-xl border ${isLow ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border text-slate-700">SKU: {prod.sku}</span>
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${isClasseA ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : isClasseB ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                                    Classe {prod.classe}
                                  </span>
                                </div>
                                <h6 className="text-xs font-bold text-slate-900 mt-1.5">{prod.produto}</h6>
                              </div>
                              <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${isLow ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-50 text-emerald-700'}`}>
                                {formatPercent(prod.margemLiquida)}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 pt-2 border-t text-center text-xs">
                              <div><span className="text-[9px] text-slate-400 block">Qtd</span><strong className="text-slate-800">{Math.round(prod.quantidadeVendida)}</strong></div>
                              <div><span className="text-[9px] text-slate-400 block">Fat.</span><strong className="text-blue-700">{formatBRL(prod.faturamentoBruto)}</strong></div>
                              <div><span className="text-[9px] text-slate-400 block">Lucro</span><strong className="text-emerald-700">{formatBRL(prod.lucroLiquido)}</strong></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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