'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { TabelaResultados } from '@/components/analise/TabelaResultados';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';
import { Skeleton } from '@/components/ui/skeleton';

// --- NOVAS IMPORTAÇÕES ---
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Função auxiliar (permanece a mesma)
function parseSearchParams(searchParams: URLSearchParams): AnaliseCreditoFiltros {
  const filtros: AnaliseCreditoFiltros = {};
  if (searchParams.has('EquipeId')) filtros.EquipeId = searchParams.get('EquipeId')!;
  if (searchParams.has('VendedorId')) filtros.VendedorId = searchParams.get('VendedorId')!;
  if (searchParams.has('Estado')) filtros.Estado = searchParams.get('Estado')!;
  if (searchParams.has('Municipio')) filtros.Municipio = searchParams.get('Municipio')!;
  if (searchParams.has('classificacaoEstrelas')) {
    filtros.ClassificacaoEstrelas = parseInt(searchParams.get('classificacaoEstrelas')!, 10);
  }
  return filtros;
}

function AnaliseView() {
  const searchParams = useSearchParams();
  const filtrosDaUrl = useMemo(() => parseSearchParams(searchParams), [searchParams]);
  return <TabelaResultados filtrosIniciais={filtrosDaUrl} />;
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[70vh] w-full" />
    </div>
  );
}

export default function AnalisePage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* --- MUDANÇA APLICADA AQUI --- */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Análise Operacional da Carteira</h1>
        {/* Botão de Voltar adicionado */}
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>

      <Suspense fallback={<LoadingState />}>
        <AnaliseView />
      </Suspense>
    </div>
  );
}