// Caminho: src/components/analise/FiltrosForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { useSmartFilters } from '@/hooks/useSmartFilters';

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
  
  // TODA A LÓGICA VEM DAQUI AGORA
  const { filtros, actions, data, status } = useSmartFilters({ showSopFilters });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
            showSopFilters ? 'xl:grid-cols-3' : 'lg:grid-cols-4'
          }`}>
            
            {/* EQUIPE */}
            <Select 
              onValueChange={actions.setString('EquipeId')} 
              value={filtros.EquipeId ?? 'TODOS'} 
              disabled={status.isLoadingEquipes || isSearching}
            >
              <SelectTrigger><SelectValue placeholder="Selecione uma Equipe" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todas as Equipes</SelectItem>
                {data.equipes?.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* VENDEDOR */}
            <Select 
              onValueChange={actions.setString('VendedorId')} 
              value={filtros.VendedorId ?? 'TODOS'} 
              disabled={!filtros.EquipeId || status.isLoadingVendedores || isSearching}
            >
              <SelectTrigger><SelectValue placeholder="Selecione um Vendedor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos os Vendedores</SelectItem>
                {data.vendedores?.map(v => <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* ESTADO */}
            <Select 
              onValueChange={actions.setString('Estado')} 
              value={filtros.Estado ?? 'TODOS'} 
              disabled={status.isLoadingEstados || status.isEstadoDisabled || isSearching}
            >
              <SelectTrigger><SelectValue placeholder="Selecione um Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos os Estados</SelectItem>
                {data.estados?.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* MUNICÍPIO */}
            <Select 
              onValueChange={actions.setString('Municipio')} 
              value={filtros.Municipio ?? 'TODOS'} 
              disabled={!(filtros.Estado || filtros.VendedorId || filtros.EquipeId || filtros.Regiao) || status.isLoadingMunicipios || isSearching}
            >
              <SelectTrigger><SelectValue placeholder="Selecione um Município" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos os Municípios</SelectItem>
                {data.municipios?.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            
            {/* FILTROS AVANÇADOS (S&OP) */}
            {showSopFilters && (
              <>
                <Select 
                  onValueChange={actions.setString('Regiao')} 
                  value={filtros.Regiao ?? 'TODAS'} 
                  disabled={status.isLoadingRegioes || isSearching}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione uma Região" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todas as Regiões</SelectItem>
                    {data.regioes?.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                
                <Select 
                  onValueChange={actions.setNumber('ClassificacaoEstrelas')} 
                  value={filtros.ClassificacaoEstrelas?.toString() ?? 'TODOS'} 
                  disabled={isSearching}
                >
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
              {isSearching 
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                : <Search className="mr-2 h-4 w-4" />
              }
              Buscar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};