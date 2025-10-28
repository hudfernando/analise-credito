// Caminho: src/lib/api.ts

import ky from 'ky';
import { 
  AnaliseCreditoFiltros, 
  AnaliseCompleta, 
  DashboardSummary, 
  PaginatedResponse ,
  Configuracao,
  DistribuicaoDto,
  TopClienteDto
} from '@/types/analise-credito';

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000, // Timeout de 60 segundos
});

// Transforma o objeto de filtros em search params, removendo valores nulos/vazios
const createSearchParams = (filters: AnaliseCreditoFiltros): URLSearchParams => {
  const searchParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams;
};


// --- NOVA FUNÇÃO ---
// Busca os dados agregados para o resumo do dashboard.
export async function fetchDashboardSummary(filters: AnaliseCreditoFiltros): Promise<DashboardSummary> {
  const searchParams = createSearchParams(filters);
  return await api.get('dashboard/summary', { searchParams }).json<DashboardSummary>();
}


// --- FUNÇÃO ATUALIZADA ---
// Busca a lista detalhada e paginada de clientes com a análise completa.
export async function fetchAnaliseCredito(filters: AnaliseCreditoFiltros): Promise<PaginatedResponse<AnaliseCompleta>> {
  const searchParams = createSearchParams(filters);
  return await api.get('credito', { searchParams }).json<PaginatedResponse<AnaliseCompleta>>();
}

// --- NOVAS FUNÇÕES ---

// Busca a lista atual de pesos de configuração da API.
export async function fetchConfiguracoes(): Promise<Configuracao[]> {
  return await api.get('configuracao').json<Configuracao[]>();
}

// Envia a lista atualizada de pesos para a API salvar.
export async function updateConfiguracoes(configs: Configuracao[]): Promise<void> {
  // O método PUT envia o corpo da requisição como JSON.
  await api.put('configuracao', { json: configs });
}

// Busca os dados para o gráfico de distribuição por classificação (estrelas).
export async function fetchDistribuicaoClassificacao(filters: AnaliseCreditoFiltros): Promise<DistribuicaoDto[]> {
  const searchParams = createSearchParams(filters);
  return await api.get('dashboard/distribuicao-classificacao', { searchParams }).json<DistribuicaoDto[]>();
}

// Busca os dados para o gráfico de distribuição por segmento.
export async function fetchDistribuicaoSegmento(filters: AnaliseCreditoFiltros): Promise<DistribuicaoDto[]> {
  const searchParams = createSearchParams(filters);
  return await api.get('dashboard/distribuicao-segmento', { searchParams }).json<DistribuicaoDto[]>();
}

// Busca os Top 5 clientes por maior valor (IVE).
export async function fetchTopClientesValor(filters: AnaliseCreditoFiltros): Promise<TopClienteDto[]> {
  const searchParams = createSearchParams(filters);
  return await api.get('dashboard/top-clientes-valor', { searchParams }).json<TopClienteDto[]>();
}

// Busca os Top 5 clientes por maior risco (Prob. Inadimplência).
export async function fetchTopClientesRisco(filters: AnaliseCreditoFiltros): Promise<TopClienteDto[]> {
  const searchParams = createSearchParams(filters);
  return await api.get('dashboard/top-clientes-risco', { searchParams }).json<TopClienteDto[]>();
}