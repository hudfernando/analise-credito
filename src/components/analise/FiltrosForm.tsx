// Caminho: src/components/analise/FiltrosForm.tsx

'use client';

import { useState } from 'react';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface FiltrosFormProps {
  onSearch: (filtros: Omit<AnaliseCreditoFiltros, 'pagina' | 'tamanhoPagina'>) => void;
  isSearching: boolean;
}

export const FiltrosForm = ({ onSearch, isSearching }: FiltrosFormProps) => {
  // --- CORREÇÃO 1: Alterado o nome do estado para corresponder ao DTO da API ---
  const [vendedorId, setVendedorId] = useState('');
  // O campo 'grupoCodigo' foi removido pois não é mais utilizado pelo backend.

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // --- CORREÇÃO 2: A chave do objeto agora é 'VendedorId' ---
    const filtros: Omit<AnaliseCreditoFiltros, 'pagina' | 'tamanhoPagina'> = {
      VendedorId: vendedorId || undefined,
    };
    
    onSearch(filtros);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros de Análise</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* --- CORREÇÃO 3: O Input agora usa o estado 'vendedorId' --- */}
            <div className="space-y-2">
              <Label htmlFor="vendedor">Código do Vendedor</Label>
              <Input
                id="vendedor"
                placeholder="Ex: AMARILDO"
                value={vendedorId}
                onChange={(e) => setVendedorId(e.target.value)}
                disabled={isSearching}
              />
            </div>

            {/* O campo para 'Código do Grupo' foi removido para alinhar com a API. */}

          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                'Buscar'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};