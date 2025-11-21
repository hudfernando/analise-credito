// Caminho: src/app/visoes/regional/page.tsx
'use client';

import { useState } from 'react';
import { useFilterStore } from '@/store/use-filter-store';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';
import { HeaderVisoes } from '@/components/visoes/HeaderVisoes';
import { FiltrosForm } from '@/components/analise/FiltrosForm';
import { TabelaAnaliseRegional } from '@/components/analise/TabelaAnaliseRegional';
import { subDays, format } from 'date-fns';

export default function VisaoRegionalPage() {
  // Rascunho do Store (atualizado pelo Form)
  const storeFiltros = useFilterStore((state) => state.filtros);
  
  // Helper para datas
  const getDates90Days = () => {
      const today = new Date();
      return {
          dataInicial: format(subDays(today, 90), 'yyyy-MM-dd'),
          dataFinal: format(today, 'yyyy-MM-dd')
      };
  };

  // Estado Local (Só muda no Buscar) - Inicializa mesclando Store + Datas
  const [activeFilters, setActiveFilters] = useState<AnaliseCreditoFiltros>({
    ...storeFiltros,
    ...getDates90Days()
  });
  
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    
    // Copia o rascunho do store para o ativo, mas FORÇA as datas
    const filtrosComRegra = {
        ...storeFiltros,
        ...getDates90Days()
    };
    
    setActiveFilters(filtrosComRegra);
    setTimeout(() => setIsSearching(false), 500);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <HeaderVisoes />
      
      <div className="space-y-6">
        <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-primary/20">
            <p className="text-sm font-medium text-primary flex items-center gap-2">
                📅 Esta visão está restrita aos últimos 90 dias de vendas (Trimestre Móvel).
            </p>
        </div>

        {/* Formulário atualiza o Store Global */}
        <FiltrosForm 
            onSearch={handleSearch} 
            isSearching={isSearching} 
            showSopFilters={true} 
        />

        {/* Tabela usa o Estado Local (Filtros Aplicados) */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TabelaAnaliseRegional filtros={activeFilters} />
        </div>
      </div>
    </div>
  );
}