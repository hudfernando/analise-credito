// src/components/analise/DocumentacaoSistema.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface DocumentacaoSistemaProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const DocumentacaoSistema = ({ isOpen, onOpenChange }: DocumentacaoSistemaProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Documentação do Sistema: Painel de Inteligência de Crédito</DialogTitle>
          <DialogDescription>
            Um resumo técnico completo da arquitetura e das regras de negócio implementadas.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <Tabs defaultValue="visao-geral" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
              <TabsTrigger value="arquitetura">Arquitetura</TabsTrigger>
              <TabsTrigger value="backend">Lógica Backend</TabsTrigger>
              <TabsTrigger value="frontend">Lógica Frontend</TabsTrigger>
              <TabsTrigger value="componentes">Componentes</TabsTrigger>
            </TabsList>
            <div className="flex-grow overflow-y-auto mt-4 pr-4">
              
              {/* Aba 1: Visão Geral */}
              <TabsContent value="visao-geral" className="space-y-4">
                <h3 className="text-xl font-semibold">Propósito do Projeto</h3>
                <p className="text-sm">
                  O Painel de Inteligência de Crédito é uma aplicação full-stack projetada para analisar a saúde financeira de uma base de clientes. Ele permite que usuários (como analistas de crédito ou vendedores) filtrem e visualizem dados financeiros detalhados, enriquecidos com uma camada de inteligência artificial (regras de negócio) para gerar scores, classificações e alertas.
                </p>
                <h3 className="text-xl font-semibold">Stack de Tecnologia</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>Backend:</strong> API RESTful em ASP.NET Core com C#.</li>
                  <li><strong>Acesso a Dados:</strong> Entity Framework Core (abordagem Database First).</li>
                  <li><strong>Banco de Dados:</strong> SQL Server.</li>
                  <li><strong>Frontend:</strong> Aplicação web com Next.js e TypeScript.</li>
                  <li><strong>UI:</strong> Componentes Shadcn/UI e estilização com Tailwind CSS.</li>
                  <li><strong>Comunicação API:</strong> Biblioteca `ky`.</li>
                  <li><strong>Gerenciamento de Estado (Server):</strong> TanStack Query (React Query).</li>
                </ul>
              </TabsContent>

              {/* Aba 2: Arquitetura */}
              <TabsContent value="arquitetura" className="space-y-4">
                <h3 className="text-xl font-semibold">Fluxo de Dados</h3>
                <ol className="list-decimal list-inside text-sm space-y-2">
                  <li>O usuário interage com o `FiltrosForm` no frontend, preenchendo os critérios de busca.</li>
                  <li>Ao clicar em "Buscar", o `page.tsx` aciona o `useQuery` (TanStack Query).</li>
                  <li>O `useQuery` chama a função `fetchAnaliseCredito`, que usa o `ky` para fazer uma requisição POST para a API .NET.</li>
                  <li>A API .NET (`CreditoController`) recebe os filtros e os repassa para o `AnaliseCreditoService`.</li>
                  <li>O `AnaliseCreditoService` executa as consultas otimizadas no SQL Server, agregando os dados no próprio banco.</li>
                  <li>A API retorna um array de `AnaliseCreditoDto` (JSON) com os dados brutos e pré-calculados.</li>
                  <li>O frontend recebe os dados. O `page.tsx` os passa para a função `performAnalysis` (`lib/analise.ts`).</li>
                  <li>`performAnalysis` enriquece os dados com scores e classificações.</li>
                  <li>Os dados enriquecidos são exibidos no componente `TabelaResultados`.</li>
                </ol>
              </TabsContent>

              {/* Aba 3: Lógica Backend */}
              <TabsContent value="backend" className="space-y-4">
                <h3 className="text-xl font-semibold">Fonte da Verdade: Script SQL</h3>
                <p className="text-sm">Toda a lógica de cálculo de indicadores no backend é uma tradução fiel do script `SCRIPT EVOLUÍDO - v3`. Este script define as regras para o que é um título ativo, liquidado, e como calcular os totais.</p>
                
                <h3 className="text-xl font-semibold">Otimização de Performance</h3>
                <p className="text-sm">Para evitar timeouts, a lógica foi refatorada para "enviar os cálculos para o banco de dados". Em vez de trazer milhões de registros para a memória, o C# monta consultas LINQ complexas com `GroupBy`, `Sum`, `Average`, etc., que o Entity Framework traduz para SQL. Isso faz com que a API receba apenas os dados já agregados, minimizando o tráfego de rede e o uso de memória.</p>
                <p className="text-sm">A otimização mais crítica foi a criação de um índice no banco de dados:</p>
                <code className="block p-2 bg-muted rounded-md text-xs">CREATE NONCLUSTERED INDEX IX_Titrecs_TpTit_CdClien ON dbo.Titrec (TpTit, CdClien);</code>

                <h3 className="text-xl font-semibold">Regras de Negócio Chave (C#)</h3>
                 <ul className="list-disc list-inside text-sm space-y-1">
                    <li>**Títulos Ativos:** A consulta principal considera apenas títulos com `situacao IN ('AB', 'PL')` e `sit_cnab != 'BO'`.</li>
                    <li>**Títulos Liquidados:** Usados para o Atraso Médio, são filtrados por `situacao = 'LQ'`.</li>
                    <li>**Nota de Crédito:** Identificada por `TpTit = 'NC'`.</li>
                 </ul>
              </TabsContent>

              {/* Aba 4: Lógica Frontend */}
              <TabsContent value="frontend" className="space-y-4">
                 <h3 className="text-xl font-semibold">O Motor de Análise: `performAnalysis`</h3>
                 <p className="text-sm">Esta função em `src/lib/analise.ts` recebe os dados da API e aplica a camada final de inteligência. Todas as regras são configuráveis através do painel de "Configurações".</p>
                 <ol className="list-decimal list-inside text-sm space-y-2">
                    <li><strong>Score de Risco (1-10):</strong> Combinação ponderada de 3 fatores: Utilização do Limite, Títulos Vencidos e Atraso Médio.</li>
                    <li><strong>Score de Valor (1-10):</strong> Combinação de 2 fatores: Frequência de Compras (90d) e Ticket Médio (90d).</li>
                    <li><strong>IVE (Índice de Valor Estratégico):</strong> A métrica central para a classificação.
                        <code className="block p-2 my-1 bg-muted rounded-md text-xs">IVE = Score de Valor - Score de Risco</code>
                    </li>
                    <li><strong>Classificação em Estrelas (0-5):</strong> O valor do IVE é mapeado para uma nota em estrelas, com base em limiares configuráveis.</li>
                    <li><strong>Regras de Prioridade:</strong>
                        <ul className="list-disc list-inside ml-4">
                            <li>Clientes com status `['BL', 'JU', 'TJ', 'DP']` recebem 1 estrela ("Crítico") automaticamente. A verificação usa `.trim().toUpperCase()` para garantir a correspondência.</li>
                            <li>Clientes sem saldo devedor e sem compras nos últimos 90 dias recebem 0 estrelas ("Inativo").</li>
                        </ul>
                    </li>
                 </ol>
              </TabsContent>

              {/* Aba 5: Componentes */}
              <TabsContent value="componentes" className="space-y-4 text-sm">
                 <p><strong>`page.tsx`:</strong> O componente principal. Orquestra os estados de filtros, configurações, e os dados da API. Dispara a busca e repassa os dados para a tabela.</p>
                 <p><strong>`TabelaResultados.tsx`:</strong> Exibe os dados enriquecidos. Implementa ordenação, exportação para Excel e a fixação das duas primeiras colunas (`Cliente` e `Nome do Cliente`) para facilitar a rolagem.</p>
                 <p><strong>`Configuracoes.tsx`:</strong> Um painel (`Sheet`) que permite ao usuário editar em tempo real todos os pesos e limiares usados na função `performAnalysis`, proporcionando flexibilidade à ferramenta.</p>
                 <p><strong>`Legenda.tsx`:</strong> Um `Popover` que explica ao usuário final, de forma simplificada, como a análise de classificação funciona.</p>
                 <p><strong>`DocumentacaoSistema.tsx`:</strong> Este próprio componente, servindo como um manual técnico para referência futura.</p>
              </TabsContent>

            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};