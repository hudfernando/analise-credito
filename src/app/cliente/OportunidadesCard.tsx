'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchOportunidadesQuentes } from "@/http/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OportunidadesCardProps {
    clienteId: number;
}

export function OportunidadesCard({ clienteId }: OportunidadesCardProps) {
    const { data: oportunidades, isLoading } = useQuery({
        queryKey: ['oportunidadesQuentes', clienteId],
        queryFn: () => fetchOportunidadesQuentes(clienteId),
        staleTime: 1000 * 60 * 10, // Cache de 10 min
    });

    if (isLoading) {
        return <Skeleton className="h-[200px] w-full rounded-xl" />;
    }

    // Se não houver oportunidades (cliente já compra tudo ou base insuficiente), não mostramos nada ou mostramos msg
    if (!oportunidades || oportunidades.length === 0) {
        return (
            <Card className="bg-muted/20 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                    <TrendingUp className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Sem oportunidades de mix óbvias detectadas.</p>
                    <p className="text-xs">Este cliente já possui alta aderência ao mix da região.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
                        Oportunidades de Venda (Mix)
                    </CardTitle>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                        Sugestão Inteligente
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {oportunidades.map((op, index) => (
                        <div key={op.idCategoria} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                            <div className="space-y-1">
                                <p className="font-medium text-sm">
                                    {op.descricaoCategoria}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Categoria não comprada pelo cliente.
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-green-600 flex items-center justify-end gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {(op.percentualAdesaoPeerGroup * 100).toFixed(0)}%
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    dos clientes na região compram
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-2 border-t text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Sugestões baseadas em clientes similares no mesmo estado.
                </div>
            </CardContent>
        </Card>
    );
}