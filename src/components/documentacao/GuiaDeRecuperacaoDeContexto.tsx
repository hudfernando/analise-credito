// Caminho: /src/components/documentacao/GuiaDeRecuperacaoDeContexto.tsx
// Objetivo: Servir como um documento centralizado para recuperar o contexto completo do projeto.
// VERSÃO ATUALIZADA EM: 28 de Outubro de 2025

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
  
  Criar uma aplicação web de BI para análise da carteira de clientes, com foco
  em dashboards, capacidade de drill-down (visão geral -> lista -> detalhe)
  e uma lógica de scores de Risco/Valor flexível e configurável pelo usuário.

  ****************************************************************************
  ** 2. ARQUITETURA DE DADOS (FLUXO ETL)
  ****************************************************************************

  A performance é garantida por uma arquitetura de dados desacoplada:

  1.  **FONTE:** SQL Server (read-only).
  2.  **ETL:** Aplicação .NET Console (`AnaliseCredito.Etl`) que copia e transforma
      os dados para o banco analítico usando Npgsql.Bulk.
  3.  **DESTINO:** Banco de dados analítico (PostgreSQL) em Docker, que é a
      única fonte de dados da API.

  ****************************************************************************
  ** 3. ARQUITETURA DA APLICAÇÃO (FRONTEND/BACKEND)
  ****************************************************************************

  --- BACKEND (API .NET EM C#) ---
  O cérebro do sistema, responsável pelos cálculos pesados e regras de negócio.
  - **Estrutura:** Controllers "magros" que delegam para Services especializados
    (`AnaliseCreditoService`, `DashboardService`, `ConfiguracaoService`, `FiltrosService`).
  - **`AnaliseBusinessLogic.cs`**: O coração dos cálculos, que usa os pesos do banco
    para gerar scores, IVE, estrelas e segmentos.
  - **Endpoints Principais:**
    - `/api/dashboard/*`: Alimenta a página principal com KPIs e gráficos.
    - `/api/credito`: Retorna a lista paginada para a tabela de análise.
    - `/api/credito/{id}`: NOVO. Retorna os dados detalhados de um único cliente.
    - `/api/filtros/*`: Popula os dropdowns de filtro.
    - `/api/configuracao`: Permite ler e salvar os pesos da análise.

  --- FRONTEND (WEB EM NEXT.JS/TYPESCRIPT) ---
  Responsável pela experiência do usuário, usando tecnologias modernas.
  - **`app/` (App Router):**
    - `page.tsx`: O Dashboard Gerencial.
    - `analise/page.tsx`: A página de Análise Operacional (tabela).
    - `cliente/[id]/page.tsx`: NOVO. A página de detalhes de um cliente.
  - **Gerenciamento de Estado:**
    - **TanStack Query:** Para todo o estado do servidor (caching, revalidação).
    - **Zustand (`use-filter-store.ts`):** Apenas para o estado dos filtros do Dashboard.
  - **Padrões de Projeto:**
    - **URL como Fonte da Verdade:** A página `/analise` deriva seu estado dos
      parâmetros da URL (`useSearchParams`), não do store global, corrigindo o
      bug de "filtros sujos".
    - **Suspense:** Usado na página `/analise` para lidar com a renderização
      de componentes que dependem de hooks do lado do cliente, como `useSearchParams`.

  ****************************************************************************
  ** 4. ESTADO ATUAL E PRÓXIMAS AÇÕES
  ****************************************************************************

  **ESTADO ATUAL:** A aplicação possui uma base sólida e funcional, com um fluxo
  de navegação de "drill-down" completo e melhorias de usabilidade implementadas.

  - **Funcionalidades Concluídas:**
    - Divisão da interface em Dashboard (`/`) e Análise Operacional (`/analise`).
    - Criação da página de Detalhes do Cliente (`/cliente/[id]`) com header,
      gráfico de histórico e tabela de títulos.
    - Implementação de botões "Voltar" para melhorar a navegabilidade.
  
  - **Correções e Melhorias de UX Recentes:**
    - Resolvido bug de "filtros sujos" ao desacoplar o estado da página de Análise
      do store global, usando a URL como fonte da verdade.
    - Implementado `<Suspense>` na página de Análise para corrigir erro de build
      e melhorar a experiência de carregamento.
    - Corrigido layout da tabela na visão "Análise Semanal" para remover
      espaços indesejados nas colunas fixas.
    - Adicionados links na tabela de análise para a nova página de detalhes do cliente.

  **PRÓXIMO PASSO:** A plataforma está estável. Podemos agora focar em adicionar
  novas camadas de inteligência, refinar a interface ou otimizar a performance.
*/