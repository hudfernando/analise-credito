import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResultadoEnriquecido } from "@/lib/analise";
import { Star, TrendingUp, TrendingDown } from "lucide-react";

interface TabelaBodyProps {
  resultados: ResultadoEnriquecido[];
}

// Helper para obter a cor e a descrição de cada status
const getStatusInfo = (status: string | undefined): { 
  variant: "default" | "destructive" | "secondary" | "outline", 
  text: string 
} => {
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

// Componente para células fixas (primeira e segunda coluna)
const FixedCell = ({ 
  children, 
  className = "", 
  isFirst = false,
  width = "auto"
}: {
  children: React.ReactNode;
  className?: string;
  isFirst?: boolean;
  width?: string;
}) => (
  <TableCell 
    className={`
      ${className}
      ${isFirst 
        ? 'sticky left-0 z-10 bg-background border-r border-border shadow-sm' 
        : 'sticky left-[250px] z-10 bg-background border-r border-border shadow-sm'
      }
      ${width !== "auto" ? `w-[${width}]` : ''}
      relative
    `}
    style={{ 
      zIndex: isFirst ? 15 : 10,
      background: 'hsl(var(--background))'
    }}
  >
    <div className="pr-2">{children}</div>
  </TableCell>
);

// Componente para células normais (demais colunas)
const NormalCell = ({ 
  children, 
  className = "",
  width = "auto"
}: {
  children: React.ReactNode;
  className?: string;
  width?: string;
}) => (
  <TableCell 
    className={className}
    style={width !== "auto" ? { width: width } : {}}
  >
    {children}
  </TableCell>
);

export const TabelaBodyFixa = ({ resultados }: TabelaBodyProps) => {
  return (
    <TableBody>
      {resultados.map((r, index) => {
        const statusInfo = getStatusInfo(r.situacaoCredito);
        const isEvenRow = index % 2 === 0;
        
        return (
          <TableRow 
            key={r.clienteId} 
            className={`
              hover:bg-muted/50 transition-colors
              ${isEvenRow ? 'bg-muted/10' : ''}
            `}
          >
            {/* Primeira coluna fixa - Cliente */}
            <NormalCell  width="250px">
              <div className="font-medium text-sm text-foreground">
                {r.nomeCliente}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ID: {r.clienteId}
              </div>
            </NormalCell>
            
            {/* Segunda coluna fixa - Situação Crédito */}
            <NormalCell width="150px">
              <Badge 
                variant={statusInfo.variant} 
                className="text-xs px-2 py-1"
              >
                {statusInfo.text}
              </Badge>
            </NormalCell>
            
            {/* Colunas normais */}
            {/* Classificação */}
            <NormalCell width="120px">
              <div className="flex items-center justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 transition-colors ${
                      i < r.classificacaoEstrelas 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                ))}
              </div>
            </NormalCell>
            
            {/* Scores */}
            <NormalCell className="text-center" width="150px">
              <div className="flex items-center justify-center gap-1">
                <TrendingDown className="h-3 w-3 text-destructive" />
                <span className="font-semibold text-destructive text-xs">
                  {r.scoreRisco?.toFixed(1) ?? 'N/A'}
                </span>
                <span className="text-muted-foreground text-xs">/</span>
                <TrendingUp className="h-3 w-3 text-primary" />
                <span className="font-semibold text-primary text-xs">
                  {r.scoreValor?.toFixed(1) ?? 'N/A'}
                </span>
              </div>
            </NormalCell>
            
            {/* Perfil Pagador */}
            <NormalCell width="140px">
              <span className="text-sm">{r.perfilPagador || 'N/A'}</span>
            </NormalCell>
            
            {/* Saldo Devedor */}
            <NormalCell className="text-right font-mono" width="130px">
              <span className="text-sm">
                {r.saldoDevedor || 'R$ 0,00'}
              </span>
            </NormalCell>
            
            {/* Limite de Crédito */}
            <NormalCell className="text-right font-mono" width="120px">
              <span className="text-sm">
                {r.limiteCredito || 'R$ 0,00'}
              </span>
            </NormalCell>
            
            {/* Atraso Médio */}
            <NormalCell className="text-right" width="130px">
              <span className="text-sm">
                {r.atrasoMedioDias ? `${r.atrasoMedioDias} dias` : '0 dias'}
              </span>
            </NormalCell>
            
            {/* ===== COLUNAS ADICIONADAS ===== */}
            {/* Saldo para Compras */}
            <NormalCell className="text-right font-mono" width="130px">
              <span className="text-sm">
                {r.saldoParaCompras || 'R$ 0,00'}
              </span>
            </NormalCell>
            
            {/* Títulos Vencidos */}
            <NormalCell className="text-center font-medium" width="120px">
              <span className="text-sm font-medium">
                {r.titulosVencidos || 0}
              </span>
            </NormalCell>
            
            {/* Títulos a Vencer */}
            <NormalCell className="text-center" width="120px">
              <span className="text-sm">
                {r.titulosAVencer || 0}
              </span>
            </NormalCell>
            
            {/* Vencimento Mais Antigo */}
            <NormalCell className="text-right" width="140px">
              <span className="text-sm">
                {r.diasVencidoMaisAntigo ? `${r.diasVencidoMaisAntigo} dias` : 'N/A'}
              </span>
            </NormalCell>
            
            {/* Maior Compra */}
            <NormalCell className="text-right font-mono" width="130px">
              <span className="text-sm">
                {r.maiorCompra || 'R$ 0,00'}
              </span>
            </NormalCell>
            
            {/* Compras 90 Dias */}
            <NormalCell className="text-center" width="120px">
              <span className="text-sm">
                {r.compras90Dias || 0}
              </span>
            </NormalCell>
            
            {/* Média Compra 90 Dias */}
            <NormalCell className="text-right font-mono" width="140px">
              <span className="text-sm">
                {r.mediaCompra90Dias || 'R$ 0,00'}
              </span>
            </NormalCell>
            
            {/* Vencimento 7 Dias */}
            <NormalCell className="text-right font-mono" width="120px">
              <span className="text-sm">
                {r.vencimento7Dias || 'R$ 0,00'}
              </span>
            </NormalCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

// Export original para compatibilidade (se necessário)
export const TabelaBody = TabelaBodyFixa;