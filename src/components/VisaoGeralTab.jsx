import React, { useState } from 'react';
import { formatBRL, formatPercent } from '../utils/formatters';
import { IconTrendingUp, IconDollarSign, IconShoppingBag, IconReceipt } from './Icons';

export default function VisaoGeralTab({ kpis, deducoesTotais, historico12Meses, onSelectMonth, selectedCompetencia, channelFilter }) {
  const ticketMedio = kpis.totalPedidos ? kpis.faturamentoBruto / kpis.totalPedidos : 0;

  // Lógica de separação (EBITDA vs Margem de Contribuição)
  const filtroAtual = channelFilter || 'todos';
  const isVisaoGlobal = filtroAtual === 'todos';
  
  const custosFixos = isVisaoGlobal ? (kpis.custosFixos || 0) : 0;
  const lucroReal = (kpis.lucroLiquido || 0) - custosFixos;
  const labelLucro = isVisaoGlobal ? "Lucro Líquido (EBITDA)" : "Margem de Contribuição";
  const margemReal = kpis.faturamentoBruto > 0 ? (lucroReal / kpis.faturamentoBruto) * 100 : 0;

  // Componente interno para mostrar o Badge de MoM (Month over Month)
  const VariationBadge = ({ valor }) => {
    if (valor === undefined || valor === 0) return null;
    const isPositivo = valor > 0;
    return (
      <span className={`inline-flex items-center text-[10px] font-black px-1.5 py-0.5 rounded ${isPositivo ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
        {isPositivo ? '↑' : '↓'} {Math.abs(valor).toFixed(1)}% vs anterior
      </span>
    );
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* 1. CARDS DE KPI COM VARIAÇÃO MOM E CUSTOS FIXOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 md:p-6 text-white shadow-xl flex flex-col justify-between border border-slate-700/50 min-w-0">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            <span className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5"><IconTrendingUp /> {labelLucro}</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">Margem {formatPercent(margemReal)}</span>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white truncate">{formatBRL(lucroReal)}</h2>
            <div className="mt-1"><VariationBadge valor={kpis.variacaoLucro} /></div>
          </div>
          
          {/* Mostra SEMPRE na visão global, revelando a saúde operacional real */}
          {isVisaoGlobal && (
            <span className="text-[10px] text-slate-400 mt-2 block border-t border-slate-700/50 pt-2">
              Margem Bruta: {formatBRL(kpis.lucroLiquido || 0)} | OPEX (Fixo): <strong className="text-rose-400">-{formatBRL(custosFixos)}</strong>
            </span>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Faturamento Bruto</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl"><IconDollarSign /></div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 truncate block">{formatBRL(kpis.faturamentoBruto)}</span>
            <div className="mt-1 flex items-center gap-2">
              <VariationBadge valor={kpis.variacaoFat} />
              <span className="text-[10px] text-slate-400">Total Processado</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Volume de Vendas</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl"><IconShoppingBag /></div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 truncate block">{Math.round(kpis.totalPedidos || 0)} pedidos</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Ticket Médio: <strong>{formatBRL(ticketMedio)}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. GRÁFICO RESPEITANDO O FILTRO */}
      <GraficoLinha12Meses historico={historico12Meses} onSelectMonth={onSelectMonth} selectedCompetencia={selectedCompetencia} />

      {/* 3. PAINEL DE DEDUÇÕES (Mantido igual) */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-6 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl"><IconReceipt className="w-5 h-5" /></div>
            <div>
              <h3 className="text-base font-bold uppercase text-slate-800 tracking-wider">Detalhamento de Deduções & Custos (Variáveis)</h3>
              <p className="text-xs text-slate-400">Total consumido diretamente pelas vendas</p>
            </div>
          </div>
          <span className="text-sm font-black text-rose-600 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
            Total Deduções: {formatBRL(deducoesTotais.total)}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold"><span className="text-slate-700">CPV (Custo dos Produtos)</span><span className="text-slate-900">{formatBRL(kpis.totalCpv)}</span></div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden"><div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.cpvPerc, 100)}%` }} /></div>
            <span className="text-xs text-slate-400 block text-right font-semibold">{formatPercent(deducoesTotais.cpvPerc)} do faturamento</span>
          </div>
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold"><span className="text-slate-700">Taxas de Plataformas</span><span className="text-slate-900">{formatBRL(kpis.totalTaxas)}</span></div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden"><div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.taxasPerc, 100)}%` }} /></div>
            <span className="text-xs text-slate-400 block text-right font-semibold">{formatPercent(deducoesTotais.taxasPerc)} do faturamento</span>
          </div>
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold"><span className="text-slate-700">Impostos e Tributos</span><span className="text-slate-900">{formatBRL(kpis.totalImpostos)}</span></div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.impostosPerc, 100)}%` }} /></div>
            <span className="text-xs text-slate-400 block text-right font-semibold">{formatPercent(deducoesTotais.impostosPerc)} do faturamento</span>
          </div>
        </div>
      </div>

      {/* 4. RAIO-X DO OPEX (Só aparece na Visão Global e Modo Mensal) */}
      {isVisaoGlobal && kpis.detalhamentoOpex && kpis.detalhamentoOpex.length > 0 && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-6 w-full animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold uppercase text-slate-800 tracking-wider">Raio-X do OPEX (Despesas Operacionais)</h3>
              <p className="text-xs text-slate-400">Composição dos custos fixos da empresa neste mês</p>
            </div>
            <span className="text-sm font-black text-rose-800 bg-rose-100 px-4 py-2 rounded-xl border border-rose-200">
              Total OPEX: {formatBRL(custosFixos)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.detalhamentoOpex.map((item, idx) => {
              const pesoNoOpex = custosFixos > 0 ? (item.valor / custosFixos) * 100 : 0;
              return (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 truncate mr-2" title={item.categoria}>{item.categoria}</span>
                    <span className="text-sm font-black text-slate-900">{formatBRL(item.valor)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-800 h-full rounded-full" style={{ width: `${Math.min(pesoNoOpex, 100)}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 w-10 text-right">{pesoNoOpex.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

function GraficoLinha12Meses({ historico, onSelectMonth, selectedCompetencia }) {
  const [hoveredIdx, setHoveredIndex] = useState(null);
  
  const maxVal = Math.max(...historico.map(d => d.faturamento || 0), 1) * 1.25;
  const svgWidth = 900; const svgHeight = 220; const paddingX = 45; const paddingY = 35;

  const pointsFat = historico.map((d, i) => ({
    x: paddingX + (i * (svgWidth - 2 * paddingX)) / (Math.max(historico.length - 1, 1)),
    y: svgHeight - paddingY - ((d.faturamento || 0) / maxVal) * (svgHeight - 2 * paddingY),
    val: d.faturamento || 0, mes: d.mes, margem: d.margem || 0, lucro: d.lucro || 0
  }));

  const pointsLucro = historico.map((d, i) => ({
    x: paddingX + (i * (svgWidth - 2 * paddingX)) / (Math.max(historico.length - 1, 1)),
    y: svgHeight - paddingY - ((d.lucro || 0) / maxVal) * (svgHeight - 2 * paddingY),
    val: d.lucro || 0
  }));

  const generatePath = (pts) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cx = (pts[i].x + pts[i + 1].x) / 2;
      d += ` C ${cx} ${pts[i].y}, ${cx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return d;
  };

  const activePoint = hoveredIdx !== null ? pointsFat[hoveredIdx] : null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 w-full relative">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider">Evolução Mensal (Passe o rato para ver os valores)</h3>
        </div>
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-pink-500 rounded-full inline-block" /><span className="text-slate-700">Faturamento</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-full inline-block" /><span className="text-slate-700">Lucro Líquido</span></div>
        </div>
      </div>

      {activePoint && (
        <div className="absolute z-20 bg-slate-900 text-white p-3 rounded-xl shadow-2xl text-xs space-y-1 border border-slate-700 pointer-events-none transition-all"
          style={{ left: `${Math.min(Math.max(activePoint.x - 70, 20), svgWidth - 160)}px`, top: '50px' }}>
          <p className="font-extrabold text-emerald-400 border-b border-slate-800 pb-1 mb-1">Mês: {activePoint.mes}</p>
          <p className="text-slate-300">Faturamento: <strong className="text-white">{formatBRL(activePoint.val)}</strong></p>
          <p className="text-slate-300">Lucro Líquido: <strong className="text-emerald-400">{formatBRL(activePoint.lucro)}</strong></p>
          <p className="text-slate-300">Margem: <strong className="text-emerald-400">{formatPercent(activePoint.margem)}</strong></p>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#e2e8f0" strokeWidth="1.5" />
          <path d={generatePath(pointsFat)} fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
          <path d={generatePath(pointsLucro)} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />

          {pointsFat.map((pt, idx) => {
            const isSelected = pt.mes === selectedCompetencia;
            return (
              <g key={pt.mes} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)} onClick={() => onSelectMonth(pt.mes)}>
                <rect x={pt.x - 20} y={0} width="40" height={svgHeight} fill="transparent" />
                <text x={pt.x} y={svgHeight - 8} textAnchor="middle" className={`text-[10px] font-bold ${isSelected ? 'fill-emerald-600 font-black' : 'fill-slate-500'}`}>{pt.mes}</text>
                <circle cx={pt.x} cy={pt.y} r={hoveredIdx === idx || isSelected ? "7" : "4"} fill="#ec4899" stroke="#ffffff" strokeWidth="2" className="transition-all" />
                <circle cx={pointsLucro[idx].x} cy={pointsLucro[idx].y} r={hoveredIdx === idx || isSelected ? "7" : "4"} fill="#10b981" stroke="#ffffff" strokeWidth="2" className="transition-all" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}