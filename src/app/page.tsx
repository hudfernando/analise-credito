// Caminho: src/app/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useFilterStore } from '@/store/use-filter-store';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';
import { fetchDashboardSummary, fetchDistribuicaoClassificacao, fetchDistribuicaoSegmento, fetchTopClientesValor, fetchTopClientesRisco } from '@/http/api';
import { FiltrosForm } from '@/components/analise/FiltrosForm';
import { DashboardSummaryView } from '@/components/dashboard/DashboardSummary';
import { GraficoDeDistribuicao } from '@/components/dashboard/GraficoDeDistribuicao';
import { ListaTopClientes } from '@/components/dashboard/ListaTopClientes';
import { LegendaInsights } from '@/components/documentacao/LegendaInsights';
import { PainelConfiguracoes } from '@/components/configuracao/PainelConfiguracoes';
import { Button } from '@/components/ui/button';
import { Settings, ExternalLink } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner";

export default function DashboardPage() {
  const { filtros, isSearchActive, setFiltros, setIsSearchActive } = useFilterStore();

  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({ queryKey: ['dashboardSummary', filtros], queryFn: () => fetchDashboardSummary(filtros), enabled: isSearchActive });
  const { data: classificacaoData, isLoading: isClassificacaoLoading } = useQuery({ queryKey: ['distribuicaoClassificacao', filtros], queryFn: () => fetchDistribuicaoClassificacao(filtros), enabled: isSearchActive });
  const { data: segmentoData, isLoading: isSegmentoLoading } = useQuery({ queryKey: ['distribuicaoSegmento', filtros], queryFn: () => fetchDistribuicaoSegmento(filtros), enabled: isSearchActive });
  const { data: topValorData, isLoading: isTopValorLoading, isError: isTopValorError } = useQuery({ queryKey: ['topClientesValor', filtros], queryFn: () => fetchTopClientesValor(filtros), enabled: isSearchActive });
  const { data: topRiscoData, isLoading: isTopRiscoLoading, isError: isTopRiscoError } = useQuery({ queryKey: ['topClientesRisco', filtros], queryFn: () => fetchTopClientesRisco(filtros), enabled: isSearchActive });

  const handleSearch = (novosFiltros: Omit<AnaliseCreditoFiltros, 'pagina' | 'tamanhoPagina'>) => {
    setFiltros(novosFiltros);
    setIsSearchActive(true);
  };
  
  const analiseUrl = `/analise?${new URLSearchParams(filtros as Record<string, string>).toString()}`;

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Dashboard Gerencial</h1>
          <div className="flex items-center gap-2">
              <LegendaInsights />
              <PainelConfiguracoes><Button variant="outline" size="icon" aria-label="Abrir Configurações"><Settings className="h-4 w-4" /></Button></PainelConfiguracoes>
          </div>
        </div>
        
        <FiltrosForm onSearch={handleSearch} isSearching={isSummaryLoading || isClassificacaoLoading} />

        {isSearchActive && (
          <>
            <DashboardSummaryView summaryData={summaryData} isLoading={isSummaryLoading} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GraficoDeDistribuicao title="Distribuição por Classificação" data={classificacaoData} isLoading={isClassificacaoLoading} />
              <GraficoDeDistribuicao title="Distribuição por Segmento" data={segmentoData} isLoading={isSegmentoLoading} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ListaTopClientes title="Top 5 Clientes de Valor (maior IVE)" data={topValorData} isLoading={isTopValorLoading} isError={isTopValorError} />
                <ListaTopClientes title="Top 5 Clientes de Risco (maior Prob. Inadimplência)" data={topRiscoData} isLoading={isTopRiscoLoading} isError={isTopRiscoError} />
            </div>
            <div className="text-center pt-4">
                <Button asChild size="lg"><Link href={analiseUrl}>Ver Análise Completa da Carteira <ExternalLink className="ml-2 h-4 w-4" /></Link></Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}