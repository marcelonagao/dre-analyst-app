import { useState, useEffect, useRef, useMemo } from 'react';

const HISTORICO_12_MESES = []; // Mock limpo, vamos focar na API Real

export function useDashboardData() {
  const [apiUrl, setApiUrl] = useState('https://script.google.com/macros/s/AKfycbzHqgfRQXYrEzvpmnc7Iuo9Sy9al1U7dsJVJoMAMjF3iQAJqLXGezGy02rxylpVmuNL/exec');
  const [selectedCompetencia, setSelectedCompetencia] = useState('');
  const [viewMode, setViewMode] = useState('mensal'); 
  const [channelFilter, setChannelFilter] = useState('todos'); 
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const localCache = useRef({});

  const fetchData = async (competencia, forceRefresh = false) => {
    if (!apiUrl.trim()) return;

    if (!forceRefresh && localCache.current[competencia]) {
      setData(localCache.current[competencia]);
      setLoading(false);
      return;
    }

    setLoading(true); setError(null);
    const cleanUrl = apiUrl.trim();
    const targetComp = competencia || '';

    try {
      // redirect: 'follow' garante que não somos bloqueados pelo CORS do Google
      const response = await fetch(`${cleanUrl}?competencia=${encodeURIComponent(targetComp)}`, {
        method: 'GET',
        redirect: 'follow'
      });
      
      if (!response.ok) throw new Error(`HTTP Error`);
      const parsedJson = await response.json();
      
      if (parsedJson.error) {
        throw new Error(parsedJson.error);
      }

      localCache.current[parsedJson.metadados.competenciaAtual] = parsedJson;
      setData(parsedJson);
      
      if (!competencia) {
        setSelectedCompetencia(parsedJson.metadados.competenciaAtual);
      }
    } catch (err) {
      setError("Erro na conexão com a API. Verifique a URL ou o Cache.");
    } finally {
      setLoading(false);
    }
  };

  // Dispara o fetch inicial quando a URL da API é configurada
  useEffect(() => { 
    if (apiUrl) fetchData(selectedCompetencia); 
  }, [apiUrl, selectedCompetencia]);

  const competenciasList = useMemo(() => data?.metadados?.competenciasDisponiveis || [], [data]);

  // 1. HISTÓRICO FILTRADO (Gráfico)
  const listaHistorico = useMemo(() => {
    const histOriginal = data?.historicoMensal || [];
    return histOriginal.map(m => {
      let fat = 0, luc = 0, cpv = 0, taxas = 0, impostos = 0, pedidos = 0;
      let lojasFiltradas = {};
      
      Object.keys(m.lojas || {}).forEach(nomeLoja => {
        const isOnline = nomeLoja.toLowerCase().includes('shopee') || nomeLoja.toLowerCase().includes('mercado livre') || nomeLoja.toLowerCase().includes('meli');
        const isExterna = nomeLoja.toLowerCase().includes('externa');

        if (channelFilter === 'todos' || (channelFilter === 'online' && isOnline) || (channelFilter === 'externa' && isExterna)) {
          lojasFiltradas[nomeLoja] = m.lojas[nomeLoja];
          fat += m.lojas[nomeLoja];
        }
      });

      const prop = m.faturamento > 0 ? fat / m.faturamento : 0;
      luc = (m.lucro || 0) * prop; cpv = (m.cpv || 0) * prop; taxas = (m.taxas || 0) * prop; impostos = (m.impostos || 0) * prop; pedidos = (m.pedidos || 0) * prop;
      
      return { ...m, faturamento: fat, lucro: luc, cpv, taxas, impostos, pedidos, lojas: lojasFiltradas };
    });
  }, [data, channelFilter]);

  // 2. DRE EXATA (Mensal ou Consolidada Real)
  const dreExibida = useMemo(() => {
    const lista = viewMode === 'consolidado' ? (data?.drePorPlataformaConsolidado || []) : (data?.drePorPlataforma || []);
    
    let mapPlat = {};
    lista.forEach(pBase => {
      const platLower = pBase.plataforma.toLowerCase();
      const isOnline = platLower.includes('shopee') || platLower.includes('mercado livre') || platLower.includes('meli');
      const isExterna = platLower.includes('externa');
      
      if (channelFilter === 'online' && !isOnline) return;
      if (channelFilter === 'externa' && !isExterna) return;

      mapPlat[pBase.plataforma] = {
        plataforma: pBase.plataforma,
        faturamentoBruto: pBase.faturamentoBruto || 0,
        lucroLiquido: pBase.lucroLiquido || 0,
        taxasPlataforma: pBase.taxasPlataforma || 0,
        imposto: pBase.imposto || 0,
        cpv: pBase.cpv || 0,
        pedidos: pBase.pedidos || 0,
      };
      mapPlat[pBase.plataforma].margemLiquida = mapPlat[pBase.plataforma].faturamentoBruto > 0 
        ? (mapPlat[pBase.plataforma].lucroLiquido / mapPlat[pBase.plataforma].faturamentoBruto) * 100 
        : 0;
    });

    return Object.values(mapPlat).sort((a, b) => b.faturamentoBruto - a.faturamentoBruto);
  }, [viewMode, data, channelFilter]);

  // ============================================================================
  // 3. KPIs GERAIS "À PROVA DE BALAS"
  // ============================================================================
  const kpisExibidos = useMemo(() => {
    let faturamentoBruto = 0, lucroLiquido = 0, totalTaxas = 0, totalImpostos = 0, totalCpv = 0, totalPedidos = 0;
    
    if (channelFilter === 'todos') {
       if (viewMode === 'mensal' && data?.kpisGerais) {
         faturamentoBruto = data.kpisGerais.faturamentoBruto || 0;
         lucroLiquido = data.kpisGerais.margemContribucion || data.kpisGerais.lucroLiquido || 0; 
         totalTaxas = data.kpisGerais.totalTaxas || 0;
         totalImpostos = data.kpisGerais.totalImpostos || 0;
         totalCpv = data.kpisGerais.totalCpv || 0;
         totalPedidos = data.kpisGerais.totalPedidos || 0;
       } else if (viewMode === 'consolidado') {
         listaHistorico.forEach(m => {
            faturamentoBruto += m.faturamento || 0; lucroLiquido += m.lucro || 0;
            totalTaxas += m.taxas || 0; totalImpostos += m.impostos || 0;
            totalCpv += m.cpv || 0; totalPedidos += m.pedidos || 0;
         });
       }
    } else {
       dreExibida.forEach(p => {
         faturamentoBruto += p.faturamentoBruto; lucroLiquido += p.lucroLiquido; 
         totalTaxas += p.taxasPlataforma; totalImpostos += p.imposto;
         totalCpv += p.cpv; totalPedidos += p.pedidos;
       });
    }

    const margemLiquidaMedia = faturamentoBruto > 0 ? (lucroLiquido / faturamentoBruto) * 100 : 0;
    
    // Cálculos de variação MoM
    let variacaoFat = 0, variacaoLucro = 0;
    if (viewMode === 'mensal' && listaHistorico.length > 1) {
      const idxAtual = listaHistorico.findIndex(h => h.mes === selectedCompetencia);
      if (idxAtual > 0) {
        const mesAnterior = listaHistorico[idxAtual - 1];
        if (mesAnterior.faturamento > 0) variacaoFat = ((faturamentoBruto - mesAnterior.faturamento) / mesAnterior.faturamento) * 100;
        if (mesAnterior.lucro > 0) variacaoLucro = ((lucroLiquido - mesAnterior.lucro) / mesAnterior.lucro) * 100;
      }
    }

    const mesesAtivos = listaHistorico.filter(m => m.faturamento > 0).length;
    const baseCustosFixos = data?.kpisGerais?.custosFixos || 0;
    const custosFixos = viewMode === 'consolidado' ? (baseCustosFixos * Math.max(mesesAtivos, 1)) : baseCustosFixos;

    // NOVO: Puxa o detalhamento do OPEX apenas se for visão global mensal
    // No modo consolidado anual, precisaríamos somar todos os meses (podemos fazer no futuro).
    const detalhamentoOpex = (channelFilter === 'todos' && viewMode === 'mensal') ? (data?.kpisGerais?.detalhamentoOpex || []) : [];

    return { 
      faturamentoBruto, lucroLiquido, margemLiquidaMedia, totalTaxas, 
      totalImpostos, totalCpv, totalPedidos, variacaoFat, variacaoLucro, custosFixos,
      detalhamentoOpex // <--- Exportando para a tela
    };
  }, [dreExibida, viewMode, listaHistorico, selectedCompetencia, data, channelFilter]);
  const deducoesTotais = useMemo(() => {
    const { totalCpv = 0, totalTaxas = 0, totalImpostos = 0, faturamentoBruto = 1 } = kpisExibidos;
    return {
      total: totalCpv + totalTaxas + totalImpostos,
      cpvPerc: (totalCpv / faturamentoBruto) * 100,
      taxasPerc: (totalTaxas / faturamentoBruto) * 100,
      impostosPerc: (totalImpostos / faturamentoBruto) * 100
    };
  }, [kpisExibidos]);

  // 4. PRODUTOS FILTRADOS GLOBAIS
  const produtosFiltradosGlobais = useMemo(() => {
    const globais = viewMode === 'consolidado' ? (data?.topProdutosCurvaABCConsolidado || []) : (data?.topProdutosCurvaABC || []);
    const porPlataforma = viewMode === 'consolidado' ? (data?.produtosPorPlataformaConsolidado || {}) : (data?.produtosPorPlataforma || {});

    if (channelFilter === 'todos') return globais;

    const map = {};
    globais.forEach(p => { map[p.sku] = { ...p, quantidadeVendida: 0, faturamentoBruto: 0, lucroLiquido: 0 }; });

    Object.keys(porPlataforma).forEach(plat => {
      const platLower = plat.toLowerCase();
      const isOnline = platLower.includes('shopee') || platLower.includes('mercado livre') || platLower.includes('meli');
      const isExterna = platLower.includes('externa');

      if ((channelFilter === 'online' && isOnline) || (channelFilter === 'externa' && isExterna)) {
        porPlataforma[plat].forEach(pPlat => {
          if (map[pPlat.sku]) {
            map[pPlat.sku].quantidadeVendida += pPlat.quantidadeVendida;
            map[pPlat.sku].faturamentoBruto += pPlat.faturamentoBruto;
            map[pPlat.sku].lucroLiquido += pPlat.lucroLiquido;
          }
        });
      }
    });
    
    const mesesAtivos = listaHistorico.filter(m => m.faturamento > 0).length;
    const diasPeriodo = viewMode === 'consolidado' ? (Math.max(mesesAtivos, 1) * 30) : 30;

    return Object.values(map).map(p => {
      const margem = p.faturamentoBruto > 0 ? (p.lucroLiquido / p.faturamentoBruto) * 100 : 0;
      const vendaDiaria = p.quantidadeVendida / diasPeriodo;
      const diasDeEstoque = vendaDiaria > 0 ? (p.estoqueAtual / vendaDiaria) : 999;
      
      let sugestaoCompra = 0;
      if (diasDeEstoque < (p.leadTime + 7)) {
         sugestaoCompra = Math.ceil((vendaDiaria * (30 + p.leadTime)) - p.estoqueAtual);
         if (sugestaoCompra < 0) sugestaoCompra = 0;
      }

      return {
        ...p, margemLiquida: margem, vendaDiaria: Number(vendaDiaria.toFixed(2)),
        diasDeEstoque: Math.round(diasDeEstoque), sugestaoCompra: sugestaoCompra
      };
    }).sort((a, b) => b.faturamentoBruto - a.faturamentoBruto);

  }, [data, channelFilter, viewMode, listaHistorico]);

  const produtosPorPlataforma = useMemo(() => {
    return viewMode === 'consolidado' ? (data?.produtosPorPlataformaConsolidado || {}) : (data?.produtosPorPlataforma || {});
  }, [data, viewMode]);

  return {
    apiUrl, setApiUrl, selectedCompetencia, setSelectedCompetencia, viewMode, setViewMode,
    channelFilter, setChannelFilter, data, loading, error, fetchData, listaHistorico,
    competenciasList, kpisExibidos, deducoesTotais, dreExibida, produtosFiltradosGlobais, produtosPorPlataforma
  };
}