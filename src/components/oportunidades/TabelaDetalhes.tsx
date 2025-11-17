// Caminho: src/components/oportunidades/TabelaDetalhes.tsx
'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import * as xlsx from 'xlsx' // Para exportação do Excel
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  fetchOportunidadesDetalhesPaginado,
  fetchOportunidadesDetalhesExport,
} from '@/http/api'
import { AnaliseCreditoFiltros, PaginatedResponse, OportunidadeMix } from '@/types/analise-credito'
import { colunas } from './colunas-detalhes' // Importa nossas colunas
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileDown,
  Settings2,
} from 'lucide-react'

interface TabelaDetalhesProps {
  filtros: AnaliseCreditoFiltros
}

export function TabelaDetalhes({ filtros }: TabelaDetalhesProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'quantidadeTotal', desc: true }, // Ordenação padrão
  ])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, // Página 0 no TanStack Table
    pageSize: 20, // Tamanho da página
  })

  // 1. QUERY PRINCIPAL (Paginação)
  // Esta query busca os dados PAGINADOS
  const { data, isLoading } = useQuery({ // <--- REMOVIDO genérico <...> daqui
    queryKey: [
      'detalhesOperacionais',
      filtros,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: (): Promise<PaginatedResponse<OportunidadeMix>> => // <-- Tipo de retorno definido na queryFn
      fetchOportunidadesDetalhesPaginado({
        ...filtros,
        pagina: pagination.pageIndex + 1, // API espera página 1, TanStack usa 0
        tamanhoPagina: pagination.pageSize,
        sortBy: sorting[0]?.id ?? 'quantidadeTotal',
        sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
      }),
    
    // --- CORREÇÃO AQUI (Linha 83) ---
    // 'keepPreviousData: true' (v4) foi substituído por:
    placeholderData: (previousData) => previousData,
    // --- FIM DA CORREÇÃO ---
  })
  
  // 2. LÓGICA DE EXPORTAÇÃO
  const [isExporting, setIsExporting] = React.useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Chama o endpoint de EXPORTAÇÃO (sem paginação)
      const exportData = await fetchOportunidadesDetalhesExport({
        ...filtros,
        sortBy: sorting[0]?.id ?? 'quantidadeTotal',
        sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
      })
      
      // Mapeia para um formato mais legível no Excel
      const formattedData = exportData.map(item => ({
        'Fabricante': item.descricaoFabricante,
        'Vendedor': item.nomeVendedor,
        'Região': item.grupoCanal, // 'grupoCanal' contém a Mesorregiao
        'Qtd. Total': item.quantidadeTotal,
        'Clientes Atendidos': item.clientesAtendidos,
        'SKUs Comprados': item.skuComprados
      }))

      // Cria a planilha e faz o download
      const worksheet = xlsx.utils.json_to_sheet(formattedData)
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Detalhes')
      xlsx.writeFile(workbook, 'detalhes_oportunidades.xlsx')

    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      // (Opcional: Adicionar um Sonner/Toast de erro)
    } finally {
      setIsExporting(false)
    }
  }

  // 3. INICIALIZAÇÃO DA TABELA
  const table = useReactTable({
    data: data?.itens ?? [], // Usa os itens paginados (Erro 2 corrigido)
    columns: colunas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    
    // Configurações para paginação e ordenação no lado do SERVIDOR
    manualPagination: true,
    manualSorting: true,
    
    // Contagem de páginas
    pageCount: data?.totalPages ?? -1, // (Erro 3 corrigido)
    
    // Estado da tabela
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      pagination,
      columnVisibility,
    },
  })

  return (
    <div className="w-full space-y-4">
      {/* Controles da Tabela (Exportar, Exibir Colunas) */}
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Settings2 className="mr-2 h-4 w-4" /> Exibir Colunas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === 'descricaoFabricante' ? 'Fabricante' :
                     column.id === 'nomeVendedor' ? 'Vendedor' :
                     column.id === 'grupoCanal' ? 'Região' :
                     column.id === 'quantidadeTotal' ? 'Qtd. Total' :
                     column.id === 'clientesAtendidos' ? 'Clientes' :
                     column.id === 'skuComprados' ? 'SKUs' :
                     column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="outline"
          className="ml-2"
          onClick={handleExport}
          disabled={isExporting}
        >
          <FileDown className="mr-2 h-4 w-4" />
          {isExporting ? 'Exportando...' : 'Exportar Excel'}
        </Button>
      </div>

      {/* A Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Estado de Carregamento (Skeleton)
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={colunas.length}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              // Estado com Dados
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Estado Vazio
              <TableRow>
                <TableCell
                  colSpan={colunas.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Controles de Paginação */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {data?.totalCount ?? 0} registro(s) encontrados. {/* (Erro 4 corrigido) */}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">
            Página {pagination.pageIndex + 1} de {data?.totalPages ?? 1} {/* (Erro 5 corrigido) */}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage() || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}