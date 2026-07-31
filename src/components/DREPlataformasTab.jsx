import React, { useState, useMemo } from 'react';
import { formatBRL, formatPercent } from '../utils/formatters';
import { IconStore, IconChevronDown, IconChevronRight, IconAlertTriangle } from './Icons';

export default function DREPlataformasTab({ dre, historico12Meses, viewMode, produtosPorPlataforma = {} }) {
  const [expandedChannel, setExpandedChannel] = useState(null);

  return (
    <div className="space-y-6 w-full">
      {/* GRÁFICO DE EVOLUÇÃO POR LOJA ESPECÍFICA */}
      <GraficoCanaisPorPlataforma historico={historico12Meses} />

      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Análise de Rentabilidade por Canal ({viewMode === 'consolidado' ? 'Acumulado Total' : 'Mensal'})
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
        {dre.map((plat, idx) => {
          const isExpanded = expandedChannel === plat.plataforma;
          const prodsCanal = produtosPorPlataforma[plat.plataforma] || [];

          return (
            <div key={idx} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 flex flex-col ${isExpanded ? 'border-emerald-400 shadow-emerald-100 lg:col-span-2' : 'border-slate-200/80'}`}>
              
              {/* CABEÇALHO DO CANAL */}
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
                    <span className={`px-3 py-1.5 rounded-xl text-sm font-black ${plat.margemLiquida >= 15 ? 'bg-emerald-100 text-emerald-800' : plat.margemLiquida >= 10 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
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

              {/* ANÁLISE PROFUNDA (DRILL-DOWN POR MARCA E PRODUTO) */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/30 animate-fadeIn space-y-4">
                  <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">Top Marcas & Produtos (Cash Cows)</h4>
                      <p className="text-xs text-slate-500">Ordenado pelo volume de <strong>Lucro Absoluto (R$)</strong> gerado para o canal.</p>
                    </div>
                  </div>
                  
                  <DeepDiveMarcas produtos={prodsCanal} />
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
// COMPONENTE: DRILL-DOWN DE MARCAS E PRODUTOS
// ==========================================
function DeepDiveMarcas({ produtos }) {
  const [marcaExpandida, setMarcaExpandida] = useState(null);

  // 1. Agrupa os produtos do canal por Marca e soma os totais
  const marcasAgrupadas = useMemo(() => {
    if (!produtos || produtos.length === 0) return [];
    
    const map = {};
    produtos.forEach(p => {
      const brand = p.marca || "Sem Marca";
      if (!map[brand]) {
        map[brand] = { marca: brand, faturamento: 0, lucro: 0, quantidade: 0, produtos: [] };
      }
      map[brand].faturamento += p.faturamentoBruto;
      map[brand].lucro += p.lucroLiquido;
      map[brand].quantidade += p.quantidadeVendida;
      map[brand].produtos.push(p);
    });

    // 2. Ordena as Marcas pelo Lucro Absoluto (Maior para Menor)
    return Object.values(map)
      .map(b => ({ ...b, margemMedia: b.faturamento > 0 ? (b.lucro / b.faturamento) * 100 : 0 }))
      .sort((a, b) => b.lucro - a.lucro);
  }, [produtos]);

  if (marcasAgrupadas.length === 0) {
    return <div className="p-4 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400">Nenhum produto com venda válida neste canal.</div>;
  }

  return (
    <div className="space-y-3 w-full">
      {marcasAgrupadas.map((b, idx) => {
        const isExpanded = marcaExpandida === b.marca;
        
        // 3. Ordena os produtos dentro da marca pelo Lucro Absoluto
        const produtosOrdenados = [...b.produtos].sort((p1, p2) => p2.lucroLiquido - p1.lucroLiquido);

        return (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* LINHA DA MARCA */}
            <div 
              onClick={() => setMarcaExpandida(isExpanded ? null : b.marca)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-3 w-1/3">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg font-black text-[10px] border border-slate-200">
                  MARCA
                </div>
                <div className="truncate">
                  <h5 className="text-sm font-bold text-slate-800 truncate">{b.marca}</h5>
                  <p className="text-[10px] text-slate-400">{Math.round(b.quantidade)} un vendidas</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 w-2/3">
                <div className="text-right hidden sm:block">
                  <span className="text-[9px] uppercase text-slate-400 font-bold block">Faturamento</span>
                  <span className="text-xs font-bold text-slate-600">{formatBRL(b.faturamento)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase text-slate-400 font-bold block">Lucro Gerado</span>
                  <span className="text-sm font-black text-emerald-600">{formatBRL(b.lucro)}</span>
                </div>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black w-16 text-center ${b.margemMedia >= 15 ? 'bg-emerald-100 text-emerald-800' : b.margemMedia >= 10 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                  {formatPercent(b.margemMedia)}
                </span>
                {isExpanded ? <IconChevronDown className="w-4 h-4 text-slate-400" /> : <IconChevronRight className="w-4 h-4 text-slate-400" />}
              </div>
            </div>

            {/* LISTA DE PRODUTOS DA MARCA (EXPANSÍVEL) */}
            {isExpanded && (
              <div className="bg-slate-50/80 border-t border-slate-100 p-0">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-100 text-slate-500 uppercase font-bold text-[9px]">
                    <tr>
                      <th className="p-3 pl-4">Produto / SKU</th>
                      <th className="p-3 text-center">Volume</th>
                      <th className="p-3 text-right">Faturamento</th>
                      <th className="p-3 text-right">Lucro (R$)</th>
                      <th className="p-3 text-center pr-4">Saúde (Margem)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {produtosOrdenados.map((p, i) => {
                      const isAlerta = p.margemLiquida < 10;
                      return (
                        <tr key={i} className="hover:bg-white transition-colors">
                          <td className="p-3 pl-4 max-w-[200px] md:max-w-[300px] truncate">
                            <span className="font-bold text-slate-700 block truncate" title={p.produto}>{p.produto}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{p.sku}</span>
                          </td>
                          <td className="p-3 text-center font-medium text-slate-600">{Math.round(p.quantidadeVendida)} un</td>
                          <td className="p-3 text-right text-slate-600">{formatBRL(p.faturamentoBruto)}</td>
                          <td className="p-3 text-right font-bold text-emerald-600">{formatBRL(p.lucroLiquido)}</td>
                          <td className="p-3 pr-4 text-center">
                            <span className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.margemLiquida >= 15 ? 'bg-emerald-100 text-emerald-700' : 
                              p.margemLiquida >= 10 ? 'bg-amber-100 text-amber-700' : 
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {isAlerta && <IconAlertTriangle className="w-3 h-3" />}
                              {formatPercent(p.margemLiquida)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// GRÁFICO DINÂMICO POR LOJA (CORRIGIDO)
// ==========================================
function GraficoCanaisPorPlataforma({ historico }) {
  const [hoveredIdx, setHoveredIndex] = useState(null);

  // Extrai todas as lojas únicas que existem no histórico
  const storeNames = Array.from(new Set(historico.flatMap(h => Object.keys(h.lojas || {}))));
  
  // Paleta de cores corporativa para diferenciar as lojas
  const COLORS = ['#f97316', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

  const maxVal = Math.max(...historico.flatMap(h => Object.values(h.lojas || {})), 1) * 1.25;

  const svgWidth = 800;
  const svgHeight = 240;
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider">Evolução do Faturamento por Loja</h3>
          <p className="text-xs text-slate-400">Passe o mouse sobre os pontos para ver os valores exatos</p>
        </div>
        
        {/* LEGENDA DINÂMICA DAS LOJAS */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold">
          {lines.map((line, i) => (
            <span key={i} className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: line.color }} /> 
              {line.store}
            </span>
          ))}
        </div>
      </div>

      {/* TOOLTIP FLUTUANTE */}
      {hoveredIdx !== null && (
        <div className="absolute z-20 bg-slate-900 text-white p-4 rounded-xl shadow-2xl text-xs space-y-2 border border-slate-700 pointer-events-none transition-all"
          style={{ left: `${Math.min(Math.max(lines[0].points[hoveredIdx].x - 100, 20), svgWidth - 220)}px`, top: '60px', minWidth: '200px' }}>
          <p className="font-extrabold text-slate-300 border-b border-slate-800 pb-2 mb-2 text-center uppercase tracking-wider">
            {historico[hoveredIdx].mes}
          </p>
          {lines.map((line, i) => {
            const valor = line.points[hoveredIdx].val;
            if (valor === 0) return null; // Esconde lojas que não venderam no mês
            return (
              <div key={i} className="flex justify-between items-center gap-4">
                <span className="font-bold truncate max-w-[120px]" style={{ color: line.color }}>{line.store}</span>
                <span className="font-black">{formatBRL(valor)}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} aria-label="Gráfico de Lojas" className="w-full h-auto overflow-visible">
          <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#e2e8f0" strokeWidth="1.5" />

          {lines.map((line, i) => (
            <path key={i} d={generatePath(line.points)} fill="none" stroke={line.color} strokeWidth="2.5" />
          ))}

          {historico.map((_, i) => (
            <g 
              key={i} 
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <rect x={lines[0]?.points[i]?.x - 20 || 0} y={0} width="40" height={svgHeight} fill="transparent" />
              
              {lines.map((line, j) => {
                if (line.points[i].val === 0) return null;
                return (
                  <circle key={j} cx={line.points[i].x} cy={line.points[i].y} r={hoveredIdx === i ? "6" : "3.5"} fill={line.color} stroke="#ffffff" strokeWidth="1.5" className="transition-all" />
                );
              })}
              
              <text x={lines[0]?.points[i]?.x || 0} y={svgHeight - 10} textAnchor="middle" className={`text-[9px] font-bold ${hoveredIdx === i ? 'fill-slate-800' : 'fill-slate-400'}`}>{historico[i].mes}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}