import React, { useState } from 'react';
import { formatBRL, formatPercent } from '../utils/formatters';
import { IconStore, IconChevronDown, IconChevronRight, IconAlertTriangle, IconPackage } from './Icons';

export default function DREPlataformasTab({ dre, historico12Meses, viewMode, produtos }) {
  const [expandedChannel, setExpandedChannel] = useState(null);

  return (
    <div className="space-y-6 w-full">
      {/* GRÁFICO MULTI-CANAIS COM HOVER */}
      <GraficoCanaisPorPlataforma historico={historico12Meses} />

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Detalhamento e Análise Profunda por Canal ({viewMode === 'consolidado' ? 'Acumulado Total' : 'Mensal'})
      </h3>

      {/* CARDS DE CANAIS EXPANSÍVEIS (ACCORDION) */}
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
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Faturamento Bruto</span><span className="font-black text-slate-800 text-sm">{formatBRL(plat.faturamentoBruto)}</span></div>
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Lucro Líquido</span><span className="font-black text-emerald-600 text-sm">{formatBRL(plat.lucroLiquido)}</span></div>
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Taxas Canal</span><span className="font-semibold text-rose-600">-{formatBRL(plat.taxasPlataforma)}</span></div>
                  <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Impostos</span><span className="font-semibold text-indigo-600">-{formatBRL(plat.imposto)}</span></div>
                </div>
              </div>

              {/* ÁREA DE ANÁLISE PROFUNDA (DRILL-DOWN) */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/30 animate-fadeIn">
                  <DeepDiveCanal plataforma={plat.plataforma} margemAtual={plat.margemLiquida} produtos={produtos} />
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
// COMPONENTE: ANÁLISE PROFUNDA DO CANAL
// ==========================================
function DeepDiveCanal({ plataforma, margemAtual, produtos }) {
  const [abaInterna, setAbaInterna] = useState('produtos'); // 'produtos' | 'simulador' | 'estoque'
  
  // Estados para o Simulador
  const [aumentoAltaMargem, setAumentoAltaMargem] = useState(20);
  const [reducaoBaixaMargem, setReducaoBaixaMargem] = useState(-30);

  // Pega os 2 melhores e os 2 piores produtos para análise
  const topProdutos = [...produtos].sort((a, b) => b.margemLiquida - a.margemLiquida).slice(0, 2);
  const pioresProdutos = [...produtos].sort((a, b) => a.margemLiquida - b.margemLiquida).slice(0, 2);

  // Cálculo Simulado da Nova Margem
  const margemSimulada = margemAtual + (aumentoAltaMargem * 0.08) + (Math.abs(reducaoBaixaMargem) * 0.05);

  return (
    <div className="space-y-4">
      {/* NAVEGAÇÃO INTERNA DO CANAL */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
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
        
        {/* ABA 1: PRODUTOS */}
        {abaInterna === 'produtos' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Estes são os itens que mais impactam a margem de <strong>{formatPercent(margemAtual)}</strong> neste canal.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mais Rentáveis */}
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

               {/* Menos Rentáveis */}
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
          </div>
        )}

        {/* ABA 2: SIMULADOR DE CENÁRIOS */}
        {abaInterna === 'simulador' && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="text-sm font-black text-blue-900">Simulador de Aumento de Margem</h4>
                <p className="text-xs text-blue-700 mt-1">Mova os sliders para ver o impacto de migrar investimentos de marketing.</p>
              </div>
              <div className="text-right bg-white p-3 rounded-xl border border-blue-200 shadow-sm min-w-[140px]">
                <span className="text-[10px] uppercase font-bold text-blue-500 block">Margem Simulada</span>
                <span className={`text-2xl font-black ${margemSimulada >= 15 ? 'text-emerald-500' : 'text-blue-700'}`}>
                  {formatPercent(margemSimulada)}
                </span>
              </div>
            </div>
            
            <div className="space-y-5 pt-4 border-t border-blue-200/50">
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
        )}

        {/* ABA 3: ESTOQUE E COMPRAS */}
        {abaInterna === 'estoque' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <IconPackage className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Giro de Estoque & Sugestão de Reposição</h4>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">SKU / Produto</th>
                    <th className="p-3 text-center">Venda Diária</th>
                    <th className="p-3 text-center">Estoque Atual</th>
                    <th className="p-3 text-center">Dias Restantes</th>
                    <th className="p-3 text-right">Sugestão Compra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {produtos.slice(0, 5).map((p, i) => {
                    const isRuptura = p.diasDeEstoque < 15;
                    return (
                      <tr key={i} className={`hover:bg-slate-50 ${isRuptura ? 'bg-rose-50/30' : ''}`}>
                        <td className="p-3">
                          <span className="font-bold text-slate-800 block truncate max-w-[200px]">{p.produto}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{p.sku}</span>
                        </td>
                        <td className="p-3 text-center font-medium">{p.vendaDiaria || 0} un/dia</td>
                        <td className="p-3 text-center font-bold">{p.estoqueAtual || 0} un</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-md font-bold ${isRuptura ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                            {p.diasDeEstoque || 0} dias
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className={`font-black ${p.sugestaoCompra > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                            {p.sugestaoCompra > 0 ? `+ ${p.sugestaoCompra} un` : 'Estoque OK'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-400 italic text-right">* Sugestão calculada para cobrir 30 dias + Lead Time do fornecedor.</p>
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
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold mt-2 md:mt-0">
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