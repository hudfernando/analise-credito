// Caminho: app/oportunidades/detalhes/page.tsx
'use client'

import { useState } from 'react'
import { useFilterStore } from '@/store/use-filter-store'
import { AnaliseCreditoFiltros } from '@/types/analise-credito'
import { TabelaDetalhes } from '@/components/oportunidades/TabelaDetalhes'
// --- ADIÇÕES DE NAVEGAÇÃO ---
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { FiltrosForm } from '@/components/analise/FiltrosForm'
// --- FIM DAS ADIÇÕES ---

/**
 * Página da Visão Operacional S&OP (v6.1)
 * [DOC-Mestre-Visao] Ref: 27, 28
 */
export default function OportunidadesDetalhesPage() {
  
  const storeFiltros = useFilterStore((state) => state.filtros)
  const setFiltrosStore = useFilterStore((state) => state.setFiltros)

  const [activeFilters, setActiveFilters] =
    useState<AnaliseCreditoFiltros>(storeFiltros)

  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    const filtrosComPaginaResetada = { ...storeFiltros, pagina: 1 }
    
    setActiveFilters(filtrosComPaginaResetada)
    setFiltrosStore(filtrosComPaginaResetada)
    
    setIsSearching(false)
  }

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">

        {/* --- CABEÇALHO ATUALIZADO --- */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-3xl font-bold tracking-tight">
            Visão Operacional (Detalhes)
          </h2>
          {/* Botão de Voltar Adicionado */}
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard de Crédito
              </Link>
            </Button>
          </div>
        </header>
        {/* --- FIM DA ATUALIZAÇÃO --- */}

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