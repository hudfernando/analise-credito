'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchOportunidadesDashboard } from "@/http/api";
import { AnaliseCreditoFiltros } from "@/types/analise-credito";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, TrendingUp, ArrowRight, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge"; // Importe o Badge

interface Props {
    filtros: AnaliseCreditoFiltros;
}

export function CardOportunidadesGeral({ filtros }: Props) {
    const { data, isLoading } = useQuery({
        queryKey: ['oportunidadesDashboard', filtros], 
        queryFn: () => fetchOportunidadesDashboard(filtros),
        staleTime: 1000 * 60 * 5, 
    });

    if (isLoading) return <Skeleton className="h-[140px] w-full rounded-xl" />;

    if (!data || data.totalOportunidades === 0) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                {/* Card do Dashboard (Sem alterações visuais) */}
                <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50/10 to-transparent hover:bg-accent/50 transition-colors cursor-pointer group shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            Radar de Oportunidades
                            <Flame className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">
                            {data.totalOportunidades} Clientes
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            com alto potencial de mix detectado.
                        </p>
                        <div className="mt-3 flex items-center text-xs font-medium text-orange-500 group-hover:underline">
                            Ver lista detalhada <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0 bg-background text-foreground border-border">
                
                <div className="p-6 pb-4 border-b border-border">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <Flame className="h-7 w-7 text-orange-500 fill-orange-500" /> 
                            Oportunidades de Mix (Agrupado por Cliente)
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            Clientes que não estão comprando categorias de alta demanda na região.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-muted/30 p-4 rounded-lg text-center border border-border">
                            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider block mb-1">Total de Clientes</span>
                            <div className="text-3xl font-bold">{data.totalOportunidades}</div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg text-center border border-border">
                            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider block mb-1">Potencial Total Estimado</span>
                            <div className="text-3xl font-bold text-green-500 truncate" title={formatCurrency(data.valorPotencialTotal)}>
                                +{formatCurrency(data.valorPotencialTotal)}
                            </div>
                        </div>
                        <div className="bg-orange-500/10 p-4 rounded-lg text-center border border-orange-500/30 flex flex-col justify-center items-center">
                            <span className="text-xs text-orange-500 uppercase font-semibold tracking-wider block mb-1">Ação Recomendada</span>
                            <div className="text-lg font-bold text-orange-500 leading-tight">Oferecer Mix Faltante</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-0 w-full bg-background/50">
                    <ScrollArea className="h-full w-full p-6">
                        <div className="space-y-3">
                            {data.topOportunidades.map((op, idx) => (
                                <div key={`${op.clienteId}-${idx}`} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-card border border-border rounded-lg hover:border-orange-500/50 hover:bg-accent/50 transition-all group">
                                    
                                    {/* Coluna Esquerda: Cliente e Badges */}
                                    <div className="flex flex-col gap-2 mb-2 md:mb-0 flex-1">
                                        <div className="flex items-baseline gap-2">
                                            <Link href={`/cliente/${op.clienteId}`} className="font-bold text-lg text-primary hover:underline decoration-orange-500 decoration-2 underline-offset-2">
                                                {op.nomeCliente}
                                            </Link>
                                            <span className="text-xs font-mono text-muted-foreground">ID: {op.clienteId}</span>
                                        </div>
                                        
                                        {/* Lista de Categorias Faltantes (Badges) */}
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground mr-1">Oportunidades:</span>
                                            {op.oportunidades.map((item, i) => (
                                                <Badge key={i} variant="outline" className="bg-muted/50 border-orange-200 text-foreground hover:bg-orange-100 hover:text-orange-900 transition-colors">
                                                    {item.categoria} 
                                                    <span className="ml-1.5 text-[10px] opacity-60 font-normal">
                                                        ({formatCurrency(item.potencial)})
                                                    </span>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Coluna Direita: Valor Total */}
                                    <div className="text-left md:text-right pl-0 md:pl-6 md:border-l border-border min-w-[180px]">
                                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Potencial do Cliente</span>
                                        <div className="text-xl font-bold text-green-500">
                                            +{formatCurrency(op.potencialTotal)}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center md:justify-end gap-1.5 mt-1">
                                            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                                            <span className="font-medium">Alta Demanda Regional</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                
                <div className="p-3 border-t border-border bg-muted/20 text-xs text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Mostrando os 50 clientes com maior potencial de mix.
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}