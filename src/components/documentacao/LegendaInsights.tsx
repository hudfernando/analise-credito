// Caminho: src/components/documentacao/LegendaInsights.tsx

'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";

const InsightSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mt-4">
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        {children}
    </div>
);

export const LegendaInsights = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BookOpen className="mr-2 h-4 w-4" /> Entenda a Análise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Guia de Inteligência de Crédito</DialogTitle>
          <DialogDescription>
            Entenda o que cada métrica significa e quais ações tomar.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm">
            <InsightSection title="Classificação por Estrelas (IVE)">
                <p><strong>O que é?</strong> A nota final do cliente, de 1 a 5 estrelas, baseada no balanço entre o valor que ele gera e o risco que oferece (IVE = Score de Valor - Score de Risco).</p>
                <p><strong>Por que é importante?</strong> Permite segmentar rapidamente a carteira, focando os esforços onde o retorno é maior.</p>
                <p><strong>Ação Sugerida:</strong> Priorize o contato e o relacionamento com clientes de 4 e 5 estrelas. Monitore de perto os clientes de 1 e 2 estrelas.</p>
            </InsightSection>

            <InsightSection title="Segmentos Estratégicos">
                <p><strong>Potencial Oculto:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>O que é?</strong> Cliente de alto valor (4-5 estrelas) com limite de crédito alto, mas que está comprando pouco.</li>
                    <li><strong>Por que é importante?</strong> É a maior oportunidade de crescimento de receita com baixo esforço. Ele já confia na sua empresa.</li>
                    <li><strong>Ação Sugerida:</strong> O vendedor deve contatá-lo para apresentar novos produtos, oferecer promoções direcionadas ou entender se há alguma barreira para compras maiores (upsell).</li>
                </ul>
                <p className="mt-2"><strong>Risco de Churn (Evasão):</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>O que é?</strong> Cliente de alto valor (4-5 estrelas) cujas compras diminuíram significativamente nas últimas semanas.</li>
                    <li><strong>Por que é importante?</strong> É um alerta crítico. Perder um cliente-estrela tem um impacto financeiro muito maior.</li>
                    <li><strong>Ação Sugerida:</strong> Contato IMEDIATO. O vendedor deve investigar o motivo da queda (problema no atendimento, oferta do concorrente, etc.) e agir para reverter a situação.</li>
                </ul>
            </InsightSection>

            <InsightSection title="Métricas de Análise">
                <p><strong>Score de Risco (1-10):</strong> Mede a chance de inadimplência. É calculado com base na utilização do limite, títulos vencidos e atraso médio.</p>
                <p><strong>Score de Valor (1-10):</strong> Mede a importância comercial do cliente. É calculado com base na frequência e no valor médio das compras (ticket médio).</p>
                <p><strong>Tendência:</strong> Compara o volume de compras das últimas 2 semanas com as 2 anteriores para indicar se o cliente está comprando mais (Subindo), menos (Descendo) ou mantendo o ritmo (Estável).</p>
                {/* --- NOVA SEÇÃO ADICIONADA AQUI --- */}
                <p className="mt-2"><strong>Prob. de Inadimplência (0-100%):</strong> É uma previsão da chance de um cliente não cumprir com seus pagamentos futuros. As cores na tabela indicam o nível de risco: <span className="text-yellow-500 font-bold">Amarelo</span> para atenção e <span className="text-red-500 font-bold">Vermelho</span> para risco alto.</p>
            </InsightSection>
        </div>
      </DialogContent>
    </Dialog>
  );
};