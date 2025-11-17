// Caminho: components/comercial/RankingChart.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

// Helper para formatar moeda (pode ser movido para utils.ts)
const formatCurrency = (value: number) => 
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Tooltip customizado para o gráfico
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold">{label}</p>
        <p className="text-sm text-primary">{`Valor: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

interface RankingChartProps {
  title: string;
  data: any[] | undefined; // Usamos 'any' para torná-lo reutilizável
  isLoading: boolean;
  dataKey: string; // Chave para o valor (ex: "valorTotalVendido")
  nameKey: string; // Chave para o nome (ex: "descricaoProduto")
}

export const RankingChart = ({ title, data, isLoading, dataKey, nameKey }: RankingChartProps) => {
  
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis 
                type="number" 
                tickFormatter={(value) => (value / 1000).toLocaleString('pt-BR') + 'k'} 
                fontSize={12}
              />
              <YAxis 
                type="category" 
                dataKey={nameKey} 
                width={150} 
                tick={{ fontSize: 10 }} 
                axisLine={false} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
              <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};