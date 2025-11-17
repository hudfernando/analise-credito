// Caminho: src/types/analise-credito.ts

export interface AnaliseCreditoFiltros {
  clienteIds?: number[];
  grupoCodigo?: string;
  situacaoCredito?: string;
  comNotaDeCredito?: boolean;
  dataInicial?: string;
  dataFinal?: string;
  pagina?: number;
  tamanhoPagina?: number;
  VendedorId?: string;
  EquipeId?: string;
  Estado?: string;
  // --- ADICIONE ESTAS DUAS PROPRIEDADES (v5.0) ---
  dataReferencia?: string; // Usado no filtro de Categoria
  grupoCanal?: string;    // Usado no filtro de Categoria e Oportunidades
  Municipio?: string;
  SituacaoCredito?: string;
  
  // --- ALTERAÇÃO AQUI (v6.1) ---
  // A API já aceitava, mas agora o frontend precisa dele no tipo principal
  ClassificacaoEstrelas?: number | null; 
  
  // --- ADIÇÃO AQUI (v6.1) ---
  Regiao?: string; // Para "Norte Goiano", "Sul Goiano", etc.
  
  // --- ADIÇÕES v6.1 (Tabela Operacional) ---
  sortBy?: string;
  sortDirection?: string;
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
  totalCobrança: number;
}

// --- ALTERAÇÃO AQUI (v6.1) ---
// Atualizado para refletir a nova estrutura da API
export interface PaginatedResponse<T> {
  itens: T[];
  totalCount: number;
  totalPages: number;
  proximaPagina?: number | null;
}
// --- FIM DA ALTERAÇÃO ---

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

// ... (todos os seus tipos existentes como AnaliseCreditoFiltros, AnaliseCompleta, etc., continuam aqui)

// --- NOVOS TIPOS ADICIONADOS AQUI ---

// Documentação: Representa a estrutura de um único título em aberto, vindo da API.
// Corresponde à entidade 'Titrec' do backend.
export type Titulo = {
  titrecId: number;
  cdClien: number;
  situacao: string;
  sitCnab: string;
  tpTit: string;
  dtVenc: string; // Datas vêm como string no formato ISO (ex: "2025-10-28T00:00:00")
  dtEmis: string;
  ultimoPagamento: string | null;
  valor: number;
  vlJuros: number | null;
  vlMulta: number | null;
  vlDesconto: number | null;
  vlAbatimento: number | null;
  vlPago: number;
};

// Documentação: Representa um ponto de dados para o gráfico de histórico de compras.
// Corresponde ao 'HistoricoComprasDto' do backend.
export type HistoricoCompras = {
  ano: number;
  mes: number;
  valorTotal: number;
};

// Documentação: Representa a estrutura completa do DTO de detalhes do cliente.
// Corresponde ao 'ClienteDetalheDto' do backend.
export type ClienteDetalhe = {
  cdClien: number;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  situacaoCredito: string;
  limiteCredito: number;
  dataCadastro: string | null;
  valorEmAberto: number;
  valorVencido: number;
  titulosVencidos: number;
  atrasoMedio: number;
  maiorCompra: number;
  dataUltimaCompra: string | null;
  historicoCompras: HistoricoCompras[];
  titulos: Titulo[];
};

export interface PerformanceGeral {
  faturamentoTotal: number;
  ticketMedio: number;
  numeroDePedidos: number;
  clientesPositivados: number;
  margemMediaPercentual: number;
}

/**
 * Corresponde ao DTO 'RankingProdutoDto' da API.
 * Usado para os gráficos e tabelas de ranking de produtos.
 */
export interface RankingProduto {
  produtoId: number;
  descricaoProduto: string;
  valorTotalVendido: number;
  quantidadeTotalVendida: number;
  custoTotal: number;
  margemTotal: number;
}

export interface DnaCategoria {
  idCategoria: string;
  descricaoCategoria: string;
  grupoCanal: string;
  clienteCompra: boolean;
  valorTotalVendido: number;
  quantidadeTotalVendida: number;
  margemTotal: number;
  margemPercentual: number;
  dataUltimaCompra: string | null; // Datas vêm como string ISO
}

export interface DnaProduto {
  idProduto: number;
  descricaoProduto: string;
  descricaoFabricante: string;
  valorTotalVendido: number;
  quantidadeTotalVendida: number;
  margemPercentual: number;
}

export interface AnaliseMixFabricante {
  idFabricante: string;
  descricaoFabricante: string | null;
  grupoCanal: string;
  idTabelaPreco: string;
  quantidadeTotal: number;
  frequenciaTotal: number;
  qtdProdutosCompradosDoMix: number;
}

// --- ADICIONE ESTA NOVA INTERFACE ---
export type AnaliseMixProduto = {
  idProduto: number
  descricaoProduto: string | null
  grupoCanal: string
  idTabelaPreco: string
  quantidadeTotal: number
  frequenciaTotal: number
  dataUltimaCompra: string | null // Datas vêm como string do JSON
}

// --- ADICIONE ESTA NOVA INTERFACE ---
export type OportunidadeMix = {
  idFabricante: string
  descricaoFabricante: string | null
  grupoCanal: string
  idVendedor: string | null
  nomeVendedor: string | null
  quantidadeTotal: number
  clientesAtendidos: number
  skuComprados: number
}
// --- FIM DA ADIÇÃO ---

// --- ADIÇÕES v6.1 (Novos DTOs da API) ---
export type KpisGerenciaisDto = {
  valorTotalVendido: number;
  margemMediaPercentual: number;
  clientesPositivados: number;
  skusUnicosVendidos: number;
};

export type VisaoCategoriaDto = {
  categoria: string;
  valorTotalVendido: number;
  margemMediaPercentual: number;
};

export type VisaoCanalDto = {
  canal: string;
  valorTotalVendido: number;
  margemMediaPercentual: number;
};
// --- FIM DA ADIÇÃO ---