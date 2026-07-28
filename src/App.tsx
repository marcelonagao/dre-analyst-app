import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  PieChart,
  Layers,
  AlertTriangle,
  Calendar,
  RefreshCw,
  Store,
  Package,
  BarChart3,
  ArrowUpRight,
  Receipt,
  Percent,
  Search,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
  Link2
} from 'lucide-react';

// ==========================================
// MOCK DE DADOS (Fallback & Desenvolvimento)
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
        margemLiquida: 5.71 // ALERTA: < 10%
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
        margemLiquida: 9.00 // ALERTA: < 10%
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
      },
      {
        plataforma: "Mercado Livre",
        faturamentoBruto: 5300.00,
        taxasPlataforma: 795.00,
        imposto: 583.00,
        cpv: 1590.00,
        lucroLiquido: 2332.00,
        margemLiquida: 44.00,
        pedidos: 118
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
// FUNÇÕES UTILITÁRIAS DE FORMATAÇÃO
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
export default function DashboardController() {
  const [apiUrl, setApiUrl] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedCompetencia, setSelectedCompetencia] = useState('04/2026');
  const [activeTab, setActiveTab] = useState('visao-geral'); // 'visao-geral' | 'dre' | 'abc'
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowMargin, setFilterLowMargin] = useState(false);

  // Efeito para carregar dados ao mudar de competência ou URL da API
  const fetchData = async (competencia) => {
    setLoading(true);
    setError(null);

    try {
      if (apiUrl) {
        // Tenta buscar da API real (Google Apps Script)
        const response = await fetch(`${apiUrl}?competencia=${competencia}`);
        if (!response.ok) throw new Error(`Erro HTTP: status ${response.status}`);
        const json = await response.json();
        setData(json);
      } else {
        // Simulação de latência de rede corporativa (400ms) com Mock Data
        await new Promise((resolve) => setTimeout(resolve, 400));
        const mockResponse = MOCK_DATA_BY_MONTH[competencia] || MOCK_DATA_BY_MONTH["04/2026"];
        setData(mockResponse);
      }
    } catch (err) {
      console.error("Falha na requisição de dados do Controller:", err);
      setError("Não foi possível carregar os dados financeiros da competência selecionada.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedCompetencia);
  }, [selectedCompetencia, apiUrl]);

  // Lista filtrada para Curva ABC
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

  // Totalizadores de deduções calculadas
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
    <div className="min-h-screen bg-slate-100 flex justify-center items-start sm:py-6 text-slate-800 font-sans antialiased">
      {/* Container Principal Estilo Mobile App (Contido e Centralizado) */}
      <div className="w-full max-w-md sm:max-w-lg bg-slate-50 min-h-screen sm:min-h-[880px] sm:rounded-3xl sm:shadow-2xl flex flex-col relative overflow-hidden border border-slate-200/80 pb-20">
        
        {/* HEADER SLATE-900 ESTILO EXECUTIVE SUITE */}
        <header className="bg-slate-900 text-white px-5 pt-6 pb-5 shadow-md relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-slate-100 leading-none">
                  Controller Financeiro
                </h1>
                <p className="text-[11px] text-slate-400 mt-1">E-commerce Executive View</p>
              </div>
            </div>

            {/* Modal de Configuração de API */}
            <button
              onClick={() => setShowApiModal(!showApiModal)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80 hover:bg-slate-800 transition-colors border border-slate-700/50"
              title="Configurar Endpoint API"
            >
              <Link2 className="w-4 h-4" />
            </button>
          </div>

          {/* Configuração Expansível de URL da API */}
          {showApiModal && (
            <div className="mb-4 p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-300">
              <label className="block mb-1 font-medium text-slate-200">
                URL da Web App (Google Apps Script):
              </label>
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                *Deixe em branco para utilizar os dados demonstrativos locais.
              </p>
            </div>
          )}

          {/* BARRA SUPERIOR: Competência e Última Atualização */}
          <div className="flex items-center justify-between bg-slate-800/90 rounded-2xl p-2.5 border border-slate-700/60">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-slate-300">Competência:</span>
              <select
                value={selectedCompetencia}
                onChange={(e) => setSelectedCompetencia(e.target.value)}
                className="bg-slate-900 text-emerald-400 font-bold text-xs rounded-lg px-2.5 py-1 border border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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
              className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>

          {data?.metadados?.ultimaAtualizacao && (
            <div className="mt-2 text-right">
              <span className="text-[10px] text-slate-400">
                Atualizado em: {formatDate(data.metadados.ultimaAtualizacao)}
              </span>
            </div>
          )}
        </header>

        {/* CONTEÚDO DINÂMICO DA ABA SELECIONADA */}
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
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

        {/* NAVEGAÇÃO INFERIOR FIXA (BOTTOM NAV ESTILO APP MOBILE) */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 flex justify-around items-center z-20 shadow-lg">
          <button
            onClick={() => setActiveTab('visao-geral')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'visao-geral'
                ? 'text-emerald-600 font-semibold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <PieChart className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Visão Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('dre')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'dre'
                ? 'text-emerald-600 font-semibold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Canais / DRE</span>
          </button>

          <button
            onClick={() => setActiveTab('abc')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all relative ${
              activeTab === 'abc'
                ? 'text-emerald-600 font-semibold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5" />
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
// ABA 1: VISÃO GERAL (KPIs & Painel de Custos)
// ==========================================
function VisaoGeralTab({ data, deducoesTotais }) {
  const kpis = data?.kpisGerais || {};

  const ticketMedio = useMemo(() => {
    if (!kpis.totalPedidos || kpis.totalPedidos === 0) return 0;
    return kpis.faturamentoBruto / kpis.totalPedidos;
  }, [kpis]);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* CARD DESTAQUE: LUCRO LÍQUIDO & MARGEM (ESTILO EXECUTIVE CARD) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden border border-slate-700/50">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400/90 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Lucro Líquido do Mês
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
            Margem {formatPercent(kpis.margemLiquidaMedia)}
          </span>
        </div>

        <div className="my-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            {formatBRL(kpis.lucroLiquido)}
          </h2>
        </div>

        {/* Barra Visual Proporcional (Margem vs Deduções) */}
        <div className="space-y-1.5 pt-2 border-t border-slate-700/60">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span>Eficiência do Faturamento:</span>
            <span className="font-semibold text-emerald-400">{formatPercent(kpis.margemLiquidaMedia)} Convertido</span>
          </div>
          <div className="w-full bg-slate-700/70 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(kpis.margemLiquidaMedia, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* GRID DE CARDS SECUNDÁRIOS */}
      <div className="grid grid-cols-2 gap-3">
        {/* CARD FATURAMENTO BRUTO */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Faturamento Bruto</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 block leading-tight">
              {formatBRL(kpis.faturamentoBruto)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Receita Total
            </span>
          </div>
        </div>

        {/* CARD PEDIDOS E TICKET MÉDIO */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Volume Vendas</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 block leading-tight">
              {kpis.totalPedidos || 0} <span className="text-xs font-normal text-slate-500">pedidos</span>
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block font-medium">
              Ticket Médio: <strong className="text-slate-800">{formatBRL(ticketMedio)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* PAINEL DETALHADO DE CUSTOS E DEDUÇÕES */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
              Detalhamento de Deduções
            </h3>
          </div>
          <span className="text-xs font-bold text-rose-600">
            Total: {formatBRL(deducoesTotais.total)}
          </span>
        </div>

        {/* LISTAGEM DE CPV, TAXAS E IMPOSTOS */}
        <div className="space-y-3 pt-1">
          {/* CPV */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">CPV (Custo dos Produtos)</span>
              <span className="font-semibold text-slate-900">{formatBRL(kpis.totalCpv)} <span className="text-[10px] text-slate-400">({formatPercent(deducoesTotais.cpvPerc)})</span></span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.cpvPerc, 100)}%` }} />
            </div>
          </div>

          {/* TAXAS PLATAFORMA */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Taxas de Plataformas / Mktplace</span>
              <span className="font-semibold text-slate-900">{formatBRL(kpis.totalTaxas)} <span className="text-[10px] text-slate-400">({formatPercent(deducoesTotais.taxasPerc)})</span></span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.taxasPerc, 100)}%` }} />
            </div>
          </div>

          {/* IMPOSTOS */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">Impostos e Tributos</span>
              <span className="font-semibold text-slate-900">{formatBRL(kpis.totalImpostos)} <span className="text-[10px] text-slate-400">({formatPercent(deducoesTotais.impostosPerc)})</span></span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(deducoesTotais.impostosPerc, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ABA 2: CANAIS / DRE POR PLATAFORMA
// ==========================================
function DREPlataformasTab({ dre }) {
  if (!dre || dre.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200/80">
        Nenhuma plataforma cadastrada nesta competência.
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Desempenho Financeiro por Canal ({dre.length})
        </h3>
      </div>

      {dre.map((plat, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{plat.plataforma}</h4>
                <p className="text-[11px] text-slate-400">{plat.pedidos} pedidos processados</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-bold">
                {formatPercent(plat.margemLiquida)} mg
              </span>
            </div>
          </div>

          {/* DRE DETALHADA DO CANAL */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Faturamento Bruto</span>
              <span className="font-bold text-slate-800">{formatBRL(plat.faturamentoBruto)}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Lucro Líquido</span>
              <span className="font-bold text-emerald-600">{formatBRL(plat.lucroLiquido)}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Taxas Canal</span>
              <span className="font-semibold text-rose-600">-{formatBRL(plat.taxasPlataforma)}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Impostos</span>
              <span className="font-semibold text-indigo-600">-{formatBRL(plat.imposto)}</span>
            </div>

            <div className="col-span-2 pt-1 border-t border-slate-200/60 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-medium">Custo do Produto (CPV):</span>
              <span className="font-semibold text-amber-700">-{formatBRL(plat.cpv)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// ABA 3: CURVA ABC DE PRODUTOS
// ==========================================
function CurvaABCTab({ produtos, searchQuery, setSearchQuery, filterLowMargin, setFilterLowMargin }) {
  return (
    <div className="space-y-3 animate-fadeIn">
      {/* BARRA DE PESQUISA E FILTROS */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por SKU, Produto ou Marca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        <div className="flex items-center justify-between text-xs px-1">
          <button
            onClick={() => setFilterLowMargin(!filterLowMargin)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
              filterLowMargin
                ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Apenas Margem &lt; 10%</span>
          </button>

          <span className="text-[11px] text-slate-400">
            {produtos.length} item(ns) encontrado(s)
          </span>
        </div>
      </div>

      {/* LISTAGEM DE PRODUTOS */}
      {produtos.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200/80">
          Nenhum produto encontrado na pesquisa.
        </div>
      ) : (
        <div className="space-y-2.5">
          {produtos.map((prod, idx) => {
            const isLowMargin = prod.margemLiquida < 10;

            return (
              <div
                key={prod.sku || idx}
                className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                  isLowMargin
                    ? 'border-rose-300 bg-rose-50/20 shadow-rose-100/50'
                    : 'border-slate-200/80'
                }`}
              >
                {/* CABEÇALHO DO CARD DE PRODUTO */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                        SKU: {prod.sku}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {prod.marca}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {prod.produto}
                    </h4>
                  </div>

                  {/* ALERTA VISUAL DE MARGEM */}
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        isLowMargin
                          ? 'bg-rose-500 text-white shadow-sm shadow-rose-300 animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isLowMargin && <AlertTriangle className="w-3 h-3 text-white" />}
                      {formatPercent(prod.margemLiquida)}
                    </span>
                  </div>
                </div>

                {/* MÉTRICAS CHAVE DO PRODUTO */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <span className="text-[9px] text-slate-400 uppercase font-medium block">Qtd Vendida</span>
                    <span className="text-xs font-bold text-slate-800">{prod.quantidadeVendida} un</span>
                  </div>

                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <span className="text-[9px] text-slate-400 uppercase font-medium block">Fat. Bruto</span>
                    <span className="text-xs font-bold text-blue-700">{formatBRL(prod.faturamentoBruto)}</span>
                  </div>

                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <span className="text-[9px] text-slate-400 uppercase font-medium block">Lucro Líq.</span>
                    <span className={`text-xs font-bold ${prod.lucroLiquido < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {formatBRL(prod.lucroLiquido)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// ESTADO DE CARREGAMENTO (SKELETON ELEGANTE)
// ==========================================
function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-36 bg-slate-200 rounded-2xl w-full" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 bg-slate-200 rounded-2xl" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
      </div>
      <div className="h-44 bg-slate-200 rounded-2xl w-full" />
    </div>
  );
}

// ==========================================
// ESTADO DE ERRO (RETRY FRIENDLY)
// ==========================================
function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3 my-4">
      <div className="inline-flex p-3 bg-rose-100 text-rose-600 rounded-full">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-rose-900">Falha na Conexão</h4>
        <p className="text-xs text-rose-700 mt-1">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
      >
        Tentar Novamente
      </button>
    </div>
  );
}