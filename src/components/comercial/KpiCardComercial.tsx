// Caminho: components/comercial/KpiCardComercial.tsx
'use client';

import { PerformanceGeral } from "@/types/analise-credito";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Package, TrendingUp, Percent } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardComercialProps {
  data: PerformanceGeral | undefined;
  isLoading: boolean;
}

// Componente interno para um Card individual
const KpiCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode; }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

// Helper para formatar moeda
const formatCurrency = (value: number) => 
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Helper para formatar percentual
const formatPercent = (value: number) => 
  `${value.toFixed(1)}%`;


export const KpiCardComercial = ({ data, isLoading }: KpiCardComercialProps) => {
  
  // --- Estado de Carregamento ---
  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-[105px] w-full" />)}
      </div>
    );
  }

  // --- Estado Carregado ---
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <KpiCard 
        title="Faturamento Total" 
        value={formatCurrency(data.faturamentoTotal)} 
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
      />
      <KpiCard 
        title="Ticket Médio" 
        value={formatCurrency(data.ticketMedio)} 
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} 
      />
      <KpiCard 
        title="Total de Pedidos" 
        value={data.numeroDePedidos.toLocaleString('pt-BR')} 
        icon={<Package className="h-4 w-4 text-muted-foreground" />} 
      />
      <KpiCard 
        title="Clientes Positivados" 
        value={data.clientesPositivados.toLocaleString('pt-BR')} 
        icon={<Users className="h-4 w-4 text-muted-foreground" />} 
      />
      <KpiCard 
        title="Margem Média" 
        value={formatPercent(data.margemMediaPercentual)} 
        icon={<Percent className="h-4 w-4 text-muted-foreground" />} 
      />
    </div>
  );
};