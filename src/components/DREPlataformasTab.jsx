import React, { useState } from 'react';
import { formatBRL, formatPercent } from '../utils/formatters';
import { IconStore, IconChevronDown, IconChevronRight, IconAlertTriangle } from './Icons';

export default function DREPlataformasTab({ dre, historico12Meses, viewMode, produtosPorPlataforma = {}, factor = 1 }) {
  const [expandedChannel, setExpandedChannel] = useState(null);

  return (
    <div className="space-y-6 w-full">
      {/* GRÁFICO DINÂMICO POR LOJA */}
      <GraficoCanaisPorPlataforma historico={historico12Meses} />

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Detalhamento e Análise Profunda por Canal ({viewMode === 'consolidado' ? 'Acumulado Total' : 'Mensal'})
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
        {dre.map((plat, idx) => {
          const isExpanded = expandedChannel === plat.plataforma;
          
          // Pega os produtos do canal e aplica o fator (Mensal x1 ou Consolidado x12)
          const prodsCanalRaw = produtosPorPlataforma[plat.plataforma] || [];
          const prodsCanal = prodsCanalRaw.map(p => ({
            ...p,
            faturamentoBruto: p.faturamentoBruto * factor,
            lucroLiquido: p.lucroLiquido * factor,
            quantidadeVendida: p.quantidadeVendida * factor
          }));

          const topProdutos = [...prodsCanal].sort((a, b) => b.margemLiquida - a.margemLiquida).slice(0, 3);
          const pioresProdutos = [...prodsCanal].sort((a, b) => a.margemLiquida - b.margemLiquida).slice(0, 3);

          return (
            <div key={idx} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 flex flex-col ${isExpanded ? 'border-emerald-400 shadow-emerald-100 lg:col-span-2' : 'border-slate-200/80'}`}>
              <div onClick={() => setExpandedChannel(isExpanded ? null : plat.plataforma)} className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-2xl text-white ${plat.plataforma.toLowerCase().includes('shopee') ? 'bg-orange-500' : plat.plataforma.toLowerCase().includes('mercado livre') ? 'bg-amber-500' : 'bg-blue-500'}`}>
                      <IconStore className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">{plat.plataforma}</h4>
                      <p className="text-xs text-slate-400">{Math.round(plat.pedidos)} pedidos processados</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1.5 rounded-xl text-sm font-black ${plat.margemLiquida >= 15 ? 'bg-emerald-100 text-emerald-800' : plat.margemLiquida >= 10 ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'}`}>
                      {formatPercent(plat.margemLiquida)} mg
                    </span>
                    {isExpanded ? <IconChevronDown className="w-5 h-5 text-slate-400" /> : <IconChevronRight className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/90 p-4 rounded-xl border border-slate-100 text-xs">
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Faturamento Bruto</span><span className="font-black text-slate-800 text-sm">{formatBRL(plat.faturamentoBruto)}</span></div>
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Lucro Líquido</span><span className="font-black text-emerald-600 text-sm">{formatBRL(plat.lucroLiquido)}</span></div>
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Taxas Canal</span><span className="font-semibold text-rose-600">-{formatBRL(plat.taxasPlataforma)}</span></div>
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Impostos</span><span className="font-semibold text-indigo-600">-{formatBRL(plat.imposto)}</span></div>
                </div>
              </div>

              {/* DEEP DIVE SIMPLIFICADO (Apenas Top Produtos) */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/30 animate-fadeIn space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2">Top Produtos & Marcas</h4>
                  <p className="text-xs text-slate-500">Análise de Margem dos produtos vendidos <strong>exclusivamente na {plat.plataforma}</strong>.</p>
                  
                  {prodsCanal.length === 0 ? (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400">Nenhum produto encontrado neste canal.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm">
                        <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-3">🔥 Puxando a Margem para Cima</h5>
                        <div className="space-y-3">
                          {topProdutos.map((p, i) => (
                            <div key={i} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                              <div className="truncate pr-2">
                                <span className="font-bold text-slate-800 block truncate">{p.produto}</span>
                                <span className="text-[9px] text-slate-400">{p.marca}</span>
                              </div>
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md font-bold shrink-0">{formatPercent(p.margemLiquida)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-sm">
                        <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-wider mb-3">⚠️ Puxando a Margem para Baixo</h5>
                        <div className="space-y-3">
                          {pioresProdutos.map((p, i) => (
                            <div key={i} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                              <div className="truncate pr-2">
                                <span className="font-bold text-slate-800 block truncate">{p.produto}</span>
                                <span className="text-[9px] text-slate-400">{p.marca}</span>
                              </div>
                              <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded-md font-bold shrink-0 flex items-center gap-1">
                                <IconAlertTriangle className="w-3 h-3"/> {formatPercent(p.margemLiquida)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// GRÁFICO DINÂMICO POR LOJA
function GraficoCanaisPorPlataforma({ historico }) {
  const [hoveredIdx, setHoveredIndex] = useState(null);

  // Extrai todas as lojas únicas que existem no histórico filtrado
  const storeNames = Array.from(new Set(historico.flatMap(h => Object.keys(h.lojas || {}))));
  
  const COLORS = ['#f97316', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

  const maxVal = Math.max(
    ...historico.flatMap(h => Object.values(h.lojas || {})), 1
  ) * 1.25;

  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 35;

  const getY = (val) => {
    if (!maxVal || maxVal <= 0) return svgHeight - paddingY;
    const ratio = Math.min(Math.max(val / maxVal, 0), 1);
    return svgHeight - paddingY - ratio * (svgHeight - 2 * paddingY);
  };

  const lines = storeNames.map((store, index) => {
    const points = historico.map((h, i) => ({
      x: paddingX + (i * (svgWidth - 2 * paddingX)) / Math.max(historico.length - 1, 1),
      y: getY(h.lojas?.[store] || 0),
      val: h.lojas?.[store] || 0
    }));
    return { store, color: COLORS[index % COLORS.length], points };
  });

  const generatePath = (pts) => {
    if (!pts.length) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cx = (pts[i].x + pts[i + 1].x) / 2;
      d += ` C ${cx} ${pts[i].y}, ${cx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return d;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 w-full relative">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider">Evolução do Faturamento por Loja</h3>
          <p className="text-xs text-slate-400">Passe o mouse sobre os pontos para ver os valores exatos</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold mt-2 md:mt-0">
          {lines.map((line, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: line.color }} /> 
              {line.store}
            </span>
          ))}
        </div>
      </div>

      {/* TOOLTIP FLUTUANTE */}
      {hoveredIdx !== null && (
        <div className="absolute z-20 bg-slate-900 text-white p-3 rounded-xl shadow-2xl text-xs space-y-2 border border-slate-700 pointer-events-none transition-all"
          style={{ left: `${Math.min(Math.max(lines[0].points[hoveredIdx].x - 80, 20), svgWidth - 180)}px`, top: '40px', minWidth: '180px' }}>
          <p className="font-extrabold text-slate-300 border-b border-slate-800 pb-1 mb-1">Competência: <span className="text-white">{historico[hoveredIdx].mes}</span></p>
          {lines.map((line, i) => (
            <div key={i} className="flex justify-between items-center gap-4">
              <span className="font-bold" style={{ color: line.color }}>{line.store}:</span>
              <span className="font-black">{formatBRL(line.points[hoveredIdx].val)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} aria-label="Gráfico de Lojas" className="w-full h-auto overflow-visible">
          <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#e2e8f0" strokeWidth="1.5" />

          {lines.map((line, i) => (
            <path key={i} d={generatePath(line.points)} fill="none" stroke={line.color} strokeWidth="3" />
          ))}

          {historico.map((_, i) => (
            <g 
              key={i} 
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <rect x={lines[0]?.points[i]?.x - 20 || 0} y={0} width="40" height={svgHeight} fill="transparent" />
              
              {lines.map((line, j) => (
                <circle key={j} cx={line.points[i].x} cy={line.points[i].y} r={hoveredIdx === i ? "7" : "4"} fill={line.color} stroke="#ffffff" strokeWidth="1.5" className="transition-all" />
              ))}
              
              <text x={lines[0]?.points[i]?.x || 0} y={svgHeight - 10} textAnchor="middle" className={`text-[9px] font-bold ${hoveredIdx === i ? 'fill-slate-800' : 'fill-slate-400'}`}>{historico[i].mes}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}