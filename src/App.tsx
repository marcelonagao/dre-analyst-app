import React, { useState, useEffect } from 'react';

const API_URL = "https://script.google.com/macros/s/AKfycbxF-Q4p6Qxfkog8PFW6CaEUige0DMI0xNstTIi1bAY-aroC9B1wHg5NLZimS0q7uYEh/exec"; // Cole o link /exec atualizado

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('geral');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Falha ao comunicar com a API de dados');
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  const formatPct = (val) => `${Number(val || 0).toFixed(2).replace('.', ',')}%`;

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '14px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Carregando inteligência financeira...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.errorBox}>
          <h3 style={{ margin: '0 0 8px 0', color: '#dc2626' }}>Atenção</h3>
          <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>{error}</p>
          <button onClick={fetchData} style={styles.retryBtn}>Tentar Novamente</button>
        </div>
      </div>
    );
  }

  const kpis = data?.kpisGerais || {};

  return (
    <div style={styles.deviceFrame}>
      {/* HEADER EXECUTIVO */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <span style={styles.brandTag}>CONTROLLER DRE</span>
          <span style={styles.competenciaBadge}>Ref: {data.metadados?.competenciaAtual}</span>
        </div>
        <h1 style={styles.headerTitle}>Visão Geral do Negócio</h1>
      </header>

      {/* CORPO DO APP */}
      <main style={styles.mainContent}>
        
        {/* ABA 1: VISÃO GERAL */}
        {activeTab === 'geral' && (
          <div style={styles.tabPane}>
            {/* Card Principal - Faturamento */}
            <div style={styles.heroCard}>
              <span style={styles.heroLabel}>Faturamento Bruto Consolidado</span>
              <div style={styles.heroValue}>{formatBRL(kpis.faturamentoBruto)}</div>
              <div style={styles.heroSub}>
                <span>Volume de Pedidos: <strong>{kpis.totalPedidos}</strong></span>
              </div>
            </div>

            {/* Grid de KPIs de Resultado */}
            <div style={styles.grid2}>
              <div style={styles.metricCard}>
                <span style={styles.metricTitle}>Lucro Líquido</span>
                <span style={{ ...styles.metricValue, color: '#16a34a' }}>{formatBRL(kpis.lucroLiquido)}</span>
              </div>
              <div style={styles.metricCard}>
                <span style={styles.metricTitle}>Margem Líquida</span>
                <span style={{ ...styles.metricValue, color: kpis.margemLiquidaMedia < 10 ? '#dc2626' : '#2563eb' }}>
                  {formatPct(kpis.margemLiquidaMedia)}
                </span>
              </div>
            </div>

            {/* Card de Custos e Deduções */}
            <div style={styles.cardSection}>
              <h3 style={styles.cardSectionTitle}>Composição de Custos & Deduções</h3>
              <div style={styles.costRow}>
                <span style={styles.costLabel}>CPV Total (Produtos + Embalagem)</span>
                <span style={styles.costVal}>{formatBRL(kpis.totalCpv)}</span>
              </div>
              <div style={styles.costRow}>
                <span style={styles.costLabel}>Taxas de Plataforma</span>
                <span style={styles.costVal}>{formatBRL(kpis.totalTaxas)}</span>
              </div>
              <div style={{ ...styles.costRow, borderBottom: 'none' }}>
                <span style={styles.costLabel}>Impostos (11%)</span>
                <span style={styles.costVal}>{formatBRL(kpis.totalImpostos)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: DRE POR CANAL */}
        {activeTab === 'canais' && (
          <div style={styles.tabPane}>
            <h2 style={styles.sectionHeading}>Rentabilidade por Canal</h2>
            {data.drePorPlataforma?.map((canal, idx) => (
              <div key={idx} style={styles.channelCard}>
                <div style={styles.channelHeader}>
                  <strong>{canal.plataforma}</strong>
                  <span style={styles.orderCountBadge}>{canal.pedidos} vendas</span>
                </div>
                
                <div style={styles.channelGrid}>
                  <div>
                    <span style={styles.subLabel}>Faturamento</span>
                    <div style={styles.subVal}>{formatBRL(canal.faturamentoBruto)}</div>
                  </div>
                  <div>
                    <span style={styles.subLabel}>Lucro Líquido</span>
                    <div style={{ ...styles.subVal, color: '#16a34a' }}>{formatBRL(canal.lucroLiquido)}</div>
                  </div>
                </div>

                <div style={styles.channelFooter}>
                  <span>Margem Líquida do Canal:</span>
                  <strong style={{ color: canal.margemLiquida < 10 ? '#dc2626' : '#16a34a' }}>
                    {formatPct(canal.margemLiquida)}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA 3: CURVA ABC DE PRODUTOS */}
        {activeTab === 'produtos' && (
          <div style={styles.tabPane}>
            <h2 style={styles.sectionHeading}>Top Produtos (Curva ABC)</h2>
            {data.topProdutosCurvaABC?.map((prod, idx) => (
              <div key={idx} style={{ 
                ...styles.productCard, 
                borderLeft: prod.margemLiquida < 10 ? '4px solid #dc2626' : '4px solid #2563eb' 
              }}>
                <div style={styles.productMeta}>
                  <span>SKU: {prod.sku}</span>
                  <span style={styles.brandBadge}>{prod.marca}</span>
                </div>
                <div style={styles.productName}>{prod.produto}</div>
                
                <div style={styles.productStats}>
                  <div>
                    <span style={styles.subLabel}>Qtd Vendida</span>
                    <strong style={{ fontSize: '13px', color: '#1e293b' }}>{prod.quantidadeVendida} un</strong>
                  </div>
                  <div>
                    <span style={styles.subLabel}>Faturamento</span>
                    <strong style={{ fontSize: '13px', color: '#1e293b' }}>{formatBRL(prod.faturamentoBruto)}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={styles.subLabel}>Margem</span>
                    <strong style={{ fontSize: '13px', color: prod.margemLiquida < 10 ? '#dc2626' : '#16a34a' }}>
                      {formatPct(prod.margemLiquida)}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* BOTTOM NAVIGATION (ESTILO APP NATIVO) */}
      <nav style={styles.bottomNav}>
        <button 
          style={activeTab === 'geral' ? styles.navBtnActive : styles.navBtn} 
          onClick={() => setActiveTab('geral')}
        >
          📊 Visão Geral
        </button>
        <button 
          style={activeTab === 'canais' ? styles.navBtnActive : styles.navBtn} 
          onClick={() => setActiveTab('canais')}
        >
          🛒 Canais (DRE)
        </button>
        <button 
          style={activeTab === 'produtos' ? styles.navBtnActive : styles.navBtn} 
          onClick={() => setActiveTab('produtos')}
        >
          📦 Curva ABC
        </button>
      </nav>
    </div>
  );
}

// ESTILOS DE DESIGN FINTECH MOBILE-FIRST
const styles = {
  deviceFrame: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    maxWidth: '480px',
    margin: '0 auto',
    position: 'relative',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  loadingScreen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif'
  },
  spinner: {
    width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTop: '3px solid #2563eb',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite'
  },
  errorBox: {
    backgroundColor: '#fff', padding: '24px', borderRadius: '12px', textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '320px'
  },
  retryBtn: {
    marginTop: '16px', padding: '10px 16px', backgroundColor: '#2563eb', color: '#fff',
    border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%'
  },
  header: {
    backgroundColor: '#0f172a', color: '#fff', padding: '24px 20px 20px 20px',
    borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)'
  },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  brandTag: { fontSize: '10px', letterSpacing: '1.2px', fontWeight: '700', color: '#94a3b8' },
  competenciaBadge: { backgroundColor: '#1e293b', color: '#38bdf8', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  headerTitle: { margin: 0, fontSize: '20px', fontWeight: '700', color: '#f8fafc' },
  mainContent: { flex: 1, padding: '20px', paddingBottom: '90px', overflowY: 'auto' },
  tabPane: { display: 'flex', flexDirection: 'column', gap: '16px' },
  heroCard: {
    backgroundColor: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', background: '#2563eb',
    color: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
  },
  heroLabel: { fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#93c5fd', fontWeight: '600' },
  heroValue: { fontSize: '28px', fontWeight: '800', margin: '8px 0 12px 0' },
  heroSub: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#dbeafe', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '10px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  metricCard: {
    backgroundColor: '#fff', padding: '16px', borderRadius: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0'
  },
  metricTitle: { fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },
  metricValue: { fontSize: '18px', fontWeight: '800', marginTop: '6px', display: 'block' },
  cardSection: {
    backgroundColor: '#fff', padding: '16px', borderRadius: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0'
  },
  cardSectionTitle: { fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 12px 0' },
  costRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' },
  costLabel: { color: '#64748b' },
  costVal: { fontWeight: '600', color: '#1e293b' },
  sectionHeading: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' },
  channelCard: {
    backgroundColor: '#fff', padding: '16px', borderRadius: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px'
  },
  channelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' },
  orderCountBadge: { backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' },
  channelGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  subLabel: { fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '2px' },
  subVal: { fontSize: '15px', fontWeight: '700', color: '#1e293b' },
  channelFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '8px', fontSize: '12px', color: '#64748b' },
  productCard: {
    backgroundColor: '#fff', padding: '16px', borderRadius: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px'
  },
  productMeta: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', fontWeight: '600' },
  brandBadge: { backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px' },
  productName: { fontSize: '13px', fontWeight: '700', color: '#1e293b', lineHeight: '1.4' },
  productStats: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', alignItems: 'center' },
  bottomNav: {
    position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
    width: '100%', maxWidth: '480px', backgroundColor: '#fff', display: 'flex',
    borderTop: '1px solid #e2e8f0', boxShadow: '0 -4px 10px rgba(0,0,0,0.03)', zIndex: 100,
    paddingBottom: 'env(safe-area-inset-bottom)'
  },
  navBtn: {
    flex: 1, padding: '14px 0', backgroundColor: 'transparent', border: 'none',
    color: '#64748b', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textAlign: 'center'
  },
  navBtnActive: {
    flex: 1, padding: '14px 0', backgroundColor: 'transparent', border: 'none',
    color: '#2563eb', fontSize: '12px', fontWeight: '700', cursor: 'pointer', textAlign: 'center',
    borderTop: '2px solid #2563eb'
  }
};