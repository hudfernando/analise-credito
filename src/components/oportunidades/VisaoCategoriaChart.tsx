// Caminho: src/components/oportunidades/VisaoCategoriaChart.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import {
  ResponsiveContainer,
  Treemap,
  Tooltip,
} from 'recharts'
import { AnaliseCreditoFiltros, VisaoCategoriaDto } from '@/types/analise-credito'
import { fetchVisaoCategoria } from '@/http/api'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle } from 'lucide-react'

// Função para formatar BRL (Reais)
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

// Função para formatar Porcentagem
const formatPercent = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

// Tooltip customizado para o gráfico
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload // 'payload' aqui é o item do DTO
    return (
      <div className="rounded-md border bg-background p-3 shadow-sm">
        <p className="font-semibold">{data.categoria}</p>
        <p className="text-sm">
          Valor: {formatCurrency(data.valorTotalVendido)}
        </p>
        <p className="text-sm">
          Margem: {formatPercent(data.margemMediaPercentual)}
        </p>
      </div>
    )
  }
  return null
}

interface ChartProps {
  filtros: AnaliseCreditoFiltros
}

export const VisaoCategoriaChart = ({ filtros }: ChartProps) => {
  const { data, isLoading, isError } = useQuery<VisaoCategoriaDto[]>({
    queryKey: ['visaoCategoria', filtros],
    queryFn: () => fetchVisaoCategoria(filtros),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  if (isError) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center text-destructive">
        <AlertTriangle className="h-10 w-10" />
        <p className="mt-2 font-semibold">Erro ao carregar os dados</p>
        <p className="text-sm text-muted-foreground">
          Não foi possível buscar a visão por categoria.
        </p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center">
        <p className="mt-2 font-semibold">Sem dados</p>
        <p className="text-sm text-muted-foreground">
          Nenhum dado encontrado para os filtros selecionados.
        </p>
      </div>
    )
  }

  return (
    // O 'ResponsiveContainer' faz o gráfico se adaptar ao tamanho do Card
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
        data={data}
        dataKey="valorTotalVendido" // O tamanho do retângulo
        aspectRatio={4 / 3}
        stroke="#fff"
        fill="#8884d8"
        nameKey="categoria" // O texto exibido
      >
        <Tooltip content={<CustomTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  )
}