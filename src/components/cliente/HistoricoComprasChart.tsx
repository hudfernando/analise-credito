'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoricoCompras } from "@/types/analise-credito";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from "@/lib/utils";

interface HistoricoComprasChartProps {
  historico: HistoricoCompras[];
}

// Componente para o Tooltip customizado do gráfico
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold">{label}</p>
        <p className="text-sm text-primary">{`Total: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export const HistoricoComprasChart = ({ historico }: HistoricoComprasChartProps) => {
  // Mapeia os dados da API para o formato que o gráfico espera,
  // criando um rótulo amigável para o mês/ano.
  const chartData = historico.map(item => ({
    name: `${item.mes.toString().padStart(2, '0')}/${item.ano.toString().slice(-2)}`,
    'Total Compras': item.valorTotal,
  }));

  // Verifica se há dados para exibir o gráfico
  const hasData = chartData && chartData.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Compras (Últimos 12 meses)</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value as number)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar 
                  dataKey="Total Compras" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">Nenhum histórico de compras encontrado no período.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};