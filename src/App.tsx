import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

// Inicializa a SDK do Gemini pegando a chave do arquivo .env
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// A mesma System Instruction que configuramos no AI Studio
const SYSTEM_INSTRUCTION = `
Você é o Controller Financeiro e Analista de DRE Sênior especializado em distribuidores multicanais e e-commerce (Mercado Livre, Shopee e Venda Direta/Externa).
Seu objetivo é analisar os dados de vendas consolidados do pipeline de ETL e gerar diagnósticos financeiros precisos, demonstrativos de resultados (DRE gerencial), alertas de desvio de margem e recomendações estratégicas de rentabilidade.

Regras de Negócio:
1. Imposto sobre vendas: 11% fixo.
2. Custos de embalagem: R$ 0,08 por unidade.
3. Classifique os relatórios em: Resumo Executivo, Destaques por Canal (Tabela) e Alertas de Margem (Crítico < 5%, Destaque Positivo).
4. Tom de voz executivo, focado em números e tomada de decisão.
`;

export default function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!jsonInput.trim()) {
      setError('Por favor, insira o JSON com os dados das vendas.');
      return;
    }

    setLoading(true);
    setError('');
    setReport('');

    try {
      // 1. Valida se o texto digitado é um JSON válido
      JSON.parse(jsonInput);

      // 2. Chama a API do Gemini via SDK oficial
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Analise estes dados de vendas e gere o relatório da DRE:\n\n${jsonInput}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
        },
      });

      // 3. Exibe o relatório retornado
      setReport(response.text);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError(
          'O texto digitado não é um JSON válido. Verifique a formatação.'
        );
      } else {
        setError(`Erro ao consultar o Gemini: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>📊 Dashboard Controller DRE - Gemini AI</h2>
        <p>
          Análise inteligente de margens e consolidação de e-commerce e venda
          direta
        </p>
      </header>

      <div style={styles.mainContent}>
        {/* LADO ESQUERDO: ENTRADA DOS DADOS */}
        <div style={styles.card}>
          <h3>1. Dados Brutos (JSON)</h3>
          <textarea
            style={styles.textarea}
            placeholder="Cole aqui o JSON gerado pelo seu script..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <button
            style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? 'Analisando DRE...' : '🚀 Gerar Análise de DRE'}
          </button>
          {error && <p style={styles.errorText}>{error}</p>}
        </div>

        {/* LADO DIREITO: RELATÓRIO DA IA */}
        <div style={styles.card}>
          <h3>2. Análise Gerencial da DRE</h3>
          {loading ? (
            <div style={styles.loadingState}>
              <p>
                ⏳ O Gemini está processando as margens e taxas do período...
              </p>
            </div>
          ) : report ? (
            <div style={styles.reportContent}>
              <pre style={styles.preFormatted}>{report}</pre>
            </div>
          ) : (
            <p style={styles.placeholderText}>
              Cole o JSON ao lado e clique em "Gerar Análise" para visualizar a
              DRE e os alertas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Estilos inline simples para rodar sem dependências extras de CSS
const styles = {
  container: {
    fontFamily: 'Segoe UI, sans-serif',
    padding: '20px',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '20px',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '10px',
  },
  mainContent: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
  },
  textarea: {
    width: '100%',
    height: '350px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontFamily: 'monospace',
    fontSize: '13px',
    resize: 'vertical',
  },
  button: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#0f62fe',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  errorText: { color: '#da1e28', marginTop: '10px', fontSize: '14px' },
  loadingState: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    color: '#525252',
  },
  reportContent: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '6px',
    overflowX: 'auto',
  },
  preFormatted: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    fontFamily: 'inherit',
    margin: 0,
  },
  placeholderText: {
    color: '#8d8d8d',
    fontStyle: 'italic',
    marginTop: '40px',
    textAlign: 'center',
  },
};
