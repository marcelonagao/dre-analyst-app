import React, { useState, useEffect, useMemo, useRef } from 'react';

// ==========================================
// ÍCONES SVG NATIVOS (ZERO DEPENDÊNCIAS)
// ==========================================
const IconBarChart3 = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />
  </svg>
);

const IconCalendar = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconRefreshCw = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const IconLink2 = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const IconPieChart = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const IconLayers = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const IconPackage = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const IconTrendingUp = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const IconDollarSign = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22m5-18H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const IconShoppingBag = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const IconReceipt = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconStore = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconSearch = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconShieldAlert = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconAlertCircle = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconChevronRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const IconChevronDown = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const IconCheckCircle2 = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ==========================================
// HISTÓRICO COM 3 CANAIS (Shopee, Meli, Venda Externa)
// ==========================================
const HISTORICO_12_MESES = [
  { mes: "05/2025", faturamento: 180000.00, lucro: 14400.00, margem: 8.00, shopee: 100000, meli: 60000, externa: 20000 },
  { mes: "06/2025", faturamento: 195000.00, lucro: 16575.00, margem: 8.50, shopee: 110000, meli: 65000, externa: 20000 },
  { mes: "07/2025", faturamento: 205000.00, lucro: 18040.00, margem: 8.80, shopee: 115000, meli: 68000, externa: 22000 },
  { mes: "08/2025", faturamento: 220000.00, lucro: 19800.00, margem: 9.00, shopee: 125000, meli: 70000, externa: 25000 },
  { mes: "09/2025", faturamento: 215000.00, lucro: 18705.00, margem: 8.70, shopee: 120000, meli: 70000, externa: 25000 },
  { mes: "10/2025", faturamento: 230000.00, lucro: 20470.00, margem: 8.90, shopee: 130000, meli: 75000, externa: 25000 },
  { mes: "11/2025", faturamento: 260000.00, lucro: 23920.00, margem: 9.20, shopee: 145000, meli: 85000, externa: 30000 },
  { mes: "12/2025", faturamento: 310000.00, lucro: 29450.00, margem: 9.50, shopee: 170000, meli: 105000, externa: 35000 },
  { mes: "01/2026", faturamento: 210000.00, lucro: 18500.00, margem: 8.81, shopee: 115000, meli: 70000, externa: 25000 },
  { mes: "02/2026", faturamento: 245000.00, lucro: 22100.00, margem: 9.02, shopee: 135000, meli: 82000, externa: 28000 },
  { mes: "03/2026", faturamento: 280000.00, lucro: 24760.00, margem: 8.84, shopee: 155000, meli: 95000, externa: 30000 },
  { mes: "04/2026", faturamento: 300939.97, lucro: 21545.65, margem: 7.16, shopee: 165000, meli: 105939.97, externa: 30000 }
];

const formatBRL = (val) => {
  if (val === undefined || val === null || isNaN(val)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0,00%';
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val) + '%';
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function App() {
  const [apiUrl, setApiUrl] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedCompetencia, setSelectedCompetencia] = useState('04/2026');
  const [viewMode, setViewMode] = useState('mensal'); // 'mensal' | 'consolidado'
  const [activeTab, setActiveTab] = useState('visao-geral');
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowMargin, setFilterLowMargin] = useState(false);

  const localCache = useRef({});

  const fetchData = async (competencia, forceRefresh = false) => {
    if (!forceRefresh && localCache.current[competencia]) {
      setData(localCache.current[competencia]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const cleanUrl = apiUrl.trim();

    try {
      if (cleanUrl) {
        const fullUrl = `${cleanUrl}?competencia=${encodeURIComponent(competencia)}`;
        const response = await fetch(fullUrl, { method: 'GET', redirect: 'follow' });
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        const parsedJson = await response.json();
        
        localCache.current[competencia] = parsedJson;
        setData(parsedJson);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const mockData = {
          metadados: {
            competenciaAtual: competencia,
            competenciasDisponiveis: HISTORICO_12_MESES.map(h => h.mes),
            ultimaAtualizacao: new Date().toISOString()
          },
          historicoMensal: HISTORICO_12_MESES,
          kpisGerais: {
            faturamentoBruto: 300939.97,
            totalTaxas: 42959.91,
            totalImpostos: 33100.00,
            totalCpv: 203331.01,
            lucroLiquido: 21545.65,
            margemLiquidaMedia: 7.16,
            totalPedidos: 4386
          },
          drePorPlataforma: [
            { plataforma: "Shopee RAFA", faturamentoBruto: 165000.00, taxasPlataforma: 23550, imposto: 18150, cpv: 111500, lucroLiquido: 11800, margemLiquida: 7.15, pedidos: 2410 },
            { plataforma: "Mercado Livre", faturamentoBruto: 105939.97, taxasPlataforma: 15120, imposto: 11650, cpv: 71500, lucroLiquido: 7669.97, margemLiquida: 7.23, pedidos: 1530 },
            { plataforma: "Venda Externa", faturamentoBruto: 30000.00, taxasPlataforma: 4289.91, imposto: 3300, cpv: 20331.01, lucroLiquido: 2075.68, margemLiquida: 6.91, pedidos: 446 }
          ],
          topProdutosCurvaABC: [
            { sku: "2LB05", produto: "Creme Facial Anti-olheira Com Filtro Solar", marca: "La Belle Paris", quantidadeVendida: 320, faturamentoBruto: 125000.00, lucroLiquido: 9800.00, margemLiquida: 7.84 },
            { sku: "SÉRUM-VITC", produto: "Sérum Facial Vitamina C 30ml Anti-idade", marca: "La Belle Paris", quantidadeVendida: 240, faturamentoBruto: 98000.00, lucroLiquido: 8330.00, margemLiquida: 8.50 },
            { sku: "PROT-SPF50", produto: "Protetor Solar Toque Seco FPS 50", marca: "SunCare Pro", quantidadeVendida: 180, faturamentoBruto: 55000.00, lucroLiquido: 2475.00, margemLiquida: 4.50 },
            { sku: "BATOM-MATTE-01", produto: "Batom Matte Longa Duração Nude Rose", marca: "Glamour Makeup", quantidadeVendida: 95, faturamentoBruto: 22939.97, lucroLiquido: 940.65, margemLiquida: 4.10 }
          ]
        };
        localCache.current[competencia] = mockData;
        setData(mockData);
      }
    } catch (err) {
      console.error("Erro no fetch:", err);
      setError("Não foi possível conectar ao Google Apps Script.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedCompetencia);
  }, [selectedCompetencia]);

  const listaHistorico = useMemo(() => data?.historicoMensal || HISTORICO_12_MESES, [data]);

  const competenciasList = useMemo(() => {
    return data?.metadados?.competenciasDisponiveis || listaHistorico.map(h => h.mes);
  }, [data, listaHistorico]);

  const dadosConsolidados = useMemo(() => {
    let fatBrutoTotal = 0;
    let lucroLiquidoTotal = 0;

    listaHistorico.forEach(m => {
      fatBrutoTotal += m.faturamento || 0;
      lucroLiquidoTotal += m.lucro || 0;
    });

    const margemMedia = fatBrutoTotal > 0 ? (lucroLiquidoTotal / fatBrutoTotal) * 100 : 0;
    const fatorMult = listaHistorico.length || 1;

    return {
      faturamentoBruto: fatBrutoTotal,
      lucroLiquido: lucroLiquidoTotal,
      margemLiquidaMedia: margemMedia,
      totalTaxas: (data?.kpisGerais?.totalTaxas || 42959.91) * fatorMult,
      totalImpostos: (data?.kpisGerais?.totalImpostos || 33100.00) * fatorMult,
      totalCpv: (data?.kpisGerais?.totalCpv || 203331.01) * fatorMult,
      totalPedidos: (data?.kpisGerais?.totalPedidos || 4386) * fatorMult
    };
  }, [listaHistorico, data]);

  const kpisExibidos = useMemo(() => {
    if (viewMode === 'consolidado') return dadosConsolidados;
    return data?.kpisGerais || {};
  }, [viewMode, data, dadosConsolidados]);

  const deducoesTotais = useMemo(() => {
    const { totalCpv = 0, totalTaxas = 0, totalImpostos = 0, faturamentoBruto = 1 } = kpisExibidos;
    const total = totalCpv + totalTaxas + totalImpostos;
    return {
      total,
      cpvPerc: (totalCpv / faturamentoBruto) * 100,
      taxasPerc: (totalTaxas / faturamentoBruto) * 100,
      impostosPerc: (totalImpostos / faturamentoBruto) * 100
    };
  }, [kpisExibidos]);

  const dreExibida = useMemo(() => {
    const lista = data?.drePorPlataforma || [];
    if (viewMode === 'mensal') return lista;

    const mapPlat = {
      "Shopee RAFA": { plataforma: "Shopee RAFA", faturamentoBruto: 0, lucroLiquido: 0, taxasPlataforma: 0, imposto: 0, cpv: 0, pedidos: 0 },
      "Mercado Livre": { plataforma: "Mercado Livre", faturamentoBruto: 0, lucroLiquido: 0, taxasPlataforma: 0, imposto: 0, cpv: 0, pedidos: 0 },
      "Venda Externa": { plataforma: "Venda Externa", faturamentoBruto: 0, lucroLiquido: 0, taxasPlataforma: 0, imposto: 0, cpv: 0, pedidos: 0 }
    };

    listaHistorico.forEach(m => {
      const shopeeFat = m.shopee || 165000;
      const meliFat = m.meli || 105939.97;
      const extFat = m.externa || 30000;

      mapPlat["Shopee RAFA"].faturamentoBruto += shopeeFat;
      mapPlat["Shopee RAFA"].lucroLiquido += shopeeFat * 0.0715;
      mapPlat["Shopee RAFA"].taxasPlataforma += shopeeFat * 0.1428;
      mapPlat["Shopee RAFA"].imposto += shopeeFat * 0.11;
      mapPlat["Shopee RAFA"].cpv += shopeeFat * 0.6757;
      mapPlat["Shopee RAFA"].pedidos += 2410;

      mapPlat["Mercado Livre"].faturamentoBruto += meliFat;
      mapPlat["Mercado Livre"].lucroLiquido += meliFat * 0.0723;
      mapPlat["Mercado Livre"].taxasPlataforma += meliFat * 0.1428;
      mapPlat["Mercado Livre"].imposto += meliFat * 0.11;
      mapPlat["Mercado Livre"].cpv += meliFat * 0.6757;
      mapPlat["Mercado Livre"].pedidos += 1530;

      mapPlat["Venda Externa"].faturamentoBruto += extFat;
      mapPlat["Venda Externa"].lucroLiquido += extFat * 0.0691;
      mapPlat["Venda Externa"].taxasPlataforma += extFat * 0.1428;
      mapPlat["Venda Externa"].imposto += extFat * 0.11;
      mapPlat["Venda Externa"].cpv += extFat * 0.6757;
      mapPlat["Venda Externa"].pedidos += 446;
    });

    return Object.values(mapPlat).map(p => ({
      ...p,
      margemLiquida: p.faturamentoBruto > 0 ? (p.lucroLiquido / p.faturamentoBruto) * 100 : 0
    }));
  }, [viewMode, data, listaHistorico]);

  const filteredABC = useMemo(() => {
    if (!data?.topProdutosCurvaABC) return [];
    return data.topProdutosCurvaABC.filter((item) => {
      const matchesSearch =
        item.produto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.marca.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMargin = filterLowMargin ? item.margemLiquida < 10 : true;
      return matchesSearch && matchesMargin;
    });
  }, [data, searchQuery, filterLowMargin]);

  return (
    <div className="w-screen min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800 antialiased overflow-x-hidden m-0 p-0">
      
      {/* SIDEBAR FIXA COMPLETA */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-slate-900 text-white flex-col justify-between shrink-0 border-r border-slate-800 fixed left-0 top-0 bottom-0 h-screen z-30 shadow-2xl">
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <IconBarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white leading-tight">Controller</h1>
              <p className="text-[11px] text-slate-400">Executive Fintech Studio</p>
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Competência Ativa</span>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400">
                <IconCalendar className="w-4 h-4" />
                <select
                  value={selectedCompetencia}
                  onChange={(e) => { setSelectedCompetencia(e.target.value); setViewMode('mensal'); }}
                  className="bg-slate-900 text-white font-bold text-xs rounded-lg px-2 py-1 border border-slate-700 focus:outline-none cursor-pointer"
                >
                  {competenciasList.map((comp) => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>

              <button onClick={() => fetchData(selectedCompetencia, true)} className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white" title="Atualizar Dados">
                <IconRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            </div>
          </div>

          <nav className="space-y-1.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block px-2 mb-1">NAVEGAÇÃO</span>
            
            <button onClick={() => setActiveTab('visao-geral')} className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'visao-geral' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
              <div className="flex items-center space-x-3"><IconPieChart className="w-4 h-4" /><span>Visão Geral</span></div>
              <IconChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button onClick={() => setActiveTab('dre')} className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'dre' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
              <div className="flex items-center space-x-3"><IconLayers className="w-4 h-4" /><span>DRE por Canais</span></div>
              <IconChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button onClick={() => setActiveTab('abc')} className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'abc' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
              <div className="flex items-center space-x-3"><IconPackage className="w-4 h-4" /><span>Curva ABC Produtos</span></div>
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900 space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/40">
            <IconCheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Vendas Válidas Ativas</span>
          </div>

          <button onClick={() => setShowApiModal(!showApiModal)} className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="flex items-center gap-2"><IconLink2 className="w-4 h-4 text-emerald-400" /> Endpoint API</span>
            <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-300">GAS</span>
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <div className="md:pl-64 lg:pl-72 flex-1 w-full min-w-0 flex flex-col min-h-screen bg-slate-50 overflow-x-hidden">
        
        <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4 shadow-xs w-full">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {activeTab === 'visao-geral' && (viewMode === 'consolidado' ? 'Visão Consolidada Acumulada' : 'Visão Geral Executiva')}
              {activeTab === 'dre' && (viewMode === 'consolidado' ? 'DRE Consolidada Acumulada' : 'DRE por Canal de Vendas')}
              {activeTab === 'abc' && (viewMode === 'consolidado' ? 'Curva ABC Consolidada Acumulada' : 'Curva ABC de Produtos')}
            </h2>
            <p className="text-xs text-slate-400">
              Modo Global: <strong className="text-slate-700">{viewMode === 'consolidado' ? 'Acumulado 12 Meses' : `Mês ${selectedCompetencia}`}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex space-x-1 text-xs">
              <button
                onClick={() => setViewMode('mensal')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${viewMode === 'mensal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Mês ({selectedCompetencia})
              </button>
              <button
                onClick={() => setViewMode('consolidado')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${viewMode === 'consolidado' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Visão Consolidada
              </button>
            </div>

            <button onClick={() => fetchData(selectedCompetencia, true)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200">
              <IconRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </header>

        {showApiModal && (
          <div className="m-6 p-4 bg-slate-900 text-white rounded-2xl shadow-xl text-xs">
            <label className="block mb-1 font-bold text-emerald-400">URL do Google Apps Script:</label>
            <input type="text" placeholder="https://script.google.com/macros/s/.../exec" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto w-full">
          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <ErrorState message={error} onRetry={() => fetchData(selectedCompetencia, true)} />
          ) : (
            <>
              {activeTab === 'visao-geral' && (
                <VisaoGeralTab
                  kpis={kpisExibidos}
                  deducoesTotais={deducoesTotais}
                  historico12Meses={listaHistorico}
                  onSelectMonth={(m) => { setSelectedCompetencia(m); setViewMode('mensal'); }}
                  selectedCompetencia={selectedCompetencia}
                />
              )}
              {activeTab === 'dre' && (
                <DREPlataformasTab
                  dre={dreExibida}
                  historico12Meses={listaHistorico}
                  viewMode={viewMode}
                />
              )}
              {activeTab === 'abc' && (
                <CurvaABCTab
                  produtos={filteredABC}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterLowMargin={filterLowMargin}
                  setFilterLowMargin={setFilterLowMargin}
                  factor={viewMode === 'consolidado' ? 12 : 1}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// ABA 1: VISÃO GERAL
function VisaoGeralTab({ kpis, deducoesTotais, historico12Meses, onSelectMonth, selectedCompetencia }) {
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

// GRÁFICO DE EVOLUÇÃO
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
          style={{
            left: `${Math.min(Math.max(activePoint.x - 70, 20), svgWidth - 160)}px`,
            top: '50px'
          }}
        >
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

// ==========================================
// ABA 2: CANAIS / DRE COM GRÁFICO CORRIGIDO (Shopee, Mercado Livre, Venda Externa)
// ==========================================
function DREPlataformasTab({ dre, historico12Meses, viewMode }) {
  return (
    <div className="space-y-6 w-full">
      {/* GRÁFICO MULTI-CANAL CORRIGIDO */}
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

// GRÁFICO DE BARRAS/LINHAS MULTI-CANAL COM ESCALA CORRIGIDA
function GraficoCanaisPorPlataforma({ historico }) {
  // Pega o teto de faturamento de todos os 3 canais sem estouro de limite
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

  const pointsShopee = historico.map((d, i) => ({
    x: paddingX + (i * (svgWidth - 2 * paddingX)) / (historico.length - 1),
    y: getY(d.shopee || 0)
  }));

  const pointsMeli = historico.map((d, i) => ({
    x: paddingX + (i * (svgWidth - 2 * paddingX)) / (historico.length - 1),
    y: getY(d.meli || 0)
  }));

  const pointsExterna = historico.map((d, i) => ({
    x: paddingX + (i * (svgWidth - 2 * paddingX)) / (historico.length - 1),
    y: getY(d.externa || 0)
  }));

  const generatePath = (pts) => {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cx = (pts[i].x + pts[i + 1].x) / 2;
      d += ` C ${cx} ${pts[i].y}, ${cx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return d;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 w-full">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider">Evolução do Faturamento por Canal</h3>
          <p className="text-xs text-slate-400">Comparativo mensal entre Shopee, Mercado Livre e Vendas Externas</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-500 rounded-full inline-block" /> Shopee</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-full inline-block" /> Mercado Livre</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-full inline-block" /> Venda Externa</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#e2e8f0" strokeWidth="1.5" />

          {/* CURVAS DOS 3 CANAIS */}
          <path d={generatePath(pointsShopee)} fill="none" stroke="#f97316" strokeWidth="3" />
          <path d={generatePath(pointsMeli)} fill="none" stroke="#f59e0b" strokeWidth="3" />
          <path d={generatePath(pointsExterna)} fill="none" stroke="#3b82f6" strokeWidth="3" />

          {pointsShopee.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="4" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx={pointsMeli[i].x} cy={pointsMeli[i].y} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx={pointsExterna[i].x} cy={pointsExterna[i].y} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
              <text x={pt.x} y={svgHeight - 10} textAnchor="middle" className="text-[9px] fill-slate-500 font-bold">{historico[i].mes}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// ABA 3: CURVA ABC REAL COM PARETO (CLASSE A, CLASSE B, CLASSE C)
// ==========================================
function CurvaABCTab({ produtos, searchQuery, setSearchQuery, filterLowMargin, setFilterLowMargin, factor }) {
  const [expandedBrand, setExpandedBrand] = useState(null);

  // CLASSIFICAÇÃO DE PARETO (CLASSE A: Top 80% / CLASSE B: Próximos 15% / CLASSE C: Restante 5%)
  const produtosComPareto = useMemo(() => {
    if (!produtos || produtos.length === 0) return [];
    
    // 1. Ordena do maior faturamento para o menor
    const sorted = [...produtos].sort((a, b) => (b.faturamentoBruto * factor) - (a.faturamentoBruto * factor));
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
  }, [produtos, factor]);

  // AGRUPAMENTO DE PRODUTOS POR MARCA
  const marcasAgrupadas = useMemo(() => {
    const map = {};
    produtosComPareto.forEach(p => {
      const brand = p.marca || "Outras Marcas";
      if (!map[brand]) {
        map[brand] = {
          marca: brand,
          faturamento: 0,
          lucro: 0,
          quantidade: 0,
          produtos: []
        };
      }

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
      {/* BARRA DE PESQUISA */}
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
        Curva ABC por Marca (Clique para expandir os SKUs e a Classificação Pareto A/B/C)
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
                {/* CABEÇALHO DA MARCA */}
                <div
                  onClick={() => setExpandedBrand(isExpanded ? null : b.marca)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors border-b border-slate-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-black text-xs border border-emerald-200">
                      MARCA
                    </div>
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

                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-black">
                      {formatPercent(b.margemMedia)}
                    </span>

                    {isExpanded ? <IconChevronDown className="w-5 h-5 text-slate-400" /> : <IconChevronRight className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {/* DRILL-DOWN DOS PRODUTOS DA MARCA COM CLASSIFICAÇÃO A/B/C */}
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
                                  
                                  {/* BADGE DE CLASSIFICAÇÃO CURVA A, B OU C */}
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                                    isClasseA ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                    isClasseB ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                    'bg-slate-100 text-slate-600 border-slate-300'
                                  }`}>
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

function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-40 bg-slate-200 rounded-2xl" />
        <div className="h-40 bg-slate-200 rounded-2xl" />
        <div className="h-40 bg-slate-200 rounded-2xl" />
      </div>
      <div className="h-56 bg-slate-200 rounded-2xl w-full" />
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3 w-full">
      <IconAlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
      <p className="text-sm text-rose-800 font-medium">{message}</p>
      <button onClick={onRetry} className="px-5 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md">
        Tentar Novamente
      </button>
    </div>
  );
}