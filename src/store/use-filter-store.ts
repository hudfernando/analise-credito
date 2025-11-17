// Caminho: src/store/use-filter-store.ts
import { create } from 'zustand';
import { AnaliseCreditoFiltros } from '@/types/analise-credito';

// --- ALTERAÇÃO AQUI ---
// A interface agora usa o tipo AnaliseCreditoFiltros diretamente.
// Removemos o Omit<...> para permitir que o store guarde TODOS os filtros,
// incluindo os novos (Regiao, ClassificacaoEstrelas) e os de paginação/ordenação.
interface FilterState {
  filtros: AnaliseCreditoFiltros;
  isSearchActive: boolean;
  setFiltros: (novosFiltros: AnaliseCreditoFiltros) => void;
  setIsSearchActive: (isActive: boolean) => void;
  // Adicionamos uma ação para atualizar filtros parciais mais facilmente
  updateFiltro: (filtro: Partial<AnaliseCreditoFiltros>) => void;
}

// Cria o "store" (o armazém de estado)
export const useFilterStore = create<FilterState>((set) => ({
  // Valores iniciais
  filtros: {
    // Definimos valores padrão para paginação e ordenação
    pagina: 1,
    tamanhoPagina: 20,
    sortBy: 'qtdTotal',
    sortDirection: 'desc',
  },
  isSearchActive: false,
  
  // Ações para modificar o estado
  setFiltros: (novosFiltros) => set({ filtros: novosFiltros }),
  setIsSearchActive: (isActive) => set({ isSearchActive: isActive }),
  
  // Nova ação para atualizações parciais
  updateFiltro: (filtro) => set((state) => ({
    filtros: { ...state.filtros, ...filtro }
  })),
}));