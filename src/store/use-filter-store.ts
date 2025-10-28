// Caminho: src/store/use-filter-store.ts
import { create } from 'zustand';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';

// Define a estrutura do nosso estado global
interface FilterState {
  filtros: Omit<AnaliseCreditoFiltros, 'pagina' | 'tamanhoPagina'>;
  isSearchActive: boolean;
  setFiltros: (novosFiltros: Omit<AnaliseCreditoFiltros, 'pagina' | 'tamanhoPagina'>) => void;
  setIsSearchActive: (isActive: boolean) => void;
}

// Cria o "store" (o armazém de estado)
export const useFilterStore = create<FilterState>((set) => ({
  // Valores iniciais
  filtros: {},
  isSearchActive: false,
  
  // Ações para modificar o estado
  setFiltros: (novosFiltros) => set({ filtros: novosFiltros }),
  setIsSearchActive: (isActive) => set({ isSearchActive: isActive }),
}));