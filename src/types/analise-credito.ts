// Caminho: src/types/analise-credito.ts

export interface AnaliseCreditoFiltros {
  clienteIds?: number[];
  grupoCodigo?: string;
  situacaoCredito?: string;
  comNotaDeCredito?: boolean;
  dataInicial?: string;
  dataFinal?: string;
  classificacaoEstrelas?: number | null;
  pagina?: number;
  tamanhoPagina?: number;
  VendedorId?: string;
  EquipeId?: string;
  Estado?: string;
  Municipio?: string;
  SituacaoCredito?: string;
  ClassificacaoEstrelas?: number | null;
}

// DTO completo, incluindo dados gerais e semanais
export interface AnaliseCompleta {
  // Dados brutos
  clienteId: number;
  nomeCliente: string;
  situacaoCredito: string;
  limiteCredito: number;
  saldoDevedor: number;
  saldoParaCompras: number;
  notasDeCredito: number;
  maiorCompra: number;
  mediaCompra90Dias: number;
  vencimento7Dias: number;
  titulosVencidos: number;
  titulosAVencer: number;
  diasVencidoMaisAntigo: number;
  atrasoMedioDias: number;
  compras90Dias: number;
  
  // Dados semanais
  qtdSemana1: number;
  valorSemana1: number;
  qtdSemana2: number;
  valorSemana2: number;
  qtdSemana3: number;
  valorSemana3: number;
  qtdSemana4: number;
  valorSemana4: number;

  // Dados de inteligência
  scoreRisco: number;
  scoreValor: number;
  ive: number;
  classificacaoEstrelas: number;
  segmento: string;
  tendencia: string;
  alertas: string[];

  // --- NOVA PROPRIEDADE ADICIONADA AQUI ---
  probabilidadeInadimplencia: number; // A API envia como um número de 0.0 a 1.0
}

// DTO do resumo, agora com os totais de limite
export interface DashboardSummary {
  totalClientes: number;
  totalSaldoDevedor: number;
  totalLimiteCredito: number;
  totalSaldoDisponivel: number;
  distribuicaoEstrelas: Record<string, number>;
}

export interface PaginatedResponse<T> {
  itens: T[];
  proximaPagina: number | null;
}

// DTO para os pesos de configuração da análise
export interface Configuracao {
  nome: string;
  valor: number;
}

// --- NOVO TIPO ADICIONADO ---
// Representa um ponto de dado para os gráficos de distribuição.
export type DistribuicaoDto = {
  chave: string;
  valor: number;
};

// --- NOVO TIPO ADICIONADO ---
// Representa um cliente nas listas de Top 5 do dashboard.
export type TopClienteDto = {
  clienteId: number;
  nomeCliente: string;
  valorPrincipal: number;
  labelValor: string; // Ex: "IVE" ou "Prob. Inadimplência"
};