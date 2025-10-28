// Caminho: src/components/analise/tabela-resultados/TabelaBody.tsx

'use client';

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Star } from "lucide-react";

// --- MUDANÇA AQUI ---
// Importamos nosso novo e único tipo de dados.
import { AnaliseCompleta } from "@/types/analise-credito";

interface TabelaBodyProps {
  // A prop agora espera uma lista do nosso novo tipo 'AnaliseCompleta'.
  resultados: AnaliseCompleta[];
  isPending: boolean;
  isError: boolean;
}

// Componente auxiliar para renderizar as estrelas, movido para cá para ser auto-contido
// ou pode ser movido para um arquivo de 'helpers' se usado em mais lugares.
const RenderEstrelas = ({ classificacao }: { classificacao: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < classificacao ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export const TabelaBody = ({ resultados, isPending, isError }: TabelaBodyProps) => {
  if (isPending) {
    return (
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            {/* O colSpan deve corresponder ao número de colunas no TabelaHeader */}
            <TableCell colSpan={10}>
              <Skeleton className="h-8 w-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (isError) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={10} className="text-center text-red-500">
            <div className="flex items-center justify-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              <span>Ocorreu um erro ao buscar os dados.</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (resultados.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={10} className="text-center text-muted-foreground">
            Nenhum resultado encontrado para os filtros selecionados.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {resultados.map((r) => (
        <TableRow key={r.clienteId}>
          <TableCell className="font-medium">{r.clienteId}</TableCell>
          <TableCell>{r.nomeCliente}</TableCell>
          <TableCell>{r.situacaoCredito}</TableCell>
          <TableCell>
            <RenderEstrelas classificacao={r.classificacaoEstrelas} />
          </TableCell>
          <TableCell>{r.segmento}</TableCell>
          <TableCell className={r.scoreRisco > 5 ? 'text-red-500 font-semibold' : ''}>{r.scoreRisco.toFixed(2)}</TableCell>
          <TableCell className={r.scoreValor > 5 ? 'text-green-600 font-semibold' : ''}>{r.scoreValor.toFixed(2)}</TableCell>
          <TableCell className="font-bold">{r.ive.toFixed(2)}</TableCell>
          <TableCell>{r.saldoDevedor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
          <TableCell>{r.compras90Dias}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};