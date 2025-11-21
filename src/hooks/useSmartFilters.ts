// Caminho: src/hooks/useSmartFilters.ts
import { useQuery } from '@tanstack/react-query';
import { useFilterStore } from '@/store/use-filter-store';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';
import {
  fetchEquipes,
  fetchVendedoresPorEquipe,
  fetchEstados,
  fetchEstadosPorVendedor,
  fetchRegioesDinamicas,
  fetchMunicipios,
} from '@/http/api';

interface UseSmartFiltersOptions {
  showSopFilters?: boolean; 
}

export function useSmartFilters({ showSopFilters = false }: UseSmartFiltersOptions = {}) {
  const filtros = useFilterStore((state) => state.filtros);
  const setFiltros = useFilterStore((state) => state.setFiltros);
  const updateFiltro = useFilterStore((state) => state.updateFiltro);

  // --- 1. LÓGICA DE ATUALIZAÇÃO CENTRALIZADA (EVENT-DRIVEN) ---
  // Substitui todos os useEffects de cascata por lógica direta no evento.
  const handleFiltroChange = (key: keyof AnaliseCreditoFiltros, value: string | number | undefined | null) => {
    const finalValue = value === null ? undefined : value;
    
    // Copia o estado atual para manipular
    let novosFiltros: AnaliseCreditoFiltros = { ...filtros };
    (novosFiltros as any)[key] = finalValue;

    // === REGRAS DE CASCATA (LIMPEZA AUTOMÁTICA) ===
    
    // Regra 1: Se mudar a EQUIPE -> Limpa tudo o que depende dela
    if (key === 'EquipeId') {
      novosFiltros.VendedorId = undefined;
      novosFiltros.Estado = undefined;
      novosFiltros.Municipio = undefined;
      novosFiltros.Regiao = undefined;
    } 
    // Regra 2: Se mudar o VENDEDOR -> Limpa Geo
    else if (key === 'VendedorId') {
       novosFiltros.Municipio = undefined;
       novosFiltros.Regiao = undefined;
       // Se mudou o vendedor, o estado anterior pode não ser válido para ele, então limpamos
       novosFiltros.Estado = undefined; 
    }
    // Regra 3: Se limpar o ESTADO -> Limpa Município e Região
    else if (key === 'Estado' && !finalValue) {
      novosFiltros.Municipio = undefined;
      novosFiltros.Regiao = undefined;
    }
    // Regra 4: Se limpar a REGIÃO -> Limpa Município
    else if (key === 'Regiao' && !finalValue) {
      novosFiltros.Municipio = undefined;
    }
    // Regra 5: Se limpar o MUNICÍPIO -> Limpa Região
    else if (key === 'Municipio' && !finalValue) {
      novosFiltros.Regiao = undefined;
    }

    // Sempre reseta para a página 1 ao aplicar qualquer filtro novo
    if (key !== 'pagina') {
      novosFiltros.pagina = 1;
    }

    // Atualização Atômica (Um único render)
    setFiltros(novosFiltros);
  };

  // Helpers de input (Currying)
  const setString = (key: keyof AnaliseCreditoFiltros) => (val: string) => handleFiltroChange(key, val === 'TODOS' ? undefined : val);
  const setNumber = (key: keyof AnaliseCreditoFiltros) => (val: string) => handleFiltroChange(key, val === 'TODOS' ? undefined : parseInt(val, 10));


  // --- 2. QUERIES DE DADOS (DATA FETCHING) ---

  const qEquipes = useQuery({
    queryKey: ['filtroEquipes'],
    queryFn: fetchEquipes,
    staleTime: Infinity,
    select: (data) => data.map(e => ({ value: e.id, label: e.descricao })),
  });

  const qVendedores = useQuery({
    queryKey: ['filtroVendedores', filtros.EquipeId],
    queryFn: () => fetchVendedoresPorEquipe(filtros.EquipeId!),
    enabled: !!filtros.EquipeId,
    staleTime: 1000 * 60 * 5, 
    select: (data) => data.map(v => ({ value: v.id, label: v.descricao })),
  });

  // Estados Inteligentes: Busca só os estados do vendedor se ele estiver selecionado
  const qEstadosVendedor = useQuery({
    queryKey: ['filtroEstadosDinamico', filtros.VendedorId],
    queryFn: () => fetchEstadosPorVendedor(filtros.VendedorId!),
    enabled: !!filtros.VendedorId, 
    staleTime: 1000 * 60 * 5,
    select: (data) => data.map(uf => ({ value: uf, label: uf })),
  });

  const qEstadosTodos = useQuery({
    queryKey: ['filtroEstadosTodos'],
    queryFn: fetchEstados,
    staleTime: Infinity,
    enabled: !filtros.VendedorId, 
    select: (data) => data.map(uf => ({ value: uf, label: uf })),
  });

  // Lógica de Derivação (Substitui o useEffect de auto-seleção)
  // Se tem vendedor selecionado, usa a lista restrita, senão usa todos
  const opcoesEstados = (!!filtros.VendedorId) ? qEstadosVendedor : qEstadosTodos;
  
  // Se o vendedor só tem 1 estado, podemos desabilitar o dropdown visualmente ou dar uma dica
  // (Nota: Removemos o auto-select automático via useEffect para evitar loops. 
  //  O usuário seleciona, ou o backend trata o filtro vazio como "todos do vendedor").
  const isEstadoDisabled = (!!filtros.VendedorId && qEstadosVendedor.data?.length === 1);

  const qMunicipios = useQuery({
    queryKey: ['filtroMunicipios', filtros.Estado, filtros.EquipeId, filtros.VendedorId, filtros.Regiao], 
    queryFn: () => fetchMunicipios({
      estado: filtros.Estado,
      equipeId: filtros.EquipeId,
      vendedorId: filtros.VendedorId,
      regiao: filtros.Regiao,
    }),
    enabled: !!filtros.Estado || !!filtros.VendedorId || !!filtros.EquipeId || !!filtros.Regiao,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.map(mun => ({ value: mun, label: mun })),
  });

  const qRegioes = useQuery({
    queryKey: ['filtroRegioes', filtros.EquipeId, filtros.VendedorId, filtros.Estado, filtros.Municipio],
    queryFn: () => fetchRegioesDinamicas({
      equipeId: filtros.EquipeId,
      vendedorId: filtros.VendedorId,
      estado: filtros.Estado,
      municipio: filtros.Municipio
    }),
    staleTime: 1000 * 60 * 5,
    enabled: showSopFilters,
    select: (data) => data.map(r => ({ value: r, label: r })),
  });

  return {
    filtros,
    actions: {
      setString,
      setNumber,
      update: updateFiltro, // Exposto caso precise de update manual raro
    },
    data: {
      equipes: qEquipes.data,
      vendedores: qVendedores.data,
      estados: opcoesEstados.data,
      municipios: qMunicipios.data,
      regioes: qRegioes.data,
    },
    status: {
      isLoadingEquipes: qEquipes.isLoading,
      isLoadingVendedores: qVendedores.isLoading,
      isLoadingEstados: opcoesEstados.isLoading,
      isLoadingMunicipios: qMunicipios.isLoading,
      isLoadingRegioes: qRegioes.isLoading,
      isEstadoDisabled,
    }
  };
}