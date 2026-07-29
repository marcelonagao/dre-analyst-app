import React, { useState } from 'react';
import { formatBRL, formatPercent } from '../utils/formatters';
import { IconStore } from './Icons';

export default function DREPlataformasTab({ dre, historico12Meses, viewMode }) {
  return (
    <div className="space-y-6 w-full">
      {/* Gráfico Multi-Canais com Hover */}
      <GraficoCanaisPorPlataforma historico={historico12Meses} />

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Detalhamento por Canal ({viewMode === 'consolidado' ? 'Acumulado Total' : 'Mensal'})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {dre.map((plat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-slate-100 text-slate-800 rounded-2xl"><IconStore className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{plat.plataforma}</h4>
                  <p className="text-xs text-slate-400">{Math.round(plat.pedidos)} pedidos processados</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-black">
                {formatPercent(plat.margemLiquida)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50/90 p-4 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Faturamento Bruto</span>
                <span className="font-bold text-slate-800 text-sm">{formatBRL(plat.faturamentoBruto)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Lucro Líquido</span>
                <span className="font-bold text-emerald-600 text-sm">{formatBRL(plat.lucroLiquido)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Taxas Canal</span>
                <span className="font-semibold text-rose-600">-{formatBRL(plat.taxasPlataforma)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Impostos</span>
                <span className="font-semibold text-indigo-600">-{formatBRL(plat.imposto)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GraficoCanaisPorPlataforma({ historico }) {
  // IMPORTANTE: useState agora está importado corretamente no topo do arquivo
  const [hoveredIdx, setHoveredIndex] = useState(null);

  const maxVal = Math.max(
    ...historico.flatMap(d => [d.shopee || 0, d.meli || 0, d.externa || 0])
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

  const pointsShopee = historico.map((d, i) => ({ x: paddingX + (i * (svgWidth - 2 * paddingX)) / (historico.length - 1), y: getY(d.shopee || 0), val: d.shopee || 0, mes: d.mes }));
  const pointsMeli = historico.map((d, i) => ({ x: paddingX + (i * (svgWidth - 2 * paddingX)) / (historico.length - 1), y: getY(d.meli || 0), val: d.meli || 0 }));
  const pointsExterna = historico.map((d, i) => ({ x: paddingX + (i * (svgWidth - 2 * paddingX)) / (historico.length - 1), y: getY(d.externa || 0), val: d.externa || 0 }));

  const generatePath = (pts) => {
    if (!pts.length) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cx = (pts[i].x + pts[i + 1].x) / 2;
      d += ` C ${cx} ${pts[i].y}, ${cx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return d;
  };

  const activeIdx = hoveredIdx;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 w-full relative">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider">Evolução do Faturamento por Canal</h3>
          <p className="text-xs text-slate-400">Passe o mouse sobre os pontos para ver os valores exatos</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-500 rounded-full inline-block" /> Shopee</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-full inline-block" /> Mercado Livre</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-full inline-block" /> Venda Externa</span>
        </div>
      </div>

      {/* TOOLTIP FLUTUANTE */}
      {activeIdx !== null && (
        <div className="absolute z-20 bg-slate-900 text-white p-3 rounded-xl shadow-2xl text-xs space-y-2 border border-slate-700 pointer-events-none transition-all"
          style={{ left: `${Math.min(Math.max(pointsShopee[activeIdx].x - 80, 20), svgWidth - 180)}px`, top: '40px', minWidth: '180px' }}>
          <p className="font-extrabold text-slate-300 border-b border-slate-800 pb-1 mb-1">Competência: <span className="text-white">{pointsShopee[activeIdx].mes}</span></p>
          <div className="flex justify-between items-center"><span className="text-orange-400 font-bold">Shopee:</span><span className="font-black">{formatBRL(pointsShopee[activeIdx].val)}</span></div>
          <div className="flex justify-between items-center"><span className="text-amber-400 font-bold">Mercado Livre:</span><span className="font-black">{formatBRL(pointsMeli[activeIdx].val)}</span></div>
          <div className="flex justify-between items-center"><span className="text-blue-400 font-bold">Externa:</span><span className="font-black">{formatBRL(pointsExterna[activeIdx].val)}</span></div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} aria-label="Gráfico de Canais" className="w-full h-auto overflow-visible">
          <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#e2e8f0" strokeWidth="1.5" />

          <path d={generatePath(pointsShopee)} fill="none" stroke="#f97316" strokeWidth="3" />
          <path d={generatePath(pointsMeli)} fill="none" stroke="#f59e0b" strokeWidth="3" />
          <path d={generatePath(pointsExterna)} fill="none" stroke="#3b82f6" strokeWidth="3" />

          {pointsShopee.map((pt, i) => (
            <g 
              key={i} 
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <rect x={pt.x - 20} y={0} width="40" height={svgHeight} fill="transparent" />
              <circle cx={pt.x} cy={pt.y} r={hoveredIdx === i ? "7" : "4"} fill="#f97316" stroke="#ffffff" strokeWidth="1.5" className="transition-all" />
              <circle cx={pointsMeli[i].x} cy={pointsMeli[i].y} r={hoveredIdx === i ? "7" : "4"} fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" className="transition-all" />
              <circle cx={pointsExterna[i].x} cy={pointsExterna[i].y} r={hoveredIdx === i ? "7" : "4"} fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" className="transition-all" />
              <text x={pt.x} y={svgHeight - 10} textAnchor="middle" className={`text-[9px] font-bold ${hoveredIdx === i ? 'fill-slate-800' : 'fill-slate-400'}`}>{historico[i].mes}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}