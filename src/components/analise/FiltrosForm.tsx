'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';
import { Search, Loader2 } from 'lucide-react';

interface FiltrosFormProps {
  filtros: AnaliseCreditoFiltros;
  // Função para atualizar o estado na página principal
  setFiltros: React.Dispatch<React.SetStateAction<AnaliseCreditoFiltros>>;
  handleSearch: () => void; // Função para iniciar a busca
  isSearching: boolean;
  dataError: string;
}

// Este agora é um componente "controlado" e mais simples
export const FiltrosForm = ({
  filtros,
  setFiltros,
  handleSearch,
  isSearching,
  dataError,
}: FiltrosFormProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFiltros(prev => ({...prev, comNotaDeCredito: checked}))
  }

  return (
    <Card className="border-azul-claro/20">
      <CardHeader>
        <CardTitle className="text-azul-claro">Filtros de Análise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Coluna 1 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="clienteIds">Códigos de Clientes (separados por ,)</Label>
              <Input id="clienteIds" name="clienteIds" value={filtros.clienteIds as string || ''} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="vendedorCodigo">Código do Vendedor</Label>
              <Input id="vendedorCodigo" name="vendedorCodigo" value={filtros.vendedorCodigo || ''} onChange={handleInputChange} />
            </div>
          </div>
          {/* Coluna 2 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="grupoCodigo">Código do Grupo</Label>
              <Input id="grupoCodigo" name="grupoCodigo" value={filtros.grupoCodigo || ''} onChange={handleInputChange} />
            </div>
             <div className="flex items-center space-x-2 pt-8">
                <Checkbox id="comNotaDeCredito" name="comNotaDeCredito" checked={filtros.comNotaDeCredito} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="comNotaDeCredito">Apenas com Nota de Crédito</Label>
            </div>
          </div>
          {/* Coluna 3 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="dataInicial">Data Inicial (DDMMYYYY)</Label>
              <Input id="dataInicial" name="dataInicial" value={filtros.dataInicial || ''} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="dataFinal">Data Final (DDMMYYYY)</Label>
              <Input id="dataFinal" name="dataFinal" value={filtros.dataFinal || ''} onChange={handleInputChange} />
            </div>
             {dataError && <p className="text-red-500 text-sm">{dataError}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSearch} disabled={isSearching} className="bg-azul-claro text-azul-escuro hover:bg-azul-claro/90 w-[120px]">
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {isSearching ? 'Buscando' : 'Buscar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};