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

const IconChevronRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// ==========================================
// MOCK DE FALLBACK LOCAL
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
// COMPONENTE PRINCIPAL (FULL SCREEN)
// ==========================================
export default function App() {
  const [apiUrl, setApiUrl] = useState('https://script.google.com/macros/s/AKfycbwIcyAxQYoQrWJWi8-xdtAAQwGMDbn7m7PWVMKwl_rfBzdFj4HT2JuugLN02sj_gvnO/exec');
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedCompetencia, setSelectedCompetencia] = useState('04/2026');
  const [activeTab, setActiveTab] = useState('visao-geral');
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowMargin, setFilterLowMargin] = useState(false);

  // FETCH ROBUSTO COM SUPORTE AO GOOGLE APPS SCRIPT
  const fetchData = async (competencia) => {
    setLoading(true);
    setError(null);

    const cleanUrl = apiUrl.trim();

    try {
      if (cleanUrl) {
        const fullUrl = `${cleanUrl}?competencia=${encodeURIComponent(competencia)}`;
        
        const response = await fetch(fullUrl, {
          method: 'GET',
          redirect: 'follow',
        });

        if (!response.ok) {
          throw new Error(`Servidor retornou código de erro HTTP ${response.status}`);
        }

        const textResult = await response.text();
        let parsedJson;

        try {
          parsedJson = JSON.parse(textResult);
        } catch (e) {
          throw new Error("O Google Apps Script retornou HTML em vez de JSON. Verifique as permissões de implantação no Google Script (Quem tem acesso: Qualquer Pessoa).");
        }

        setData(parsedJson);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const mockResponse = MOCK_DATA_BY_MONTH[competencia] || MOCK_DATA_BY_MONTH["04/2026"];
        setData(mockResponse);
      }
    } catch (err) {
      console.error("Erro na integração com a API:", err);
      setError(err.message || "Não foi possível conectar à API do Google Apps Script.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedCompetencia);
  }, [selectedCompetencia]);

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
    <div className="w-screen min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800 antialiased overflow-x-hidden">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-slate-900 text-white flex-col justify-between shrink-0 shadow-2xl border-r border-slate-800 sticky top-0 h-screen overflow-y-auto z-20">
        
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <IconBarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
                Controller
              </h1>
              <p className="text-[11px] text-slate-400">Executive Fintech View</p>
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Competência Ativa</span>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400">
                <IconCalendar className="w-4 h-4" />
                <select
                  value={selectedCompetencia}
                  onChange={(e) => setSelectedCompetencia(e.target.value)}
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

          <nav className="space-y-1.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block px-2 mb-1">
              Menu Principal
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
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all relative ${
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

        <div className="p-6 border-t border-slate-800 space-y-3">
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
            <h1 className="text-sm font-bold text-white">Controller Financeiro</h1>
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

      {/* ÁREA DE CONTEÚDO 100% LARGURA DA TELA */}
      <div className="flex-1 w-full min-w-0 flex flex-col min-h-screen bg-slate-50">
        
        {/* BARRA SUPERIOR EXECUTIVA (SEM MARGENS) */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4 shadow-xs w-full">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {activeTab === 'visao-geral' && 'Visão Geral Executiva'}
              {activeTab === 'dre' && 'Demonstrativo do Resultado por Canal (DRE)'}
              {activeTab === 'abc' && 'Curva ABC & Performance de Margem por SKU'}
            </h2>
            <p className="text-xs text-slate-400">Competência de análise: <strong className="text-slate-700">{selectedCompetencia}</strong></p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => fetchData(selectedCompetencia)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 transition-colors"
            >
              <IconRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Atualizar</span>
            </button>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Status: Online
            </span>
          </div>
        </header>

        {showApiModal && (
          <div className="m-6 p-4 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 text-xs">
            <div className="flex justify-between items-center mb-2">
              <label className="font-bold text-emerald-400">URL da Web App do Google Apps Script:</label>
              <button
                onClick={() => { setApiUrl(''); fetchData(selectedCompetencia); }}
                className="text-[10px] text-slate-400 hover:text-white underline"
              >
                Resetar para Dados Demonstrativos
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1 p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                onClick={() => fetchData(selectedCompetencia)}
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                Conectar
              </button>
            </div>
          </div>
        )}

        {/* CORPO DE CONTEÚDO */}
        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto w-full">
          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={() => fetchData(selectedCompetencia)}
              onUseMock={() => { setApiUrl(''); fetchData(selectedCompetencia); }}
            />
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
      </div>
    </div>
  );
}

// ==========================================
// ABA 1: VISÃO GERAL (NÚMEROS AJUSTADOS)
// ==========================================
function VisaoGeralTab({ data, deducoesTotais }) {
  const kpis = data?.kpisGerais || {};
  const ticketMedio = kpis.totalPedidos ? kpis.faturamentoBruto / kpis.totalPedidos : 0;

  return (
    <div className="space-y-6 w-full">
      
      {/* GRID DE CARDS SUPERIORES PREENCHENDO A TELA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        
        {/* CARD LUCRO LÍQUIDO */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between border border-slate-700/50 min-w-0">
          <div>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5 shrink-0">
                <IconTrendingUp className="w-4 h-4 text-emerald-400" /> Lucro Líquido
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                Margem {formatPercent(kpis.margemLiquidaMedia)}
              </span>
            </div>
            
            {/* FONTE RESPONSIVA CORRIGIDA PARA NÃO ESTOURAR */}
            <div className="my-3 overflow-hidden">
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight truncate">
                {formatBRL(kpis.lucroLiquido)}
              </h2>
            </div>
          </div>
          
          <div className="space-y-2 pt-3 border-t border-slate-700/60">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Eficiência das Vendas:</span>
              <span className="font-bold text-emerald-400">{formatPercent(kpis.margemLiquidaMedia)} Convertido</span>
            </div>
            <div className="w-full bg-slate-700/70 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(Math.max(kpis.margemLiquidaMedia, 0), 100)}%` }} />
            </div>
          </div>
        </div>

        {/* CARD FATURAMENTO BRUTO */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faturamento Bruto</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl shrink-0"><IconDollarSign className="w-5 h-5" /></div>
          </div>
          <div className="overflow-hidden">
            <span className="text-2xl lg:text-3xl font-black text-slate-900 block tracking-tight truncate">
              {formatBRL(kpis.faturamentoBruto)}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">Receita Bruta Total Processada</span>
          </div>
        </div>

        {/* CARD VOLUME E TICKET MÉDIO */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Volume de Vendas</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0"><IconShoppingBag className="w-5 h-5" /></div>
          </div>
          <div className="overflow-hidden">
            <span className="text-2xl lg:text-3xl font-black text-slate-900 block tracking-tight truncate">
              {kpis.totalPedidos || 0} <span className="text-sm font-normal text-slate-500">pedidos</span>
            </span>
            <span className="text-xs text-slate-600 mt-2 block font-medium truncate">
              Ticket Médio: <strong className="text-slate-900 font-bold">{formatBRL(ticketMedio)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* PAINEL DE DEDUÇÕES LARGURA TOTAL */}
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
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">CPV (Custo dos Produtos)</span>
              <span className="text-sm font-black text-slate-900">{formatBRL(kpis.totalCpv)}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.cpvPerc, 100)}%` }} />
            </div>
            <span className="text-xs text-slate-400 block text-right font-semibold">{formatPercent(deducoesTotais.cpvPerc)} do faturamento</span>
          </div>

          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">Taxas de Plataformas</span>
              <span className="text-sm font-black text-slate-900">{formatBRL(kpis.totalTaxas)}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.taxasPerc, 100)}%` }} />
            </div>
            <span className="text-xs text-slate-400 block text-right font-semibold">{formatPercent(deducoesTotais.taxasPerc)} do faturamento</span>
          </div>

          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">Impostos e Tributos</span>
              <span className="text-sm font-black text-slate-900">{formatBRL(kpis.totalImpostos)}</span>
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
                    {isLowMargin && <IconAlertTriangle />}
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
      <div className="h-48 bg-slate-200 rounded-2xl w-full" />
    </div>
  );
}

function ErrorState({ message, onRetry, onUseMock }) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-4 w-full">
      <IconAlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
      <div>
        <h3 className="text-base font-bold text-rose-900">Falha ao Conectar com o Google Apps Script</h3>
        <p className="text-xs text-rose-700 mt-1 max-w-xl mx-auto">{message}</p>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <button onClick={onRetry} className="px-5 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-rose-700">
          Tentar Novamente
        </button>
        <button onClick={onUseMock} className="px-5 py-2.5 bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md hover:bg-slate-900">
          Usar Dados Demonstrativos
        </button>
      </div>
    </div>
  );
}