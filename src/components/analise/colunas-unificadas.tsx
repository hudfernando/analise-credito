// Caminho: src/components/analise/colunas-unificadas.tsx
'use client';

import { AnaliseUnificadaDto } from '@/types/analise-credito'; // CORREÇÃO 1: Importamos o tipo AnaliseUnificadaDto
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils'; // Assumindo utils.ts existe

// Colunas fixas para a Super Tabela (v7.0)
export const colunasUnificadas: ColumnDef<AnaliseUnificadaDto>[] = [
  {
    // Coluna Chave (ID) - Condicional
    accessorKey: 'chave',
    header: 'Código',
    cell: ({ row }) => <div className="font-mono text-xs text-muted-foreground">{row.getValue('chave')}</div>,
    // Garante que o TanStack Table saiba que esta coluna existe para ser visível/invisível
    enableHiding: true,
  },
  {
    accessorKey: 'descricao',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="justify-start"
        >
          Dimensão Principal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('descricao')}</div>,
  },
  {
    accessorKey: 'valorTotalVendido',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full justify-end"
        >
          Faturamento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right tabular-nums font-semibold">
        {formatCurrency(row.getValue('valorTotalVendido'))}
      </div>
    ),
  },
  {
    accessorKey: 'margemPercentual',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full justify-end"
        >
          Margem %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatPercentage(row.getValue('margemPercentual'))}
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
      );
    },
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.getValue('clientesAtendidos')}
      </div>
    ),
  },
  {
    accessorKey: 'mixProdutos',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full justify-end"
        >
          Mix (SKUs)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.getValue('mixProdutos')}
      </div>
    ),
  },
];