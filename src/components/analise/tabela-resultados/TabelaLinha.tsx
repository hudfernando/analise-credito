import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ResultadoEnriquecido } from '@/lib/analise';
import { AlertTriangle, Star } from 'lucide-react';

const getScoreColor = (score: number, type: 'risk' | 'value') => {
    if (type === 'risk') {
        if (score >= 7) return 'text-red-500';
        if (score >= 4) return 'text-yellow-500';
        return 'text-green-500';
    } else { // type === 'value'
        if (score >= 7) return 'text-green-500';
        if (score >= 4) return 'text-yellow-500';
        return 'text-gray-400';
    }
};

interface TabelaLinhaProps {
    resultado: ResultadoEnriquecido;
}

export const TabelaLinha = ({ resultado: r }: TabelaLinhaProps) => {
    return (
        <TableRow className="border-b-azul-claro/20 hover:bg-azul-claro/10">
            {/* Colunas Fixas */}
            <TableCell className="sticky left-0 bg-card font-medium min-w-[150px]">{r.clienteId}</TableCell>
            <TableCell className="sticky left-[150px] bg-card font-medium min-w-[300px]">{r.nomeCliente}</TableCell>
            
            {/* Colunas de Análise */}
            <TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < r.classificacaoEstrelas ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}/>
                    ))}
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>{r.classificacaoNome}</p></TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell className={`text-center font-bold ${getScoreColor(r.scoreRisco, 'risk')}`}>{r.scoreRisco.toFixed(1)}</TableCell>
            <TableCell className={`text-center font-bold ${getScoreColor(r.scoreValor, 'value')}`}>{r.scoreValor.toFixed(1)}</TableCell>
            <TableCell className="text-center">
                {r.alerta && (
                    <Tooltip><TooltipTrigger asChild><span className="flex justify-center"><AlertTriangle className="h-5 w-5 text-yellow-400" /></span></TooltipTrigger><TooltipContent><p>{r.alerta}</p></TooltipContent></Tooltip>
                )}
            </TableCell>
            <TableCell>{r.perfilPagador}</TableCell>

            {/* Colunas Financeiras e de Risco (Restantes) */}
            <TableCell className="text-right text-red-400">{r.saldoDevedor}</TableCell>
            <TableCell className="text-right">{r.limiteDeCredito}</TableCell>
            <TableCell className="text-right text-green-400">{r.saldoParaCompras}</TableCell>
            <TableCell className="text-right">{r.notasDeCredito}</TableCell>
            <TableCell className="text-center">{r.titulosVencidos}</TableCell>
            <TableCell className="text-center">{r.titulosAVencer}</TableCell>
            <TableCell className="text-center">{r.diasDoVencidoMaisAntigo}</TableCell>
            <TableCell className="text-center">{r.atrasoMedioDias}</TableCell>
            <TableCell className="text-right">{r.maiorCompra}</TableCell>
            <TableCell className="text-center">{r.compras90Dias}</TableCell>
            <TableCell className="text-right">{r.mediaCompra90Dias}</TableCell>
            <TableCell className="text-right">{r.vencimento7Dias}</TableCell>
        </TableRow>
    );
};