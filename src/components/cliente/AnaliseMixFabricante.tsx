// Caminho: src/components/cliente/AnaliseMixFabricante.tsx
'use client'

import { fetchAnaliseMixFabricante } from '@/http/api'

// --- ADIÇÕES DE IMPORTAÇÃO ---
import React, { useState } from 'react' // <-- Importa React e useState
import { ChevronDown, ChevronRight } from 'lucide-react' // <-- Ícones de expansão
import { AnaliseMixProdutoSubTabela } from './AnaliseMixProdutoSubTabela' // <-- Sub-tabela
// --- FIM DAS ADIÇÕES ---
import type { AnaliseMixFabricante } from '@/types/analise-credito'
import { useQuery } from '@tanstack/react-query'
import { Loader2, AlertCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

interface AnaliseMixFabricanteProps {
  clienteId: string
}

export function AnaliseMixFabricante({
  clienteId,
}: AnaliseMixFabricanteProps) {
  // 1. Busca os dados da API usando TanStack Query
  const {
    data: analiseMix,
    isLoading,
    isError,
  } = useQuery<AnaliseMixFabricante[]>({
    queryKey: ['analiseMixFabricante', clienteId],
    queryFn: () => fetchAnaliseMixFabricante(clienteId),
  })

  // --- ADIÇÃO DO STATE DE EXPANSÃO ---
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [key]: !prev[key], // Inverte o estado da linha clicada
    }))
  }
  // --- FIM DA ADIÇÃO ---
  // 2. Componente de Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2">Buscando análise de mix...</span>
      </div>
    )
  }

  // 3. Componente de Erro ou Vazio
  if (isError || !analiseMix || analiseMix.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Mix por Fabricante (S&OP)</CardTitle>
          <CardDescription>
            Análise de frequência e penetração de mix por canal de venda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span className="ml-2">
              Nenhuma análise de mix de fabricante foi encontrada para este
              cliente.
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 4. Tabela de Resultados (MODIFICADA)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Mix por Fabricante (S&OP)</CardTitle>
        <CardDescription>
          Análise de frequência e penetração de mix por canal de venda (Plano
          v5.0).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {/* Coluna extra para o ícone de expandir */}
              <TableHead className="w-[50px]"></TableHead> 
              <TableHead>Fabricante</TableHead>
              <TableHead>Canal (Origem)</TableHead>
              <TableHead>Tabela de Preço</TableHead>
              <TableHead className="text-right">Qtd. Comprada</TableHead>
              <TableHead className="text-right">Frequência</TableHead>
              <TableHead className="text-right">Produtos (Mix)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Loop modificado para React.Fragment */}
            {analiseMix.map((item) => {
              const rowKey = `${item.idFabricante}-${item.grupoCanal}-${item.idTabelaPreco}`
              const isExpanded = !!expandedRows[rowKey]

              return (
                <React.Fragment key={rowKey}>
                  {/* Linha Principal (Clicável) */}
                  <TableRow
                    onClick={() => toggleRow(rowKey)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {item.descricaoFabricante ?? item.idFabricante}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {item.idFabricante}
                      </div>
                    </TableCell>
                    <TableCell>{item.grupoCanal}</TableCell>
                    <TableCell>{item.idTabelaPreco}</TableCell>
                    <TableCell className="text-right">
                      {item.quantidadeTotal.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.frequenciaTotal}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.qtdProdutosCompradosDoMix}
                    </TableCell>
                  </TableRow>

                  {/* Linha da Sub-Tabela (Renderização Condicional) */}
                  {isExpanded && (
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <AnaliseMixProdutoSubTabela
                        clienteId={clienteId}
                        fabricanteId={item.idFabricante}
                      />
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}