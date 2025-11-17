import { ClienteDetalhe } from "@/types/analise-credito";
// 1. REMOVER a importação do Badge padrão
// import { Badge } from "@/components/ui/badge"; 
// 2. IMPORTAR o seu StatusBadge, que já tem a inteligência de cores
import { StatusBadge } from "@/components/analise/tabela-resultados/StatusBadge"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CircleDollarSign, Scale, ShieldAlert, FileText, CalendarDays, ShoppingCart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Componente auxiliar MetricCard (permanece o mesmo)
const MetricCard = ({ title, value, icon, tooltipText }: { title: string; value: string | number; icon: React.ReactNode; tooltipText: string; }) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="rounded-lg border bg-background p-4 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium tracking-tight">{title}</h3>
            {icon}
          </div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const ClienteDetalheHeader = ({ cliente }: { cliente: ClienteDetalhe }) => {
  // 3. REMOVER a função getBadgeVariant, pois não é mais necessária
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl">{cliente.razaoSocial}</CardTitle>
            <p className="text-sm text-muted-foreground">ID: {cliente.cdClien} | CNPJ: {cliente.cnpj}</p>
          </div>
          {/* 4. USAR o componente StatusBadge, passando o código da situação */}
          <div className="text-base">
            <StatusBadge status={cliente.situacaoCredito} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Limite de Crédito"
            value={formatCurrency(cliente.limiteCredito)}
            icon={<Scale className="h-4 w-4 text-muted-foreground" />}
            tooltipText="O limite total de crédito concedido ao cliente."
          />
          <MetricCard
            title="Valor em Aberto"
            value={formatCurrency(cliente.valorEmAberto)}
            icon={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />}
            tooltipText="Soma de todos os títulos não quitados."
          />
          <MetricCard
            title="Valor Vencido"
            value={formatCurrency(cliente.valorVencido)}
            icon={<ShieldAlert className="h-4 w-4 text-muted-foreground" />}
            tooltipText="Soma dos títulos em aberto que já passaram da data de vencimento."
          />
          <MetricCard
            title="Títulos Vencidos"
            value={cliente.titulosVencidos}
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            tooltipText="Quantidade de títulos que estão vencidos e não pagos."
          />
          <MetricCard
            title="Atraso Médio (Pagos)"
            value={`${cliente.atrasoMedio} dias`}
            icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
            tooltipText="A média de dias de atraso para pagamento dos títulos já quitados."
          />
           <MetricCard
            title="Última Compra"
            value={cliente.dataUltimaCompra ? new Date(cliente.dataUltimaCompra).toLocaleDateString('pt-BR') : 'N/A'}
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            tooltipText="Data da emissão do último título."
          />
        </div>
      </CardContent>
    </Card>
  );
};