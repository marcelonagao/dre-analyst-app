import React, { useState } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import VisaoGeralTab from './components/VisaoGeralTab';
import DREPlataformasTab from './components/DREPlataformasTab';
import CurvaABCTab from './components/CurvaABCTab';
import {
  IconBarChart3, IconCalendar, IconRefreshCw, IconLink2,
  IconPieChart, IconLayers, IconPackage, IconChevronRight,
  IconCheckCircle2, IconAlertCircle
} from './components/Icons';

export default function App() {
  const {
    apiUrl, setApiUrl,
    selectedCompetencia, setSelectedCompetencia,
    viewMode, setViewMode,
    data, loading, error,
    fetchData,
    listaHistorico,
    competenciasList,
    kpisExibidos,
    deducoesTotais,
    dreExibida
  } = useDashboardData();

  const [showApiModal, setShowApiModal] = useState(false);
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowMargin, setFilterLowMargin] = useState(false);

  return (
    <div className="w-screen min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800 antialiased overflow-x-hidden m-0 p-0">
      
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

              <button 
                onClick={() => fetchData(selectedCompetencia, true)} 
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white" 
                title="Atualizar Dados"
                aria-label="Atualizar Dados"
              >
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

            <button 
              onClick={() => fetchData(selectedCompetencia, true)} 
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200"
              aria-label="Atualizar Dados"
            >
              <IconRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </header>

        {showApiModal && (
          <div className="m-6 p-4 bg-slate-900 text-white rounded-2xl shadow-xl text-xs">
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
                  produtos={data?.topProdutosCurvaABC || []}
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