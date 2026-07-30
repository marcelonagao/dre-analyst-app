import { useState, useEffect, useRef, useMemo } from 'react';

const HISTORICO_12_MESES = [
  { mes: "05/2025", faturamento: 180000.00, lucro: 14400.00, margem: 8.00, shopee: 100000, meli: 60000, externa: 20000 },
  { mes: "06/2025", faturamento: 195000.00, lucro: 16575.00, margem: 8.50, shopee: 110000, meli: 65000, externa: 20000 },
  { mes: "07/2025", faturamento: 205000.00, lucro: 18040.00, margem: 8.80, shopee: 115000, meli: 68000, externa: 22000 },
  { mes: "08/2025", faturamento: 220000.00, lucro: 19800.00, margem: 9.00, shopee: 125000, meli: 70000, externa: 25000 },
  { mes: "09/2025", faturamento: 215000.00, lucro: 18705.00, margem: 8.70, shopee: 120000, meli: 70000, externa: 25000 },
  { mes: "10/2025", faturamento: 230000.00, lucro: 20470.00, margem: 8.90, shopee: 130000, meli: 75000, externa: 25000 },
  { mes: "11/2025", faturamento: 260000.00, lucro: 23920.00, margem: 9.20, shopee: 145000, meli: 85000, externa: 30000 },
  { mes: "12/2025", faturamento: 310000.00, lucro: 29450.00, margem: 9.50, shopee: 170000, meli: 105000, externa: 35000 },
  { mes: "01/2026", faturamento: 210000.00, lucro: 18500.00, margem: 8.81, shopee: 115000, meli: 70000, externa: 25000 },
  { mes: "02/2026", faturamento: 245000.00, lucro: 22100.00, margem: 9.02, shopee: 135000, meli: 82000, externa: 28000 },
  { mes: "03/2026", faturamento: 280000.00, lucro: 24760.00, margem: 8.84, shopee: 155000, meli: 95000, externa: 30000 },
  { mes: "04/2026", faturamento: 300939.97, lucro: 21545.65, margem: 7.16, shopee: 165000, meli: 105939.97, externa: 30000 }
];

export function useDashboardData() {
  const [apiUrl, setApiUrl] = useState('');
  const [selectedCompetencia, setSelectedCompetencia] = useState('04/2026');
  const [viewMode, setViewMode] = useState('mensal'); // 'mensal' | 'consolidado'
  const [channelFilter, setChannelFilter] = useState('todos'); // 'todos' | 'online' | 'externa'
  
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

    setLoading(true);
    setError(null);
    const cleanUrl = apiUrl.trim();

    try {
      if (cleanUrl) {
        const fullUrl = `${cleanUrl}?competencia=${encodeURIComponent(competencia)}`;
        const response = await fetch(fullUrl, { method: 'GET', redirect: 'follow' });
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        const parsedJson = await response.json();
        
        localCache.current[competencia] = parsedJson;
        setData(parsedJson);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 200));
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
            { sku: "SÉRUM-VITC", produto: "Sérum Facial Vitamina C 30ml", marca: "La Belle Paris", plataforma: "Mercado Livre", quantidadeVendida: 240, faturamentoBruto: 98000.00, lucroLiquido: 8330.00, margemLiquida: 8.50, estoqueAtual: 400, leadTime: 15, vendaDiaria: 8, diasDeEstoque: 50, sugestaoCompra: 0 },
            { sku: "PROT-SPF50", produto: "Protetor Solar Toque Seco FPS 50", marca: "SunCare Pro", plataforma: "Mercado Livre", quantidadeVendida: 180, faturamentoBruto: 55000.00, lucroLiquido: 2475.00, margemLiquida: 4.50, estoqueAtual: 20, leadTime: 20, vendaDiaria: 6, diasDeEstoque: 3, sugestaoCompra: 280 },
            { sku: "BATOM-MATTE-01", produto: "Batom Matte Nude Rose", marca: "Glamour Makeup", plataforma: "Shopee RAFA", quantidadeVendida: 95, faturamentoBruto: 22939.97, lucroLiquido: 940.65, margemLiquida: 4.10, estoqueAtual: 0, leadTime: 10, vendaDiaria: 3.1, diasDeEstoque: 0, sugestaoCompra: 124 },
            { sku: "KIT-REV-01", produto: "Kit Revenda 50 Unidades Creme", marca: "La Belle Paris", plataforma: "Venda Externa", quantidadeVendida: 5, faturamentoBruto: 25000.00, lucroLiquido: 1500.00, margemLiquida: 6.00, estoqueAtual: 10, leadTime: 5, vendaDiaria: 0.5, diasDeEstoque: 20, sugestaoCompra: 5 }
          ]
        };
        localCache.current[competencia] = mockData;
        setData(mockData);
      }
    } catch (err) {
      console.error("Erro no fetch:", err);
      setError("Não foi possível conectar ao Google Apps Script.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedCompetencia);
  }, [selectedCompetencia]);

  const listaHistorico = useMemo(() => data?.historicoMensal || HISTORICO_12_MESES, [data]);
  const competenciasList = useMemo(() => data?.metadados?.competenciasDisponiveis || listaHistorico.map(h => h.mes), [data, listaHistorico]);

  // 1. DRE Filtrada por Canal
  const dreExibida = useMemo(() => {
    const lista = data?.drePorPlataforma || [];
    const numMeses = viewMode === 'consolidado' ? (listaHistorico.length || 1) : 1;
    
    let mapPlat = {};
    lista.forEach(pBase => {
      // Aplica o filtro Global
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

  // 2. KPIs Dinâmicos baseados na DRE Filtrada
  const kpisExibidos = useMemo(() => {
    let faturamentoBruto = 0, lucroLiquido = 0, totalTaxas = 0, totalImpostos = 0, totalCpv = 0, totalPedidos = 0;
    
    dreExibida.forEach(p => {
      faturamentoBruto += p.faturamentoBruto;
      lucroLiquido += p.lucroLiquido;
      totalTaxas += p.taxasPlataforma;
      totalImpostos += p.imposto;
      totalCpv += p.cpv;
      totalPedidos += p.pedidos;
    });

    const margemLiquidaMedia = faturamentoBruto > 0 ? (lucroLiquido / faturamentoBruto) * 100 : 0;

    return { faturamentoBruto, lucroLiquido, margemLiquidaMedia, totalTaxas, totalImpostos, totalCpv, totalPedidos };
  }, [dreExibida]);

  const deducoesTotais = useMemo(() => {
    const { totalCpv = 0, totalTaxas = 0, totalImpostos = 0, faturamentoBruto = 1 } = kpisExibidos;
    const total = totalCpv + totalTaxas + totalImpostos;
    return {
      total,
      cpvPerc: (totalCpv / faturamentoBruto) * 100,
      taxasPerc: (totalTaxas / faturamentoBruto) * 100,
      impostosPerc: (totalImpostos / faturamentoBruto) * 100
    };
  }, [kpisExibidos]);

  // 3. Produtos Filtrados por Canal
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
    apiUrl, setApiUrl,
    selectedCompetencia, setSelectedCompetencia,
    viewMode, setViewMode,
    channelFilter, setChannelFilter, // <-- Exportamos o controle do filtro
    data, loading, error,
    fetchData,
    listaHistorico,
    competenciasList,
    kpisExibidos,
    deducoesTotais,
    dreExibida,
    produtosFiltradosGlobais, // <-- Nova lista filtrada para ABC e Inteligência
    produtosPorPlataforma
  };
}