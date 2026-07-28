import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});

const SYSTEM_INSTRUCTION = `
Você é o Controller Financeiro e Analista de DRE Sênior especializado em distribuidores multicanais e e-commerce (Mercado Livre, Shopee e Venda Direta/Externa).
Seu objetivo é analisar os dados de vendas consolidados do pipeline de ETL e gerar diagnósticos financeiros precisos, demonstrativos de resultados (DRE gerencial), alertas de desvio de margem e recomendações estratégicas de rentabilidade.

ESTRUTURA DA DRE E REGRAS DE NEGÓCIO:
1. Faturamento Bruto (Receita Bruta).
2. Deduções: Imposto fixo de 11,00% + Total Taxas Plataforma (comissão, frete líquido, etc.).
3. Receita Líquida = Faturamento Bruto - (Imposto 11% + Taxas Plataforma).
4. CPV Total = Custo Total Produto + Custo Embalagem (R$ 0,08/unidade).
5. Lucro Líquido Vendedor = Faturamento Bruto - Taxas - Impostos - CPV Total.
6. Margem Líquida (%) = (Lucro Líquido / Faturamento Bruto) * 100.

Sua resposta DEVE conter sempre:
- 📊 Resumo Executivo da DRE
- 🔍 Destaques e Comparativo por Canal (em formato de Tabela Markdown)
- ⚠️ Alertas Críticos (Margem < 5% ou prejuízo) e Oportunidades de Margem
`;

export default function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [report, setReport] = useState('');
  const [competencia, setCompetencia] = useState('07/2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estado para histórico do Firebase
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Carregar histórico do Firebase ao iniciar
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const q = query(collection(db, "dre_historico"), orderBy("dataCriacao", "desc"));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(docs);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jsonInput.trim()) {
      setError('Por favor, insira o JSON de vendas do ETL.');
      return;
    }

    setLoading(true);
    setError('');
    setReport('');

    try {
      // Validar JSON
      JSON.parse(jsonInput);

      // Chamada Gemini 2.5
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analise estes dados de vendas consolidando a DRE do período (${competencia}):\n\n${jsonInput}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
        },
      });

      const generatedText = response.text;
      setReport(generatedText);

      // Salvar no Firestore
      await addDoc(collection(db, "dre_historico"), {
        competencia: competencia,
        dadosJson: jsonInput,
        relatorio: generatedText,
        dataCriacao: serverTimestamp()
      });

      // Atualizar lista
      fetchHistory();

    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Estrutura de JSON inválida. Verifique o formato enviado.');
      } else {
        setError(`Erro ao processar análise: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item) => {
    setCompetencia(item.competencia);
    setJsonInput(item.dadosJson || '');
    setReport(item.relatorio);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerTitle}>
          <h2>📈 Controller Financeiro DRE - Multi-Canal</h2>
          <p>Consolidação gerencial via AI (Gemini 2.5) & Histórico no Cloud Firestore</p>
        </div>
      </header>

      <div style={styles.mainLayout}>
        {/* COLUNA ESQUERDA: ENTRADA E HISTÓRICO */}
        <div style={styles.sidebar}>
          <div style={styles.card}>
            <h3>1. Parâmetros & Payload JSON</h3>
            
            <label style={styles.label}>Competência / Período:</label>
            <input 
              type="text" 
              value={competencia} 
              onChange={(e) => setCompetencia(e.target.value)}
              style={styles.input} 
            />

            <label style={styles.label}>Dados Brutos das Vendas (JSON):</label>
            <textarea
              style={styles.textarea}
              placeholder="Cole o JSON extraído do seu script de consolidação..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />

            <button 
              style={loading ? {...styles.button, opacity: 0.6} : styles.button} 
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? '⚙️ Processando Margens...' : '🚀 Gerar e Salvar DRE'}
            </button>
            {error && <p style={styles.errorText}>{error}</p>}
          </div>

          {/* PAINEL DE HISTÓRICO DE DREs */}
          <div style={styles.card}>
            <h3>📋 DREs Salvas (Firebase)</h3>
            {loadingHistory ? (
              <p style={styles.subtext}>Carregando histórico...</p>
            ) : history.length === 0 ? (
              <p style={styles.subtext}>Nenhuma DRE salva ainda.</p>
            ) : (
              <div style={styles.historyList}>
                {history.map((item) => (
                  <div key={item.id} style={styles.historyItem} onClick={() => loadFromHistory(item)}>
                    <strong>Competência: {item.competencia}</strong>
                    <span style={styles.historyDate}>
                      {item.dataCriacao?.toDate ? item.dataCriacao.toDate().toLocaleDateString('pt-BR') : 'Hoje'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA: RESULTADO DA DRE */}
        <div style={styles.mainContent}>
          <div style={styles.cardResult}>
            <div style={styles.cardHeader}>
              <h3>📊 Demonstrativo do Resultado do Exercício</h3>
              {report && <span style={styles.badgeSuccess}>Análise Concluída</span>}
            </div>

            {loading ? (
              <div style={styles.loadingBox}>
                <div style={styles.spinner}></div>
                <p>O Gemini está auditando os impostos, comissões de marketplace e CPV...</p>
              </div>
            ) : report ? (
              <div style={styles.reportWrapper}>
                <pre style={styles.preFormatted}>{report}</pre>
              </div>
            ) : (
              <div style={styles.placeholderBox}>
                <p>👈 Insira o JSON ao lado ou selecione um relatório do histórico para visualizar o DRE.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px' },
  header: { backgroundColor: '#1e293b', color: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  headerTitle: { margin: 0 },
  mainLayout: { display: 'grid', gridTemplateColumns: '400px 1fr', gap: '20px' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '20px' },
  mainContent: { display: 'flex', flexDirection: 'column' },
  card: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardResult: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minHeight: '600px', display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#475569', marginTop: '12px', display: 'block' },
  input: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', marginTop: '4px', boxSizing: 'border-box' },
  textarea: { width: '100%', height: '220px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '12px', marginTop: '4px', resize: 'vertical', boxSizing: 'border-box' },
  button: { width: '100%', marginTop: '16px', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  errorText: { color: '#dc2626', fontSize: '13px', marginTop: '10px' },
  badgeSuccess: { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  loadingBox: { textAlign: 'center', padding: '60px 20px', color: '#64748b' },
  placeholderBox: { textAlign: 'center', padding: '100px 20px', color: '#94a3b8' },
  reportWrapper: { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '6px', border: '1px solid #e2e8f0', overflowX: 'auto' },
  preFormatted: { whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#1e293b' },
  historyList: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', maxHeight: '200px', overflowY: 'auto' },
  historyItem: { padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  historyDate: { fontSize: '11px', color: '#64748b' },
  subtext: { fontSize: '13px', color: '#64748b', fontStyle: 'italic' }
};