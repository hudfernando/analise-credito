'use client';

import React, { useState, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchAnaliseCredito } from '@/http/api';
import { AnaliseCompleta, AnaliseCreditoFiltros } from '@/types/analise-credito';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, AlertCircle, ArrowUpDown, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TabelaFooter } from './tabela-resultados/TabelaFooter';
import Link from 'next/link';

interface TabelaResultadosProps {
    filtrosIniciais: AnaliseCreditoFiltros;
}

type SortableKeys = keyof AnaliseCompleta;

// --- CORREÇÃO: Garantindo que os componentes retornem JSX ---
const RenderEstrelas = ({ classificacao }: { classificacao: number }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < classificacao ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        ))}
    </div>
);

const RenderTendencia = ({ tendencia }: { tendencia: string | null }) => {
    let icon;
    let textoTooltip = tendencia || "Estável";
    switch (tendencia) {
        case "Subindo": icon = <TrendingUp className="h-5 w-5 text-green-500" />; break;
        case "Descendo": icon = <TrendingDown className="h-5 w-5 text-red-500" />; break;
        default: icon = <Minus className="h-5 w-5 text-muted-foreground" />; break;
    }
    // CORRIGIDO: Adicionado o 'return' que estava faltando
    return (
        <Tooltip>
            <TooltipTrigger asChild><span>{icon}</span></TooltipTrigger>
            <TooltipContent><p>{textoTooltip}</p></TooltipContent>
        </Tooltip>
    );
};

const DetalhesOperacionais = ({ cliente }: { cliente: AnaliseCompleta }) => (
    <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 text-sm md:grid-cols-4 lg:grid-cols-5">
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">Score Risco</p><p className="tabular-nums">{cliente.scoreRisco.toFixed(2)}</p></div>
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">Score Valor</p><p className="tabular-nums">{cliente.scoreValor.toFixed(2)}</p></div>
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">IVE</p><p className="tabular-nums">{cliente.ive.toFixed(2)}</p></div>
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">Limite Crédito</p><p className="tabular-nums">{formatCurrency(cliente.limiteCredito)}</p></div>
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">Saldo p/ Compras</p><p className="tabular-nums">{formatCurrency(cliente.saldoParaCompras)}</p></div>
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">Notas de Crédito</p><p className="tabular-nums">{formatCurrency(cliente.notasDeCredito)}</p></div>
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">Títulos a Vencer</p><p className="tabular-nums">{cliente.titulosAVencer}</p></div>
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">Maior Atraso (dias)</p><p className="tabular-nums">{cliente.diasVencidoMaisAntigo}</p></div>
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">Atraso Médio (dias)</p><p className="tabular-nums">{cliente.atrasoMedioDias}</p></div>
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">Maior Compra</p><p className="tabular-nums">{formatCurrency(cliente.maiorCompra)}</p></div>
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">Compras (90d)</p><p className="tabular-nums">{cliente.compras90Dias}</p></div>
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">Média Compra (90d)</p><p className="tabular-nums">{formatCurrency(cliente.mediaCompra90Dias)}</p></div>
        <div className="space-y-1"><p className="font-semibold text-muted-foreground">Venc. (7d)</p><p className="tabular-nums">{formatCurrency(cliente.vencimento7Dias)}</p></div>
    </div>
);


export const TabelaResultados = ({ filtrosIniciais }: TabelaResultadosProps) => {
    const [view, setView] = useState<'carteira' | 'semanal'>('carteira');
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>({ key: 'ive', direction: 'desc' });
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } = useInfiniteQuery({
        queryKey: ['analiseCredito', filtrosIniciais],
        queryFn: ({ pageParam = 1 }) => fetchAnaliseCredito({ ...filtrosIniciais, pagina: pageParam }),
        getNextPageParam: (lastPage) => lastPage.proximaPagina,
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5,
    });

    const resultados = useMemo(() => data?.pages.flatMap(page => page.itens) ?? [], [data]);
    const sortedResultados = useMemo(() => {
        let sortableItems = [...resultados];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
                }
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                return 0;
            });
        }
        return sortableItems;
    }, [resultados, sortConfig]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader = ({ children, columnKey }: { children: React.ReactNode; columnKey: SortableKeys; }) => (
        <TableHead className="whitespace-nowrap">
            <Button variant="ghost" onClick={() => requestSort(columnKey)}>
                {children}
                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortConfig?.key === columnKey ? '' : 'text-muted-foreground'}`} />
            </Button>
        </TableHead>
    );

    // --- CORREÇÃO: A função 'renderContent' foi movida para antes de ser chamada ---
    const renderContent = (colSpan: number) => {
        if (isPending && !data) {
            return (<TableRow><TableCell colSpan={colSpan}><div className="space-y-2 p-4">{[...Array(10)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div></TableCell></TableRow>);
        }
        if (isError) {
            return (<TableRow><TableCell colSpan={colSpan} className="py-10 text-center text-red-500"><div className="flex items-center justify-center"><AlertCircle className="mr-2 h-5 w-5" /><span>Ocorreu um erro ao buscar os dados.</span></div></TableCell></TableRow>);
        }
        if (!isPending && sortedResultados.length === 0) {
            return (<TableRow><TableCell colSpan={colSpan} className="py-10 text-center text-muted-foreground">Nenhum resultado encontrado para os filtros selecionados.</TableCell></TableRow>);
        }
        return null;
    };
    
    const tableContent = renderContent(view === 'carteira' ? 8 : 12);

    return (
        <TooltipProvider>
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Resultados Detalhados</CardTitle>
                    <ToggleGroup type="single" value={view} onValueChange={(value) => { if (value) setView(value as any) }} defaultValue="carteira">
                        <ToggleGroupItem value="carteira">Análise de Carteira</ToggleGroupItem>
                        <ToggleGroupItem value="semanal">Análise Semanal</ToggleGroupItem>
                    </ToggleGroup>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto rounded-md border max-h-[70vh]">
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-background">
                                {view === 'carteira' ? (
                                    <TableRow>
                                        <TableHead className="sticky left-0 w-[50px] bg-background"></TableHead>
                                        <SortableHeader columnKey="clienteId">Cliente</SortableHeader>
                                        <SortableHeader columnKey="nomeCliente">Nome do Cliente</SortableHeader>
                                        <SortableHeader columnKey="classificacaoEstrelas">Classificação</SortableHeader>
                                        <SortableHeader columnKey="segmento">Segmento</SortableHeader>
                                        <SortableHeader columnKey="probabilidadeInadimplencia">Prob. Inadimplência</SortableHeader>
                                        <SortableHeader columnKey="saldoDevedor">Saldo Devedor</SortableHeader>
                                        <SortableHeader columnKey="titulosVencidos">Títulos Vencidos</SortableHeader>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <SortableHeader columnKey="clienteId">Cliente</SortableHeader>
                                        <SortableHeader columnKey="nomeCliente">Nome do Cliente</SortableHeader>
                                        <SortableHeader columnKey="classificacaoEstrelas">Classificação</SortableHeader>
                                        <SortableHeader columnKey="tendencia">Tendência</SortableHeader>
                                        <SortableHeader columnKey="valorSemana1">Valor S1</SortableHeader>
                                        <SortableHeader columnKey="qtdSemana1">Qtd S1</SortableHeader>
                                        <SortableHeader columnKey="valorSemana2">Valor S2</SortableHeader>
                                        <SortableHeader columnKey="qtdSemana2">Qtd S2</SortableHeader>
                                        <SortableHeader columnKey="valorSemana3">Valor S3</SortableHeader>
                                        <SortableHeader columnKey="qtdSemana3">Qtd S3</SortableHeader>
                                        <SortableHeader columnKey="valorSemana4">Valor S4</SortableHeader>
                                        <SortableHeader columnKey="qtdSemana4">Qtd S4</SortableHeader>
                                    </TableRow>
                                )}
                            </TableHeader>
                            <TableBody>
                                {tableContent ?? (view === 'carteira' ?
                                    sortedResultados.map((r) => (
                                        <React.Fragment key={r.clienteId}>
                                            <TableRow>
                                                <TableCell className="sticky left-0 bg-background">
                                                    <Button variant="ghost" size="sm" onClick={() => setExpandedRows(prev => ({ ...prev, [r.clienteId]: !prev[r.clienteId] }))}>
                                                        {expandedRows[r.clienteId] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="sticky left-[50px] bg-background font-medium">
                                                    <Link href={`/cliente/${r.clienteId}`} className="hover:underline">{r.clienteId}</Link>
                                                </TableCell>
                                                <TableCell className="sticky left-[150px] bg-background">
                                                    <Link href={`/cliente/${r.clienteId}`} className="hover:underline">{r.nomeCliente}</Link>
                                                </TableCell>
                                                <TableCell><RenderEstrelas classificacao={r.classificacaoEstrelas} /></TableCell>
                                                <TableCell>{r.segmento}</TableCell>
                                                <TableCell>
                                                    <div className={cn("text-center font-semibold tabular-nums", {
                                                        "text-red-500 dark:text-red-400": r.probabilidadeInadimplencia > 0.7,
                                                        "text-yellow-500 dark:text-yellow-400": r.probabilidadeInadimplencia > 0.4 && r.probabilidadeInadimplencia <= 0.7,
                                                    })}>
                                                        {formatPercentage(r.probabilidadeInadimplencia)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">{formatCurrency(r.saldoDevedor)}</TableCell>
                                                <TableCell className="text-center tabular-nums">{r.titulosVencidos}</TableCell>
                                            </TableRow>
                                            {expandedRows[r.clienteId] && (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="p-0">
                                                        <DetalhesOperacionais cliente={r} />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    )) :
                                    sortedResultados.map((r) => (
                                        <TableRow key={r.clienteId} className="group">
                                            <TableCell className="sticky left-0 bg-background group-hover:bg-muted/50 font-medium">{r.clienteId}</TableCell>
                                            <TableCell className="sticky left-[100px] bg-background group-hover:bg-muted/50 w-[300px] truncate">{r.nomeCliente}</TableCell>
                                            <TableCell><RenderEstrelas classificacao={r.classificacaoEstrelas} /></TableCell>
                                            <TableCell><div className="flex justify-center"><RenderTendencia tendencia={r.tendencia} /></div></TableCell>
                                            <TableCell className="text-right tabular-nums">{formatCurrency(r.valorSemana1)}</TableCell>
                                            <TableCell className="text-center tabular-nums">{r.qtdSemana1}</TableCell>
                                            <TableCell className="text-right tabular-nums">{formatCurrency(r.valorSemana2)}</TableCell>
                                            <TableCell className="text-center tabular-nums">{r.qtdSemana2}</TableCell>
                                            <TableCell className="text-right tabular-nums">{formatCurrency(r.valorSemana3)}</TableCell>
                                            <TableCell className="text-center tabular-nums">{r.qtdSemana3}</TableCell>
                                            <TableCell className="text-right tabular-nums">{formatCurrency(r.valorSemana4)}</TableCell>
                                            <TableCell className="text-center tabular-nums">{r.qtdSemana4}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                            <TabelaFooter
                                onLoadMore={fetchNextPage}
                                hasNextPage={!!hasNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                            />
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
};