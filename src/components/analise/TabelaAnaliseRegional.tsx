'use client';

import { useQuery } from "@tanstack/react-query";
import { AnaliseCreditoFiltros } from "@/types/analise-credito";
import { fetchAnaliseRegional } from "@/http/api";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { MapPin, TrendingUp, AlertCircle, ServerCrash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
    filtros: AnaliseCreditoFiltros;
}

export function TabelaAnaliseRegional({ filtros }: Props) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['analiseRegional', filtros],
        queryFn: () => fetchAnaliseRegional(filtros),
        staleTime: 1000 * 60 * 10,
        retry: 1, // Tenta apenas 1 vez antes de falhar
    });

    // 1. Estado de Carregamento
    if (isLoading) {
        return (
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
            </Card>
        );
    }

    // 2. Tratamento de Erro da API (Evita tela branca)
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-red-200 bg-red-50 rounded-md text-red-600">
                <ServerCrash className="h-10 w-10 mb-2" />
                <h3 className="font-semibold text-lg">Erro ao carregar dados regionais</h3>
                <p className="text-sm opacity-80">
                    {error instanceof Error ? error.message : "Erro de comunicação com o servidor."}
                </p>
                <p className="text-xs mt-2 text-muted-foreground">Verifique se a API está rodando e se o serviço GeoService foi registrado.</p>
            </div>
        );
    }

    // 3. Estado Vazio (Sem dados para os filtros)
    if (!data || data.length === 0) {
        return (
            <div className="p-12 text-center border rounded-md bg-muted/10">
                <MapPin className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium text-muted-foreground">Nenhum dado geográfico encontrado</h3>
                <p className="text-sm text-muted-foreground/80">Tente ajustar os filtros de Região ou Vendedor.</p>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    Inteligência Geográfica (Expansão)
                </CardTitle>
                <Badge variant="outline" className="font-mono">
                    {data.length} Cidades
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Município</TableHead>
                                <TableHead>Região</TableHead>
                                <TableHead className="text-right">População</TableHead>
                                <TableHead className="text-right">Vendas (R$)</TableHead>
                                <TableHead className="text-right">Clientes</TableHead>
                                <TableHead className="text-right text-primary font-bold">Venda p/ Hab.</TableHead>
                                <TableHead className="text-right">Share Est.</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, idx) => (
                                <TableRow key={`${item.municipio}-${idx}`} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">
                                        {item.municipio} <span className="text-xs text-muted-foreground">({item.uf})</span>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{item.mesorregiao}</TableCell>

                                    <TableCell className="text-right tabular-nums">
                                        {/* Proteção contra nulos */}
                                        {item.populacao ? item.populacao.toLocaleString() : '-'}
                                    </TableCell>

                                    <TableCell className="text-right tabular-nums font-semibold">
                                        {formatCurrency(item.valorTotalVendido || 0)}
                                    </TableCell>

                                    <TableCell className="text-right tabular-nums">
                                        {item.clientesAtivos || 0}
                                    </TableCell>

                                    {/* KPI: Venda per Capita (Com ícones seguros) */}
                                    <TableCell className="text-right tabular-nums">
                                        <div className="flex items-center justify-end gap-2">
                                            {formatCurrency(item.vendaPerCapita || 0)}

                                            {/* Lógica visual simples */}
                                            {(item.vendaPerCapita || 0) < 1 && (item.populacao || 0) > 10000 && (
                                                <span title="Baixo desempenho em cidade grande" className="text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                </span>
                                            )}
                                            {(item.vendaPerCapita || 0) > 10 && (
                                                <span title="Alta performance" className="text-green-500">
                                                    <TrendingUp className="h-3 w-3" />
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right tabular-nums text-muted-foreground">
                                        {formatPercentage(item.marketShareEstimado || 0)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}