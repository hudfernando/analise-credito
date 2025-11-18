// Caminho: app/oportunidades/page.tsx
'use client'

import { useState } from 'react'
import { useFilterStore } from '@/store/use-filter-store'
import { AnaliseCreditoFiltros } from '@/types/analise-credito'

import { KpiCardsGerenciais } from '@/components/oportunidades/KpiCardsGerenciais'
import { AbasDeVisao } from '@/components/oportunidades/AbasDeVisao'
import { Separator } from '@/components/ui/separator'
// --- ADIÇÕES DE NAVEGAÇÃO ---
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { FiltrosForm } from '@/components/analise/FiltrosForm'
// --- FIM DAS ADIÇÕES ---

/**
 * Página do Dashboard Gerencial S&OP (v6.1)
 * [DOC-Mestre-Visao] Ref: 25, 26
 */
export default function OportunidadesPage() {
  const storeFiltros = useFilterStore((state) => state.filtros)
  const setFiltrosStore = useFilterStore((state) => state.setFiltros)

  const [activeFilters, setActiveFilters] =
    useState<AnaliseCreditoFiltros>(storeFiltros)

  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    setActiveFilters(storeFiltros)
    setFiltrosStore(storeFiltros)
    setIsSearching(false)
  }

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        
        {/* --- CABEÇALHO ATUALIZADO --- */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-3xl font-bold tracking-tight">
            Dashboard Gerencial S&OP
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
          showSopFilters={true} 
        />

        <div className="space-y-4 pt-4">
          {/* 2. Os Cards de KPI */}
          <KpiCardsGerenciais filtros={activeFilters} />

          <Separator />

          {/* 3. As Abas com Gráficos */}
          <AbasDeVisao filtros={activeFilters} />
        </div>
      </div>
    </div>
  )
}