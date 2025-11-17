'use client';

import { DashboardSummary } from "@/types/analise-credito";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, DollarSign, HelpCircle, ShieldCheck, Scale ,AlertOctagon} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useFilterStore } from "@/store/use-filter-store";

interface DashboardSummaryProps {
  summaryData: DashboardSummary | undefined;
  isLoading: boolean;
}

const SummaryCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode; }) => ( <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle>{icon}</CardHeader><CardContent><div className="text-2xl font-bold">{value}</div></CardContent></Card> );

const ClickableCard = ({ title, value, href }: { title: React.ReactNode; value: string | number; href: string }) => (
    <Link href={href} className="block">
        <Card className="transition-all hover:shadow-lg cursor-pointer hover:border-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium h-5">{title}</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{value}</div></CardContent>
        </Card>
    </Link>
);

const TitleWithStars = ({ count }: { count: number }) => ( <div className="flex items-center">{[...Array(count)].map((_, i) => (<Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />))}</div> );

// Helper para formatar moeda (você deve tê-lo em utils.ts)
const formatCurrency = (value: number) => 
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const DashboardSummaryView = ({ summaryData, isLoading }: DashboardSummaryProps) => {
  const { filtros } = useFilterStore();

  if (isLoading && !summaryData) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-[105px] w-full" />)}</div>
        <Skeleton className="h-10 w-1/3 mt-4" />
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-[105px] w-full" />)}</div>
      </div>
    );
  }

  if (!summaryData) return null;

  const createAnaliseUrl = (estrela: number) => {
    const params = new URLSearchParams(filtros as Record<string, string>);
    // CORREÇÃO: Usando 'C' maiúsculo para bater com o DTO da API
    params.set('ClassificacaoEstrelas', estrela.toString()); 
    return `/analise?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Visão Geral da Carteira</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <SummaryCard title="Total de Clientes" value={summaryData.totalClientes} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
        <SummaryCard title="Limite de Crédito Total" value={summaryData.totalLimiteCredito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />} />
        <SummaryCard title="Saldo Devedor Total" value={summaryData.totalSaldoDevedor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
        <SummaryCard title="Limite Disponível Total" value={summaryData.totalSaldoDisponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} icon={<Scale className="h-4 w-4 text-muted-foreground" />} />
        <SummaryCard 
          title="Cobrança (Vencido 1 Ano)" 
          value={formatCurrency(summaryData.totalCobrança)} 
          icon={<AlertOctagon className="h-4 w-4 text-muted-foreground" />} 
        />
      </div>

      <h2 className="text-2xl font-bold tracking-tight">Distribuição por Classificação</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
        {[5, 4, 3, 2, 1].map(estrela => (
          <ClickableCard key={estrela} title={<TitleWithStars count={estrela} />} value={summaryData.distribuicaoEstrelas[estrela] || 0} href={createAnaliseUrl(estrela)} />
        ))}
        { (summaryData.distribuicaoEstrelas[0] || 0) > 0 && (
            <ClickableCard key={0} title="Inativos" value={summaryData.distribuicaoEstrelas[0]} href={createAnaliseUrl(0)} />
        )}
      </div>
    </div>
  );
};