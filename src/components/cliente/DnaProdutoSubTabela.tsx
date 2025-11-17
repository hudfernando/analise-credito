// Caminho: src/components/cliente/DnaProdutoSubTabela.tsx
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDnaDetalheCategoria } from '@/http/api';
import { DnaProduto } from '@/types/analise-credito';
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Loader2 } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface DnaProdutoSubTabelaProps {
  clienteId: number | string;
  categoriaId: string;
  canal: string;
  colSpan: number;
}

export const DnaProdutoSubTabela = ({ 
  clienteId, 
  categoriaId, 
  canal, 
  colSpan 
}: DnaProdutoSubTabelaProps) => {
  
  const { data: produtos, isLoading } = useQuery({
    queryKey: ['dnaDetalheCategoria', clienteId, categoriaId, canal],
    queryFn: () => fetchDnaDetalheCategoria(clienteId, categoriaId, canal),
    staleTime: 1000 * 60 * 15,
  });

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="h-24 text-center p-4 bg-muted/20">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
        </TableCell>
      </TableRow>
    );
  }

  if (!produtos || produtos.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-center text-muted-foreground p-4 bg-muted/20">
          Nenhum produto encontrado para esta categoria/canal.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <React.Fragment>
      {/* Cabeçalho da Sub-Tabela (agora não é mais sticky) */}
      <TableRow className="bg-muted/30 hover:bg-muted/30">
        <TableCell className="w-10"></TableCell> 
        <TableHead className="pl-10 font-semibold">Fabricante</TableHead>
        <TableHead className="font-semibold">Produto</TableHead>
        <TableHead className="text-right font-semibold">Faturamento</TableHead>
        <TableHead className="text-right font-semibold">Margem %</TableHead>
      </TableRow>
      
      {/* Corpo da Sub-Tabela */}
      {produtos.map((p: DnaProduto) => (
        <TableRow key={p.idProduto} className="bg-muted/10 hover:bg-muted/20">
          <TableCell></TableCell> 
          <TableCell className="pl-10 text-muted-foreground">{p.descricaoFabricante}</TableCell>
          <TableCell>{p.descricaoProduto}</TableCell>
          <TableCell className="text-right tabular-nums">{formatCurrency(p.valorTotalVendido)}</TableCell>
          <TableCell
            className={cn("text-right tabular-nums font-semibold", {
              "text-green-500": p.margemPercentual > 0.1,
              "text-red-500": p.margemPercentual < 0
            })}
          >
            {formatPercentage(p.margemPercentual)}
          </TableCell>
        </TableRow>
      ))}
    </React.Fragment>
  );
};