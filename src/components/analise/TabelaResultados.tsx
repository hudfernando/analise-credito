// src/components/analise/TabelaResultados.tsx
'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, FileDown, Loader2, Star, AlertTriangle } from 'lucide-react';
import { StatusBadge } from './tabela-resultados/StatusBadge';
import * as XLSX from 'xlsx';
import type { ResultadoEnriquecido } from '@/lib/analise';

type SortConfig = {
  key: keyof ResultadoEnriquecido;
  direction: 'ascending' | 'descending';
} | null;

interface TabelaResultadosProps {
  resultados: ResultadoEnriquecido[];
  isPending: boolean;
  isError: boolean;
}

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export const TabelaResultados = ({ resultados, isPending, isError }: TabelaResultadosProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'saldoDevedor', direction: 'descending' });

  const sortedResultados = useMemo(() => {
    if (!resultados) return [];
    let sortableItems = [...resultados];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA == null) return 1;
        if (valB == null) return -1;
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [resultados, sortConfig]);

  const handleSort = (key: keyof ResultadoEnriquecido) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleExport = () => {
    const dataToExport = sortedResultados.map(r => ({
      'Cliente ID': r.clienteId,
      'Nome': r.nomeCliente,
      'Situação': r.situacaoCredito,
      'Classificação': r.classificacaoNome,
      'Estrelas': r.classificacaoEstrelas,
      'Limite de Crédito': r.limiteCredito,
      'Saldo Devedor': r.saldoDevedor,
      'Saldo p/ Compras': r.saldoParaCompras,
      'Notas de Crédito': r.notasDeCredito,
      'Títulos Vencidos': r.titulosVencidos,
      'Títulos a Vencer': r.titulosAVencer,
      'Maior Atraso (dias)': r.diasVencidoMaisAntigo,
      'Atraso Médio (dias)': r.atrasoMedioDias,
      'Maior Compra': r.maiorCompra,
      'Compras (90d)': r.compras90Dias,
      'Média Compra (90d)': r.mediaCompra90Dias,
      'Alerta': r.alerta,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AnaliseDeCredito");
    XLSX.writeFile(workbook, "Analise_de_Credito.xlsx");
  };

  if (isPending) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError) return <div className="text-center p-8 text-red-500">Ocorreu um erro ao buscar os dados.</div>;
  if (!resultados || resultados.length === 0) return <div className="text-center p-8">Nenhum resultado encontrado.</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleExport}><FileDown className="mr-2 h-4 w-4" />Exportar</Button>
      </div>
      <div className="relative max-h-[calc(100vh-300px)] overflow-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 top-0 z-30 bg-secondary w-[120px]"><Button variant="ghost" onClick={() => handleSort('clienteId')}>Cliente <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky left-[120px] top-0 z-30 bg-secondary min-w-[250px]"><Button variant="ghost" onClick={() => handleSort('nomeCliente')}>Nome do Cliente <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary w-[130px]"><Button variant="ghost" onClick={() => handleSort('situacaoCredito')}>Situação <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary min-w-[200px]"><Button variant="ghost" onClick={() => handleSort('classificacaoEstrelas')}>Classificação <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary min-w-[220px]">Alerta</TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary"><Button variant="ghost" onClick={() => handleSort('limiteCredito')}>Limite de Crédito <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary"><Button variant="ghost" onClick={() => handleSort('saldoDevedor')}>Saldo Devedor <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary"><Button variant="ghost" onClick={() => handleSort('saldoParaCompras')}>Saldo p/ Compras <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary"><Button variant="ghost" onClick={() => handleSort('notasDeCredito')}>Notas de Crédito <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary"><Button variant="ghost" onClick={() => handleSort('titulosVencidos')}>Títulos Vencidos <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary"><Button variant="ghost" onClick={() => handleSort('titulosAVencer')}>Títulos a Vencer <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary"><Button variant="ghost" onClick={() => handleSort('diasVencidoMaisAntigo')}>Maior Atraso (dias) <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary"><Button variant="ghost" onClick={() => handleSort('atrasoMedioDias')}>Atraso Médio (dias) <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary"><Button variant="ghost" onClick={() => handleSort('maiorCompra')}>Maior Compra <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary"><Button variant="ghost" onClick={() => handleSort('compras90Dias')}>Compras (90d) <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
              <TableHead className="sticky top-0 z-20 bg-secondary"><Button variant="ghost" onClick={() => handleSort('mediaCompra90Dias')}>Média Compra (90d) <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedResultados.map((cliente) => (
              <TableRow key={cliente.clienteId} className="group">
                <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted font-medium">{cliente.clienteId}</TableCell>
                <TableCell className="sticky left-[120px] z-10 bg-background group-hover:bg-muted">{cliente.nomeCliente}</TableCell>
                <TableCell><StatusBadge status={cliente.situacaoCredito} /></TableCell>
                <TableCell><div className="flex flex-col"><StarRating rating={cliente.classificacaoEstrelas} /><span className="text-xs text-muted-foreground">{cliente.classificacaoNome}</span></div></TableCell>
                <TableCell>{cliente.alerta && (<div className="flex items-center text-yellow-600"><AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" /><span className="text-xs">{cliente.alerta}</span></div>)}</TableCell>
                <TableCell>{cliente.limiteCredito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                <TableCell>{cliente.saldoDevedor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                <TableCell>{cliente.saldoParaCompras.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                <TableCell>{cliente.notasDeCredito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                <TableCell className="text-center font-medium text-red-600">{cliente.titulosVencidos}</TableCell>
                <TableCell className="text-center">{cliente.titulosAVencer}</TableCell>
                <TableCell className="text-center">{cliente.diasVencidoMaisAntigo}</TableCell>
                <TableCell className="text-center">{cliente.atrasoMedioDias}</TableCell>
                <TableCell>{cliente.maiorCompra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                <TableCell className="text-center">{cliente.compras90Dias}</TableCell>
                <TableCell>{cliente.mediaCompra90Dias.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};