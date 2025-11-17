// Caminho: src/http/api.ts

import ky from 'ky';
import { 
  AnaliseCreditoFiltros, 
  AnaliseCompleta, 
  DashboardSummary, 
  PaginatedResponse ,
  Configuracao,
  DistribuicaoDto,
  TopClienteDto,
  ClienteDetalhe,
  PerformanceGeral,
  RankingProduto,
  DnaCategoria,
  DnaProduto,
  AnaliseMixFabricante,
  AnaliseMixProduto,
  // --- ADIÇÃO v6.1 ---
  KpisGerenciaisDto,
  VisaoCategoriaDto,
  VisaoCanalDto,
  OportunidadeMix
  // --- FIM DA ADIÇÃO ---
} from '@/types/analise-credito';

export type FiltroOpcaoString = { id: string; descricao: string };
export type FiltroOpcaoNumero = { id: number; descricao: string };

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000, // Timeout de 60 segundos
});

// Transforma o objeto de filtros em search params, removendo valores nulos/vazios
const createSearchParams = (filters: AnaliseCreditoFiltros): URLSearchParams => {
  const searchParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    // --- ALTERAÇÃO AQUI ---
    // Precisamos permitir '0' (ex: ClassificacaoEstrelas = 0 para Inativos)
    if (value !== undefined && value !== null && value !== '') {
    // --- FIM DA ALTERAÇÃO ---
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

// Documentação: Busca os dados detalhados de um único cliente pelo seu ID.
export async function fetchClienteDetalhe(id: string | number): Promise<ClienteDetalhe> {
  // A biblioteca 'ky' já tem o prefixUrl configurado, então só precisamos do caminho relativo.
  return await api.get(`credito/${id}`).json<ClienteDetalhe>();
}

// --- ADIÇÕES DA FASE 1: INTELIGÊNCIA COMERCIAL ---

/**
 * Busca os KPIs de performance geral de vendas (Mês Atual).
 */
export async function fetchPerformanceGeral(): Promise<PerformanceGeral> {
  return await api.get('comercial/performance-geral').json<PerformanceGeral>();
}

/**
 * Busca o ranking dos 10 produtos mais vendidos (em valor).
 */
export async function fetchTop10Produtos(): Promise<RankingProduto[]> {
  return await api.get('comercial/ranking-produtos').json<RankingProduto[]>();
}

/**
 * Busca o faturamento agrupado por categoria de produto.
 */
// --- CORREÇÃO AQUI (Linha 122) ---
// Adicionamos '= {}' para tornar o argumento 'filters' opcional.
export async function fetchFaturamentoCategoria(filters: AnaliseCreditoFiltros = {}): Promise<DistribuicaoDto[]> {
  // --- FIM DA CORREÇÃO ---
  // --- ATUALIZAÇÃO v6.1 ---
  // Agora passa os filtros para o endpoint
  const searchParams = createSearchParams(filters);
  return await api.get('comercial/faturamento-categoria', { searchParams }).json<DistribuicaoDto[]>();
}

// Chama o endpoint: GET /api/filtros/equipes
export async function fetchEquipes(): Promise<FiltroOpcaoString[]> {
  return await api.get('filtros/equipes').json<FiltroOpcaoString[]>();
}

// Chama o endpoint: GET /api/filtros/vendedores/{equipeId}
export async function fetchVendedoresPorEquipe(equipeId: string): Promise<FiltroOpcaoString[]> {
  return await api.get(`filtros/vendedores/${equipeId}`).json<FiltroOpcaoString[]>();
}

// Chama o endpoint: GET /api/filtros/estados
export async function fetchEstados(): Promise<string[]> {
  return await api.get('filtros/estados').json<string[]>();
}

// --- ADIÇÃO FILTRO INTELIGENTE (CRÉDITO) ---
// Chama o endpoint: GET /api/filtros/estados-por-vendedor/{vendedorId}
export async function fetchEstadosPorVendedor(vendedorId: string): Promise<string[]> {
  return await api.get(`filtros/estados-por-vendedor/${vendedorId}`).json<string[]>();
}
// --- FIM DA ADIÇÃO ---


// Chama o endpoint: GET /api/filtros/municipios
export async function fetchMunicipios(filtros: { 
  estado?: string; 
  equipeId?: string; 
  vendedorId?: string; 
}): Promise<string[]> {
  
  const searchParams = new URLSearchParams();
  
  // Adiciona os parâmetros apenas se eles existirem
  if (filtros.estado) searchParams.append("estado", filtros.estado);
  if (filtros.equipeId) searchParams.append("equipeId", filtros.equipeId);
  if (filtros.vendedorId) searchParams.append("vendedorId", filtros.vendedorId);

  return await api.get('filtros/municipios', { searchParams }).json<string[]>();
}

// --- ADIÇÃO v6.1 ---
// Chama o endpoint: GET /api/filtros/regioes
export async function fetchRegioes(): Promise<string[]> {
  return await api.get('filtros/regioes').json<string[]>();
}
// --- FIM DA ADIÇÃO ---

// --- ADIÇÃO FILTRO INTELIGENTE (S&OP) ---
// Chama o endpoint: GET /api/filtros/regioes-dinamicas
export async function fetchRegioesDinamicas(filtros: {
  estado?: string;
  municipio?: string;
  equipeId?: string;
  vendedorId?: string;
}): Promise<string[]> {
  const searchParams = new URLSearchParams();
  if (filtros.estado) searchParams.append("estado", filtros.estado);
  if (filtros.municipio) searchParams.append("municipio", filtros.municipio);
  if (filtros.equipeId) searchParams.append("equipeId", filtros.equipeId);
  if (filtros.vendedorId) searchParams.append("vendedorId", filtros.vendedorId);
  
  return await api.get('filtros/regioes-dinamicas', { searchParams }).json<string[]>();
}
// --- FIM DA ADIÇÃO ---

export async function fetchDnaCompraCliente(clienteId: string | number): Promise<DnaCategoria[]> {
  return await api.get(`credito/${clienteId}/dna-compra`).json<DnaCategoria[]>();
}

export async function fetchDnaDetalheCategoria(
  clienteId: string | number,
  categoriaId: string,
  canal: string
): Promise<DnaProduto[]> {
  
  const searchParams = new URLSearchParams({
    categoriaId: categoriaId,
    canal: canal
  });

  return await api.get(`credito/${clienteId}/dna-detalhe-categoria`, { searchParams }).json<DnaProduto[]>();
}

export async function fetchCanais(): Promise<string[]> {
  return await api.get('filtros/canais').json<string[]>();
}

// --- ADICIONE ESTA NOVA FUNÇÃO ---
export async function fetchAnaliseMixFabricante(
  clienteId: string,
): Promise<AnaliseMixFabricante[]> {
  // Chama o endpoint que criamos e corrigimos na API
  return api
    .get(`comercial/cliente/${clienteId}/analise-mix-fabricante`)
    .json<AnaliseMixFabricante[]>()
}

// --- ADICIONE ESTA NOVA FUNÇÃO ---
export async function fetchAnaliseMixProduto(
  clienteId: string,
  fabricanteId: string,
): Promise<AnaliseMixProduto[]> {
  return api
    .get(
      `comercial/cliente/${clienteId}/analise-mix-produto/${fabricanteId}`,
    )
    .json<AnaliseMixProduto[]>()
}

// --- FUNÇÃO REMOVIDA (fetchOportunidadesMix) ---
// Foi substituída pelas novas funções abaixo
// --- FIM DA REMOÇÃO ---


// --- ADIÇÕES FINAIS v6.1 (NOVOS ENDPOINTS) ---

/**
 * Busca os KPIs para os cards do Dashboard Gerencial.
 */
export async function fetchKpisGerenciais(filters: AnaliseCreditoFiltros): Promise<KpisGerenciaisDto> {
  const searchParams = createSearchParams(filters);
  return await api.get('comercial/oportunidades/kpis-gerenciais', { searchParams }).json<KpisGerenciaisDto>();
}

/**
 * Busca os dados para a aba "Visão por Categoria".
 */
export async function fetchVisaoCategoria(filters: AnaliseCreditoFiltros): Promise<VisaoCategoriaDto[]> {
  const searchParams = createSearchParams(filters);
  return await api.get('comercial/oportunidades/visao-categoria', { searchParams }).json<VisaoCategoriaDto[]>();
}

/**
 * Busca os dados para a aba "Visão por Canal".
 */
export async function fetchVisaoCanal(filters: AnaliseCreditoFiltros): Promise<VisaoCanalDto[]> {
  const searchParams = createSearchParams(filters);
  return await api.get('comercial/oportunidades/visao-canal', { searchParams }).json<VisaoCanalDto[]>();
}

/**
 * Busca os dados da tabela operacional (paginada).
 */
export async function fetchOportunidadesDetalhesPaginado(filters: AnaliseCreditoFiltros): Promise<PaginatedResponse<OportunidadeMix>> {
  const searchParams = createSearchParams(filters);
  return await api.get('comercial/oportunidades/detalhes', { searchParams }).json<PaginatedResponse<OportunidadeMix>>();
}

/**
 * Busca os dados completos da tabela operacional (para exportação).
 */
export async function fetchOportunidadesDetalhesExport(filters: AnaliseCreditoFiltros): Promise<OportunidadeMix[]> {
  const searchParams = createSearchParams(filters);
  return await api.get('comercial/oportunidades/detalhes/exportar', { searchParams }).json<OportunidadeMix[]>();
}