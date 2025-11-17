// Caminho: src/components/oportunidades/VisaoCanalChart.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { AnaliseCreditoFiltros, VisaoCanalDto } from '@/types/analise-credito'
import { fetchVisaoCanal } from '@/http/api'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle } from 'lucide-react'

// Função para formatar BRL (Reais)
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

// Tooltip customizado para o gráfico
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload // 'payload' aqui é o item do DTO
    return (
      <div className="rounded-md border bg-background p-3 shadow-sm">
        <p className="font-semibold">{label}</p>
        <p className="text-sm">
          Valor: {formatCurrency(data.valorTotalVendido)}
        </p>
        <p className="text-sm">
          Margem: {data.margemMediaPercentual.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 1 })}
        </p>
      </div>
    )
  }
  return null
}

interface ChartProps {
  filtros: AnaliseCreditoFiltros
}

export const VisaoCanalChart = ({ filtros }: ChartProps) => {
  const { data, isLoading, isError } = useQuery<VisaoCanalDto[]>({
    queryKey: ['visaoCanal', filtros],
    queryFn: () => fetchVisaoCanal(filtros),
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
          Não foi possível buscar a visão por canal.
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
    <ResponsiveContainer width="100%" height={400}>
      <BarChart layout="vertical" data={data} margin={{ left: 20, right: 30 }}>
        <XAxis type="number" hide /> {/* Esconde o eixo X (valor) */}
        <YAxis
          type="category"
          dataKey="canal" // O nome do Canal (ex: "EDI/OL")
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
        <Bar
          dataKey="valorTotalVendido" // O tamanho da barra
          fill="currentColor"
          radius={[0, 4, 4, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}