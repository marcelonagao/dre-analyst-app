import { useState, useEffect, useRef, useMemo } from 'react';

// Mock atualizado com os novos campos para funcionar sem internet
const HISTORICO_12_MESES = [
  { mes: "05/2025", faturamento: 180000, lucro: 14400, margem: 8.00, shopee: 100000, meli: 60000, externa: 20000, cpv: 100000, taxas: 25000, impostos: 19800, pedidos: 2500 },
  { mes: "06/2025", faturamento: 195000, lucro: 16575, margem: 8.50, shopee: 110000, meli: 65000, externa: 20000, cpv: 110000, taxas: 27000, impostos: 21450, pedidos: 2700 },
  { mes: "07/2025", faturamento: 205000, lucro: 18040, margem: 8.80, shopee: 115000, meli: 68000, externa: 22000, cpv: 115000, taxas: 28000, impostos: 22550, pedidos: 2850 },
  { mes: "08/2025", faturamento: 220000, lucro: 19800, margem: 9.00, shopee: 125000, meli: 70000, externa: 25000, cpv: 125000, taxas: 30000, impostos: 24200, pedidos: 3000 },
  { mes: "09/2025", faturamento: 215000, lucro: 18705, margem: 8.70, shopee: 120000, meli: 70000, externa: 25000, cpv: 122000, taxas: 29000, impostos: 23650, pedidos: 2950 },
  { mes: "10/2025", faturamento: 230000, lucro: 20470, margem: 8.90, shopee: 130000, meli: 75000, externa: 25000, cpv: 130000, taxas: 31000, impostos: 25300, pedidos: 3100 },
  { mes: "11/2025", faturamento: 260000, lucro: 23920, margem: 9.20, shopee: 145000, meli: 85000, externa: 30000, cpv: 145000, taxas: 35000, impostos: 28600, pedidos: 3500 },
  { mes: "12/2025", faturamento: 310000, lucro: 29450, margem: 9.50, shopee: 170000, meli: 105000, externa: 35000, cpv: 170000, taxas: 42000, impostos: 34100, pedidos: 4200 },
  { mes: "01/2026", faturamento: 210000, lucro: 18500, margem: 8.81, shopee: 115000, meli: 70000, externa: 25000, cpv: 118000, taxas: 28000, impostos: 23100, pedidos: 2900 },
  { mes: "02/2026", faturamento: 245000, lucro: 22100, margem: 9.02, shopee: 135000, meli: 82000, externa: 28000, cpv: 138000, taxas: 33000, impostos: 26950, pedidos: 3300 },
  { mes: "03/2026", faturamento: 280000, lucro: 24760, margem: 8.84, shopee: 155000, meli: 95000, externa: 30000, cpv: 158000, taxas: 38000, impostos: 30800, pedidos: 3800 },
  { mes: "04/2026", faturamento: 300939.97, lucro: 21545.65, margem: 7.16, shopee: 165000, meli: 105939.97, externa: 30000, cpv: 203331.01, taxas: 42959.91, impostos: 33100, pedidos: 4386 }
];

export function useDashboardData() {
  const [apiUrl, setApiUrl] = useState('');
  const [selectedCompetencia, setSelectedCompetencia] = useState('04/2026');
  const [viewMode, setViewMode] = useState('mensal'); 
  const [channelFilter, setChannelFilter] = useState('todos'); 
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const localCache = useRef({});

  const fetchData = async (competencia, forceRefresh = false) => {
    if (!forceRefresh && localCache.current[competencia]) {
      setData(localCache.current[competencia]);
      setLoading(false);
      return;
    }

    setLoading(true); setError(null);
    const cleanUrl = apiUrl.trim();

    try {
      if (cleanUrl) {
        const response = await fetch(`${cleanUrl}?competencia=${encodeURIComponent(competencia)}`);
        if (!response.ok) throw new Error(`HTTP Error`);
        const parsedJson = await response.json();
        localCache.current[competencia] = parsedJson;
        setData(parsedJson);
      } else {
        await new Promise((res) => setTimeout(res, 200));
        const mockData = {
          metadados: { competenciaAtual: competencia, competenciasDisponiveis: HISTORICO_12_MESES.map(h => h.mes) },
          historicoMensal: HISTORICO_12_MESES,
          kpisGerais: { faturamentoBruto: 300939.97, totalTaxas: 42959.91, totalImpostos: 33100.00, totalCpv: 203331.01, lucroLiquido: 21545.65, margemLiquidaMedia: 7.16, totalPedidos: 4386 },
          drePorPlataforma: [
            { plataforma: "Shopee RAFA", faturamentoBruto: 165000.00, taxasPlataforma: 23550, imposto: 18150, cpv: 111500, lucroLiquido: 11800, margemLiquida: 7.15, pedidos: 2410 },
            { plataforma: "Mercado Livre", faturamentoBruto: 105939.97, taxasPlataforma: 15120, imposto: 11650, cpv: 71500, lucroLiquido: 7669.97, margemLiquida: 7.23, pedidos: 1530 },
            { plataforma: "Venda Externa", faturamentoBruto: 30000.00, taxasPlataforma: 4289.91, imposto: 3300, cpv: 20331.01, lucroLiquido: 2075.68, margemLiquida: 6.91, pedidos: 446 }
          ],
          topProdutosCurvaABC: [
            { sku: "2LB05", produto: "Creme Facial Anti-olheira", marca: "La Belle Paris", plataforma: "Shopee RAFA", quantidadeVendida: 320, faturamentoBruto: 125000.00, lucroLiquido: 9800.00, margemLiquida: 7.84, estoqueAtual: 150, leadTime: 15, vendaDiaria: 10.6, diasDeEstoque: 14, sugestaoCompra: 327 },
            { sku: "SÉRUM-VITC", produto: "Sérum Facial Vitamina C 30ml", marca: "La Belle Paris", plataforma: "Mercado Livre", quantidadeVendida: 240, faturamentoBruto: 98000.00, lucroLiquido: 8330.00, margemLiquida: 8.50, estoqueAtual: 400, leadTime: 15, vendaDiaria: 8, diasDeEstoque: 50, sugestaoCompra: 0 }
          ]
        };
        localCache.current[competencia] = mockData;
        setData(mockData);
      }
    } catch (err) {
      setError("Erro na conexão com a API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(selectedCompetencia); }, [selectedCompetencia]);

  const competenciasList = useMemo(() => data?.metadados?.competenciasDisponiveis || HISTORICO_12_MESES.map(h => h.mes), [data]);

  // 1. HISTÓRICO FILTRADO (O Gráfico agora reage ao Filtro Global)
  const listaHistorico = useMemo(() => {
    const histOriginal = data?.historicoMensal || HISTORICO_12_MESES;
    
    return histOriginal.map(m => {
      let fat = 0, luc = 0, cpv = 0, taxas = 0, impostos = 0, pedidos = 0;
      
      if (channelFilter === 'todos') {
        fat = m.faturamento; luc = m.lucro;
        cpv = m.cpv || 0; taxas = m.taxas || 0; impostos = m.impostos || 0; pedidos = m.pedidos || 0;
      } else if (channelFilter === 'online') {
        fat = (m.shopee || 0) + (m.meli || 0);
        const prop = m.faturamento > 0 ? fat / m.faturamento : 0;
        luc = (m.lucro || 0) * prop; cpv = (m.cpv || 0) * prop; taxas = (m.taxas || 0) * prop; impostos = (m.impostos || 0) * prop; pedidos = (m.pedidos || 0) * prop;
      } else if (channelFilter === 'externa') {
        fat = (m.externa || 0);
        const prop = m.faturamento > 0 ? fat / m.faturamento : 0;
        luc = (m.lucro || 0) * prop; cpv = (m.cpv || 0) * prop; taxas = (m.taxas || 0) * prop; impostos = (m.impostos || 0) * prop; pedidos = (m.pedidos || 0) * prop;
      }
      
      return { ...m, faturamento: fat, lucro: luc, cpv, taxas, impostos, pedidos };
    });
  }, [data, channelFilter]);

  // 2. DRE Filtrada por Canal
  const dreExibida = useMemo(() => {
    const lista = data?.drePorPlataforma || [];
    const numMeses = viewMode === 'consolidado' ? (listaHistorico.length || 1) : 1;
    
    let mapPlat = {};
    lista.forEach(pBase => {
      const isOnline = pBase.plataforma.includes('Shopee') || pBase.plataforma.includes('Mercado Livre');
      const isExterna = pBase.plataforma.includes('Externa');
      
      if (channelFilter === 'online' && !isOnline) return;
      if (channelFilter === 'externa' && !isExterna) return;

      mapPlat[pBase.plataforma] = {
        plataforma: pBase.plataforma,
        faturamentoBruto: (pBase.faturamentoBruto || 0) * numMeses,
        lucroLiquido: (pBase.lucroLiquido || 0) * numMeses,
        taxasPlataforma: (pBase.taxasPlataforma || 0) * numMeses,
        imposto: (pBase.imposto || 0) * numMeses,
        cpv: (pBase.cpv || 0) * numMeses,
        pedidos: (pBase.pedidos || 0) * numMeses,
      };
      mapPlat[pBase.plataforma].margemLiquida = mapPlat[pBase.plataforma].faturamentoBruto > 0 
        ? (mapPlat[pBase.plataforma].lucroLiquido / mapPlat[pBase.plataforma].faturamentoBruto) * 100 
        : 0;
    });

    return Object.values(mapPlat);
  }, [viewMode, data, listaHistorico, channelFilter]);

  // 3. KPIs Dinâmicos (Soma Real Matemática para o Botão "Total")
  const kpisExibidos = useMemo(() => {
    let faturamentoBruto = 0, lucroLiquido = 0, totalTaxas = 0, totalImpostos = 0, totalCpv = 0, totalPedidos = 0;
    
    if (viewMode === 'consolidado') {
      // Soma real de todos os meses do histórico filtrado
      listaHistorico.forEach(m => {
        faturamentoBruto += m.faturamento || 0;
        lucroLiquido += m.lucro || 0;
        totalTaxas += m.taxas || 0;
        totalImpostos += m.impostos || 0;
        totalCpv += m.cpv || 0;
        totalPedidos += m.pedidos || 0;
      });
    } else {
      // Soma apenas do mês atual filtrado
      dreExibida.forEach(p => {
        faturamentoBruto += p.faturamentoBruto; lucroLiquido += p.lucroLiquido;
        totalTaxas += p.taxasPlataforma; totalImpostos += p.imposto;
        totalCpv += p.cpv; totalPedidos += p.pedidos;
      });
    }

    const margemLiquidaMedia = faturamentoBruto > 0 ? (lucroLiquido / faturamentoBruto) * 100 : 0;

    return { faturamentoBruto, lucroLiquido, margemLiquidaMedia, totalTaxas, totalImpostos, totalCpv, totalPedidos };
  }, [dreExibida, viewMode, listaHistorico]);

  const deducoesTotais = useMemo(() => {
    const { totalCpv = 0, totalTaxas = 0, totalImpostos = 0, faturamentoBruto = 1 } = kpisExibidos;
    return {
      total: totalCpv + totalTaxas + totalImpostos,
      cpvPerc: (totalCpv / faturamentoBruto) * 100,
      taxasPerc: (totalTaxas / faturamentoBruto) * 100,
      impostosPerc: (totalImpostos / faturamentoBruto) * 100
    };
  }, [kpisExibidos]);

  const produtosFiltradosGlobais = useMemo(() => {
    const produtos = data?.topProdutosCurvaABC || [];
    return produtos.filter(p => {
      const isOnline = p.plataforma.includes('Shopee') || p.plataforma.includes('Mercado Livre');
      const isExterna = p.plataforma.includes('Externa');
      if (channelFilter === 'online' && !isOnline) return false;
      if (channelFilter === 'externa' && !isExterna) return false;
      return true;
    });
  }, [data, channelFilter]);

  const produtosPorPlataforma = useMemo(() => {
    const agrupado = {};
    produtosFiltradosGlobais.forEach(p => {
      const plat = p.plataforma || "Desconhecida";
      if (!agrupado[plat]) agrupado[plat] = [];
      agrupado[plat].push(p);
    });
    return agrupado;
  }, [produtosFiltradosGlobais]);

  return {
    apiUrl, setApiUrl, selectedCompetencia, setSelectedCompetencia, viewMode, setViewMode,
    channelFilter, setChannelFilter, data, loading, error, fetchData, listaHistorico,
    competenciasList, kpisExibidos, deducoesTotais, dreExibida, produtosFiltradosGlobais, produtosPorPlataforma
  };
}