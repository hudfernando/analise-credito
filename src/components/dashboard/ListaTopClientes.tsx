// Caminho: src/components/dashboard/ListaTopClientes.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TopClienteDto } from "@/types/analise-credito";
import Link from "next/link";

interface ListaTopClientesProps {
  title: string;
  data: TopClienteDto[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const ListaTopClientes = ({ title, data, isLoading, isError }: ListaTopClientesProps) => {
  const renderContent = () => {
    if (isLoading) {
      return <div className="space-y-3 p-6">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>;
    }
    if (isError) {
      return <p className="p-6 text-sm text-destructive">Erro ao carregar dados.</p>;
    }
    if (!data || data.length === 0) {
      return <p className="p-6 text-sm text-muted-foreground">Nenhum cliente para exibir.</p>;
    }
    return (
      <ul className="divide-y divide-border">
        {data.map((cliente) => (
          <li key={cliente.clienteId} className="p-3 hover:bg-muted/50">
            <Link href={`/cliente/${cliente.clienteId}`} className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="font-semibold">{cliente.nomeCliente}</span>
                <span className="text-xs text-muted-foreground">ID: {cliente.clienteId}</span>
              </div>
              <div className="text-right">
                <span className="font-bold tabular-nums">
                  {cliente.labelValor === "Prob. Inadimplência"
                    ? `${(cliente.valorPrincipal * 100).toFixed(0)}%`
                    : cliente.valorPrincipal.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">{cliente.labelValor}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};