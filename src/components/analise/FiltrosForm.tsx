// Caminho: src/components/dashboard/FiltrosForm.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import {
  fetchEquipes,
  fetchVendedoresPorEquipe,
  fetchEstados,
  // --- MUDANÇAS FILTRO INTELIGENTE ---
  fetchEstadosPorVendedor, // Para o Dashboard de Crédito
  fetchRegioesDinamicas,  // Para o Dashboard S&OP
  // --- FIM DA MUDANÇA ---
  fetchMunicipios,
} from '@/http/api'; // Caminho corrigido
import { useFilterStore } from '@/store/use-filter-store'; 
import { useEffect } from 'react';

interface FiltrosFormProps {
  onSearch: () => void;
  isSearching: boolean;
  showSopFilters?: boolean; 
}

const rankingOptions = [
  { value: '5', label: '⭐⭐⭐⭐⭐ 5 Estrelas' },
  { value: '4', label: '⭐⭐⭐⭐ 4 Estrelas' },
  { value: '3', label: '⭐⭐⭐ 3 Estrelas' },
  { value: '2', label: '⭐⭐ 2 Estrelas' },
  { value: '1', label: '⭐ 1 Estrela' },
  { value: '0', label: 'Inativos' },
];

export const FiltrosForm = ({ onSearch, isSearching, showSopFilters = false }: FiltrosFormProps) => {
  
  const filtros = useFilterStore((state) => state.filtros);
  const updateFiltro = useFilterStore((state) => state.updateFiltro);
  const setFiltros = useFilterStore((state) => state.setFiltros);
  
  const handleFiltroChange = (key: keyof AnaliseCreditoFiltros, value: string | number | undefined | null) => {
    
    const finalValue = value === null ? undefined : value;
    
    let novosFiltros: AnaliseCreditoFiltros = { ...filtros, [key]: finalValue };

    // --- LÓGICA DE LIMPEZA ATUALIZADA ---
    if (key === 'EquipeId') {
      // Se limpar equipe, limpa vendedor e, consequentemente, estados dinâmicos e municípios
      novosFiltros = { ...novosFiltros, VendedorId: undefined, Municipio: undefined, Regiao: undefined };
      if (!showSopFilters) { // Se estiver no Dashboard de Crédito, também limpa o estado
        novosFiltros.Estado = undefined;
      }
    } 
    else if (key === 'VendedorId') {
      // Se limpar vendedor, limpa municípios e reseta o estado (para o filtro de crédito)
       novosFiltros = { ...novosFiltros, Municipio: undefined, Regiao: undefined };
       if (!showSopFilters) { // Se estiver no Dashboard de Crédito
         novosFiltros.Estado = undefined;
       }
    }
    else if (key === 'Estado') {
      // Se limpar estado, limpa município e região
      novosFiltros = { ...novosFiltros, Municipio: undefined, Regiao: undefined };
    }
    else if (key === 'Municipio') {
      // Se limpar município, limpa região
      novosFiltros.Regiao = undefined;
    }
    // --- FIM DA LÓGICA DE LIMPEZA ---
    
    if (key !== 'pagina') {
      novosFiltros.pagina = 1;
    }

    setFiltros(novosFiltros);
  };
  
  const handleSelectChange = (key: keyof AnaliseCreditoFiltros) => (value: string) => {
    handleFiltroChange(key, value === 'TODOS' ? undefined : value);
  };
  
  const handleSelectChangeNumero = (key: keyof AnaliseCreditoFiltros) => (value: string) => {
    handleFiltroChange(key, value === 'TODOS' ? undefined : parseInt(value, 10));
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch();
  };

  // --- BUSCA DE DADOS PARA OS DROPDOWNS ---

  const { data: equipes, isLoading: isLoadingEquipes } = useQuery({
    queryKey: ['filtroEquipes'],
    queryFn: fetchEquipes,
    staleTime: Infinity,
    select: (data) => data.map(e => ({ value: e.id, label: e.descricao })),
  });

  const { data: vendedores, isLoading: isLoadingVendedores } = useQuery({
    queryKey: ['filtroVendedores', filtros.EquipeId],
    queryFn: () => fetchVendedoresPorEquipe(filtros.EquipeId!),
    enabled: !!filtros.EquipeId,
    staleTime: 1000 * 60 * 5, 
    select: (data) => data.map(v => ({ value: v.id, label: v.descricao })),
  });

  // --- LÓGICA 1: FILTRO INTELIGENTE DE ESTADO (Dashboard de Crédito) ---
  const { data: estadosDinamicos, isLoading: isLoadingEstadosDinamicos } = useQuery({
    queryKey: ['filtroEstadosDinamico', filtros.VendedorId],
    queryFn: () => fetchEstadosPorVendedor(filtros.VendedorId!),
    // ATIVADO: Apenas se um VendedorId existir E estivermos no Dashboard de Crédito (showSopFilters === false)
    enabled: !!filtros.VendedorId && !showSopFilters, 
    staleTime: 1000 * 60 * 5,
    select: (data) => data.map(uf => ({ value: uf, label: uf })),
  });

  // Efeito que trava o estado se apenas 1 for retornado (Lógica 1)
  useEffect(() => {
    if (estadosDinamicos && estadosDinamicos.length === 1 && !showSopFilters) {
      if(filtros.Estado !== estadosDinamicos[0].value) {
        updateFiltro({ Estado: estadosDinamicos[0].value });
      }
    }
  }, [estadosDinamicos, showSopFilters, updateFiltro, filtros.Estado]);
  
  // Query para buscar TODOS os estados (usado como fallback ou no S&OP)
  const { data: estadosTodos, isLoading: isLoadingEstadosTodos } = useQuery({
    queryKey: ['filtroEstadosTodos'],
    queryFn: fetchEstados,
    staleTime: Infinity,
    // ATIVADO: Apenas se o filtro dinâmico NÃO estiver ativo
    enabled: !(!showSopFilters && !!filtros.VendedorId), 
    select: (data) => data.map(uf => ({ value: uf, label: uf })),
  });
  
  // Decide qual lista de estados usar
  const estadosParaExibir = (!!filtros.VendedorId && !showSopFilters) ? estadosDinamicos : estadosTodos;
  const isLoadingEstados = (!!filtros.VendedorId && !showSopFilters) ? isLoadingEstadosDinamicos : isLoadingEstadosTodos;
  const isEstadoDisabled = (!!filtros.VendedorId && !showSopFilters && estadosDinamicos?.length === 1) || isSearching;
  // --- FIM DA LÓGICA 1 ---


  const { data: municipios, isLoading: isLoadingMunicipios } = useQuery({
    queryKey: ['filtroMunicipios', filtros.Estado, filtros.EquipeId, filtros.VendedorId],
    queryFn: () => fetchMunicipios({
      estado: filtros.Estado,
      equipeId: filtros.EquipeId,
      vendedorId: filtros.VendedorId
    }),
    enabled: !!filtros.Estado || !!filtros.VendedorId || !!filtros.EquipeId, 
    staleTime: 1000 * 60 * 5,
    select: (data) => data.map(mun => ({ value: mun, label: mun })),
  });
  
  // --- LÓGICA 2: FILTRO INTELIGENTE DE REGIÃO (Dashboard S&OP) ---
  const { data: regioes, isLoading: isLoadingRegioes } = useQuery({
    queryKey: ['filtroRegioes', filtros.EquipeId, filtros.VendedorId, filtros.Estado, filtros.Municipio],
    queryFn: () => fetchRegioesDinamicas({
      equipeId: filtros.EquipeId,
      vendedorId: filtros.VendedorId,
      estado: filtros.Estado,
      municipio: filtros.Municipio
    }),
    staleTime: 1000 * 60 * 5,
    enabled: showSopFilters, // Só busca se o filtro for exibido
    select: (data) => data.map(r => ({ value: r, label: r })),
  });
  // --- FIM DA LÓGICA 2 ---

  // --- Efeito para limpar Vendedor/Município se Equipe/Estado for limpo
  useEffect(() => {
    if (!filtros.EquipeId) {
      updateFiltro({ VendedorId: undefined });
    }
  }, [filtros.EquipeId, updateFiltro]);

  useEffect(() => {
    if (!filtros.Estado) {
      updateFiltro({ Municipio: undefined });
    }
  }, [filtros.Estado, updateFiltro]);


  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
            showSopFilters ? 'xl:grid-cols-3' : 'lg:grid-cols-4'
          }`}>
            
            <Select onValueChange={handleSelectChange('EquipeId')} value={filtros.EquipeId ?? 'TODOS'} disabled={isLoadingEquipes || isSearching}>
              <SelectTrigger><SelectValue placeholder="Selecione uma Equipe" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todas as Equipes</SelectItem>
                {equipes?.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select onValueChange={handleSelectChange('VendedorId')} value={filtros.VendedorId ?? 'TODOS'} disabled={!filtros.EquipeId || isLoadingVendedores || isSearching}>
              <SelectTrigger><SelectValue placeholder="Selecione um Vendedor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos os Vendedores</SelectItem>
                {vendedores?.map(v => <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* --- MUDANÇA: Select de Estado agora é dinâmico --- */}
            <Select 
              onValueChange={handleSelectChange('Estado')} 
              value={filtros.Estado ?? 'TODOS'} 
              disabled={isLoadingEstados || isEstadoDisabled || isSearching}
            >
              <SelectTrigger><SelectValue placeholder="Selecione um Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos os Estados</SelectItem>
                {/* Agora usa a lista de estados dinâmica */}
                {estadosParaExibir?.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select 
              onValueChange={handleSelectChange('Municipio')} 
              value={filtros.Municipio ?? 'TODOS'} 
              disabled={!filtros.Estado && !filtros.VendedorId && !filtros.EquipeId || isLoadingMunicipios || isSearching}
            >
              <SelectTrigger><SelectValue placeholder="Selecione um Município" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos os Municípios</SelectItem>
                {municipios?.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {/* --- FIM DA MUDANÇA --- */}
            
            {showSopFilters && (
              <>
                <Select onValueChange={handleSelectChange('Regiao')} value={filtros.Regiao ?? 'TODAS'} disabled={isLoadingRegioes || isSearching}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma Região" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todas as Regiões</SelectItem>
                    {/* Agora usa a query dinâmica 'regioes' */}
                    {regioes?.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                
                <Select onValueChange={handleSelectChangeNumero('ClassificacaoEstrelas')} value={filtros.ClassificacaoEstrelas?.toString() ?? 'TODOS'} disabled={isSearching}>
                  <SelectTrigger><SelectValue placeholder="Selecione um Ranking" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos os Rankings</SelectItem>
                    {rankingOptions.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </>
            )}

          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSearching} size="lg">
              {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Buscar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};