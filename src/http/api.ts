// lib/api.ts ou http/api.ts

import ky from 'ky';
import { AnaliseCreditoFiltros, AnaliseCreditoResultado } from '@/types/analise-credito';

const api = ky.create({
  prefixUrl: 'https://localhost:7286/api', // IMPORTANTE: Verifique se a URL da sua API está correta!
});

// Função que busca os dados da análise de crédito
export const fetchAnaliseCredito = async (
  filtros: AnaliseCreditoFiltros
): Promise<AnaliseCreditoResultado[]> => {

  const searchParams = new URLSearchParams();

  // ==================> INÍCIO DA CORREÇÃO <==================
  // Verifica se clienteIds existe e se é um array antes de usar o forEach
  if (filtros.clienteIds && Array.isArray(filtros.clienteIds) && filtros.clienteIds.length > 0) {
    // Adiciona o tipo explícito 'number' para o parâmetro 'id'
    filtros.clienteIds.forEach((id: number) => {
      searchParams.append('ClienteIds', id.toString());
    });
  }
  // ==================> FIM DA CORREÇÃO <==================

  if (filtros.vendedorCodigo) {
    searchParams.append('VendedorCodigo', filtros.vendedorCodigo);
  }
  if (filtros.grupoCodigo) {
    searchParams.append('GrupoCodigo', filtros.grupoCodigo);
  }
  if (filtros.comNotaDeCredito) {
    searchParams.append('ComNotaDeCredito', 'true');
  }
  if (filtros.dataInicial) {
    searchParams.append('DataInicial', filtros.dataInicial);
  }
  if (filtros.dataFinal) {
    searchParams.append('DataFinal', filtros.dataFinal);
  }

  const resultados = await api.get('credito', { searchParams }).json<AnaliseCreditoResultado[]>();
  return resultados;
};