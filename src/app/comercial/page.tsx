// Caminho: app/comercial/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
// --- CORREÇÃO DE CAMINHO ---
// O seu arquivo de API está em 'src/lib/api'
import { fetchPerformanceGeral, fetchTop10Produtos, fetchFaturamentoCategoria } from '@/http/api'; 
// --- FIM DA CORREÇÃO ---
import { Loader2, AlertCircle } from 'lucide-react';
import { KpiCardComercial } from '@/components/comercial/KpiCardComercial'; // (Vamos criar este)
import { RankingChart } from '@/components/comercial/RankingChart'; // (Vamos criar este)
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * Este é o componente principal da nova página de Inteligência Comercial.
 * Ele é responsável por buscar todos os dados da API e orquestrar
 * a exibição dos componentes filhos.
 */
export default function ComercialPage() {
  
  // Query 1: Busca os KPIs de Performance Geral
  const { data: performanceData, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['comercialPerformanceGeral'],
    queryFn: fetchPerformanceGeral,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });

  // Query 2: Busca o Ranking de Produtos
  const { data: rankingData, isLoading: isLoadingRanking } = useQuery({
    queryKey: ['comercialRankingProdutos'],
    queryFn: fetchTop10Produtos,
    staleTime: 1000 * 60 * 5,
  });

  // Query 3: Busca o Faturamento por Categoria
  const { data: categoriaData, isLoading: isLoadingCategoria } = useQuery({
    queryKey: ['comercialFaturamentoCategoria'],
    // --- CORREÇÃO AQUI (Linha 37) ---
    // Precisamos envelopar a chamada em uma arrow function
    queryFn: () => fetchFaturamentoCategoria(), 
    // --- FIM DA CORREÇÃO ---
    staleTime: 1000 * 60 * 5,
  });

  // Define o estado de carregamento geral da página
  const isLoading = isLoadingPerformance || isLoadingRanking || isLoadingCategoria;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      
      {/* --- CABEÇALHO DA PÁGINA --- */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Inteligência Comercial</h1>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>

      {/* --- SEÇÃO DE KPIs (PERFORMANCE GERAL) --- */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Performance do Mês</h2>
        <KpiCardComercial 
          data={performanceData} 
          isLoading={isLoadingPerformance} 
        />
      </div>

      {/* --- SEÇÃO DE GRÁFICOS (RANKING E CATEGORIA) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RankingChart
          title="Top 10 Produtos (por Valor)"
          data={rankingData}
          isLoading={isLoadingRanking}
          dataKey="valorTotalVendido"
          nameKey="descricaoProduto"
        />
        
        <RankingChart
          title="Faturamento por Categoria"
          data={categoriaData} // Reutilizando o componente com os dados de categoria
          isLoading={isLoadingCategoria}
          dataKey="valor" // Vem do nosso DistribuicaoDto
          nameKey="chave" // Vem do nosso DistribuicaoDto
        />
      </div>

    </div>
  );
}