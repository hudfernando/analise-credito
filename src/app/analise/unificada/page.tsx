// Caminho: app/analise/unificada/page.tsx
'use client';

import { useState } from 'react';
import { useFilterStore } from '@/store/use-filter-store';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';
// Usamos o componente único de filtros

import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChartHorizontal } from 'lucide-react';
import Link from 'next/link';
import { FiltrosForm } from '@/components/analise/FiltrosForm';
import { TabelaAnaliseUnificada } from '@/components/analise/TabelaAnaliseUnificada';


/**
 * Página da Visão Unificada (v7.0 - Super-Tabela OLAP)
 */
export default function AnaliseUnificadaPage() {
    
    // Filtros rascunho (o que está no formulário, lido do store)
    const storeFiltros = useFilterStore((state) => state.filtros);
    
    // Filtros ativos (os filtros que a tabela realmente usa, só mudam ao clicar em 'Buscar')
    const [activeFilters, setActiveFilters] = useState<AnaliseCreditoFiltros>(storeFiltros);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        setIsSearching(true);
        // Congela o estado atual do formulário para o estado 'ativo'
        setActiveFilters(storeFiltros);
        setIsSearching(false);
    };

    return (
        <div className="flex-col md:flex">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                
                <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <h1 className="text-3xl font-bold tracking-tight">Análise Unificada (v7.0)</h1>
                    <div className="flex items-center space-x-2">
                        {/* Botão de Voltar Adicionado */}
                        <Button asChild variant="outline">
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar ao Dashboard
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/comercial">
                                <BarChartHorizontal className="mr-2 h-4 w-4" />
                                Inteligência Comercial
                            </Link>
                        </Button>
                    </div>
                </header>

                {/* 1. O Formulário de Filtros (usado para travar os filtros) */}
                <FiltrosForm
                    onSearch={handleSearch}
                    isSearching={isSearching}
                    showSopFilters={true} // Usamos os filtros S&OP + Ranking
                />

                {/* 2. A Super-Tabela */}
                <div className="pt-4">
                    <TabelaAnaliseUnificada filtros={activeFilters} />
                </div>
            </div>
        </div>
    );
}