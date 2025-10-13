import { TableBody } from "@/components/ui/table";
import { ResultadoEnriquecido } from '@/lib/analise';
import { TabelaLinha } from "./TabelaLinha";

interface TabelaBodyProps {
    resultados: ResultadoEnriquecido[];
}

export const TabelaBody = ({ resultados }: TabelaBodyProps) => {
    return (
        <TableBody>
            {resultados.map((r) => (
                <TabelaLinha key={r.clienteId} resultado={r} />
            ))}
        </TableBody>
    );
};