'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Titulo } from "@/types/analise-credito";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TabelaTitulosAbertosProps {
  titulos: Titulo[];
}

// Função auxiliar para calcular os dias em atraso
const calcularDiasAtraso = (dataVencimento: string) => {
  const hoje = new Date();
  const vencimento = new Date(dataVencimento);
  
  // Zera as horas para comparar apenas as datas
  hoje.setHours(0, 0, 0, 0);
  vencimento.setHours(0, 0, 0, 0);

  if (vencimento >= hoje) {
    return 0; // Não está atrasado
  }

  const diffTime = Math.abs(hoje.getTime() - vencimento.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const TabelaTitulosAbertos = ({ titulos }: TabelaTitulosAbertosProps) => {
  const hasData = titulos && titulos.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Títulos em Aberto</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Emissão</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-center">Atraso (dias)</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {titulos.map((titulo) => {
                  const diasAtraso = calcularDiasAtraso(titulo.dtVenc);
                  const saldo = titulo.valor - titulo.vlPago;
                  
                  return (
                    <TableRow key={titulo.titrecId}>
                      <TableCell>
                        {new Date(titulo.dtEmis).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {new Date(titulo.dtVenc).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className={cn(
                        "text-center font-bold",
                        diasAtraso > 30 && "text-red-600",
                        diasAtraso > 7 && diasAtraso <= 30 && "text-yellow-600",
                      )}>
                        {diasAtraso > 0 ? diasAtraso : '-'}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(titulo.valor)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">
                        {formatCurrency(saldo)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">Nenhum título em aberto para este cliente.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};