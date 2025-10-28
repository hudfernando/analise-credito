// Caminho: src/app/analise/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchAnaliseCredito } from '@/http/api';
import { TabelaResultados } from '@/components/analise/TabelaResultados';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';
import { useFilterStore } from '@/store/use-filter-store';

function AnalisePage() {
  const searchParams = useSearchParams();
  const { setFiltros, setIsSearchActive } = useFilterStore();
  
  const [selectedEstrelas, setSelectedEstrelas] = useState<number | null>(null);

  const filtrosDaUrl = useMemo(() => {
    const params: Omit<AnaliseCreditoFiltros, 'pagina' | 'tamanhoPagina'> = {};
    if (searchParams.get('VendedorId')) params.VendedorId = searchParams.get('VendedorId')!;
    if (searchParams.get('EquipeId')) params.EquipeId = searchParams.get('EquipeId')!;
    if (searchParams.get('Estado')) params.Estado = searchParams.get('Estado')!;
    if (searchParams.get('Municipio')) params.Municipio = searchParams.get('Municipio')!;
    if (searchParams.get('classificacaoEstrelas')) {
        const estrelas = parseInt(searchParams.get('classificacaoEstrelas')!, 10);
        if (!isNaN(estrelas)) {
            params.ClassificacaoEstrelas = estrelas;
        }
    }
    return params;
  }, [searchParams]);

  useEffect(() => {
    setFiltros(filtrosDaUrl);
    setIsSearchActive(true);
  }, [filtrosDaUrl, setFiltros, setIsSearchActive]);

  const { data, isFetching, isError } = useQuery({
    queryKey: ['analiseCreditoDetalhada', filtrosDaUrl],
    queryFn: () => fetchAnaliseCredito({ ...filtrosDaUrl, pagina: 1, tamanhoPagina: 10000 }),
    enabled: true,
  });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild><Link href="/" aria-label="Voltar para o Dashboard"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
            <h1 className="text-3xl font-bold">Análise Operacional da Carteira</h1>
            <p className="text-muted-foreground">Explore os detalhes dos clientes que correspondem aos filtros aplicados no dashboard.</p>
        </div>
      </div>
      <TabelaResultados resultados={data?.itens ?? []} isPending={isFetching} isError={isError} />
    </div>
  );
}

export default function AnalisePageWrapper() {
  return (
    <React.Suspense fallback={<div className="container mx-auto p-4 text-center">Carregando análise...</div>}>
      <AnalisePage />
    </React.Suspense>
  );
}