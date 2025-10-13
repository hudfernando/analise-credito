// types/analise-credito.ts

// Filtros que serão enviados para a API
export interface AnaliseCreditoFiltros {
 // CORRIGIDO: Permite que o campo seja string (do input) ou number[] (após processamento)
  clienteIds?: number[] | string; 
  vendedorCodigo?: string;
  grupoCodigo?: string;
  comNotaDeCredito?: boolean;
  dataInicial?: string;
  dataFinal?: string;
}

// Estrutura dos dados recebidos da API
export interface AnaliseCreditoResultado {
  clienteId: number;
  nomeCliente: string;
  situacaoCredito: string;
  limiteDeCredito: string;
  saldoDevedor: string;
  saldoParaCompras: string;
  titulosVencidos: number;
  titulosAVencer: number;
  notasDeCredito: string;
  diasDoVencidoMaisAntigo: number;
  atrasoMedioDias: number;
  maiorCompra: string;
  compras90Dias: number;
  mediaCompra90Dias: string;
  vencimento7Dias: string;
}