// Caminho: src/components/analise/tabela-resultados/TabelaHeader.tsx

'use client';

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// --- MUDANÇA AQUI ---
// Importamos nosso novo e único tipo de dados.
import { AnaliseCompleta } from "@/types/analise-credito";

// Definimos as chaves que podem ser usadas para ordenação.
type SortableKeys = keyof AnaliseCompleta;

type SortConfig = { 
  key: SortableKeys; 
  direction: 'asc' | 'desc'; 
} | null;

interface TabelaHeaderProps {
  onSort: (key: SortableKeys) => void;
  sortConfig: SortConfig;
}

// Componente auxiliar para criar um cabeçalho de coluna ordenável
const SortableHeader = ({ 
  children, 
  columnKey,
  onSort,
  sortConfig
}: { 
  children: React.ReactNode; 
  columnKey: SortableKeys;
  onSort: (key: SortableKeys) => void;
  sortConfig: SortConfig;
}) => {
  const isSorted = sortConfig?.key === columnKey;
  const direction = isSorted ? sortConfig.direction : null;

  return (
    <TableHead>
      <Button variant="ghost" onClick={() => onSort(columnKey)}>
        {children}
        <ArrowUpDown className={`ml-2 h-4 w-4 ${isSorted ? '' : 'text-muted-foreground'}`} />
      </Button>
    </TableHead>
  );
};


export const TabelaHeader = ({ onSort, sortConfig }: TabelaHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        {/* Mapeamos as novas colunas para o nosso cabeçalho ordenável */}
        <SortableHeader columnKey="clienteId" onSort={onSort} sortConfig={sortConfig}>Cliente</SortableHeader>
        <SortableHeader columnKey="nomeCliente" onSort={onSort} sortConfig={sortConfig}>Nome do Cliente</SortableHeader>
        <SortableHeader columnKey="situacaoCredito" onSort={onSort} sortConfig={sortConfig}>Situação</SortableHeader>
        <SortableHeader columnKey="classificacaoEstrelas" onSort={onSort} sortConfig={sortConfig}>Classificação</SortableHeader>
        <SortableHeader columnKey="segmento" onSort={onSort} sortConfig={sortConfig}>Segmento</SortableHeader>
        <SortableHeader columnKey="scoreRisco" onSort={onSort} sortConfig={sortConfig}>Score Risco</SortableHeader>
        <SortableHeader columnKey="scoreValor" onSort={onSort} sortConfig={sortConfig}>Score Valor</SortableHeader>
        <SortableHeader columnKey="ive" onSort={onSort} sortConfig={sortConfig}>IVE</SortableHeader>
        <SortableHeader columnKey="saldoDevedor" onSort={onSort} sortConfig={sortConfig}>Saldo Devedor</SortableHeader>
        <SortableHeader columnKey="compras90Dias" onSort={onSort} sortConfig={sortConfig}>Compras (90d)</SortableHeader>
      </TableRow>
    </TableHeader>
  );
};