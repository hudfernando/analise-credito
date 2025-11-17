// Caminho: src/components/oportunidades/colunas-detalhes.tsx
'use client'

import { OportunidadeMix } from '@/types/analise-credito'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

// Função simples para formatar Número
const formatNumber = (value: number) => {
  return value.toLocaleString('pt-BR')
}

// Definição das colunas para a tabela de detalhes
export const colunas: ColumnDef<OportunidadeMix>[] = [
  {
    accessorKey: 'descricaoFabricante',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fabricante
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="pl-4">{row.getValue('descricaoFabricante')}</div>
    ),
  },
  {
    accessorKey: 'nomeVendedor',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Vendedor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="pl-4">{row.getValue('nomeVendedor')}</div>,
  },
  {
    // Nota: A API retorna 'grupoCanal', mas ele contém a 'Mesorregiao'
    accessorKey: 'grupoCanal', 
    header: 'Região',
  },
  {
    accessorKey: 'quantidadeTotal',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full justify-end"
        >
          Qtd. Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="pr-4 text-right font-medium">
        {formatNumber(row.getValue('quantidadeTotal'))}
      </div>
    ),
  },
  {
    accessorKey: 'clientesAtendidos',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full justify-end"
        >
          Clientes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="pr-4 text-right">
        {formatNumber(row.getValue('clientesAtendidos'))}
      </div>
    ),
  },
  {
    accessorKey: 'skuComprados',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full justify-end"
        >
          SKUs
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="pr-4 text-right">
        {formatNumber(row.getValue('skuComprados'))}
      </div>
    ),
  },
]