// src/components/Legenda.tsx
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";

export const Legenda = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline"><Info className="mr-2 h-4 w-4" /> Entenda a Análise</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96">
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="font-semibold leading-none">Como a Classificação Funciona</h4>
            <p className="text-sm text-muted-foreground">
              A nota final em estrelas é calculada em 5 etapas:
            </p>
          </div>
          <div className="text-sm space-y-3">
            <p><strong>1. Regras de Prioridade:</strong> Clientes com situação 'Bloqueado', 'Jurídico' ou 'Protestado' recebem 1 estrela (Crítico). Clientes sem compras ou saldo nos últimos 90 dias são classificados como 'Inativo' (0 estrelas).</p>
            <p><strong>2. Score de Risco (Nota 1-10):</strong> Mede a probabilidade de inadimplência, combinando 3 fatores: <span className="font-semibold">Utilização do Limite</span>, <span className="font-semibold">Quantidade de Títulos Vencidos</span> e o <span className="font-semibold">Atraso Médio</span> histórico.</p>
            <p><strong>3. Score de Valor (Nota 1-10):</strong> Mede a importância comercial do cliente, com base na <span className="font-semibold">Frequência de Compras</span> e no <span className="font-semibold">Valor do Ticket Médio</span> dos últimos 90 dias.</p>
            <p><strong>4. IVE (Índice de Valor Estratégico):</strong> É o balanço entre o potencial e o risco do cliente. A fórmula é: <br /><code className="font-mono p-1 bg-muted rounded">IVE = Score de Valor - Score de Risco</code></p>
            <p><strong>5. Classificação Final (Estrelas):</strong> O valor do IVE é usado para definir a nota final de 1 a 5 estrelas.</p>
            <p className="text-xs text-muted-foreground pt-2 border-t"><strong>Importante:</strong> Todos os pesos e limites usados nestes cálculos podem ser ajustados no painel de 'Configurações'.</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};