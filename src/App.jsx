import React, { useState, Suspense, lazy } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import {
  IconBarChart3, IconCalendar, IconRefreshCw,
  IconPieChart, IconLayers, IconPackage, IconBrain
} from './components/Icons';

/* 🚀 MELHORIA 1: Lazy Loading (Carregamento Sob Demanda) 
   O sistema só baixa o código da tela DRE se o usuário clicar nela, deixando o app super leve! */
const VisaoGeralTab = lazy(() => import('./components/VisaoGeralTab'));
const DREPlataformasTab = lazy(() => import('./components/DREPlataformasTab'));
const CurvaABCTab = lazy(() => import('./components/CurvaABCTab'));
const InteligenciaTab = lazy(() => import('./components/InteligenciaTab'));
const CatalogoB2BTab = lazy(() => import('./components/CatalogoB2BTab'));

/* 🚀 MELHORIA 2: Fim das "Magic Strings" (Padronização) */
const TABS = {
  VISAO_GERAL: 'visao-geral',
  DRE: 'dre',
  ABC: 'abc',
  INTELIGENCIA: 'inteligencia',
  CATALOGO_B2B: 'catalogo-b2b'
};

export default function App() {
  const {
    selectedCompetencia, setSelectedCompetencia,
    viewMode, setViewMode,
    channelFilter, setChannelFilter,
    data, loading, error,
    fetchData,
    listaHistorico,
    competenciasList,
    kpisExibidos,
    deducoesTotais,
    dreExibida,
    produtosFiltradosGlobais
  } = useDashboardData();

  // =======================================================
  // 🌟 ORDEM CORRETA: PRIMEIRO DECLARAMOS OS ESTADOS
  // =======================================================
  const [appUserRole, setAppUserRole] = useState('b2b');
  const [activeTab, setActiveTab] = useState(TABS.CATALOGO_B2B);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowMargin, setFilterLowMargin] = useState(false);

  // =======================================================
  // 🌟 SEGUNDO: AGORA SIM PODEMOS LER O 'activeTab' e o 'appUserRole'
  // =======================================================

  const isB2BClient = activeTab === TABS.CATALOGO_B2B && appUserRole !== 'admin'; 
    
  
  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-50">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-slate-500 font-bold text-sm tracking-widest uppercase">
          Conectando ao Supabase...
        </h2>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800 antialiased overflow-x-hidden m-0 p-0 pb-20 md:pb-0">
      
      {/* 🌟 CAMINHO 1: Ocultando Menu Lateral se for Cliente B2B */}
      {!isB2BClient && (
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
                <div className="flex items-center space-x-2 text-emerald-400 w-full">
                  <IconCalendar className="w-4 h-4 shrink-0" />
                  <select
                    value={selectedCompetencia}
                    onChange={(e) => { setSelectedCompetencia(e.target.value); setViewMode('mensal'); }}
                    className="bg-slate-900 text-white font-bold text-xs rounded-lg px-2 py-1 border border-slate-700 focus:outline-none cursor-pointer w-full"
                  >
                    {(competenciasList || []).map((comp) => (
                      <option key={comp} value={comp}>{comp}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <nav className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block px-2 mb-1">NAVEGAÇÃO</span>
              <button onClick={() => setActiveTab(TABS.VISAO_GERAL)} aria-label="Ir para Visão Geral" className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === TABS.VISAO_GERAL ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
                <div className="flex items-center space-x-3"><IconPieChart className="w-4 h-4" /><span>Visão Geral</span></div>
              </button>
              <button onClick={() => setActiveTab(TABS.DRE)} aria-label="Ir para DRE" className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === TABS.DRE ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
                <div className="flex items-center space-x-3"><IconLayers className="w-4 h-4" /><span>DRE por Canais</span></div>
              </button>
              <button onClick={() => setActiveTab(TABS.ABC)} aria-label="Ir para Curva ABC" className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === TABS.ABC ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
                <div className="flex items-center space-x-3"><IconPackage className="w-4 h-4" /><span>Curva ABC Produtos</span></div>
              </button>
              <button onClick={() => setActiveTab(TABS.INTELIGENCIA)} aria-label="Ir para Inteligência" className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === TABS.INTELIGENCIA ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
                <div className="flex items-center space-x-3"><IconBrain className="w-4 h-4" /><span>Inteligência & Compras</span></div>
              </button>
              
              <button onClick={() => setActiveTab(TABS.CATALOGO_B2B)} aria-label="Ir para Portal B2B" className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === TABS.CATALOGO_B2B ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
                <div className="flex items-center space-x-3"><span className="text-sm">🛒</span><span>Portal B2B</span></div>
              </button>
            </nav>
          </div>
        </aside>
      )}

      {/* 🌟 CAMINHO 1: Se for B2B, remove a margem esquerda (pl-64) para ocupar 100% da tela */}
      <div className={`${!isB2BClient ? 'md:pl-64 lg:pl-72' : ''} flex-1 w-full min-w-0 flex flex-col min-h-screen bg-slate-50 overflow-x-hidden`}>
        
        {/* Ocultando Header de Gestão se for B2B */}
        {!isB2BClient && (
          <>
            {/* 🖥️ HEADER DESKTOP DA GESTÃO */}
            <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4 shadow-xs w-full">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {activeTab === TABS.VISAO_GERAL && 'Visão Executiva'}
                  {activeTab === TABS.DRE && 'DRE por Canal de Vendas'}
                  {activeTab === TABS.ABC && 'Curva ABC de Produtos'}
                  {activeTab === TABS.INTELIGENCIA && 'Inteligência & Planejamento'}
                  {activeTab === TABS.CATALOGO_B2B && 'Portal de Vendas B2B'} 
                </h2>
                <p className="text-xs text-slate-400">
                  Modo: <strong className="text-slate-700">{viewMode === 'consolidado' ? 'Acumulado Total' : `Mês ${selectedCompetencia}`}</strong>
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-50/50 p-1 rounded-xl border border-emerald-100 flex space-x-1 text-xs mr-2">
                  <button onClick={() => setChannelFilter('todos')} className={`px-3 py-1.5 rounded-lg font-bold transition-all ${channelFilter === 'todos' ? 'bg-emerald-500 text-white shadow-sm' : 'text-emerald-700 hover:bg-emerald-100'}`}>Todos</button>
                  <button onClick={() => setChannelFilter('online')} className={`px-3 py-1.5 rounded-lg font-bold transition-all ${channelFilter === 'online' ? 'bg-emerald-500 text-white shadow-sm' : 'text-emerald-700 hover:bg-emerald-100'}`}>Online</button>
                  <button onClick={() => setChannelFilter('externa')} className={`px-3 py-1.5 rounded-lg font-bold transition-all ${channelFilter === 'externa' ? 'bg-emerald-500 text-white shadow-sm' : 'text-emerald-700 hover:bg-emerald-100'}`}>B2B/Externa</button>
                </div>

                <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex space-x-1 text-xs mr-2">
                  <button onClick={() => setViewMode('mensal')} className={`px-3 py-1.5 rounded-lg font-bold transition-all ${viewMode === 'mensal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Mês</button>
                  <button onClick={() => setViewMode('consolidado')} className={`px-3 py-1.5 rounded-lg font-bold transition-all ${viewMode === 'consolidado' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Total</button>
                </div>

                <button onClick={() => fetchData()} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200" title="Atualizar Dados do Supabase">
                  <IconRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
              </div>
            </header>

            {/* 📱 HEADER MOBILE DA GESTÃO */}
            <header className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-slate-900 text-emerald-400 rounded-lg"><IconBarChart3 className="w-5 h-5" /></div>
                  <h1 className="text-sm font-black text-slate-900 tracking-tight">Controller</h1>
                </div>
                <button onClick={() => fetchData()} className="p-2 bg-slate-100 text-slate-700 rounded-lg border border-slate-200"><IconRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} /></button>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex bg-emerald-50 rounded-lg border border-emerald-100 p-1 text-[10px]">
                  <button onClick={() => setChannelFilter('todos')} className={`flex-1 py-1.5 rounded-md font-bold ${channelFilter === 'todos' ? 'bg-emerald-500 text-white' : 'text-emerald-700'}`}>Todos</button>
                  <button onClick={() => setChannelFilter('online')} className={`flex-1 py-1.5 rounded-md font-bold ${channelFilter === 'online' ? 'bg-emerald-500 text-white' : 'text-emerald-700'}`}>Online</button>
                  <button onClick={() => setChannelFilter('externa')} className={`flex-1 py-1.5 rounded-md font-bold ${channelFilter === 'externa' ? 'bg-emerald-500 text-white' : 'text-emerald-700'}`}>Externa</button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 flex-1">
                    <IconCalendar className="w-4 h-4 text-slate-500" />
                    <select value={selectedCompetencia} onChange={(e) => { setSelectedCompetencia(e.target.value); setViewMode('mensal'); }} className="bg-transparent text-slate-700 font-bold text-xs w-full focus:outline-none">
                      {(competenciasList || []).map((comp) => (<option key={comp} value={comp}>{comp}</option>))}
                    </select>
                  </div>
                  <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex text-[10px]">
                    <button onClick={() => setViewMode('mensal')} className={`px-3 py-1.5 rounded-md font-bold transition-all ${viewMode === 'mensal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Mês</button>
                    <button onClick={() => setViewMode('consolidado')} className={`px-3 py-1.5 rounded-md font-bold transition-all ${viewMode === 'consolidado' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500'}`}>Total</button>
                  </div>
                </div>
              </div>
            </header>
          </>
        )}

        {/* 🌟 CAMINHO 1: O segredo do espaço em branco! 
            Se a aba for o Catálogo B2B, zeramos os paddings e tiramos o limite de espaço */}
        <main className={`flex-1 overflow-y-auto w-full relative ${activeTab === TABS.CATALOGO_B2B ? 'p-0' : 'p-4 md:p-8 space-y-6'}`}>
          {error ? (
            <ErrorState message={error} onRetry={() => fetchData()} />
          ) : (
            /* Suspense garante que a tela exiba algo enquanto o Lazy Loading baixa o arquivo */
            <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold animate-pulse">Carregando módulo...</div>}>
              {activeTab === TABS.VISAO_GERAL && (
                <VisaoGeralTab 
                  kpis={kpisExibidos} 
                  deducoesTotais={deducoesTotais} 
                  historico12Meses={listaHistorico} 
                  onSelectMonth={(m) => { setSelectedCompetencia(m); setViewMode('mensal'); }} 
                  selectedCompetencia={selectedCompetencia}
                  channelFilter={channelFilter}
                />
              )}
              {activeTab === TABS.DRE && (
                <DREPlataformasTab 
                  dre={dreExibida} 
                  historico12Meses={listaHistorico} 
                  viewMode={viewMode} 
                />
              )}
              {activeTab === TABS.ABC && (
                <CurvaABCTab 
                  produtos={produtosFiltradosGlobais || []} 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                  filterLowMargin={filterLowMargin} 
                  setFilterLowMargin={setFilterLowMargin} 
                />
              )}
              {activeTab === TABS.INTELIGENCIA && (
                <InteligenciaTab 
                  produtos={produtosFiltradosGlobais || []} 
                  margemAtual={kpisExibidos.margemLiquidaMedia} 
                />
              )}
              {/* O CATÁLOGO AGORA OCUPA 100% DO ESPAÇO E AVISA QUEM ESTÁ LOGADO */}
              {activeTab === TABS.CATALOGO_B2B && (
                <CatalogoB2BTab onRoleChange={setAppUserRole} />
              )}
            </Suspense>
          )}
        </main>
      </div>

      {/* Ocultando Menu Mobile da Gestão se for B2B */}
      {!isB2BClient && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex items-center justify-around px-2 py-2 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)]">
          <button aria-label="Ir para Visão Geral" onClick={() => setActiveTab(TABS.VISAO_GERAL)} className={`flex flex-col items-center space-y-1 p-2 w-full transition-colors ${activeTab === TABS.VISAO_GERAL ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <IconPieChart className="w-5 h-5" />
          </button>
          <button aria-label="Ir para DRE" onClick={() => setActiveTab(TABS.DRE)} className={`flex flex-col items-center space-y-1 p-2 w-full transition-colors ${activeTab === TABS.DRE ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <IconLayers className="w-5 h-5" />
          </button>
          <button aria-label="Ir para Curva ABC" onClick={() => setActiveTab(TABS.ABC)} className={`flex flex-col items-center space-y-1 p-2 w-full transition-colors ${activeTab === TABS.ABC ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <IconPackage className="w-5 h-5" />
          </button>
          <button aria-label="Ir para Inteligência" onClick={() => setActiveTab(TABS.INTELIGENCIA)} className={`flex flex-col items-center space-y-1 p-2 w-full transition-colors ${activeTab === TABS.INTELIGENCIA ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <IconBrain className="w-5 h-5" />
          </button>
          <button aria-label="Ir para Portal B2B" onClick={() => setActiveTab(TABS.CATALOGO_B2B)} className={`flex flex-col items-center space-y-1 p-2 w-full transition-colors ${activeTab === TABS.CATALOGO_B2B ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <span className="text-[20px]">🛒</span>
          </button>
        </nav>
      )}
    </div>
  );
}

function ErrorState({ message, onRetry }) { 
  return (
    <div className="p-8 bg-red-50 rounded-2xl border border-red-200 text-center space-y-4">
      <p className="text-red-700 font-bold text-sm">{message}</p>
      <button onClick={onRetry} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-red-700">Tentar Novamente</button>
    </div>
  ); 
}