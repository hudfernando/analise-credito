import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResultadoEnriquecido } from "@/lib/analise";
import { ArrowUpDown } from "lucide-react";

interface TabelaHeaderProps {
  onSort: (key: keyof ResultadoEnriquecido) => void;
}

// Componente auxiliar para criar um cabeçalho de tabela clicável
const SortableHeader = ({ onSort, sortKey, children, className }: { onSort: TabelaHeaderProps['onSort'], sortKey: keyof ResultadoEnriquecido, children: React.ReactNode, className?: string }) => (
  <TableHead className={`cursor-pointer ${className}`} onClick={() => onSort(sortKey)}>
    {children} <ArrowUpDown className="inline-block ml-1 h-3 w-3" />
  </TableHead>
);

export const TabelaHeader = ({ onSort }: TabelaHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <SortableHeader onSort={onSort} sortKey="nomeCliente" className="w-[250px]">Cliente</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="situacaoCredito">Situação Crédito</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="classificacaoEstrelas">Classificação</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="scoreRisco" className="text-center">Scores (Risco/Valor)</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="perfilPagador">Perfil Pagador</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="saldoDevedor" className="text-right">Saldo Devedor</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="limiteDeCredito" className="text-right">Limite</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="atrasoMedioDias" className="text-right">Atraso Médio</SortableHeader>

        {/* ===== COLUNAS ADICIONADAS A PARTIR DAQUI ===== */}
        <SortableHeader onSort={onSort} sortKey="saldoParaCompras" className="text-right">Saldo p/ Compras</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="titulosVencidos" className="text-center">Tít. Vencidos</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="titulosAVencer" className="text-center">Tít. a Vencer</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="diasDoVencidoMaisAntigo" className="text-right">Venc. Mais Antigo</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="maiorCompra" className="text-right">Maior Compra</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="compras90Dias" className="text-center">Compras (90d)</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="mediaCompra90Dias" className="text-right">Média Compra (90d)</SortableHeader>
        <SortableHeader onSort={onSort} sortKey="vencimento7Dias" className="text-right">Venc. (7d)</SortableHeader>
      </TableRow>
    </TableHeader>
  );
};