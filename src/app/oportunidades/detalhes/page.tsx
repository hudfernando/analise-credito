// Caminho: app/oportunidades/detalhes/page.tsx
'use client'

import { useState } from 'react'
import { useFilterStore } from '@/store/use-filter-store'
import { AnaliseCreditoFiltros } from '@/types/analise-credito'

import { TabelaDetalhes } from '@/components/oportunidades/TabelaDetalhes' // Nosso novo componente
import { FiltrosForm } from '@/components/analise/FiltrosForm'

/**
 * Página da Visão Operacional S&OP (v6.1)
 * [DOC-Mestre-Visao] Ref: 27, 28
 */
export default function OportunidadesDetalhesPage() {
  
  const storeFiltros = useFilterStore((state) => state.filtros)
  const setFiltrosStore = useFilterStore((state) => state.setFiltros)

  // 'activeFilters' armazena os filtros que foram *realmente* buscados.
  const [activeFilters, setActiveFilters] =
    useState<AnaliseCreditoFiltros>(storeFiltros)

  const [isSearching, setIsSearching] = useState(false)

  // Esta função é chamada quando o usuário clica em "Buscar"
  const handleSearch = () => {
    setIsSearching(true)
    // Congela os filtros da store no estado "ativo"
    const filtrosComPaginaResetada = { ...storeFiltros, pagina: 1 }
    
    setActiveFilters(filtrosComPaginaResetada)
    setFiltrosStore(filtrosComPaginaResetada)
    
    setIsSearching(false)
  }

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Visão Operacional (Detalhes)
          </h2>
        </div>

        {/* 1. O Formulário de Filtros */}
        <FiltrosForm
          onSearch={handleSearch}
          isSearching={isSearching}
          showSopFilters={true} // Mostra Região e Ranking
        />

        {/* 2. A Tabela de Dados Paginada */}
        <div className="pt-4">
          <TabelaDetalhes filtros={activeFilters} />
        </div>
      </div>
    </div>
  )
}