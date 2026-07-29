import React, { useState } from 'react';
import { formatBRL, formatPercent } from '../utils/formatters';
import { IconTrendingUp, IconDollarSign, IconShoppingBag, IconReceipt } from './Icons';

export default function VisaoGeralTab({ kpis, deducoesTotais, historico12Meses, onSelectMonth, selectedCompetencia }) {
  const ticketMedio = kpis.totalPedidos ? kpis.faturamentoBruto / kpis.totalPedidos : 0;

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 md:p-6 text-white shadow-xl flex flex-col justify-between border border-slate-700/50 min-w-0">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            <span className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5"><IconTrendingUp /> Lucro Líquido</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">Margem {formatPercent(kpis.margemLiquidaMedia)}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white truncate">{formatBRL(kpis.lucroLiquido)}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Faturamento Bruto</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl"><IconDollarSign /></div>
          </div>
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 truncate">{formatBRL(kpis.faturamentoBruto)}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Volume de Vendas</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl"><IconShoppingBag /></div>
          </div>
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 truncate">{Math.round(kpis.totalPedidos || 0)} pedidos</span>
          <span className="text-xs text-slate-500 mt-1 block">Ticket Médio: <strong>{formatBRL(ticketMedio)}</strong></span>
        </div>
      </div>

      <GraficoLinha12Meses historico={historico12Meses} onSelectMonth={onSelectMonth} selectedCompetencia={selectedCompetencia} />

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-6 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl"><IconReceipt className="w-5 h-5" /></div>
            <div>
              <h3 className="text-base font-bold uppercase text-slate-800 tracking-wider">Detalhamento de Deduções & Custos</h3>
              <p className="text-xs text-slate-400">Total consumido pela operação do e-commerce</p>
            </div>
          </div>
          <span className="text-sm font-black text-rose-600 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
            Total Deduções: {formatBRL(deducoesTotais.total)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">CPV (Custo dos Produtos)</span>
              <span className="text-slate-900">{formatBRL(kpis.totalCpv)}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.cpvPerc, 100)}%` }} />
            </div>
            <span className="text-xs text-slate-400 block text-right font-semibold">{formatPercent(deducoesTotais.cpvPerc)} do faturamento</span>
          </div>

          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Taxas de Plataformas</span>
              <span className="text-slate-900">{formatBRL(kpis.totalTaxas)}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.taxasPerc, 100)}%` }} />
            </div>
            <span className="text-xs text-slate-400 block text-right font-semibold">{formatPercent(deducoesTotais.taxasPerc)} do faturamento</span>
          </div>

          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Impostos e Tributos</span>
              <span className="text-slate-900">{formatBRL(kpis.totalImpostos)}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.impostosPerc, 100)}%` }} />
            </div>
            <span className="text-xs text-slate-400 block text-right font-semibold">{formatPercent(deducoesTotais.impostosPerc)} do faturamento</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GraficoLinha12Meses({ historico, onSelectMonth, selectedCompetencia }) {
  const [hoveredIdx, setHoveredIndex] = useState(null);

  const maxVal = Math.max(...historico.map(d => d.faturamento)) * 1.25;
  const svgWidth = 900;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 35;

  const pointsFat = historico.map((d, i) => {
    const x = paddingX + (i * (svgWidth - 2 * paddingX)) / (historico.length - 1);
    const y = svgHeight - paddingY - (d.faturamento / maxVal) * (svgHeight - 2 * paddingY);
    return { x, y, val: d.faturamento, mes: d.mes, margem: d.margem, lucro: d.lucro };
  });

  const pointsLucro = historico.map((d, i) => {
    const x = paddingX + (i * (svgWidth - 2 * paddingX)) / (historico.length - 1);
    const y = svgHeight - paddingY - (d.lucro / maxVal) * (svgHeight - 2 * paddingY);
    return { x, y, val: d.lucro };
  });

  const generatePath = (pts) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cx = (pts[i].x + pts[i + 1].x) / 2;
      d += ` C ${cx} ${pts[i].y}, ${cx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return d;
  };

  const pathFat = generatePath(pointsFat);
  const pathLucro = generatePath(pointsLucro);

  const activePoint = hoveredIdx !== null ? pointsFat[hoveredIdx] : null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 w-full relative">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider">Evolução Mensal (Passe o mouse para ver os valores)</h3>
          <p className="text-xs text-slate-400">Clique em um ponto para selecionar a competência</p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-pink-500 rounded-full inline-block" /><span className="text-slate-700">Faturamento</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-full inline-block" /><span className="text-slate-700">Lucro Líquido</span></div>
        </div>
      </div>

      {activePoint && (
        <div
          className="absolute z-20 bg-slate-900 text-white p-3 rounded-xl shadow-2xl text-xs space-y-1 border border-slate-700 pointer-events-none transition-all"
          style={{ left: `${Math.min(Math.max(activePoint.x - 70, 20), svgWidth - 160)}px`, top: '50px' }}
        >
          <p className="font-extrabold text-emerald-400 border-b border-slate-800 pb-1 mb-1">Mês: {activePoint.mes}</p>
          <p className="text-slate-300">Faturamento: <strong className="text-white">{formatBRL(activePoint.val)}</strong></p>
          <p className="text-slate-300">Lucro Líquido: <strong className="text-emerald-400">{formatBRL(activePoint.lucro)}</strong></p>
          <p className="text-slate-300">Margem: <strong className="text-emerald-400">{formatPercent(activePoint.margem)}</strong></p>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} aria-label="Gráfico de Evolução" className="w-full h-auto overflow-visible">
          <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#e2e8f0" strokeWidth="1.5" />

          <path d={pathFat} fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
          <path d={pathLucro} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />

          {pointsFat.map((pt, idx) => {
            const isSelected = pt.mes === selectedCompetencia;
            const ptLucro = pointsLucro[idx];

            return (
              <g
                key={pt.mes}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectMonth(pt.mes)}
              >
                <text x={pt.x} y={svgHeight - 8} textAnchor="middle" className={`text-[10px] font-bold ${isSelected ? 'fill-emerald-600 font-black' : 'fill-slate-500'}`}>
                  {pt.mes}
                </text>
                <circle cx={pt.x} cy={pt.y} r={hoveredIdx === idx || isSelected ? "7" : "4"} fill="#ec4899" stroke="#ffffff" strokeWidth="2" className="transition-all" />
                <circle cx={ptLucro.x} cy={ptLucro.y} r={hoveredIdx === idx || isSelected ? "7" : "4"} fill="#10b981" stroke="#ffffff" strokeWidth="2" className="transition-all" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}