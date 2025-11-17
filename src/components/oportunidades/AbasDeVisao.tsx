// Caminho: src/components/oportunidades/AbasDeVisao.tsx
'use client'

import { AnaliseCreditoFiltros } from '@/types/analise-credito'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs' // Importa o componente de abas
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VisaoCategoriaChart } from './VisaoCategoriaChart' // Novo componente
import { VisaoCanalChart } from './VisaoCanalChart' // Novo componente

interface AbasDeVisaoProps {
  filtros: AnaliseCreditoFiltros
}

export const AbasDeVisao = ({ filtros }: AbasDeVisaoProps) => {
  return (
    <Tabs defaultValue="categoria" className="space-y-4">
      <TabsList>
        <TabsTrigger value="categoria">Visão por Categoria</TabsTrigger>
        <TabsTrigger value="canal">Visão por Canal</TabsTrigger>
      </TabsList>

      {/* Aba 1: Gráfico de Categoria (Treemap) */}
      <TabsContent value="categoria">
        <Card>
          <CardHeader>
            <CardTitle>Análise por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* O componente do gráfico é chamado aqui */}
            <VisaoCategoriaChart filtros={filtros} />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Aba 2: Gráfico de Canal (Barras) */}
      <TabsContent value="canal">
        <Card>
          <CardHeader>
            <CardTitle>Análise por Canal de Venda</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* O componente do gráfico é chamado aqui */}
            <VisaoCanalChart filtros={filtros} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}