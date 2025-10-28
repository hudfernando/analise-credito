// Caminho: /src/components/documentacao/GuiaDeRecuperacaoDeContexto.tsx
// Objetivo: Servir como um documento centralizado para recuperar o contexto completo do projeto.
// VERSÃO ATUALIZADA EM: 20 de Outubro de 2025

/*
  ############################################################################
  ### GUIA DE RECUPERAÇÃO DE CONTEXTO - PAINEL DE INTELIGÊNCIA DE CRÉDITO ###
  ############################################################################

  Olá, Parceiro de Programação!
  Este arquivo resume toda a arquitetura, lógica de negócio e funcionalidades
  do nosso projeto. Use-o para se realinhar com os objetivos e a implementação.

  ****************************************************************************
  ** 1. OBJETIVO FINAL DO PROJETO
  ****************************************************************************
  
  Criar uma aplicação web de Business Intelligence (BI) para análise da carteira
  de clientes. A ferramenta deve ir além de uma simples tabela de dados, oferecendo
  visões agregadas (dashboard), capacidade de aprofundamento (drill-down) e
  insights estratégicos sobre o perfil de risco e valor de cada cliente,
  com uma lógica de cálculo de scores flexível e configurável pelo usuário.

  ****************************************************************************
  ** 2. ARQUITETURA DE DADOS (FLUXO ETL)
  ****************************************************************************

  A performance é garantida por uma arquitetura de dados desacoplada:

  1.  **FONTE:** Um banco de dados de produção (SQL Server), acessado como read-only.
  2.  **ETL:** Uma aplicação .NET Console (`AnaliseCredito.Etl`) é responsável por:
      a. **Criar/Atualizar o esquema do banco de destino** usando Migrations do EF Core (`Database.MigrateAsync()`).
      b. **Inserir dados de configuração padrão** (pesos da análise) na tabela `ConfiguracaoAnalise` se ela estiver vazia.
      c. **Copiar os dados** das tabelas `cliente` e `titrec` em massa e de forma performática
         (usando a biblioteca Npgsql.Bulk) para o banco analítico.
  3.  **DESTINO:** Um banco de dados analítico (PostgreSQL) rodando em um contêiner Docker,
      otimizado para consultas complexas. É a ÚNICA fonte de dados da API.

  ****************************************************************************
  ** 3. ARQUITETURA DA APLICAÇÃO (FRONTEND/BACKEND)
  ****************************************************************************

  --- BACKEND (API .NET EM C#) ---
  O backend é o cérebro, responsável por todos os cálculos e regras de negócio.

  - **`Models/ConfiguracaoAnalise.cs`**: Entidade que mapeia a tabela para armazenar os pesos da análise.
  - **`Controllers`**:
    - `DashboardController`: Fornece o endpoint de resumo (`/summary`).
    - `CreditoController`: Fornece o endpoint de detalhes (`/credito`).
    - `ConfiguracaoController`: Fornece endpoints `GET` e `PUT` para ler e salvar os pesos da análise.
  - **`Services`**:
    - `AnaliseCreditoService.cs`: Orquestra a lógica. Busca as configurações dinâmicas, busca os dados brutos, chama a `AnaliseBusinessLogic` e retorna os DTOs.
    - `AnaliseBusinessLogic.cs`: O "CÉREBRO DINÂMICO". Recebe os pesos do banco de dados e os utiliza para calcular scores, IVE, estrelas e segmentos estratégicos.
    - `ConfiguracaoService.cs`: Contém a lógica para interagir com a tabela `ConfiguracaoAnalise`.
  - **`DTOs`**: Definem os contratos de dados.

  --- FRONTEND (WEB EM NEXT.JS/TYPESCRIPT) ---
  O frontend é responsável pela experiência do usuário, seguindo o Princípio da Responsabilidade Única.

  - **`app/layout.tsx`**: Configura o layout principal e, mais importante, envolve toda a aplicação com o `QueryProvider`, disponibilizando o TanStack Query globalmente.
  - **`app/page.tsx`**: Componente principal que orquestra a tela, gerencia os estados de filtro e usa o `useQuery` para as chamadas à API.
  - **`components/`**:
    - `DashboardSummaryView.tsx`: Renderiza os cards de resumo dinâmicos.
    - `TabelaResultados.tsx`: Renderiza a tabela com as duas visões (Carteira e Semanal).
    - `LegendaInsights.tsx`: Explica as métricas e insights para o usuário.
    - **`Painel de Configurações (Pasta /configuracao)`**: **NOVO**. Implementa a edição de pesos:
        - `PainelConfiguracoes.tsx` (Componente Smart): Orquestra a lógica de dados com `useQuery` e `useMutation`, controla o estado do dialog.
        - `ConfiguracoesForm.tsx` (Componente de Gerenciamento): Gerencia o estado do formulário de edição.
        - `PesoSlider.tsx` (Componente Dumb): Renderiza uma única linha de slider.

  ****************************************************************************
  ** 4. LÓGICA DE NEGÓCIO CENTRAL (CÁLCULOS DINÂMICOS DA API)
  ****************************************************************************
  
  A análise de cada cliente segue esta sequência de cálculos dinâmicos:

  1.  **CARREGAMENTO DOS PESOS:** A `AnaliseCreditoService` busca os pesos atuais da tabela `ConfiguracaoAnalise`.
  2.  **REGRAS DE PRIORIDADE:** (Cliente Crítico e Inativo).
  3.  **SCORE DE RISCO (1-10):** Média ponderada usando os **pesos do banco de dados**.
  4.  **SCORE DE VALOR (1-10):** Média ponderada usando os **pesos do banco de dados**.
  5.  **IVE, ESTRELAS E TENDÊNCIA:** Calculados com base nos scores.
  6.  **INSIGHTS ESTRATÉGICOS:** A lógica identifica e atribui segmentos acionáveis como "Risco de Churn" e "Potencial Oculto".

  ****************************************************************************
  ** 5. ESTADO ATUAL E PRÓXIMOS PASSOS
  ****************************************************************************

  **ÚLTIMO ESTADO:** A aplicação está **100% funcional e feature-complete** de acordo com o plano atual.
  - O backend calcula scores e insights com base em pesos dinâmicos armazenados no banco de dados.
  - O frontend exibe um dashboard interativo com visões de Carteira e Semanal.
  - Um painel de configurações permite que o usuário ajuste os pesos da análise, e as mudanças são refletidas em tempo real no dashboard.

  **DIAGNÓSTICO ATUAL:** O ciclo de desenvolvimento principal foi concluído com sucesso. A plataforma está estável e pronta para a próxima fase de evolução.

  **AÇÃO IMEDIATA / PRÓXIMO PASSO:**
  Com a base de BI descritivo e dinâmico estabelecida, o próximo passo é evoluir para a **análise preditiva e insights mais profundos**. Com base nas nossas discussões anteriores, a próxima grande funcionalidade sugerida é a implementação da:

  - **Previsão de Inadimplência (Probabilidade de Default):** Criar um novo "Índice de Probabilidade de Inadimplência" em porcentagem, permitindo ações proativas da equipe financeira. Podemos começar com uma fórmula ponderada avançada e, futuramente, evoluir para um modelo de Machine Learning.
*/