'use client';

import { useState } from 'react';
import { useFilterStore } from '@/store/use-filter-store';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';

import { TabelaAnaliseRegional } from '@/components/analise/TabelaAnaliseRegional';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FiltrosForm } from '@/components/analise/FiltrosForm';

export default function AnaliseRegionalPage() {
    const storeFiltros = useFilterStore((state) => state.filtros);
    const [activeFilters, setActiveFilters] = useState<AnaliseCreditoFiltros>(storeFiltros);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        setIsSearching(true);
        setActiveFilters(storeFiltros);
        setTimeout(() => setIsSearching(false), 500);
    };

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Inteligência Geográfica (Expansão)</h1>
                <Button asChild variant="outline">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar ao Dashboard
                    </Link>
                </Button>
            </header>

            <FiltrosForm 
                onSearch={handleSearch} 
                isSearching={isSearching} 
                showSopFilters={true} // Mostra filtro de Região
            />

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <TabelaAnaliseRegional filtros={activeFilters} />
            </div>
        </div>
    );
}