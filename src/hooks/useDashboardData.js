import { useState, useEffect, useRef, useMemo } from 'react';

// Mock atualizado com os novos campos para funcionar sem internet
const HISTORICO_12_MESES = [
  { mes: "05/2025", faturamento: 180000, lucro: 14400, margem: 8.00, shopee: 100000, meli: 60000, externa: 20000, cpv: 100000, taxas: 25000, impostos: 19800, pedidos: 2500, lojas: {"Shopee RAFA": 80000, "Mercado Livre LCMED": 80000, "Venda Externa": 20000} },
  { mes: "06/2025", faturamento: 195000, lucro: 16575, margem: 8.50, shopee: 110000, meli: 65000, externa: 20000, cpv: 110000, taxas: 27000, impostos: 21450, pedidos: 2700, lojas: {"Shopee RAFA": 90000, "Mercado Livre LCMED": 85000, "Venda Externa": 20000} },
  { mes: "07/2025", faturamento: 205000, lucro: 18040, margem: 8.80, shopee: 115000, meli: 68000, externa: 22000, cpv: 115000, taxas: 28000, impostos: 22550, pedidos: 2850, lojas: {"Shopee RAFA": 95000, "Mercado Livre LCMED": 88000, "Venda Externa": 22000} },
  { mes: "08/2025", faturamento: 220000, lucro: 19800, margem: 9.00, shopee: 125000, meli: 70000, externa: 25000, cpv: 125000, taxas: 30000, impostos: 24200, pedidos: 3000, lojas: {"Shopee RAFA": 100000, "Mercado Livre LCMED": 95000, "Venda Externa": 25000} },
  { mes: "09/2025", faturamento: 215000, lucro: 18705, margem: 8.70, shopee: 120000, meli: 70000, externa: 25000, cpv: 122000, taxas: 29000, impostos: 23650, pedidos: 2950, lojas: {"Shopee RAFA": 95000, "Mercado Livre LCMED": 95000, "Venda Externa": 25000} },
  { mes: "10/2025", faturamento: 230000, lucro: 20470, margem: 8.90, shopee: 130000, meli: 75000, externa: 25000, cpv: 130000, taxas: 31000, impostos: 25300, pedidos: 3100, lojas: {"Shopee RAFA": 105000, "Mercado Livre LCMED": 100000, "Venda Externa": 25000} },
  { mes: "11/2025", faturamento: 260000, lucro: 23920, margem: 9.20, shopee: 145000, meli: 85000, externa: 30000, cpv: 145000, taxas: 35000, impostos: 28600, pedidos: 3500, lojas: {"Shopee RAFA": 120000, "Mercado Livre LCMED": 110000, "Venda Externa": 30000} },
  { mes: "12/2025", faturamento: 310000, lucro: 29450, margem: 9.50, shopee: 170000, meli: 105000, externa: 35000, cpv: 170000, taxas: 42000, impostos: 34100, pedidos: 4200, lojas: {"Shopee RAFA": 140000, "Mercado Livre LCMED": 135000, "Venda Externa": 35000} },
  { mes: "01/2026", faturamento: 210000, lucro: 18500, margem: 8.81, shopee: 115000, meli: 70000, externa: 25000, cpv: 118000, taxas: 28000, impostos: 23100, pedidos: 2900, lojas: {"Shopee RAFA": 95000, "Mercado Livre LCMED": 90000, "Venda Externa": 25000} },
  { mes: "02/2026", faturamento: 245000, lucro: 22100, margem: 9.02, shopee: 135000, meli: 82000, externa: 28000, cpv: 138000, taxas: 33000, impostos: 26950, pedidos: 3300, lojas: {"Shopee RAFA": 110000, "Mercado Livre LCMED": 107000, "Venda Externa": 28000} },
  { mes: "03/2026", faturamento: 280000, lucro: 24760, margem: 8.84, shopee: 155000, meli: 95000, externa: 30000, cpv: 158000, taxas: 38000, impostos: 30800, pedidos: 3800, lojas: {"Shopee RAFA": 125000, "Mercado Livre LCMED": 125000, "Venda Externa": 30000} },
  { mes: "04/2026", faturamento: 300939.97, lucro: 21545.65, margem: 7.16, shopee: 165000, meli: 105939.97, externa: 30000, cpv: 203331.01, taxas: 42959.91, impostos: 33100, pedidos: 4386, lojas: {"Shopee RAFA": 142796.36, "Mercado Livre LCMED": 101451.75, "Venda Externa": 56691.86} }
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
        const response = await fetch(`${cleanUrl}?competencia=${encodeURIComponent(competencia)}`, {
          method: 'GET',
          redirect: 'follow'
        });
        if (!response.ok) throw new Error(`HTTP Error`);
        const parsedJson = await response.json();
        localCache.current[competencia] = parsedJson;
        setData(parsedJson);
      } else {
        await new Promise((res) => setTimeout(res, 200));
        const mockData = {
          metadados: { competenciaAtual: competencia, competenciasDisponiveis: HISTORICO_12_MESES.map(h => h.mes) },
          historicoMensal: HISTORICO_12_MESES,
          // MOCK ATUALIZADO: Inclusão do custosFixos simulando o valor do OPEX
          kpisGerais: { faturamentoBruto: 300939.97, totalTaxas: 42959.91, totalImpostos: 33100.00, totalCpv: 203331.01, lucroLiquido: 21545.65, margemLiquidaMedia: 7.16, totalPedidos: 4386, custosFixos: 6500.00 },
          drePorPlataforma: [
            { plataforma: "Shopee RAFA", faturamentoBruto: 142796.36, taxasPlataforma: 26091.30, imposto: 15707.60, cpv: 86630.72, lucroLiquido: 14366.74, margemLiquida: 10.06, pedidos: 1897 },
            { plataforma: "Mercado Livre LCMED", faturamentoBruto: 101451.75, taxasPlataforma: 27560.25, imposto: 11159.69, cpv: 53217.17, lucroLiquido: 9514.64, margemLiquida: 9.38, pedidos: 1036 },
            { plataforma: "Venda Externa", faturamentoBruto: 56691.86, taxasPlataforma: 0, imposto: 6236.10, cpv: 43397.43, lucroLiquido: 7058.33, margemLiquida: 12.45, pedidos: 691 }
          ],
          topProdutosCurvaABC: [
            { sku: "2LB05", produto: "Creme Facial Anti-olheira", marca: "La Belle Paris", plataforma: "Shopee RAFA", quantidadeVendida: 320, faturamentoBruto: 125000.00, lucroLiquido: 9800.00, margemLiquida: 7.84, estoqueAtual: 150, leadTime: 15, vendaDiaria: 10.6, diasDeEstoque: 14, sugestaoCompra: 327 },
            { sku: "SÉRUM-VITC", produto: "Sérum Facial Vitamina C", marca: "La Belle Paris", plataforma: "Mercado Livre LCMED", quantidadeVendida: 0, faturamentoBruto: 0, lucroLiquido: 0, margemLiquida: 0, estoqueAtual: 400, leadTime: 15, vendaDiaria: 0, diasDeEstoque: 999, sugestaoCompra: 0 }
          ],
          produtosPorPlataforma: {
            "Shopee RAFA": [
              { sku: "2LB05", produto: "Creme Facial Anti-olheira", marca: "La Belle Paris", quantidadeVendida: 320, faturamentoBruto: 125000.00, lucroLiquido: 9800.00, margemLiquida: 7.84 }
            ]
          }
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

  // 1. HISTÓRICO FILTRADO (Gráfico)
  const listaHistorico = useMemo(() => {
    const histOriginal = data?.historicoMensal || HISTORICO_12_MESES;
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
        lucroLiquido: pBase.lucroLiquido || 0, // <-- Essa é a Margem de Contribuição do canal
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

  // 3. KPIs GERAIS (INCLUINDO CUSTO FIXO)
  const kpisExibidos = useMemo(() => {
    let faturamentoBruto = 0, lucroLiquido = 0, totalTaxas = 0, totalImpostos = 0, totalCpv = 0, totalPedidos = 0;
    
    dreExibida.forEach(p => {
      faturamentoBruto += p.faturamentoBruto; 
      lucroLiquido += p.lucroLiquido; // Soma das Margens de Contribuição
      totalTaxas += p.taxasPlataforma; totalImpostos += p.imposto;
      totalCpv += p.cpv; totalPedidos += p.pedidos;
    });

    const margemLiquidaMedia = faturamentoBruto > 0 ? (lucroLiquido / faturamentoBruto) * 100 : 0;

    let variacaoFat = 0, variacaoLucro = 0;
    if (viewMode === 'mensal' && listaHistorico.length > 1) {
      const idxAtual = listaHistorico.findIndex(h => h.mes === selectedCompetencia);
      if (idxAtual > 0) {
        const mesAnterior = listaHistorico[idxAtual - 1];
        if (mesAnterior.faturamento > 0) variacaoFat = ((faturamentoBruto - mesAnterior.faturamento) / mesAnterior.faturamento) * 100;
        if (mesAnterior.lucro > 0) variacaoLucro = ((lucroLiquido - mesAnterior.lucro) / mesAnterior.lucro) * 100;
      }
    }

    // LÓGICA DO OPEX: Se for "consolidado", multiplica o custo fixo do mês pela quantidade de meses ativos.
    const mesesAtivos = listaHistorico.filter(m => m.faturamento > 0).length;
    const baseCustosFixos = data?.kpisGerais?.custosFixos || 0;
    const custosFixos = viewMode === 'consolidado' ? (baseCustosFixos * Math.max(mesesAtivos, 1)) : baseCustosFixos;

    return { 
      faturamentoBruto, 
      lucroLiquido, 
      margemLiquidaMedia, 
      totalTaxas, 
      totalImpostos, 
      totalCpv, 
      totalPedidos, 
      variacaoFat, 
      variacaoLucro,
      custosFixos // <--- Campo adicionado para a Visão Geral
    };
  }, [dreExibida, viewMode, listaHistorico, selectedCompetencia, data]);

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
    globais.forEach(p => {
      map[p.sku] = { ...p, quantidadeVendida: 0, faturamentoBruto: 0, lucroLiquido: 0 };
    });

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
        ...p,
        margemLiquida: margem,
        vendaDiaria: Number(vendaDiaria.toFixed(2)),
        diasDeEstoque: Math.round(diasDeEstoque),
        sugestaoCompra: sugestaoCompra
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