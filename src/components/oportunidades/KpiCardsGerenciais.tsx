// Caminho: src/components/oportunidades/KpiCardsGerenciais.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { AnaliseCreditoFiltros, KpisGerenciaisDto } from '@/types/analise-credito'
import { fetchKpisGerenciais } from '@/http/api'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle, DollarSign, Percent, Users, Package } from 'lucide-react'

// Interface das props do componente
interface KpiCardsGerenciaisProps {
  filtros: AnaliseCreditoFiltros
}

// Interface para um único card de KPI
interface KpiCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  isLoading: boolean
}

// Função simples para formatar BRL (Reais)
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

// Função simples para formatar Porcentagem
const formatPercent = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

// Função simples para formatar Número
const formatNumber = (value: number) => {
  return value.toLocaleString('pt-BR')
}

/**
 * Componente interno para renderizar um único Card de KPI,
 * incluindo seu estado de carregamento (Skeleton).
 */
const KpiCard = ({ title, value, icon: Icon, isLoading }: KpiCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

/**
 * Componente principal que busca os dados e renderiza os 4 Cards.
 */
export const KpiCardsGerenciais = ({ filtros }: KpiCardsGerenciaisProps) => {
  // 1. Busca os dados da API usando TanStack Query
  const { data, isLoading, isError } = useQuery<KpisGerenciaisDto>({
    queryKey: ['kpisGerenciais', filtros], // A queryKey inclui os filtros
    queryFn: () => fetchKpisGerenciais(filtros),
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  })

  // 2. Estado de Erro
  if (isError) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-destructive">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">
              Erro ao carregar KPIs
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Não foi possível buscar os dados. Tente atualizar os filtros.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 3. Renderização dos Cards (com dados ou em estado de loading)
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Valor Total Vendido"
        value={data ? formatCurrency(data.valorTotalVendido) : 'R$ 0,00'}
        icon={DollarSign}
        isLoading={isLoading}
      />
      <KpiCard
        title="Margem Média"
        value={data ? formatPercent(data.margemMediaPercentual) : '0,0%'}
        icon={Percent}
        isLoading={isLoading}
      />
      <KpiCard
        title="Clientes Positivados"
        value={data ? formatNumber(data.clientesPositivados) : '0'}
        icon={Users}
        isLoading={isLoading}
      />
      <KpiCard
        title="SKUs Únicos Vendidos"
        value={data ? formatNumber(data.skusUnicosVendidos) : '0'}
        icon={Package}
        isLoading={isLoading}
      />
    </div>
  )
}