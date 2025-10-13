import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { HelpCircle, Star, ShieldAlert } from "lucide-react"

export const Legenda = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <HelpCircle className="mr-2 h-4 w-4" />
          Entenda a Análise
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Como a Análise Funciona</h4>
            <p className="text-sm text-muted-foreground">
              A nota do cliente é calculada com base em seu status, risco e valor.
            </p>
          </div>

          {/* Seção Nova: Explica a regra de prioridade */}
          <div className="grid gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="font-bold text-amber-700 flex items-center">
              <ShieldAlert className="mr-2 h-4 w-4" /> Regra de Prioridade
            </div>
            <p className="text-sm text-muted-foreground">
              Clientes com status crítico (ex: <strong>Bloqueado, Jurídico, Protestado</strong>) recebem automaticamente a classificação de <strong>1 estrela</strong>, independentemente dos outros cálculos.
            </p>
          </div>

          <div className="grid gap-2">
            <div className="font-bold text-red-500">Score de Risco (Peso 1.5)</div>
            <p className="text-sm text-muted-foreground">
              Avalia a probabilidade de inadimplência. Quanto maior o score, maior o risco.
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>
                <strong>Utilização do Limite:</strong> Percentual do crédito que o cliente está usando.
              </li>
              <li>
                <strong>Títulos Vencidos:</strong> Quantidade de boletos em atraso.
              </li>
              <li>
                <strong>Atraso Médio:</strong> Média de dias de atraso nos pagamentos.
              </li>
              {/* Texto corrigido para a regra do bônus */}
              <li>
                <strong className="text-sky-600">⭐ Bônus do Bom Pagador:</strong> Se o cliente não tem títulos vencidos, o risco associado à <strong>Utilização do Limite</strong> é reduzido, beneficiando quem paga em dia.
              </li>
            </ul>
          </div>

          <div className="grid gap-2">
            <div className="font-bold text-green-500">Score de Valor (Peso 1.0)</div>
            <p className="text-sm text-muted-foreground">
              Mede o volume de negócios do cliente.
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>
                <strong>Frequência:</strong> Número de compras nos últimos 90 dias.
              </li>
              <li>
                <strong>Valor Médio:</strong> Média do valor das compras nos últimos 90 dias.
              </li>
            </ul>
          </div>

          <div className="grid gap-2">
            <div className="font-bold">Classificação Final (IVE)</div>
            <p className="text-sm text-muted-foreground">
              A nota final (IVE - Índice de Valor Estratégico) é o resultado da fórmula: <br />
              <code className="text-green-500 font-semibold">(Score de Valor * 1.0)</code> - <code className="text-red-500 font-semibold">(Score de Risco * 1.5)</code>.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                <li className="flex items-center"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/>: Cliente Elite</li>
                <li className="flex items-center"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/>: Cliente Sólido</li>
                <li className="flex items-center"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/>: Cliente Neutro</li>
                <li className="flex items-center"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/>: Cliente de Risco</li>
                <li className="flex items-center"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"/>: Cliente Crítico</li>
                {/* Legenda adicionada para Clientes Inativos */}
                <li className="flex items-center"><Star className="h-4 w-4 text-slate-300 fill-slate-300 mr-1"/>: Cliente Inativo</li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}