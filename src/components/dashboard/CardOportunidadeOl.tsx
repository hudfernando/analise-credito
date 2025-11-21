'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchOportunidadesOl } from "@/http/api";
import { AnaliseCreditoFiltros } from "@/types/analise-credito";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck, ArrowRightLeft, AlertTriangle, ExternalLink } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface Props {
    filtros: AnaliseCreditoFiltros;
}

export function CardOportunidadeOl({ filtros }: Props) {
    const { data, isLoading } = useQuery({
        queryKey: ['oportunidadesOl', filtros],
        queryFn: () => fetchOportunidadesOl(filtros),
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) return <Skeleton className="h-[140px] w-full rounded-xl" />;

    if (!data || data.length === 0) return null;

    // Calcula o total que está sendo comprado fora do canal ideal
    const totalDesvio = data.reduce((acc, item) => acc + item.valorCompraVarejo, 0);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/10 to-transparent hover:bg-accent/50 transition-colors cursor-pointer group shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-600">
                            Eficiência de Canal (OL)
                            <Truck className="h-4 w-4 text-blue-500" />
                        </CardTitle>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                            {data.length} Alertas
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {formatCurrency(totalDesvio)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            em compras de Indústria (OL) feitas no Varejo.
                        </p>
                        <div className="mt-3 flex items-center text-xs font-medium text-blue-600 group-hover:underline">
                            Ver oportunidades de migração <ArrowRightLeft className="ml-1 h-3 w-3" />
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>

            <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 bg-background text-foreground border-border">

                <div className="p-6 pb-4 border-b border-border">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="flex items-center gap-2 text-xl text-blue-600">
                            <Truck className="h-6 w-6" />
                            Otimização de Canal (Share de OL)
                        </DialogTitle>
                        <DialogDescription>
                            Clientes comprando marcas de OL (ex: Hypera, Neo Química) através de canais de Varejo/Cotação.
                            <br />Migrar para o OL fideliza o cliente e garante o volume contratado com a indústria.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-4">
                        <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-md flex-1 text-center">
                            <span className="text-xs text-blue-600 font-semibold uppercase">Volume Fora do Canal</span>
                            <div className="text-2xl font-bold text-blue-700">{formatCurrency(totalDesvio)}</div>
                        </div>
                        <div className="bg-muted/30 border p-3 rounded-md flex-1 text-center">
                            <span className="text-xs text-muted-foreground font-semibold uppercase">Clientes Impactados</span>
                            <div className="text-2xl font-bold">{data.length}</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-0 w-full bg-muted/10">
                    <ScrollArea className="h-full w-full p-6">
                        <div className="space-y-3">
                            {data.map((item, idx) => (
                                <div key={`${item.clienteId}-${idx}`} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-blue-400/50 transition-all group relative overflow-hidden">

                                    {/* Indicador lateral */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg" />

                                    <div className="flex flex-col gap-1 mb-2 md:mb-0 pl-3">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/cliente/${item.clienteId}`} className="font-bold text-lg text-foreground hover:underline flex items-center gap-2">
                                                {item.nomeCliente}
                                                <ExternalLink className="h-3 w-3 opacity-50" />
                                            </Link>
                                            <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
                                                ID: {item.clienteId}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">Marca:</span>
                                            <span className="font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs border border-blue-200">
                                                {item.fabricante}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 pl-3 md:pl-0">
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase text-muted-foreground block">Compra no Varejo</span>
                                            <div className="font-bold text-red-500 text-lg">
                                                {formatCurrency(item.valorCompraVarejo)}
                                            </div>
                                        </div>

                                        <ArrowRightLeft className="h-5 w-5 text-muted-foreground/30" />

                                        <div className="text-right min-w-[100px]">
                                            <span className="text-[10px] uppercase text-muted-foreground block">Compra no OL</span>
                                            <div className="font-bold text-muted-foreground text-lg">
                                                {formatCurrency(item.valorCompraOl)}
                                            </div>
                                            {item.valorCompraOl === 0 && (
                                                <span className="text-[10px] text-orange-500 flex justify-end items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" /> Nunca comprou
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}