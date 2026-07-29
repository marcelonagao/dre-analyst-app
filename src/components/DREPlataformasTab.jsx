import React, { useState } from 'react';
import { formatBRL, formatPercent } from '../utils/formatters';
import { IconStore, IconChevronDown, IconChevronRight, IconTrendingUp, IconPackage, IconAlertTriangle } from './Icons';

export default function DREPlataformasTab({ dre, historico12Meses, viewMode }) {
  const [expandedChannel, setExpandedChannel] = useState(null);

  return (
    <div className="space-y-6 w-full">
      {/* 1. GRÁFICO COM TOOLTIP INTERATIVO */}
      <GraficoCanaisPorPlataforma historico={historico12Meses} />

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Detalhamento e Análise Profunda por Canal ({viewMode === 'consolidado' ? 'Acumulado Total' : 'Mensal'})
      </h3>

      {/* 2. CARDS DE CANAIS EXPANSÍVEIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {dre.map((plat, idx) => {
          const isExpanded = expandedChannel === plat.plataforma;

          return (
            <div key={idx} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${isExpanded ? 'border-emerald-400 shadow-emerald-100 lg:col-span-2' : 'border-slate-200/80'}`}>
              
              {/* CABEÇALHO DO CANAL (CLICÁVEL) */}
              <div 
                onClick={() => setExpandedChannel(isExpanded ? null : plat.plataforma)}
                className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors flex flex-col justify-between h-full"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-2xl text-white ${
                      plat.plataforma.includes('Shopee') ? 'bg-orange-500' : 
                      plat.plataforma.includes('Mercado Livre') ? 'bg-amber-500' : 'bg-blue-500'
                    }`}>
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
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Faturamento</span><span className="font-black text-slate-800 text-sm">{formatBRL(plat.faturamentoBruto)}</span></div>
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Lucro Líquido</span><span className="font-black text-emerald-600 text-sm">{formatBRL(plat.lucroLiquido)}</span></div>
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Taxas Canal</span><span className="font-semibold text-rose-600">-{formatBRL(plat.taxasPlataforma)}</span></div>
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Impostos</span><span className="font-semibold text-indigo-600">-{formatBRL(plat.imposto)}</span></div>
                </div>
              </div>

              {/* ÁREA DE ANÁLISE PROFUNDA (DRILL-DOWN) */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/30 animate-fadeIn">
                  <DeepDiveCanal plataforma={plat.plataforma} margemAtual={plat.margemLiquida} />
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: ANÁLISE PROFUNDA DO CANAL (MOCKUP DA NOVA UX)
// ==========================================
function DeepDiveCanal({ plataforma, margemAtual }) {
  const [abaInterna, setAbaInterna] = useState('produtos'); // 'produtos' | 'simulador' | 'estoque'

  return (
    <div className="space-y-4">
      {/* NAVEGAÇÃO INTERNA DO CANAL */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button onClick={() => setAbaInterna('produtos')} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all ${abaInterna === 'produtos' ? 'border-emerald-500 text-emerald-700 bg-emerald-50/50' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>
          Top Produtos & Marcas
        </button>
        <button onClick={() => setAbaInterna('simulador')} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all ${abaInterna === 'simulador' ? 'border-blue-500 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>
          Simulador de Meta (15%)
        </button>
        <button onClick={() => setAbaInterna('estoque')} className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all ${abaInterna === 'estoque' ? 'border-amber-500 text-amber-700 bg-amber-50/50' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>
          Giro de Estoque & Compras
        </button>
      </div>

      {/* CONTEÚDO DAS ABAS INTERNAS */}
      <div className="pt-2">
        
        {abaInterna === 'produtos' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-4">Estes são os itens que mais impactam a margem de <strong>{formatPercent(margemAtual)}</strong> neste canal.</p>
            {/* Mock de Tabela de Produtos do Canal */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Marca / Produto</th>
                    <th className="p-3 text-right">Volume</th>
                    <th className="p-3 text-right">Lucro</th>
                    <th className="p-3 text-right">Margem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3"><span className="font-bold text-slate-800 block">La Belle Paris</span>Sérum Vitamina C</td>
                    <td className="p-3 text-right font-medium">145 un</td>
                    <td className="p-3 text-right font-bold text-emerald-600">R$ 3.450,00</td>
                    <td className="p-3 text-right"><span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md font-bold">45%</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-rose-50/20">
                    <td className="p-3"><span className="font-bold text-slate-800 block">Glamour Makeup</span>Batom Matte Nude</td>
                    <td className="p-3 text-right font-medium">320 un</td>
                    <td className="p-3 text-right font-bold text-rose-600">R$ 110,00</td>
                    <td className="p-3 text-right"><span className="bg-rose-100 text-rose-800 px-2 py-1 rounded-md font-bold flex items-center justify-end gap-1"><IconAlertTriangle className="w-3 h-3"/> 4%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaInterna === 'simulador' && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-black text-blue-900">Simulador de Aumento de Margem</h4>
                <p className="text-xs text-blue-700">Descubra o que acontece se mudarmos o mix de vendas.</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-blue-500 block">Margem Simulada</span>
                <span className="text-2xl font-black text-blue-700">15,20%</span>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-blue-200/50">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Aumentar vendas de "Sérum Vitamina C" (Margem Alta)</span>
                  <span className="text-blue-600">+ 30%</span>
                </div>
                <input type="range" className="w-full accent-blue-600" min="0" max="100" defaultValue="30" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Reduzir Ads em "Batom Matte" (Margem Baixa)</span>
                  <span className="text-rose-600">- 50%</span>
                </div>
                <input type="range" className="w-full accent-rose-600" min="-100" max="0" defaultValue="-50" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic">* Requer atualização do backend para funcionar com dados reais.</p>
          </div>
        )}

        {abaInterna === 'estoque' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white border border-slate-200 p-3 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Estoque Total</span>
                <span className="text-lg font-black text-slate-800">1.240 un</span>
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Giro Médio</span>
                <span className="text-lg font-black text-slate-800">45 dias</span>
              </div>
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-center">
                <span className="text-[10px] text-rose-500 uppercase font-bold block">Ruptura Iminente</span>
                <span className="text-lg font-black text-rose-700">3 SKUs</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic text-center">* Integração com a aba de Estoque do Sheets necessária.</p>
          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// GRÁFICO COM TOOLTIP INTERATIVO (HOVER)
// ==========================================
function GraficoCanaisPorPlataforma({ historico }) {
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
          
          <div className="flex justify-between items-center">
            <span className="text-orange-400 font-bold">Shopee:</span>
            <span className="font-black">{formatBRL(pointsShopee[activeIdx].val)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-amber-400 font-bold">Mercado Livre:</span>
            <span className="font-black">{formatBRL(pointsMeli[activeIdx].val)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-400 font-bold">Externa:</span>
            <span className="font-black">{formatBRL(pointsExterna[activeIdx].val)}</span>
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
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
              {/* Área de captura de mouse invisível maior para facilitar o hover */}
              <rect x={pt.x - 20} y={0} width="40" height={svgHeight} fill="transparent" />
              
              <circle cx={pt.x} cy={pt.y} r={hoveredIdx === i ? "7" : "4"} fill="#f97316" stroke="#ffffff" strokeWidth="2" className="transition-all" />
              <circle cx={pointsMeli[i].x} cy={pointsMeli[i].y} r={hoveredIdx === i ? "7" : "4"} fill="#f59e0b" stroke="#ffffff" strokeWidth="2" className="transition-all" />
              <circle cx={pointsExterna[i].x} cy={pointsExterna[i].y} r={hoveredIdx === i ? "7" : "4"} fill="#3b82f6" stroke="#ffffff" strokeWidth="2" className="transition-all" />
              
              <text x={pt.x} y={svgHeight - 10} textAnchor="middle" className={`text-[9px] font-bold ${hoveredIdx === i ? 'fill-slate-800' : 'fill-slate-400'}`}>
                {historico[i].mes}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}