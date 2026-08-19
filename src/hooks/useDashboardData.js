import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';

// Auxiliar de arredondamento
function round2(val) {
  return Math.round((Number(val) || 0) * 100) / 100;
}

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCompetencia, setSelectedCompetencia] = useState('');
  const [viewMode, setViewMode] = useState('mensal'); 
  const [channelFilter, setChannelFilter] = useState('todos'); 

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        { data: vendas, error: errVendas },
        { data: produtos, error: errProdutos },
        { data: kits, error: errKits },
        { data: custosFixos, error: errCustos }
      ] = await Promise.all([
        supabase.from('vendas').select('*').limit(2000),
        supabase.from('produtos').select('*'),
        supabase.from('kits').select('*'),
        supabase.from('custos_fixos').select('*')
      ]);

      if (errVendas) throw errVendas;
      if (errProdutos) throw errProdutos;
      if (errKits) throw errKits;
      if (errCustos) throw errCustos;

      const competenciasSet = new Set(
        (vendas || [])
          .map(v => v?.competencia?.trim())
          .filter(c => c && c !== 'N/A' && c !== '')
      );
      
      const competenciasDisponiveis = Array.from(competenciasSet).sort((a, b) => {
        const [mA, yA] = a.split('/').map(Number);
        const [mB, yB] = b.split('/').map(Number);
        return yA !== yB ? yA - yB : mA - mB;
      });

      const compAtual = selectedCompetencia || (competenciasDisponiveis.length > 0 ? competenciasDisponiveis[competenciasDisponiveis.length - 1] : '');
      if (!selectedCompetencia && compAtual) {
        setSelectedCompetencia(compAtual);
      }

      const historicoMap = {};
      const dreMapMensal = {};
      const dreMapConsolidado = {};
      
      const produtosMapMensal = {};
      const produtosMapConsolidado = {};

      const produtosDict = {};
      (produtos || []).forEach(p => {
        produtosDict[p.sku] = p;
      });

      const kitsDict = {};
      (kits || []).forEach(k => {
        if (!kitsDict[k.sku_kit]) kitsDict[k.sku_kit] = [];
        kitsDict[k.sku_kit].push(k);
      });

      // NOVO: Estrutura base de um produto para guardar o histórico por Canal
      const initProd = (sku, pInfo, custoProdUnit) => ({
        sku, produto: pInfo.nome, marca: pInfo.marca,
        custoUnitario: Number(pInfo.custo_unitario) || custoProdUnit || 0,
        estoqueAtual: Number(pInfo.estoque_atual) || 0,
        leadTime: Number(pInfo.lead_time) || 15,
        quantidadeVendida: 0, faturamentoBruto: 0, lucroLiquido: 0,
        canais: {
          online: { quantidadeVendida: 0, faturamentoBruto: 0, lucroLiquido: 0 },
          externa: { quantidadeVendida: 0, faturamentoBruto: 0, lucroLiquido: 0 },
          outros: { quantidadeVendida: 0, faturamentoBruto: 0, lucroLiquido: 0 }
        }
      });

      (vendas || []).forEach(v => {
        const comp = v.competencia;
        if (!comp || comp === 'N/A') return;

        const plat = v.plataforma || 'Outros';
        const fatBruto = Number(v.faturamento_bruto) || 0;
        const taxas = Number(v.taxas_plataforma) || 0;
        const imposto = Number(v.imposto) || 0;
        const embalagem = Number(v.custo_embalagem) || 0;
        const qtd = Number(v.quantidade) || 1;

        const isOnline = plat.toLowerCase().includes('shopee') || plat.toLowerCase().includes('mercado livre') || plat.toLowerCase().includes('meli');
        const isExterna = plat.toLowerCase().includes('externa');
        const canalKey = isOnline ? 'online' : (isExterna ? 'externa' : 'outros');

        let custoProdUnit = 0;
        if (kitsDict[v.sku]) {
          custoProdUnit = kitsDict[v.sku].reduce((acc, comp) => {
            const pComp = produtosDict[comp.sku_componente];
            return acc + ((pComp ? Number(pComp.custo_unitario) : 0) * Number(comp.quantidade_componente));
          }, 0);
        } else {
          const p = produtosDict[v.sku];
          custoProdUnit = p ? Number(p.custo_unitario) : 0;
        }

        const cpvTotal = (custoProdUnit * qtd) + embalagem;
        const lucroMargem = fatBruto - taxas - imposto - cpvTotal;

        if (!historicoMap[comp]) {
          historicoMap[comp] = { faturamento: 0, lucro: 0, cpv: 0, taxas: 0, impostos: 0, pedidos: 0, lojas: {} };
        }
        historicoMap[comp].faturamento += fatBruto;
        historicoMap[comp].lucro += lucroMargem; 
        historicoMap[comp].cpv += cpvTotal;
        historicoMap[comp].taxas += taxas;
        historicoMap[comp].impostos += imposto;
        historicoMap[comp].pedidos += 1;
        historicoMap[comp].lojas[plat] = (historicoMap[comp].lojas[plat] || 0) + fatBruto;

        if (!dreMapConsolidado[plat]) {
          dreMapConsolidado[plat] = { plataforma: plat, faturamentoBruto: 0, taxasPlataforma: 0, imposto: 0, cpv: 0, lucroLiquido: 0, pedidos: 0 };
        }
        dreMapConsolidado[plat].faturamentoBruto += fatBruto;
        dreMapConsolidado[plat].taxasPlataforma += taxas;
        dreMapConsolidado[plat].imposto += imposto;
        dreMapConsolidado[plat].cpv += cpvTotal;
        dreMapConsolidado[plat].lucroLiquido += lucroMargem;
        dreMapConsolidado[plat].pedidos += 1;

        if (comp === compAtual) {
          if (!dreMapMensal[plat]) {
            dreMapMensal[plat] = { plataforma: plat, faturamentoBruto: 0, taxasPlataforma: 0, imposto: 0, cpv: 0, lucroLiquido: 0, pedidos: 0 };
          }
          dreMapMensal[plat].faturamentoBruto += fatBruto;
          dreMapMensal[plat].taxasPlataforma += taxas;
          dreMapMensal[plat].imposto += imposto;
          dreMapMensal[plat].cpv += cpvTotal;
          dreMapMensal[plat].lucroLiquido += lucroMargem;
          dreMapMensal[plat].pedidos += 1;
        }

        const skuProd = v.sku;
        const prodInfo = produtosDict[skuProd] || { nome: 'Sem Nome', marca: 'N/A' };

        // Agregação de Produtos Global e por Canal (Consolidado)
        if (!produtosMapConsolidado[skuProd]) {
          produtosMapConsolidado[skuProd] = initProd(skuProd, prodInfo, custoProdUnit);
        }
        produtosMapConsolidado[skuProd].quantidadeVendida += qtd;
        produtosMapConsolidado[skuProd].faturamentoBruto += fatBruto;
        produtosMapConsolidado[skuProd].lucroLiquido += lucroMargem;
        produtosMapConsolidado[skuProd].canais[canalKey].quantidadeVendida += qtd;
        produtosMapConsolidado[skuProd].canais[canalKey].faturamentoBruto += fatBruto;
        produtosMapConsolidado[skuProd].canais[canalKey].lucroLiquido += lucroMargem;

        // Agregação de Produtos Global e por Canal (Mensal)
        if (comp === compAtual) {
          if (!produtosMapMensal[skuProd]) {
            produtosMapMensal[skuProd] = initProd(skuProd, prodInfo, custoProdUnit);
          }
          produtosMapMensal[skuProd].quantidadeVendida += qtd;
          produtosMapMensal[skuProd].faturamentoBruto += fatBruto;
          produtosMapMensal[skuProd].lucroLiquido += lucroMargem;
          produtosMapMensal[skuProd].canais[canalKey].quantidadeVendida += qtd;
          produtosMapMensal[skuProd].canais[canalKey].faturamentoBruto += fatBruto;
          produtosMapMensal[skuProd].canais[canalKey].lucroLiquido += lucroMargem;
        }
      });

      (produtos || []).forEach(p => {
        if (!produtosMapConsolidado[p.sku]) produtosMapConsolidado[p.sku] = initProd(p.sku, p, p.custo_unitario);
        if (compAtual && !produtosMapMensal[p.sku]) produtosMapMensal[p.sku] = initProd(p.sku, p, p.custo_unitario);
      });

      const opexHistoricoMap = {};
      const opexDetalhamentoMes = [];
      let custosFixosMesAtual = 0;

      (custosFixos || []).forEach(c => {
        const val = Number(c.valor) || 0;
        if (!opexHistoricoMap[c.competencia]) opexHistoricoMap[c.competencia] = 0;
        opexHistoricoMap[c.competencia] += val;

        if (c.competencia === compAtual) {
          custosFixosMesAtual += val;
          opexDetalhamentoMes.push({ categoria: c.categoria, valor: val });
        }
      });

      opexDetalhamentoMes.sort((a, b) => b.valor - a.valor);

      const historicoMensalArr = competenciasDisponiveis.map(m => {
        const h = historicoMap[m] || { faturamento: 0, lucro: 0, cpv: 0, taxas: 0, impostos: 0, pedidos: 0, lojas: {} };
        const opexM = opexHistoricoMap[m] || 0;
        const margem = h.faturamento > 0 ? ((h.lucro - opexM) / h.faturamento) * 100 : 0;
        return {
          mes: m, faturamento: round2(h.faturamento), lucro: round2(h.lucro - opexM), 
          opex: round2(opexM), margem: round2(margem), cpv: round2(h.cpv),
          taxas: round2(h.taxas), impostos: round2(h.impostos), pedidos: h.pedidos, lojas: h.lojas
        };
      });

      const kpisM = historicoMap[compAtual] || { faturamento: 0, lucro: 0, cpv: 0, taxas: 0, impostos: 0, pedidos: 0 };
      const margemContrib = kpisM.lucro;
      const ebitda = margemContrib - custosFixosMesAtual;
      const margemEbitdaPct = kpisM.faturamento > 0 ? (ebitda / kpisM.faturamento) * 100 : 0;

      const formatDRE = (mapa) => Object.values(mapa).map(item => ({
        ...item,
        faturamentoBruto: round2(item.faturamentoBruto),
        taxasPlataforma: round2(item.taxasPlataforma),
        imposto: round2(item.imposto),
        cpv: round2(item.cpv),
        lucroLiquido: round2(item.lucroLiquido),
        margemLiquida: round2(item.faturamentoBruto > 0 ? (item.lucroLiquido / item.faturamentoBruto) * 100 : 0)
      })).sort((a, b) => b.faturamentoBruto - a.faturamentoBruto);

      setData({
        metadados: { competenciaAtual: compAtual, competenciasDisponiveis, ultimaAtualizacao: new Date().toISOString() },
        historicoMensal: historicoMensalArr,
        kpisGerais: {
          faturamentoBruto: round2(kpisM.faturamento), totalTaxas: round2(kpisM.taxas), totalImpostos: round2(kpisM.impostos),
          totalCpv: round2(kpisM.cpv), margemContribucion: round2(margemContrib), custosFixos: round2(custosFixosMesAtual),
          detalhamentoOpex: opexDetalhamentoMes, lucroLiquido: round2(ebitda), margemLiquidaMedia: round2(margemEbitdaPct), totalPedidos: kpisM.pedidos
        },
        drePorPlataforma: formatDRE(dreMapMensal),
        drePorPlataformaConsolidado: formatDRE(dreMapConsolidado),
        rawProdutosMensal: Object.values(produtosMapMensal),
        rawProdutosConsolidado: Object.values(produtosMapConsolidado)
      });

    } catch (err) {
      console.error("Erro ao carregar dados do Supabase:", err);
      setError("Falha ao carregar dados: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCompetencia]);

  const listaHistorico = useMemo(() => {
    const hist = data?.historicoMensal || [];
    return hist.map(m => {
      let fat = 0; let lojasF = {};
      Object.keys(m.lojas || {}).forEach(loja => {
        const isOnline = loja.toLowerCase().includes('shopee') || loja.toLowerCase().includes('mercado livre') || loja.toLowerCase().includes('meli');
        const isExterna = loja.toLowerCase().includes('externa');
        if (channelFilter === 'todos' || (channelFilter === 'online' && isOnline) || (channelFilter === 'externa' && isExterna)) {
          lojasF[loja] = m.lojas[loja]; fat += m.lojas[loja];
        }
      });
      const prop = m.faturamento > 0 ? fat / m.faturamento : 0;
      const opexF = channelFilter === 'todos' ? (m.opex || 0) : 0;
      const lucroF = channelFilter === 'todos' ? (m.lucro || 0) : (m.lucro + (m.opex || 0)) * prop;

      return { ...m, faturamento: fat, lucro: lucroF, opex: opexF, lojas: lojasF };
    });
  }, [data, channelFilter]);

  const dreExibida = useMemo(() => {
    const listaDRE = viewMode === 'mensal' ? (data?.drePorPlataforma || []) : (data?.drePorPlataformaConsolidado || []);
    return listaDRE.filter(p => {
      const isOnline = p.plataforma.toLowerCase().includes('shopee') || p.plataforma.toLowerCase().includes('mercado livre') || p.plataforma.toLowerCase().includes('meli');
      const isExterna = p.plataforma.toLowerCase().includes('externa');
      if (channelFilter === 'todos') return true;
      if (channelFilter === 'online') return isOnline;
      if (channelFilter === 'externa') return isExterna;
      return true;
    });
  }, [data, viewMode, channelFilter]);

  // NOVO: Processamento de Produtos 100% Dinâmico por Canal
  const produtosExibidos = useMemo(() => {
    const baseList = viewMode === 'mensal' ? (data?.rawProdutosMensal || []) : (data?.rawProdutosConsolidado || []);
    const diasPeriodo = viewMode === 'mensal' ? 30 : Math.max(data?.metadados?.competenciasDisponiveis?.length || 1, 1) * 30;

    return baseList.map(p => {
      let fat = 0, lucro = 0, qtd = 0;
      
      if (channelFilter === 'todos') {
        fat = p.faturamentoBruto; lucro = p.lucroLiquido; qtd = p.quantidadeVendida;
      } else {
        fat = p.canais[channelFilter]?.faturamentoBruto || 0;
        lucro = p.canais[channelFilter]?.lucroLiquido || 0;
        qtd = p.canais[channelFilter]?.quantidadeVendida || 0;
      }

      const margem = fat > 0 ? (lucro / fat) * 100 : 0;
      const vendaDiaria = qtd / diasPeriodo;
      const diasDeEstoque = vendaDiaria > 0 ? (p.estoqueAtual / vendaDiaria) : 999;
      let sugestaoCompra = 0;
      if (diasDeEstoque < (p.leadTime + 7)) {
        sugestaoCompra = Math.max(0, Math.ceil((vendaDiaria * (30 + p.leadTime)) - p.estoqueAtual));
      }

      return {
        ...p,
        quantidadeVendida: qtd,
        faturamentoBruto: round2(fat),
        lucroLiquido: round2(lucro),
        margemLiquida: round2(margem),
        custoUnitario: round2(p.custoUnitario),
        vendaDiaria: round2(vendaDiaria),
        diasDeEstoque: Math.round(diasDeEstoque),
        sugestaoCompra
      };
    }).sort((a, b) => b.faturamentoBruto - a.faturamentoBruto);
  }, [data, viewMode, channelFilter]);

  const kpisExibidos = useMemo(() => {
    let faturamentoBruto = 0, lucroLiquido = 0, totalTaxas = 0, totalImpostos = 0, totalCpv = 0, totalPedidos = 0;

    if (channelFilter === 'todos') {
      if (viewMode === 'mensal' && data?.kpisGerais) {
        faturamentoBruto = data.kpisGerais.faturamentoBruto || 0;
        lucroLiquido = data.kpisGerais.margemContribucion || 0; 
        totalTaxas = data.kpisGerais.totalTaxas || 0;
        totalImpostos = data.kpisGerais.totalImpostos || 0;
        totalCpv = data.kpisGerais.totalCpv || 0;
        totalPedidos = data.kpisGerais.totalPedidos || 0;
      } else if (viewMode === 'consolidado') {
        listaHistorico.forEach(m => {
          faturamentoBruto += m.faturamento || 0;
          lucroLiquido += (m.lucro + (m.opex || 0)) || 0; 
          totalTaxas += m.taxas || 0;
          totalImpostos += m.impostos || 0;
          totalCpv += m.cpv || 0;
          totalPedidos += m.pedidos || 0;
        });
      }
    } else {
      dreExibida.forEach(p => {
        faturamentoBruto += p.faturamentoBruto;
        lucroLiquido += p.lucroLiquido; 
        totalTaxas += p.taxasPlataforma;
        totalImpostos += p.imposto;
        totalCpv += p.cpv;
        totalPedidos += p.pedidos;
      });
    }

    const margemLiquidaMedia = faturamentoBruto > 0 ? (lucroLiquido / faturamentoBruto) * 100 : 0;
    const baseCustosFixos = data?.kpisGerais?.custosFixos || 0;
    const mesesAtivos = listaHistorico.filter(m => m.faturamento > 0).length;
    const custosFixos = viewMode === 'consolidado' ? (baseCustosFixos * Math.max(mesesAtivos, 1)) : baseCustosFixos;
    const detalhamentoOpex = (channelFilter === 'todos' && viewMode === 'mensal') ? (data?.kpisGerais?.detalhamentoOpex || []) : [];

    return {
      faturamentoBruto, lucroLiquido, margemLiquidaMedia, totalTaxas,
      totalImpostos, totalCpv, totalPedidos, custosFixos, detalhamentoOpex
    };
  }, [dreExibida, viewMode, listaHistorico, data, channelFilter]);

  return {
    data,
    loading,
    error,
    selectedCompetencia,
    setSelectedCompetencia,
    viewMode,
    setViewMode,
    channelFilter,
    setChannelFilter,
    listaHistorico,
    dreExibida,
    produtosExibidos,
    produtosFiltradosGlobais: produtosExibidos,
    competenciasList: data?.metadados?.competenciasDisponiveis || [],
    kpisExibidos,
    deducoesTotais: (kpisExibidos.totalTaxas || 0) + (kpisExibidos.totalImpostos || 0),
    fetchData,
    refetch: fetchData
  };
}