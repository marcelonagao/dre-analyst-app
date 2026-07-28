import React, { useState, useEffect } from 'react';

// URL do seu Google Apps Script (API)
const API_URL = "https://script.google.com/macros/s/AKfycbwIZ2PfNvKGy_C0pdtNZgOP6W0kNtLA747RuOVBCBOug-H_8nbzUzA54_bNDdr1m-oa/exec";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('geral'); // geral, canais, produtos

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Falha ao carregar dados da API');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Formatador de Moeda (BRL)
  const formatBRL = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  // Formatador de Porcentagem
  const formatPct = (value) => {
    return `${Number(value || 0).toFixed(2).replace('.', ',')}%`;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '16px', color: '#64748b' }}>Sincronizando dados de vendas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingContainer}>
        <p style={{ color: '#ef4444', fontWeight: 'bold' }}>Erro de conexão</p>
        <p style={{ color: '#64748b' }}>{error}</p>
        <button onClick={fetchData} style={styles.retryButton}>Tentar Novamente</button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={styles.appContainer}>
      {/* CABEÇALHO */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Controller Financeiro</h1>
        <p style={styles.headerSubtitle}>Competência: {data.metadados?.competenciaAtual}</p>
      </header>

      {/* ÁREA PRINCIPAL (ROLÁVEL) */}
      <main style={styles.mainContent}>
        
        {/* ABA: VISÃO GERAL */}
        {activeTab === 'geral' && (
          <div style={styles.fadeAnimation}>
            <h2 style={styles.sectionTitle}>Visão Executiva</h2>
            
            <div style={styles.kpiCardHighlight}>
              <span style={styles.kpiLabel}>Receita Bruta</span>
              <span style={styles.kpiValueHighlight}>{formatBRL(data.kpisGerais?.faturamentoBruto)}</span>
            </div>

            <div style={styles.grid2Col}>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>Lucro Líquido</span>
                <span style={{...styles.kpiValue, color: '#16a34a'}}>{formatBRL(data.kpisGerais?.lucroLiquido)}</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>Margem Média</span>
                <span style={styles.kpiValue}>{formatPct(data.kpisGerais?.margemLiquidaMedia)}</span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <span style={styles.kpiLabel}>Custos e Deduções (CPV + Taxas + Impostos)</span>
              <div style={styles.progressContainer}>
                <div style={{
                  ...styles.progressBar, 
                  width: `${((data.kpisGerais?.totalCpv + data.kpisGerais?.totalTaxas + data.kpisGerais?.totalImpostos) / data.kpisGerais?.faturamentoBruto) * 100}%`
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
                <span>CPV: {formatBRL(data.kpisGerais?.totalCpv)}</span>
                <span>Taxas: {formatBRL(data.kpisGerais?.totalTaxas)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ABA: DRE POR CANAL */}
        {activeTab === 'canais' && (
          <div style={styles.fadeAnimation}>
            <h2 style={styles.sectionTitle}>DRE por Plataforma</h2>
            {data.drePorPlataforma?.map((canal, index) => (
              <div key={index} style={styles.listItem}>
                <div style={styles.listHeader}>
                  <strong>{canal.plataforma}</strong>
                  <span style={styles.badge}>{canal.pedidos} pedidos</span>
                </div>
                <div style={styles.grid2ColList}>
                  <div>
                    <span style={styles.microLabel}>Faturamento</span>
                    <strong style={styles.microValue}>{formatBRL(canal.faturamentoBruto)}</strong>
                  </div>
                  <div>
                    <span style={styles.microLabel}>Lucro Líquido</span>
                    <strong style={{...styles.microValue, color: '#16a34a'}}>{formatBRL(canal.lucroLiquido)}</strong>
                  </div>
                </div>
                <div style={styles.marginIndicator}>
                  <span style={styles.microLabel}>Margem Líquida</span>
                  <strong style={{
                    color: canal.margemLiquida < 10 ? '#ef4444' : '#16a34a',
                    fontSize: '14px'
                  }}>
                    {formatPct(canal.margemLiquida)}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA: CURVA ABC DE PRODUTOS */}
        {activeTab === 'produtos' && (
          <div style={styles.fadeAnimation}>
            <h2 style={styles.sectionTitle}>Curva ABC (Top Produtos)</h2>
            {data.topProdutosCurvaABC?.map((prod, index) => (
              <div key={index} style={{...styles.listItem, borderLeft: prod.margemLiquida < 10 ? '4px solid #ef4444' : '4px solid #3b82f6'}}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>SKU: {prod.sku} | {prod.marca}</div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '12px', lineHeight: '1.4' }}>{prod.produto}</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={styles.microLabel}>Vendas</span>
                    <strong style={styles.microValue}>{prod.quantidadeVendida} un</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={styles.microLabel}>Margem (Alerta)</span>
                    <strong style={{ 
                      fontSize: '14px',
                      color: prod.margemLiquida < 10 ? '#ef4444' : '#16a34a' 
                    }}>
                      {formatPct(prod.margemLiquida)}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* NAVEGAÇÃO INFERIOR (BOTTOM TAB BAR) */}
      <nav style={styles.bottomNav}>
        <button 
          style={activeTab === 'geral' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveTab('geral')}
        >
          Visão Geral
        </button>
        <button 
          style={activeTab === 'canais' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveTab('canais')}
        >
          Canais (DRE)
        </button>
        <button 
          style={activeTab === 'produtos' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveTab('produtos')}
        >
          Curva ABC
        </button>
      </nav>
    </div>
  );
}

// ESTILOS FOCADOS EM MOBILE
const styles = {
  appContainer: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    maxWidth: '480px', // Restringe a largura para parecer um celular no desktop
    margin: '0 auto',
    position: 'relative',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column'
  },
  loadingContainer: {
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    height: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'sans-serif'
  },
  spinner: {
    width: '40px', height: '40px', border: '4px solid #cbd5e1', borderTop: '4px solid #3b82f6',
    borderRadius: '50%', animation: 'spin 1s linear infinite'
  },
  retryButton: {
    marginTop: '16px', padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff',
    border: 'none', borderRadius: '6px', fontWeight: 'bold'
  },
  header: {
    backgroundColor: '#0f172a', color: '#fff', padding: '24px 20px',
    borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px',
    position: 'sticky', top: 0, zIndex: 10
  },
  headerTitle: { margin: 0, fontSize: '20px', fontWeight: 'bold' },
  headerSubtitle: { margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' },
  mainContent: {
    flex: 1, padding: '20px', paddingBottom: '90px', overflowY: 'auto'
  },
  sectionTitle: {
    fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px', marginTop: 0
  },
  kpiCardHighlight: {
    backgroundColor: '#3b82f6', color: '#fff', padding: '20px', borderRadius: '12px',
    marginBottom: '16px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
  },
  kpiValueHighlight: { fontSize: '32px', fontWeight: 'bold', marginTop: '8px' },
  grid2Col: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' },
  kpiCard: {
    backgroundColor: '#fff', padding: '16px', borderRadius: '12px', display: 'flex',
    flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  kpiLabel: { fontSize: '13px', color: '#64748b', fontWeight: '600' },
  kpiValue: { fontSize: '22px', fontWeight: 'bold', color: '#1e293b', marginTop: '4px' },
  progressContainer: { width: '100%', backgroundColor: '#e2e8f0', height: '8px', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' },
  progressBar: { backgroundColor: '#ef4444', height: '100%' },
  listItem: {
    backgroundColor: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' },
  badge: { backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' },
  grid2ColList: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  microLabel: { display: 'block', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' },
  microValue: { fontSize: '15px', fontWeight: 'bold', color: '#1e293b' },
  marginIndicator: { marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  bottomNav: {
    position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
    width: '100%', maxWidth: '480px', backgroundColor: '#fff', display: 'flex',
    borderTop: '1px solid #e2e8f0', zIndex: 10, paddingBottom: 'env(safe-area-inset-bottom)'
  },
  navButton: {
    flex: 1, padding: '16px 0', backgroundColor: 'transparent', border: 'none',
    borderTop: '3px solid transparent', color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
  },
  navButtonActive: {
    flex: 1, padding: '16px 0', backgroundColor: 'transparent', border: 'none',
    borderTop: '3px solid #3b82f6', color: '#3b82f6', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
  },
  fadeAnimation: { animation: 'fadeIn 0.3s ease-in-out' }
};

// Adicionando a keyframe animation no documento (simples truque para inline styles)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(style);
}