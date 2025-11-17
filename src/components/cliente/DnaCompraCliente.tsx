// Caminho: src/components/cliente/DnaCompraCliente.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDnaCompraCliente, fetchCanais } from '@/http/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Target, ArrowUpDown, ChevronRight, ChevronDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DnaCategoria } from '@/types/analise-credito';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DnaProdutoSubTabela } from './DnaProdutoSubTabela';

interface DnaCompraClienteProps {
  clienteId: number | string;
}

type SortableKeys = keyof DnaCategoria;

// --- CORREÇÃO: O componente auxiliar agora recebe as props do pai ---
const SortableHeader = ({ children, columnKey, className, sortConfig, requestSort }: { 
  children: React.ReactNode; 
  columnKey: SortableKeys; 
  className?: string;
  sortConfig: { key: SortableKeys; direction: 'asc' | 'desc' };
  requestSort: (key: SortableKeys) => void;
}) => (
  <TableHead className={className}>
    <Button variant="ghost" onClick={() => requestSort(columnKey)} className="px-1 w-full">
      <span className="flex-1 text-left">{children}</span>
      <ArrowUpDown className={cn("ml-2 h-4 w-4", sortConfig.key !== columnKey && "text-muted-foreground")} />
    </Button>
  </TableHead>
);
// --- FIM DA CORREÇÃO ---

export const DnaCompraCliente = ({ clienteId }: DnaCompraClienteProps) => {
  
  const [canalSelecionado, setCanalSelecionado] = useState('TODOS');
  // --- CORREÇÃO: O estado da ordenação vive no componente PAI ---
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' }>({
    key: 'valorTotalVendido',
    direction: 'desc',
  });
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Query 1: Busca os dados do DNA do cliente
  const { data: dnaData, isLoading: isLoadingDna, isError: isErrorDna } = useQuery({
    queryKey: ['dnaCompraCliente', clienteId],
    queryFn: () => fetchDnaCompraCliente(clienteId),
    staleTime: 1000 * 60 * 15, 
  });

  // Query 2: Busca a lista mestra de Canais
  const { data: canaisDisponiveis, isLoading: isLoadingCanais, isError: isErrorCanais } = useQuery({
    queryKey: ['filtroCanais'],
    queryFn: fetchCanais, 
    staleTime: Infinity,
    select: (data) => ['TODOS', ...data], 
  });

  // --- CORREÇÃO: Lógica de 'useMemo' e 'isLoading' / 'isError' atualizada ---
  const { dadosFiltrados, avgMargem } = useMemo(() => {
    if (!dnaData) return { dadosFiltrados: [], avgMargem: 0 };
    
    let dadosFiltrados;
    if (canalSelecionado === 'TODOS') {
      const agrupado = new Map<string, DnaCategoria>();
      for (const item of dnaData) {
        const chave = item.idCategoria;
        if (!agrupado.has(chave)) {
          agrupado.set(chave, { ...item } as DnaCategoria);
        } else {
          const existente = agrupado.get(chave)!;
          existente.valorTotalVendido += item.valorTotalVendido;
          existente.quantidadeTotalVendida += item.quantidadeTotalVendida;
          existente.margemTotal += item.margemTotal;
          if (item.clienteCompra) existente.clienteCompra = true;
        }
      }
      dadosFiltrados = Array.from(agrupado.values()).map(item => {
        item.margemPercentual = (item.valorTotalVendido > 0) ? (item.margemTotal / item.valorTotalVendido) : 0;
        return item;
      });
    } else {
      dadosFiltrados = dnaData.filter(d => d.grupoCanal === canalSelecionado);
    }
    
    const compras = dadosFiltrados?.filter(d => d.clienteCompra) ?? [];
    const totalValor = compras.reduce((acc, c) => acc + c.valorTotalVendido, 0);
    const totalMargemPonderada = compras.reduce((acc, c) => acc + (c.margemPercentual * c.valorTotalVendido), 0);
    const avgMargem = totalValor > 0 ? (totalMargemPonderada / totalValor) : 0;

    return { dadosFiltrados, avgMargem };
  }, [dnaData, canalSelecionado]);
  
  const compras = dadosFiltrados?.filter(d => d.clienteCompra) ?? [];
  const oportunidades = dadosFiltrados?.filter(d => !d.clienteCompra) ?? [];

  const sortedCompras = useMemo(() => {
    let sortableItems = [...compras];
    sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
    return sortableItems;
  }, [compras, sortConfig]);

  // --- CORREÇÃO: Função de ordenação vive no PAI ---
  const requestSort = (key: SortableKeys) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };
  
  // Agora verificamos os dois estados de 'loading' e 'error'
  const isLoading = isLoadingDna || isLoadingCanais;
  const isError = isErrorDna || isErrorCanais;

  if (isLoading) {
    return (
       <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Performance por Categoria</CardTitle>
          <CardDescription>O que o cliente compra, por canal de venda.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Performance por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex flex-col items-center justify-center text-destructive">
           <AlertCircle className="h-8 w-8 mb-2" />
           {/* Mostra o erro específico se a Query 2 (Canais) falhar */}
          <p>{isErrorCanais ? "Erro ao carregar lista de canais. (Verifique a API)" : "Erro ao carregar o DNA do cliente."}</p>
        </CardContent>
      </Card>
    );
  }
  // --- FIM DA CORREÇÃO ---

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      
      {/* --- COLUNA 1: TABELA DE PERFORMANCE (Expansível) --- */}
      <Card className="xl:col-span-2">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <CardTitle>Performance por Categoria</CardTitle>
              <CardDescription>O que o cliente compra, por canal de venda.</CardDescription>
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={canalSelecionado} onValueChange={setCanalSelecionado} disabled={isLoading || isError}>
                <SelectTrigger><SelectValue placeholder="Filtrar por Canal" /></SelectTrigger>
                <SelectContent>
                  {canaisDisponiveis?.map((canal: string) => (
                    <SelectItem key={canal} value={canal}>{canal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedCompras.length > 0 ? (
            <div className="relative w-full overflow-auto rounded-md border max-h-[600px]">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead> 
                    {/* --- CORREÇÃO: Passando as props de ordenação --- */}
                    <SortableHeader columnKey="descricaoCategoria" sortConfig={sortConfig} requestSort={requestSort}>Categoria</SortableHeader>
                    <SortableHeader columnKey="valorTotalVendido" className="text-right" sortConfig={sortConfig} requestSort={requestSort}>Faturamento</SortableHeader>
                    <SortableHeader columnKey="quantidadeTotalVendida" className="text-right" sortConfig={sortConfig} requestSort={requestSort}>Quantidade</SortableHeader>
                    <SortableHeader columnKey="margemPercentual" className="text-right" sortConfig={sortConfig} requestSort={requestSort}>Margem %</SortableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCompras.map((item) => (
                    <React.Fragment key={`${item.idCategoria}-${item.grupoCanal}`}>
                      <TableRow 
                        onClick={() => setExpandedRows(prev => ({ ...prev, [item.idCategoria]: !prev[item.idCategoria] }))}
                        className="cursor-pointer"
                      >
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            {expandedRows[item.idCategoria] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{item.descricaoCategoria}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatCurrency(item.valorTotalVendido)}</TableCell>
                        <TableCell className="text-right tabular-nums">{item.quantidadeTotalVendida.toLocaleString('pt-BR')}</TableCell>
                        <TableCell 
                          className={cn("text-right tabular-nums font-semibold", {
                            "text-green-500": item.margemPercentual > avgMargem,
                            "text-red-500": item.margemPercentual < 0
                          })}
                        >
                          {formatPercentage(item.margemPercentual)}
                        </TableCell>
                      </TableRow>
                      
                      {expandedRows[item.idCategoria] && (
                        <DnaProdutoSubTabela
                          clienteId={clienteId}
                          categoriaId={item.idCategoria}
                          canal={canalSelecionado}
                          colSpan={5} 
                        />
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <div className="flex h-[400px] items-center justify-center">
               <p className="text-muted-foreground">{isLoading ? "Carregando..." : "Cliente não comprou por este canal."}</p>
             </div>
          )}
        </CardContent>
      </Card>

      {/* --- COLUNA 2: LISTA DE OPORTUNIDADES (permanece a mesma) --- */}
      <Card>
         <CardHeader>
          <CardTitle>Oportunidades (Cross-sell)</CardTitle>
          <CardDescription>
            Categorias que este cliente ainda não compra {canalSelecionado === 'TODOS' ? 'em nenhum canal' : `no canal ${canalSelecionado}`}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {oportunidades.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {oportunidades.map(op => (
                <div key={`${op.idCategoria}-${op.grupoCanal}`} className="flex items-center space-x-3 p-2 rounded-md border border-dashed border-green-500 bg-green-900/10">
                  <Target className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-green-300">{op.descricaoCategoria}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-muted-foreground">Nenhuma oportunidade óbvia encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};