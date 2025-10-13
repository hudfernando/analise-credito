import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResultadoEnriquecido } from "@/lib/analise";
import { Star, TrendingUp, TrendingDown } from "lucide-react";

interface TabelaBodyProps {
  resultados: ResultadoEnriquecido[];
}

// Helper para obter a cor e a descrição de cada status
const getStatusInfo = (status: string | undefined): { variant: "default" | "destructive" | "secondary" | "outline", text: string } => {
  if (!status) return { variant: "outline", text: "N/A" };
  const s = status.trim().toUpperCase();
  switch (s) {
    case 'LB': return { variant: "default", text: "Liberado" };
    case 'BL': return { variant: "destructive", text: "Bloqueado" };
    case 'JU': return { variant: "destructive", text: "Jurídico" };
    case 'TJ': return { variant: "destructive", text: "Protestado" };
    case 'DP': return { variant: "secondary", text: "Dep. Antecipado" };
    case 'RECA': return { variant: "secondary", text: "Recadastro" };
    case 'NE': return { variant: "secondary", text: "Em Acordo" };
    case 'NO': return { variant: "outline", text: "Novo" };
    case 'AN': return { variant: "outline", text: "Analisar" };
    default: return { variant: "outline", text: s };
  }
};

export const TabelaBody = ({ resultados }: TabelaBodyProps) => {
  return (
    <TableBody>
      {resultados.map((r) => {
        const statusInfo = getStatusInfo(r.situacaoCredito);
        return (
          <TableRow key={r.clienteId}>
            {/* Colunas que já existiam */}
            <TableCell className="font-medium">
              <div className="text-sm text-gray-400">{r.nomeCliente}</div>
              <div className="text-xs text-gray-800">ID: {r.clienteId}</div>
            </TableCell>
            <TableCell>
              <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.classificacaoEstrelas ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="font-semibold text-red-500">{r.scoreRisco.toFixed(1)}</span>
                <span>/</span>
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-blue-500">{r.scoreValor.toFixed(1)}</span>
              </div>
            </TableCell>
            <TableCell>{r.perfilPagador}</TableCell>
            <TableCell className="text-right font-mono">{r.saldoDevedor}</TableCell>
            <TableCell className="text-right font-mono">{r.limiteDeCredito}</TableCell>
            <TableCell className="text-right">{r.atrasoMedioDias} dias</TableCell>
            
            {/* ===== CÉLULAS ADICIONADAS A PARTIR DAQUI ===== */}
            <TableCell className="text-right font-mono">{r.saldoParaCompras}</TableCell>
            <TableCell className="text-center font-medium">{r.titulosVencidos}</TableCell>
            <TableCell className="text-center">{r.titulosAVencer}</TableCell>
            <TableCell className="text-right">{r.diasDoVencidoMaisAntigo} dias</TableCell>
            <TableCell className="text-right font-mono">{r.maiorCompra}</TableCell>
            <TableCell className="text-center">{r.compras90Dias}</TableCell>
            <TableCell className="text-right font-mono">{r.mediaCompra90Dias}</TableCell>
            <TableCell className="text-right font-mono">{r.vencimento7Dias}</TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};