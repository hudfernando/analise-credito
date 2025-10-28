// Caminho: src/components/documentacao/LegendaInsights.tsx

'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { BookOpenText } from "lucide-react";

export const LegendaInsights = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Abrir Legenda de Insights">
                    <BookOpenText className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Legenda dos Insights</DialogTitle>
                    <DialogDescription>
                        Entenda o significado de cada métrica e classificação na análise.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 text-sm">
                    <div className="space-y-1">
                        <p className="font-semibold">Score de Risco (1-10)</p>
                        <p className="text-muted-foreground">Avalia o risco de um cliente com base em seu comportamento financeiro. Quanto maior o score, maior o risco.</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold">Score de Valor (1-10)</p>
                        <p className="text-muted-foreground">Mede o valor que um cliente agrega ao negócio, baseado na frequência e no valor de suas compras. Quanto maior o score, maior o valor.</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold">IVE (Índice de Valor Estratégico)</p>
                        <p className="text-muted-foreground">É o principal indicador para a classificação em estrelas. Calculado como <span className="font-mono bg-muted px-1 rounded">Score de Valor - Score de Risco</span>. Um IVE positivo indica um cliente saudável.</p>
                    </div>
                    <Separator className="my-2" />
                    
                    {/* --- NOVA SEÇÃO ADICIONADA AQUI --- */}
                    <div className="space-y-1">
                        <p className="font-semibold">Prob. Inadimplência</p>
                        <p className="text-muted-foreground">
                            Uma previsão, em porcentagem, da chance de um cliente não cumprir com seus pagamentos futuros.
                        </p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground pl-2 mt-1">
                            <li>Influenciada pelo histórico de atrasos, dívidas atuais e uso do limite de crédito.</li>
                            <li><span className="text-yellow-500 font-bold">Amarelo:</span> Risco de atenção.</li>
                            <li><span className="text-red-500 font-bold">Vermelho:</span> Risco alto.</li>
                        </ul>
                    </div>
                    {/* --- FIM DA NOVA SEÇÃO --- */}

                </div>
            </DialogContent>
        </Dialog>
    );
};