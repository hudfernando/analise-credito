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

// Interface que espelha o DTO que vem do backend (ASP.NET Core)
// Adicionamos os novos campos aqui.
export interface AnaliseCreditoResultado {
  clienteId: number;
  nomeCliente: string;
  situacaoCredito: string;
  limiteCredito: number;
  saldoDevedor: number;
  saldoParaCompras: number;
  notasDeCredito: number;
  titulosVencidos: number;
  titulosAVencer: number;
  diasVencidoMaisAntigo: number;
  atrasoMedioDias: number;
  maiorCompra: number;
  compras90Dias: number;
  mediaCompra90Dias: number;
  vencimento7Dias: number;
}