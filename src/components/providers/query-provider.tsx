// Caminho: src/components/providers/QueryProvider.tsx

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Criamos uma única instância do QueryClient para toda a aplicação.
const queryClient = new QueryClient();

// Este é o nosso componente Provider.
// Ele recebe 'children', que serão as páginas e outros componentes da nossa aplicação.
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}