// Caminho: src/components/analise/TabelaAnaliseUnificada.tsx
'use client';

import * as React from 'react';
import {
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel, 
  useReactTable,
} from '@tanstack/react-table';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AnaliseCreditoFiltros, AnaliseUnificadaDto, PaginatedResponse } from '@/types/analise-credito';
import { colunasUnificadas } from './colunas-unificadas';
import { fetchAnaliseUnificada } from '@/http/api'; 
import * as xlsx from 'xlsx';
import { useInView } from 'react-intersection-observer'; 
import { Loader2, FileDown } from 'lucide-react'; 

interface TabelaAnaliseUnificadaProps {
  filtros: AnaliseCreditoFiltros;
}

const camposAgrupamento = [
    { value: "vendedor", label: "Vendedor" },
    { value: "fabricante", label: "Fabricante" },
    { value: "produto", label: "Produto" },
    { value: "cliente", label: "Cliente" },
    { value: "tipoPedido", label: "Tipo Pedido" }, 
    { value: "tabelaPreco", label: "Tabela Preço" }, 
];

export function TabelaAnaliseUnificada({ filtros }: TabelaAnaliseUnificadaProps) {
  const [groupBy, setGroupBy] = React.useState<string>("vendedor");
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'valorTotalVendido', desc: true },
  ]);
  const [isExporting, setIsExporting] = React.useState(false);
  
  // Estado inicial da visibilidade
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    chave: false, 
  });

  // 1. QUERY PRINCIPAL: SCROLL INFINITO
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
  } = useInfiniteQuery<PaginatedResponse<AnaliseUnificadaDto>>({
    queryKey: ['analiseUnificada', filtros, groupBy, sorting],
    queryFn: ({ pageParam }) => fetchAnaliseUnificada({ 
        ...filtros, 
        pagina: (pageParam as number) ?? 1, 
        tamanhoPagina: 50, 
        groupBy: groupBy, 
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
    }, groupBy),
    getNextPageParam: (lastPage) => lastPage.proximaPagina, 
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });

  // 2. CONSOLIDAÇÃO DOS DADOS
  const dataToDisplay = React.useMemo(() => data?.pages.flatMap(page => page.itens) ?? [], [data]);
  
  // 3. LÓGICA DE EXPORTAÇÃO
  const handleExport = async () => {
    setIsExporting(true);
    try {
        const exportData = dataToDisplay; 
        if (exportData.length === 0) return;

        const formattedData = exportData.map(item => ({
            'Código': item.chave,
            'Agrupamento': item.descricao,
            'Faturamento': item.valorTotalVendido,
            'Margem %': item.margemPercentual,
            'Clientes': item.clientesAtendidos,
            'SKUs': item.mixProdutos,
            'Preço Médio': item.precoMedio
        }));
        
        const worksheet = xlsx.utils.json_to_sheet(formattedData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, `Analise_${groupBy}`);
        xlsx.writeFile(workbook, `analise_unificada_${groupBy}.xlsx`);

    } catch (error) {
        console.error('Erro ao exportar dados:', error);
    } finally {
        setIsExporting(false);
    }
  };

  // 4. INICIALIZAÇÃO DA TABELA
  const table = useReactTable({
    data: dataToDisplay, 
    columns: colunasUnificadas,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility },
  });
  
  // 5. OBSERVER MODERNIZADO (SEM useEffect) [cite: 14, 19]
  // Usamos o callback 'onChange' da biblioteca. Isso é reativo e não precisa de efeito.
  const { ref: observerRef } = useInView({
    rootMargin: '100px 0px',
    onChange: (inView) => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    },
  });

  // 6. EVENTO DE TROCA DE PIVÔ (SEM useEffect)
  // Atualizamos a visibilidade no momento da ação, evitando re-render extra.
  const handleGroupByChange = (newValue: string) => {
      if (!newValue) return;
      
      setGroupBy(newValue);
      
      // Lógica de Visibilidade da Coluna 'chave' aplicada diretamente na mudança de estado
      const isCodeBasedGroup = ['cliente', 'produto', 'vendedor', 'tipopedido', 'tabelapreco'].includes(newValue);
      
      setColumnVisibility(prev => ({
          ...prev,
          chave: isCodeBasedGroup
      }));
  }

  // 7. Renderização
  return (
    <div className="w-full space-y-4">
      {/* --- Controles de Pivô e Exportação --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-muted-foreground">Agrupar por:</span>
          <ToggleGroup 
            type="single" 
            variant="outline" 
            value={groupBy} 
            onValueChange={handleGroupByChange} 
          >
            {camposAgrupamento.map(field => (
                <ToggleGroupItem key={field.value} value={field.value} disabled={isLoading || isFetchingNextPage}>
                    {field.label}
                </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isExporting || isLoading || dataToDisplay.length === 0}
            >
              <FileDown className="mr-2 h-4 w-4" />
              {isExporting ? 'Exportando...' : `Exportar (${dataToDisplay.length})`}
            </Button>
        </div>
      </div>

      {/* 8. A Tabela */}
      <div className="rounded-md border relative w-full overflow-auto max-h-[80vh]">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {dataToDisplay.length > 0 && table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
            ))}
            
            {/* Linha de Status de Scroll Infinito com Observer */}
            {(hasNextPage || isFetchingNextPage || isLoading) && (
              <TableRow ref={observerRef} className="bg-accent/20">
                <TableCell colSpan={colunasUnificadas.length} className="py-4 text-center">
                  {isFetchingNextPage ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : 
                   isLoading ? 'Carregando dados...' : hasNextPage && 'Carregar mais...'}
                </TableCell>
              </TableRow>
            )}
            
            {!isLoading && dataToDisplay.length === 0 && (
              <TableRow>
                <TableCell colSpan={colunasUnificadas.length} className="h-24 text-center">Nenhum resultado encontrado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}