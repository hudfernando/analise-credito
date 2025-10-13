import { Button } from '@/components/ui/button';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResultadoEnriquecido } from '@/lib/analise';
import { ArrowUpDown } from 'lucide-react';

interface TabelaHeaderProps {
  onSort: (key: keyof ResultadoEnriquecido) => void;
}

export const TabelaHeader = ({ onSort }: TabelaHeaderProps) => {
  return (
    <TableHeader className="sticky top-0 z-10">
      <TableRow className="border-b-azul-claro/20 bg-card hover:bg-azul-claro/10">
        {/* Colunas Fixas */}
        <TableHead className="sticky left-0 z-20 bg-card min-w-[150px]"><Button variant="ghost" onClick={() => onSort('clienteId')}>Cliente <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
        <TableHead className="sticky left-[150px] z-20 bg-card min-w-[300px]"><Button variant="ghost" onClick={() => onSort('nomeCliente')}>Nome <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
        
        {/* Colunas de Análise */}
        <TableHead className="text-azul-claro"><Button variant="ghost" onClick={() => onSort('classificacaoEstrelas')}>Classificação <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
        <TableHead className="text-azul-claro"><Button variant="ghost" onClick={() => onSort('scoreRisco')}>Score Risco <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
        <TableHead className="text-azul-claro"><Button variant="ghost" onClick={() => onSort('scoreValor')}>Score Valor <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
        <TableHead className="text-center text-azul-claro font-semibold">Alerta</TableHead>
        <TableHead className="text-azul-claro"><Button variant="ghost" onClick={() => onSort('perfilPagador')}>Perfil Pagador <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
        
        {/* Colunas Financeiras e de Risco (Restantes) */}
        <TableHead className="text-right"><Button variant="ghost" onClick={() => onSort('saldoDevedor')}>Saldo Devedor <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
        <TableHead className="text-right font-semibold">Limite Crédito</TableHead>
        <TableHead className="text-right font-semibold">Saldo p/ Compras</TableHead>
        <TableHead className="text-right font-semibold">Notas de Crédito</TableHead>
        <TableHead className="text-center"><Button variant="ghost" onClick={() => onSort('titulosVencidos')}>Tít. Vencidos <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
        <TableHead className="text-center font-semibold">Tít. a Vencer</TableHead>
        <TableHead className="text-center font-semibold">Venc. Mais Antigo (d)</TableHead>
        <TableHead className="text-center"><Button variant="ghost" onClick={() => onSort('atrasoMedioDias')}>Atraso Médio (d) <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
        <TableHead className="text-right font-semibold">Maior Compra</TableHead>
        <TableHead className="text-center font-semibold">Compras (90d)</TableHead>
        <TableHead className="text-right font-semibold">Média Compra (90d)</TableHead>
        <TableHead className="text-right font-semibold">Vencimento (7d)</TableHead>
      </TableRow>
    </TableHeader>
  );
};