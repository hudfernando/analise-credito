// Caminho: app/oportunidades/page.tsx
'use client'

import { useState } from 'react'
import { useFilterStore } from '@/store/use-filter-store'
import { AnaliseCreditoFiltros } from '@/types/analise-credito'
 // Verifique o caminho deste componente
import { KpiCardsGerenciais } from '../../components/oportunidades/KpiCardsGerenciais' // Novo componente
import { AbasDeVisao } from '../../components/oportunidades/AbasDeVisao' // Novo componente
import { Separator } from '@/components/ui/separator'
import { FiltrosForm } from '@/components/analise/FiltrosForm'

/**
 * Página do Dashboard Gerencial S&OP (v6.1)
 * [DOC-Mestre-Visao] Ref: 25, 26
 */
export default function OportunidadesPage() {
  // O 'useFilterStore' armazena os filtros "rascunho" que o usuário seleciona.
  const storeFiltros = useFilterStore((state) => state.filtros)
  const setFiltrosStore = useFilterStore((state) => state.setFiltros)

  // 'activeFilters' armazena os filtros que foram *realmente* buscados.
  // Isso evita que os gráficos recarreguem a cada clique em um seletor.
  const [activeFilters, setActiveFilters] =
    useState<AnaliseCreditoFiltros>(storeFiltros)

  const [isSearching, setIsSearching] = useState(false)

  // Esta função é chamada quando o usuário clica em "Buscar"
  const handleSearch = () => {
    setIsSearching(true)
    // Congela os filtros da store no estado "ativo"
    setActiveFilters(storeFiltros)
    
    // Atualiza a store para garantir que a paginação/ordenação estão corretas
    setFiltrosStore(storeFiltros)
    
    setIsSearching(false)
  }

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Dashboard Gerencial S&OP
          </h2>
        </div>

        {/* 1. O Formulário de Filtros */}
        <FiltrosForm
          onSearch={handleSearch}
          isSearching={isSearching}
          showSopFilters={true} // <-- A prop que definimos para mostrar Região e Ranking!
        />

        {/* Os componentes abaixo SÓ renderizarão os dados baseados em 
          'activeFilters', que só muda ao clicar em "Buscar".
        */}
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