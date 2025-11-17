// Caminho: src/components/cliente/AnaliseMixProdutoSubTabela.tsx
'use client'

import { fetchAnaliseMixProduto } from '@/http/api'
import type { AnaliseMixProduto } from '@/types/analise-credito' // Import como tipo
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

interface Props {
  clienteId: string
  fabricanteId: string
}

export function AnaliseMixProdutoSubTabela({ clienteId, fabricanteId }: Props) {
  // 1. Busca os dados de produto (drill-down)
  const { data: produtos, isLoading } = useQuery<AnaliseMixProduto[]>({
    queryKey: ['analiseMixProduto', clienteId, fabricanteId],
    queryFn: () => fetchAnaliseMixProduto(clienteId, fabricanteId),
    staleTime: 5 * 60 * 1000, // Cache de 5 minutos
  })

  // 2. Estado de Loading (dentro da célula da tabela)
  if (isLoading) {
    return (
      <TableCell colSpan={7} className="h-24 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
      </TableCell>
    )
  }

  // 3. Estado de Erro ou Vazio (dentro da célula da tabela)
  if (!produtos || produtos.length === 0) {
    return (
      <TableCell colSpan={7} className="py-4 text-center text-sm text-muted-foreground">
        <AlertCircle className="mx-auto mb-1 h-4 w-4" />
        Nenhum produto encontrado para este fabricante.
      </TableCell>
    )
  }

  // 4. Sucesso: Renderiza a célula com uma tabela interna
  return (
    <TableCell colSpan={7} className="p-0"> {/* Ocupa a linha inteira */}
      <div className="p-4 bg-muted/50">
        <h4 className="mb-2 px-1 text-sm font-semibold tracking-tight">
          Produtos Comprados (Drill-Down)
        </h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-2">Produto (ID)</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Tabela Preço</TableHead>
              <TableHead className="text-right">Qtd.</TableHead>
              <TableHead className="text-right">Freq.</TableHead>
              <TableHead className="text-right">Última Compra</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.map((p) => (
              <TableRow
                key={`${p.idProduto}-${p.grupoCanal}-${p.idTabelaPreco}`}
                className="border-0 hover:bg-background/50" // Remove bordas
              >
                <TableCell className="pl-2">
                  <div className="font-medium">{p.descricaoProduto ?? 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">{p.idProduto}</div>
                </TableCell>
                <TableCell>{p.grupoCanal}</TableCell>
                <TableCell>{p.idTabelaPreco}</TableCell>
                <TableCell className="text-right">
                  {p.quantidadeTotal.toLocaleString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">{p.frequenciaTotal}</TableCell>
                <TableCell className="text-right">
                  {p.dataUltimaCompra
                    ? new Date(p.dataUltimaCompra).toLocaleDateString('pt-BR')
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TableCell>
  )
}