import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// ÍCONES SVG LEVES E NATIVOS (ZERO DEPENDÊNCIAS)
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

const IconAlertTriangle = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconAlertCircle = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ==========================================
// MOCK DE DADOS
// ==========================================
const MOCK_DATA_BY_MONTH = {
  "04/2026": {
    metadados: {
      competenciaAtual: "04/2026",
      competenciasDisponiveis: ["01/2026", "02/2026", "03/2026", "04/2026"],
      ultimaAtualizacao: "2026-07-28T14:30:00.000Z"
    },
    kpisGerais: {
      faturamentoBruto: 15420.50,
      totalTaxas: 2310.20,
      totalImpostos: 1696.25,
      totalCpv: 4500.00,
      lucroLiquido: 6914.05,
      margemLiquidaMedia: 44.83,
      totalPedidos: 342
    },
    drePorPlataforma: [
      {
        plataforma: "Shopee RAFA",
        faturamentoBruto: 9850.00,
        taxasPlataforma: 1477.50,
        imposto: 1083.50,
        cpv: 2870.00,
        lucroLiquido: 4419.00,
        margemLiquida: 44.86,
        pedidos: 210
      },
      {
        plataforma: "Mercado Livre",
        faturamentoBruto: 5570.50,
        taxasPlataforma: 832.70,
        imposto: 612.75,
        cpv: 1630.00,
        lucroLiquido: 2495.05,
        margemLiquida: 44.79,
        pedidos: 132
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
      },
      {
        sku: "PROT-SPF50",
        produto: "Protetor Solar Toque Seco FPS 50",
        marca: "SunCare Pro",
        quantidadeVendida: 78,
        faturamentoBruto: 3510.00,
        lucroLiquido: 1579.50,
        margemLiquida: 45.00
      },
      {
        sku: "BATOM-MATTE-01",
        produto: "Batom Matte Longa Duração Nude Rose",
        marca: "Glamour Makeup",
        quantidadeVendida: 49,
        faturamentoBruto: 1225.00,
        lucroLiquido: 110.25,
        margemLiquida: 9.00
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
      faturamentoBruto: 13800.00,
      totalTaxas: 2070.00,
      totalImpostos: 1518.00,
      totalCpv: 4140.00,
      lucroLiquido: 6072.00,
      margemLiquidaMedia: 44.00,
      totalPedidos: 298
    },
    drePorPlataforma: [
      {
        plataforma: "Shopee RAFA",
        faturamentoBruto: 8500.00,
        taxasPlataforma: 1275.00,
        imposto: 935.00,
        cpv: 2550.00,
        lucroLiquido: 3740.00,
        margemLiquida: 44.00,
        pedidos: 180
      }
    ],
    topProdutosCurvaABC: [
      {
        sku: "SÉRUM-VITC",
        produto: "Sérum Facial Vitamina C 30ml Anti-idade",
        marca: "La Belle Paris",
        quantidadeVendida: 110,
        faturamentoBruto: 4950.00,
        lucroLiquido: 2475.00,
        margemLiquida: 50.00
      }
    ]
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
  const [activeTab, setActiveTab] = useState('visao-geral');
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowMargin, setFilterLowMargin] = useState(false);

  const fetchData = async (competencia) => {
    setLoading(true);
    setError(null);

    try {
      if (apiUrl) {
        const response = await fetch(`${apiUrl}?competencia=${competencia}`);
        if (!response.ok) throw new Error(`Erro HTTP: status ${response.status}`);
        const json = await response.json();
        setData(json);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const mockResponse = MOCK_DATA_BY_MONTH[competencia] || MOCK_DATA_BY_MONTH["04/2026"];
        setData(mockResponse);
      }
    } catch (err) {
      console.error("Falha ao carregar dados:", err);
      setError("Não foi possível carregar os dados financeiros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedCompetencia);
  }, [selectedCompetencia, apiUrl]);

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

  const deducoesTotais = useMemo(() => {
    if (!data?.kpisGerais) return { total: 0, cpvPerc: 0, taxasPerc: 0, impostosPerc: 0 };
    const { totalCpv, totalTaxas, totalImpostos, faturamentoBruto } = data.kpisGerais;
    const total = totalCpv + totalTaxas + totalImpostos;
    const cpvPerc = faturamentoBruto > 0 ? (totalCpv / faturamentoBruto) * 100 : 0;
    const taxasPerc = faturamentoBruto > 0 ? (totalTaxas / faturamentoBruto) * 100 : 0;
    const impostosPerc = faturamentoBruto > 0 ? (totalImpostos / faturamentoBruto) * 100 : 0;
    return { total, cpvPerc, taxasPerc, impostosPerc };
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-start items-center md:py-8 font-sans antialiased text-slate-800">
      
      {/* CONTAINER RESPONSIVO (Compacto no Mobile, Amplo no Notebook/Desktop) */}
      <div className="w-full max-w-md md:max-w-5xl lg:max-w-6xl bg-slate-50 min-h-screen md:min-h-0 md:rounded-3xl md:shadow-2xl flex flex-col overflow-hidden border border-slate-200/80 pb-20 md:pb-6">
        
        {/* HEADER SLATE-900 */}
        <header className="bg-slate-900 text-white px-5 md:px-8 pt-6 pb-5 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Título */}
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shrink-0">
                <IconBarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-100">
                  Controller Financeiro
                </h1>
                <p className="text-xs text-slate-400">E-commerce Executive Dashboard</p>
              </div>
            </div>

            {/* Ações de Topo: Competência, Modal API e Botão Atualizar */}
            <div className="flex flex-wrap items-center gap-2.5 justify-between md:justify-end">
              
              {/* Seletor de Mês */}
              <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                <IconCalendar className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300 font-medium">Mês:</span>
                <select
                  value={selectedCompetencia}
                  onChange={(e) => setSelectedCompetencia(e.target.value)}
                  className="bg-slate-900 text-emerald-400 font-bold text-xs rounded-lg px-2 py-1 border border-emerald-500/30 focus:outline-none cursor-pointer"
                >
                  {data?.metadados?.competenciasDisponiveis?.map((comp) => (
                    <option key={comp} value={comp} className="bg-slate-900 text-white">
                      {comp}
                    </option>
                  )) || <option value="04/2026">04/2026</option>}
                </select>
              </div>

              {/* Botão Atualizar */}
              <button
                onClick={() => fetchData(selectedCompetencia)}
                className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl border border-slate-700 transition-colors"
                disabled={loading}
              >
                <IconRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
                <span>Atualizar</span>
              </button>

              {/* Botão Configurar API */}
              <button
                onClick={() => setShowApiModal(!showApiModal)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
                title="Configurar URL da API"
              >
                <IconLink2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Input de URL da API */}
          {showApiModal && (
            <div className="mt-4 p-3 bg-slate-800 rounded-2xl border border-slate-700 text-xs text-slate-300">
              <label className="block mb-1 font-medium text-slate-200">URL do Google Apps Script:</label>
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {/* Navegação Superior Visível no Desktop/Notebook */}
          <div className="hidden md:flex items-center space-x-2 mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('visao-geral')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'visao-geral' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <IconPieChart className="w-4 h-4" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('dre')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dre' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <IconLayers className="w-4 h-4" />
              <span>DRE Canais</span>
            </button>

            <button
              onClick={() => setActiveTab('abc')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'abc' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <IconPackage className="w-4 h-4" />
              <span>Curva ABC Produtos</span>
            </button>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <ErrorState message={error} onRetry={() => fetchData(selectedCompetencia)} />
          ) : (
            <>
              {activeTab === 'visao-geral' && <VisaoGeralTab data={data} deducoesTotais={deducoesTotais} />}
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

        {/* NAVEGAÇÃO INFERIOR FIXA (Visível no Celular) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-3 flex justify-around items-center z-20 shadow-lg">
          <button
            onClick={() => setActiveTab('visao-geral')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'visao-geral' ? 'text-emerald-600 font-bold scale-105' : 'text-slate-400'
            }`}
          >
            <IconPieChart />
            <span className="text-[11px]">Visão Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('dre')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'dre' ? 'text-emerald-600 font-bold scale-105' : 'text-slate-400'
            }`}
          >
            <IconLayers />
            <span className="text-[11px]">DRE Canais</span>
          </button>

          <button
            onClick={() => setActiveTab('abc')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all relative ${
              activeTab === 'abc' ? 'text-emerald-600 font-bold scale-105' : 'text-slate-400'
            }`}
          >
            <IconPackage />
            <span className="text-[11px]">Curva ABC</span>
            {data?.topProdutosCurvaABC?.some(p => p.margemLiquida < 10) && (
              <span className="absolute top-1 right-3 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            )}
          </button>
        </nav>
      </div>
    </div>
  );
}

// ==========================================
// ABA 1: VISÃO GERAL (Grade Adaptativa)
// ==========================================
function VisaoGeralTab({ data, deducoesTotais }) {
  const kpis = data?.kpisGerais || {};
  const ticketMedio = kpis.totalPedidos ? kpis.faturamentoBruto / kpis.totalPedidos : 0;

  return (
    <div className="space-y-6">
      
      {/* GRID SUPERIOR DE CARDS (3 Colunas no Notebook) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* CARD LUCRO LÍQUIDO (DESTAQUE) */}
        <div className="md:col-span-1 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 text-white shadow-xl flex flex-col justify-between border border-slate-700/50">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 flex items-center gap-1.5">
                <IconTrendingUp className="w-4 h-4 text-emerald-400" /> Lucro Líquido
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Margem {formatPercent(kpis.margemLiquidaMedia)}
              </span>
            </div>
            <div className="my-3">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{formatBRL(kpis.lucroLiquido)}</h2>
            </div>
          </div>
          
          <div className="space-y-1.5 pt-2 border-t border-slate-700/60">
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Eficiência das Vendas:</span>
              <span className="font-semibold text-emerald-400">{formatPercent(kpis.margemLiquidaMedia)} Convertido</span>
            </div>
            <div className="w-full bg-slate-700/70 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(Math.max(kpis.margemLiquidaMedia, 0), 100)}%` }} />
            </div>
          </div>
        </div>

        {/* CARD FATURAMENTO BRUTO */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faturamento Bruto</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><IconDollarSign className="w-5 h-5" /></div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block tracking-tight">{formatBRL(kpis.faturamentoBruto)}</span>
            <span className="text-xs text-slate-400 mt-1 block">Receita Bruta Total</span>
          </div>
        </div>

        {/* CARD VOLUME E TICKET */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Volume de Pedidos</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><IconShoppingBag className="w-5 h-5" /></div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block tracking-tight">{kpis.totalPedidos || 0} <span className="text-xs font-normal text-slate-500">pedidos</span></span>
            <span className="text-xs text-slate-600 mt-1 block font-medium">Ticket Médio: <strong className="text-slate-900">{formatBRL(ticketMedio)}</strong></span>
          </div>
        </div>
      </div>

      {/* PAINEL DE DEDUÇÕES */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <IconReceipt className="w-5 h-5 text-slate-500" />
            <h3 className="text-sm font-bold uppercase text-slate-700 tracking-wider">Detalhamento de Deduções & Custos</h3>
          </div>
          <span className="text-sm font-bold text-rose-600">Total Deduções: {formatBRL(deducoesTotais.total)}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* CPV */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">CPV (Custo dos Produtos)</span>
              <span className="font-bold text-slate-900">{formatBRL(kpis.totalCpv)}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.cpvPerc, 100)}%` }} />
            </div>
            <span className="text-[11px] text-slate-400 block text-right">{formatPercent(deducoesTotais.cpvPerc)} da receita</span>
          </div>

          {/* TAXAS PLATAFORMA */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Taxas de Plataformas</span>
              <span className="font-bold text-slate-900">{formatBRL(kpis.totalTaxas)}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.taxasPerc, 100)}%` }} />
            </div>
            <span className="text-[11px] text-slate-400 block text-right">{formatPercent(deducoesTotais.taxasPerc)} da receita</span>
          </div>

          {/* IMPOSTOS */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Impostos e Tributos</span>
              <span className="font-bold text-slate-900">{formatBRL(kpis.totalImpostos)}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.impostosPerc, 100)}%` }} />
            </div>
            <span className="text-[11px] text-slate-400 block text-right">{formatPercent(deducoesTotais.impostosPerc)} da receita</span>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// ABA 2: CANAIS / DRE (Grade Multi-coluna)
// ==========================================
function DREPlataformasTab({ dre }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Canais de Venda ({dre.length})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dre.map((plat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-4 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl"><IconStore className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{plat.plataforma}</h4>
                  <p className="text-xs text-slate-400">{plat.pedidos} pedidos</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
                {formatPercent(plat.margemLiquida)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Faturamento</span>
                <span className="font-bold text-slate-800 text-sm">{formatBRL(plat.faturamentoBruto)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Lucro Líquido</span>
                <span className="font-bold text-emerald-600 text-sm">{formatBRL(plat.lucroLiquido)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Taxas</span>
                <span className="font-semibold text-rose-600">-{formatBRL(plat.taxasPlataforma)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Impostos</span>
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
    <div className="space-y-4">
      {/* BARRA DE PESQUISA */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por SKU, Produto ou Marca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        <button
          onClick={() => setFilterLowMargin(!filterLowMargin)}
          className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border text-xs transition-all ${
            filterLowMargin ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <IconShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Apenas Margem &lt; 10%</span>
        </button>
      </div>

      {/* LISTA DE PRODUTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {produtos.map((prod, idx) => {
          const isLowMargin = prod.margemLiquida < 10;
          return (
            <div key={idx} className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${isLowMargin ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200/80'}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                      SKU: {prod.sku}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{prod.marca}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{prod.produto}</h4>
                </div>
                
                <span className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 shrink-0 ${isLowMargin ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800'}`}>
                  {isLowMargin && <IconAlertTriangle />}
                  {formatPercent(prod.margemLiquida)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[9px] text-slate-400 uppercase block font-medium">Qtd Vendida</span>
                  <span className="font-bold text-slate-800">{prod.quantidadeVendida} un</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
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
    <div className="space-y-4 animate-pulse">
      <div className="h-40 bg-slate-200 rounded-2xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="h-28 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
      <IconAlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
      <p className="text-sm text-rose-800 font-medium">{message}</p>
      <button onClick={onRetry} className="px-5 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md">
        Tentar Novamente
      </button>
    </div>
  );
}