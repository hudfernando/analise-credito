// Caminho: app/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchDashboardSummary,
  fetchDistribuicaoClassificacao,
  fetchDistribuicaoSegmento,
  fetchTopClientesValor,
  fetchTopClientesRisco
} from '@/http/api'; // <-- Corrigi o caminho (estava @/http/api)
import { useFilterStore } from '@/store/use-filter-store';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';

import { DashboardSummaryView } from '@/components/dashboard/DashboardSummary';
import { GraficoDeDistribuicao } from '@/components/dashboard/GraficoDeDistribuicao';
import { ListaTopClientes } from '@/components/dashboard/ListaTopClientes';
import { LegendaInsights } from '@/components/documentacao/LegendaInsights';
import { PainelConfiguracoes } from '@/components/configuracao/PainelConfiguracoes';
import { Button } from '@/components/ui/button';
import { Settings, BarChartHorizontal, Search } from 'lucide-react';
import Link from 'next/link';
import { TabelaStatus } from '@/components/analise/tabela-resultados/TabelaStatus';
import { LineChart } from 'lucide-react'
import { FiltrosForm } from '@/components/analise/FiltrosForm';
import { CardOportunidadesGeral } from '@/components/dashboard/CardOportunidadesGeral';
import { CardOportunidadeOl } from '@/components/dashboard/CardOportunidadeOl';

export default function DashboardPage() {
  // --- CORREÇÃO v6.1 ---
  // 'filtros' (do store) são os filtros "rascunho" do formulário.
  const { filtros, setFiltros } = useFilterStore();

  // 'activeFilters' são os filtros que o usuário *buscou*. As queries dependem deste.
  const [activeFilters, setActiveFilters] = useState<AnaliseCreditoFiltros>(filtros);

  // 'isSearchActive' controla se a busca já foi feita
  const [isSearchActive, setIsSearchActive] = useState(false);

  // 'isSearching' controla o estado de loading do botão
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    // 1. "Commita" os filtros do formulário (store) para os filtros ativos da página
    setActiveFilters(filtros);
    // 2. Ativa o dashboard
    setIsSearchActive(true);
    // 3. (Opcional) Reseta a página da tabela de análise para 1
    setFiltros({ ...filtros, pagina: 1 });
  };
  // --- FIM DA CORREÇÃO ---

  // Query 1: Resumo do Dashboard
  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['dashboardSummary', activeFilters], // Depende de activeFilters
    queryFn: () => fetchDashboardSummary(activeFilters),
    enabled: isSearchActive, // Só roda se a busca for ativa
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Query 2: Gráfico de Classificação
  const { data: classificacaoData, isLoading: isLoadingClassificacao } = useQuery({
    queryKey: ['distribuicaoClassificacao', activeFilters], // Depende de activeFilters
    queryFn: () => fetchDistribuicaoClassificacao(activeFilters),
    enabled: isSearchActive,
    staleTime: 1000 * 60 * 5,
  });

  // Query 3: Gráfico de Segmento
  const { data: segmentoData, isLoading: isLoadingSegmento } = useQuery({
    queryKey: ['distribuicaoSegmento', activeFilters], // Depende de activeFilters
    queryFn: () => fetchDistribuicaoSegmento(activeFilters),
    enabled: isSearchActive,
    staleTime: 1000 * 60 * 5,
  });

  // Query 4: Top Clientes por Valor
  const { data: topValorData, isLoading: isLoadingTopValor } = useQuery({
    queryKey: ['topClientesValor', activeFilters], // Depende de activeFilters
    queryFn: () => fetchTopClientesValor(activeFilters),
    enabled: isSearchActive,
    staleTime: 1000 * 60 * 5,
  });

  // Query 5: Top Clientes por Risco
  const { data: topRiscoData, isLoading: isLoadingTopRisco } = useQuery({
    queryKey: ['topClientesRisco', activeFilters], // Depende de activeFilters
    queryFn: () => fetchTopClientesRisco(activeFilters),
    enabled: isSearchActive,
    staleTime: 1000 * 60 * 5,
  });

  // O isLoading agora é controlado pelas queries individuais
  const isLoading = (isLoadingSummary || isLoadingClassificacao || isLoadingSegmento || isLoadingTopValor || isLoadingTopRisco) && isSearchActive;

  // --- CORREÇÃO: Passando os filtros corretos para o link de Análise ---
  const createAnaliseUrl = () => {
    // Usa os filtros ATIVOS para construir o link
    const filtrosCorrigidos: Record<string, string> = {};
    for (const [key, value] of Object.entries(activeFilters)) {
      if (value !== undefined && value !== null) {
        // Converte 'classificacaoEstrelas' para 'ClassificacaoEstrelas' se existir
        const newKey = key === 'classificacaoEstrelas' ? 'ClassificacaoEstrelas' : key;
        filtrosCorrigidos[newKey] = String(value);
      }
    }

    const params = new URLSearchParams(filtrosCorrigidos);
    return `/analise?${params.toString()}`;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">


      <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Gerencial (Crédito)</h1>
        <div className="flex items-center space-x-2">

          {/* --- Link para Comercial --- */}
          <Button asChild variant="outline">
            <Link href="/comercial">
              <BarChartHorizontal className="mr-2 h-4 w-4" />
              Inteligência Comercial
            </Link>
          </Button>

          {/* --- ADIÇÃO: Link para a nova página S&OP (v5.0) --- */}
          <Button asChild variant="outline" size="sm">
            <Link href="/oportunidades">
              <LineChart className="mr-2 h-4 w-4" />
              Oportunidades S&OP
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm">
            <Link href="/visoes/regional">
              <LineChart className="mr-2 h-4 w-4" />
              Visões Estratégicas
            </Link>
          </Button>

          {/* --- ADIÇÃO CRÍTICA: Link para a Visão Unificada (v7.0) --- */}
          <Button asChild variant="default" size="sm">
            <Link href="/analise/unificada">
              <Settings className="mr-2 h-4 w-4" />
              Visão Unificada
            </Link>
          </Button>

          <LegendaInsights />
          <PainelConfiguracoes>
            <Button variant="outline" size="icon" aria-label="Configurações">
              <Settings className="h-4 w-4" />
            </Button>
          </PainelConfiguracoes>
        </div>
      </header>

      {/* --- FILTROS (CORRIGIDO) --- */}
      <FiltrosForm
        onSearch={handleSearch}
        isSearching={isLoading}
        showSopFilters={false} // Mantém os filtros de crédito
      />

      {/* --- ÁREA DE DESTAQUE: RADAR DE OPORTUNIDADES --- */}
        {/* Só mostramos se houver oportunidades carregadas */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <CardOportunidadesGeral filtros={activeFilters} />
        </div>

        {/* Cards de Resumo (Totais, Limites, Cobrança) */}
        <DashboardSummaryView summaryData={summaryData} isLoading={isLoading} />

      {/* --- BOTÃO DE ANÁLISE OPERACIONAL --- */}
      {isSearchActive && (
        <div className="flex justify-end">
          <Button asChild size="lg">
            <Link href={createAnaliseUrl()}>
              <Search className="mr-2 h-5 w-5" />
              Ver Análise Operacional Detalhada
            </Link>
          </Button>
        </div>
      )}

      {/* --- CONTEÚDO DO DASHBOARD --- */}
      {!isSearchActive ? (
        <div className="flex h-[40vh] items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">Execute uma busca para carregar o dashboard.</p>
        </div>
      ) : (
        <TabelaStatus isPending={isLoading} isError={false} hasData={!!summaryData}>
          <div className="space-y-6">
            {/* KPIs */}
            <DashboardSummaryView
              summaryData={summaryData}
              isLoading={isLoadingSummary}
            />
            {/* Gráficos Principais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GraficoDeDistribuicao
                title="Distribuição por Classificação"
                data={classificacaoData}
                isLoading={isLoadingClassificacao}
              />
              <GraficoDeDistribuicao
                title="Distribuição por Segmento"
                data={segmentoData}
                isLoading={isLoadingSegmento}
              />
            </div>
           
            {/* Listas Top 5 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ListaTopClientes
                title="Top 5 Clientes (Maior Valor)"
                data={topValorData}
                isLoading={isLoadingTopValor}
                isError={false}
              />
              <ListaTopClientes
                title="Top 5 Clientes (Maior Risco)"
                data={topRiscoData}
                isLoading={isLoadingTopRisco}
                isError={false}
              />
            </div>
          </div>
        </TabelaStatus>
      )}
    </div>
  );
}