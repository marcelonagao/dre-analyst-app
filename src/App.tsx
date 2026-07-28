import React, { useState, useEffect, useMemo } from 'react';

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

// ==========================================
// MOCK DE HISTÓRICO MÊS A MÊS
// ==========================================
const MOCK_DATA_BY_MONTH = {
  "04/2026": {
    metadados: {
      competenciaAtual: "04/2026",
      competenciasDisponiveis: ["01/2026", "02/2026", "03/2026", "04/2026"],
      ultimaAtualizacao: "2026-07-28T14:30:00.000Z"
    },
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
      {
        plataforma: "Shopee RAFA",
        faturamentoBruto: 185000.00,
        taxasPlataforma: 26418.00,
        imposto: 20350.00,
        cpv: 125000.00,
        lucroLiquido: 13232.00,
        margemLiquida: 7.15,
        pedidos: 2710
      },
      {
        plataforma: "Mercado Livre",
        faturamentoBruto: 115939.97,
        taxasPlataforma: 16541.91,
        imposto: 12750.00,
        cpv: 78331.01,
        lucroLiquido: 8313.65,
        margemLiquida: 7.17,
        pedidos: 1676
      }
    ],
    topProdutosCurvaABC: [
      {
        sku: "2LB05",
        produto: "Creme Facial Anti-olheira Com Filtro Solar",
        marca: "La Belle Paris",
        quantidadeVendida: 120,
        faturamentoBruto: 1618.80,
        lucroLiquido: 92.40,
        margemLiquida: 5.71
      },
      {
        sku: "SÉRUM-VITC",
        produto: "Sérum Facial Vitamina C 30ml Anti-idade",
        marca: "La Belle Paris",
        quantidadeVendida: 95,
        faturamentoBruto: 4275.00,
        lucroLiquido: 2137.50,
        margemLiquida: 50.00
      }
    ]
  },
  "03/2026": {
    metadados: {
      competenciaAtual: "03/2026",
      competenciasDisponiveis: ["01/2026", "02/2026", "03/2026", "04/2026"],
      ultimaAtualizacao: "2026-04-01T08:00:00.000Z"
    },
    kpisGerais: {
      faturamentoBruto: 280000.00,
      totalTaxas: 40040.00,
      totalImpostos: 30800.00,
      totalCpv: 184400.00,
      lucroLiquido: 24760.00,
      margemLiquidaMedia: 8.84,
      totalPedidos: 4100
    },
    drePorPlataforma: [],
    topProdutosCurvaABC: []
  },
  "02/2026": {
    metadados: {
      competenciaAtual: "02/2026",
      competenciasDisponiveis: ["01/2026", "02/2026", "03/2026", "04/2026"],
      ultimaAtualizacao: "2026-03-01T08:00:00.000Z"
    },
    kpisGerais: {
      faturamentoBruto: 245000.00,
      totalTaxas: 35035.00,
      totalImpostos: 26950.00,
      totalCpv: 160915.00,
      lucroLiquido: 22100.00,
      margemLiquidaMedia: 9.02,
      totalPedidos: 3580
    },
    drePorPlataforma: [],
    topProdutosCurvaABC: []
  },
  "01/2026": {
    metadados: {
      competenciaAtual: "01/2026",
      competenciasDisponiveis: ["01/2026", "02/2026", "03/2026", "04/2026"],
      ultimaAtualizacao: "2026-02-01T08:00:00.000Z"
    },
    kpisGerais: {
      faturamentoBruto: 210000.00,
      totalTaxas: 30030.00,
      totalImpostos: 23100.00,
      totalCpv: 138370.00,
      lucroLiquido: 18500.00,
      margemLiquidaMedia: 8.81,
      totalPedidos: 3100
    },
    drePorPlataforma: [],
    topProdutosCurvaABC: []
  }
};

// ==========================================
// FORMATAÇÕES
// ==========================================
const formatBRL = (val) => {
  if (val === undefined || val === null || isNaN(val)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0,00%';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val) + '%';
};

const formatDate = (isoString) => {
  if (!isoString) return '--/--/---- --:--';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
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

  const fetchData = async (competencia) => {
    setLoading(true);
    setError(null);
    const cleanUrl = apiUrl.trim();

    try {
      if (cleanUrl) {
        const fullUrl = `${cleanUrl}?competencia=${encodeURIComponent(competencia)}`;
        const response = await fetch(fullUrl, { method: 'GET', redirect: 'follow' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const textResult = await response.text();
        const parsedJson = JSON.parse(textResult);
        setData(parsedJson);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const mockResponse = MOCK_DATA_BY_MONTH[competencia] || MOCK_DATA_BY_MONTH["04/2026"];
        setData(mockResponse);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err.message || "Erro na conexão com a API do Google Apps Script.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedCompetencia);
  }, [selectedCompetencia]);

  // CÁLCULO DA VISÃO CONSOLIDADA
  const dadosConsolidados = useMemo(() => {
    const todosMeses = Object.values(MOCK_DATA_BY_MONTH);
    let fatBrutoTotal = 0;
    let lucroLiquidoTotal = 0;
    let totalTaxas = 0;
    let totalImpostos = 0;
    let totalCpv = 0;
    let totalPedidos = 0;

    todosMeses.forEach(m => {
      const k = m.kpisGerais;
      fatBrutoTotal += k.faturamentoBruto || 0;
      lucroLiquidoTotal += k.lucroLiquido || 0;
      totalTaxas += k.totalTaxas || 0;
      totalImpostos += k.totalImpostos || 0;
      totalCpv += k.totalCpv || 0;
      totalPedidos += k.totalPedidos || 0;
    });

    const margemMedia = fatBrutoTotal > 0 ? (lucroLiquidoTotal / fatBrutoTotal) * 100 : 0;

    return {
      faturamentoBruto: fatBrutoTotal,
      lucroLiquido: lucroLiquidoTotal,
      margemLiquidaMedia: margemMedia,
      totalTaxas,
      totalImpostos,
      totalCpv,
      totalPedidos
    };
  }, []);

  const kpisExibidos = useMemo(() => {
    if (viewMode === 'consolidado') return dadosConsolidados;
    return data?.kpisGerais || {};
  }, [viewMode, data, dadosConsolidados]);

  const deducoesTotais = useMemo(() => {
    const { totalCpv, totalTaxas, totalImpostos, faturamentoBruto } = kpisExibidos;
    const total = (totalCpv || 0) + (totalTaxas || 0) + (totalImpostos || 0);
    const cpvPerc = faturamentoBruto > 0 ? (totalCpv / faturamentoBruto) * 100 : 0;
    const taxasPerc = faturamentoBruto > 0 ? (totalTaxas / faturamentoBruto) * 100 : 0;
    const impostosPerc = faturamentoBruto > 0 ? (totalImpostos / faturamentoBruto) * 100 : 0;
    return { total, cpvPerc, taxasPerc, impostosPerc };
  }, [kpisExibidos]);

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
      
      {/* ========================================== */}
      {/* SIDEBAR FIXA ESTILO GOOGLE AI STUDIO      */}
      {/* ========================================== */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-slate-900 text-white flex-col justify-between shrink-0 border-r border-slate-800 fixed left-0 top-0 bottom-0 h-screen z-30 shadow-2xl">
        
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <IconBarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white leading-tight">
                Controller
              </h1>
              <p className="text-[11px] text-slate-400">Executive Fintech Studio</p>
            </div>
          </div>

          {/* Competência Activa */}
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Competência Ativa</span>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400">
                <IconCalendar className="w-4 h-4" />
                <select
                  value={selectedCompetencia}
                  onChange={(e) => {
                    setSelectedCompetencia(e.target.value);
                    setViewMode('mensal');
                  }}
                  className="bg-slate-900 text-white font-bold text-xs rounded-lg px-2 py-1 border border-slate-700 focus:outline-none cursor-pointer"
                >
                  {data?.metadados?.competenciasDisponiveis?.map((comp) => (
                    <option key={comp} value={comp} className="bg-slate-900 text-white">
                      {comp}
                    </option>
                  )) || <option value="04/2026">04/2026</option>}
                </select>
              </div>

              <button
                onClick={() => fetchData(selectedCompetencia)}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Atualizar dados"
                disabled={loading}
              >
                <IconRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Seção de Menus */}
          <nav className="space-y-1.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block px-2 mb-1">
              NAVEGAÇÃO
            </span>

            <button
              onClick={() => setActiveTab('visao-geral')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'visao-geral'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconPieChart className="w-4 h-4" />
                <span>Visão Geral</span>
              </div>
              <IconChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('dre')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dre'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconLayers className="w-4 h-4" />
                <span>DRE por Canais</span>
              </div>
              <IconChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('abc')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'abc'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconPackage className="w-4 h-4" />
                <span>Curva ABC Produtos</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800 space-y-3 bg-slate-900">
          <button
            onClick={() => setShowApiModal(!showApiModal)}
            className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <IconLink2 className="w-4 h-4 text-emerald-400" /> Configurar API
            </span>
            <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-300">GAS</span>
          </button>
        </div>
      </aside>

      {/* HEADER MOBILE */}
      <header className="md:hidden bg-slate-900 text-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <IconBarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Controller</h1>
            <p className="text-[10px] text-slate-400">E-commerce View</p>
          </div>
        </div>

        <select
          value={selectedCompetencia}
          onChange={(e) => setSelectedCompetencia(e.target.value)}
          className="bg-slate-800 text-emerald-400 font-bold text-xs rounded-lg px-2 py-1 border border-slate-700"
        >
          {data?.metadados?.competenciasDisponiveis?.map((comp) => (
            <option key={comp} value={comp}>{comp}</option>
          ))}
        </select>
      </header>

      {/* ========================================== */}
      {/* ÁREA DE CONTEÚDO COM PLACEMENT À DIREITA   */}
      {/* ========================================== */}
      <div className="md:pl-64 lg:pl-72 flex-1 w-full min-w-0 flex flex-col min-h-screen bg-slate-50 overflow-x-hidden">
        
        {/* BARRA SUPERIOR EXECUTIVA */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4 shadow-xs w-full">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {activeTab === 'visao-geral' && (viewMode === 'consolidado' ? 'Visão Consolidada Acumulada' : 'Visão Geral Executiva')}
              {activeTab === 'dre' && 'DRE por Canal de Vendas'}
              {activeTab === 'abc' && 'Curva ABC de Produtos'}
            </h2>
            <p className="text-xs text-slate-400">
              Modo: <strong className="text-slate-700">{viewMode === 'consolidado' ? 'Acumulado Total' : `Mês ${selectedCompetencia}`}</strong>
            </p>
          </div>

          {/* SELECTOR DE MENSAL / CONSOLIDADO */}
          <div className="flex items-center space-x-3">
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex space-x-1 text-xs">
              <button
                onClick={() => setViewMode('mensal')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'mensal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Mês ({selectedCompetencia})
              </button>
              <button
                onClick={() => setViewMode('consolidado')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'consolidado' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Visão Consolidada
              </button>
            </div>

            <button
              onClick={() => fetchData(selectedCompetencia)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors"
              title="Atualizar"
            >
              <IconRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </header>

        {showApiModal && (
          <div className="m-6 p-4 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 text-xs">
            <label className="block mb-1 font-bold text-emerald-400">URL do Google Apps Script:</label>
            <input
              type="text"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        )}

        {/* CORPO DO DASHBOARD */}
        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto w-full">
          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <ErrorState message={error} onRetry={() => fetchData(selectedCompetencia)} />
          ) : (
            <>
              {activeTab === 'visao-geral' && (
                <VisaoGeralTab
                  kpis={kpisExibidos}
                  deducoesTotais={deducoesTotais}
                  onSelectMonth={(m) => {
                    setSelectedCompetencia(m);
                    setViewMode('mensal');
                  }}
                  selectedCompetencia={selectedCompetencia}
                />
              )}
              {activeTab === 'dre' && <DREPlataformasTab dre={data?.drePorPlataforma || []} />}
              {activeTab === 'abc' && (
                <CurvaABCTab
                  produtos={filteredABC}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterLowMargin={filterLowMargin}
                  setFilterLowMargin={setFilterLowMargin}
                />
              )}
            </>
          )}
        </main>

        {/* BOTTOM NAV MOBILE */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-3 flex justify-around items-center z-30 shadow-lg">
          <button
            onClick={() => setActiveTab('visao-geral')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl ${activeTab === 'visao-geral' ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}
          >
            <IconPieChart />
            <span className="text-[10px]">Visão Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('dre')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl ${activeTab === 'dre' ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}
          >
            <IconLayers />
            <span className="text-[10px]">DRE Canais</span>
          </button>

          <button
            onClick={() => setActiveTab('abc')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl ${activeTab === 'abc' ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}
          >
            <IconPackage />
            <span className="text-[10px]">Curva ABC</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

// ==========================================
// ABA 1: VISÃO GERAL + GRÁFICO DE LINHA SUAVE
// ==========================================
function VisaoGeralTab({ kpis, deducoesTotais, onSelectMonth, selectedCompetencia }) {
  const ticketMedio = kpis.totalPedidos ? kpis.faturamentoBruto / kpis.totalPedidos : 0;

  return (
    <div className="space-y-6 w-full">
      
      {/* GRID DE CARDS ESTILO MERCADO LIVRE (IMAGEM 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
        
        {/* CARD LUCRO LÍQUIDO */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 md:p-6 text-white shadow-xl flex flex-col justify-between border border-slate-700/50 min-w-0">
          <div>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5 shrink-0">
                <IconTrendingUp className="w-4 h-4 text-emerald-400" /> Lucro Líquido
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                Margem {formatPercent(kpis.margemLiquidaMedia)}
              </span>
            </div>
            
            <div className="my-2 overflow-hidden">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight truncate">
                {formatBRL(kpis.lucroLiquido)}
              </h2>
            </div>
          </div>
          
          <div className="space-y-2 pt-3 border-t border-slate-700/60">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Eficiência das Vendas:</span>
              <span className="font-bold text-emerald-400">{formatPercent(kpis.margemLiquidaMedia)} Convertido</span>
            </div>
            <div className="w-full bg-slate-700/70 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(Math.max(kpis.margemLiquidaMedia, 0), 100)}%` }} />
            </div>
          </div>
        </div>

        {/* CARD FATURAMENTO BRUTO */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faturamento Bruto</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl shrink-0"><IconDollarSign className="w-5 h-5" /></div>
          </div>
          <div className="overflow-hidden my-2">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 block tracking-tight truncate">
              {formatBRL(kpis.faturamentoBruto)}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">Receita Bruta Total Processada</span>
          </div>
        </div>

        {/* CARD VOLUME E TICKET MÉDIO */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between min-w-0 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Volume de Vendas</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0"><IconShoppingBag className="w-5 h-5" /></div>
          </div>
          <div className="overflow-hidden my-2">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 block tracking-tight truncate">
              {kpis.totalPedidos || 0} <span className="text-sm font-normal text-slate-500">pedidos</span>
            </span>
            <span className="text-xs text-slate-600 mt-1 block font-medium truncate">
              Ticket Médio: <strong className="text-slate-900 font-bold">{formatBRL(ticketMedio)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* GRÁFICO DE LINHA SUAVE DE EVOLUÇÃO (MERCADO LIVRE / IMAGEM 6) */}
      <GraficoLinhaSuave onSelectMonth={onSelectMonth} selectedCompetencia={selectedCompetencia} />

      {/* PAINEL DE DEDUÇÕES */}
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

// ==========================================
// COMPONENTE GRÁFICO DE LINHA SUAVE (SVG NATIVO)
// ==========================================
function GraficoLinhaSuave({ onSelectMonth, selectedCompetencia }) {
  const meses = Object.keys(MOCK_DATA_BY_MONTH).reverse();
  const dados = meses.map(m => {
    const k = MOCK_DATA_BY_MONTH[m].kpisGerais;
    return {
      mes: m,
      faturamento: k.faturamentoBruto,
      lucro: k.lucroLiquido,
      margem: k.margemLiquidaMedia
    };
  });

  const maxVal = Math.max(...dados.map(d => d.faturamento)) * 1.2;
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 60;
  const paddingY = 30;

  // CÁLCULO DAS COORDENADAS X/Y PARA A CURVA BEZIER
  const pointsFat = dados.map((d, i) => {
    const x = paddingX + (i * (svgWidth - 2 * paddingX)) / (dados.length - 1);
    const y = svgHeight - paddingY - (d.faturamento / maxVal) * (svgHeight - 2 * paddingY);
    return { x, y, val: d.faturamento, mes: d.mes, margem: d.margem };
  });

  const pointsLucro = dados.map((d, i) => {
    const x = paddingX + (i * (svgWidth - 2 * paddingX)) / (dados.length - 1);
    const y = svgHeight - paddingY - (d.lucro / maxVal) * (svgHeight - 2 * paddingY);
    return { x, y, val: d.lucro };
  });

  // FUNÇÃO DE GERAR CURVA BEZIER
  const generateSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const pathFat = generateSmoothPath(pointsFat);
  const pathLucro = generateSmoothPath(pointsLucro);

  const areaFat = `${pathFat} L ${pointsFat[pointsFat.length - 1].x} ${svgHeight - paddingY} L ${pointsFat[0].x} ${svgHeight - paddingY} Z`;
  const areaLucro = `${pathLucro} L ${pointsLucro[pointsLucro.length - 1].x} ${svgHeight - paddingY} L ${pointsLucro[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 w-full">
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider">
            Evolução de Vendas e Lucro (Curva Contínua)
          </h3>
          <p className="text-xs text-slate-400">Clique nos pontos do gráfico para navegar entre os meses</p>
        </div>

        {/* Legendas */}
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-pink-500 rounded-full" />
            <span className="text-slate-700">Faturamento Bruto</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-slate-700">Lucro Líquido</span>
          </div>
        </div>
      </div>

      {/* SVG RESPONSIVO */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            {/* GRADIENTES SUAVES DA CURVA */}
            <linearGradient id="gradFat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="gradLucro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* LINHAS DE GRADE DE FUNDO */}
          <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#e2e8f0" strokeWidth="1.5" />

          {/* ÁREAS COM GRADIENTE */}
          <path d={areaFat} fill="url(#gradFat)" />
          <path d={areaLucro} fill="url(#gradLucro)" />

          {/* CURVAS SUAVES */}
          <path d={pathFat} fill="none" stroke="#ec4899" strokeWidth="3.5" strokeLinecap="round" />
          <path d={pathLucro} fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />

          {/* PONTOS DE DADOS INTERATIVOS */}
          {pointsFat.map((pt, idx) => {
            const isSelected = pt.mes === selectedCompetencia;
            const ptLucro = pointsLucro[idx];

            return (
              <g key={pt.mes} className="cursor-pointer" onClick={() => onSelectMonth(pt.mes)}>
                {/* Rótulo do Mês na base */}
                <text x={pt.x} y={svgHeight - 8} textAnchor="middle" className={`text-[11px] font-bold ${isSelected ? 'fill-emerald-600 font-extrabold' : 'fill-slate-500'}`}>
                  {pt.mes}
                </text>

                {/* Badge da Margem sobre o ponto */}
                <rect x={pt.x - 26} y={pt.y - 24} width="52" height="16" rx="8" fill={isSelected ? '#10b981' : '#f0fdf4'} stroke="#10b981" strokeWidth="1" />
                <text x={pt.x} y={pt.y - 13} textAnchor="middle" className={`text-[9px] font-black ${isSelected ? 'fill-white' : 'fill-emerald-800'}`}>
                  {formatPercent(pt.margem)}
                </text>

                {/* Ponto Faturamento (Rosa) */}
                <circle cx={pt.x} cy={pt.y} r={isSelected ? "6" : "4.5"} fill="#ec4899" stroke="#ffffff" strokeWidth="2" className="transition-all hover:scale-125" />
                
                {/* Ponto Lucro (Verde) */}
                <circle cx={ptLucro.x} cy={ptLucro.y} r={isSelected ? "6" : "4.5"} fill="#10b981" stroke="#ffffff" strokeWidth="2" className="transition-all hover:scale-125" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// ABA 2: CANAIS / DRE
// ==========================================
function DREPlataformasTab({ dre }) {
  return (
    <div className="space-y-4 w-full">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Canais Cadastrados ({dre.length})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {dre.map((plat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-slate-100 text-slate-800 rounded-2xl"><IconStore className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{plat.plataforma}</h4>
                  <p className="text-xs text-slate-400">{plat.pedidos} pedidos processados</p>
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

// ==========================================
// ABA 3: CURVA ABC
// ==========================================
function CurvaABCTab({ produtos, searchQuery, setSearchQuery, filterLowMargin, setFilterLowMargin }) {
  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por SKU, Nome do Produto ou Marca..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {produtos.map((prod, idx) => {
          const isLowMargin = prod.margemLiquida < 10;
          return (
            <div key={idx} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all flex flex-col justify-between ${isLowMargin ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200/80'}`}>
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                        SKU: {prod.sku}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{prod.marca}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{prod.produto}</h4>
                  </div>
                  
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 shrink-0 ${isLowMargin ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800'}`}>
                    {formatPercent(prod.margemLiquida)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 uppercase block font-medium">Qtd Vendida</span>
                  <span className="font-bold text-slate-800">{prod.quantidadeVendida} un</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 uppercase block font-medium">Faturamento</span>
                  <span className="font-bold text-blue-700">{formatBRL(prod.faturamentoBruto)}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[9px] text-slate-400 uppercase block font-medium">Lucro Líquido</span>
                  <span className="font-bold text-emerald-700">{formatBRL(prod.lucroLiquido)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
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