// Caminho: src/components/configuracao/PainelConfiguracoes.tsx

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchConfiguracoes, updateConfiguracoes } from '@/http/api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfiguracoesForm } from './ConfiguracoesForm';
import { toast } from 'sonner';

interface PainelConfiguracoesProps {
  children: React.ReactNode;
}

export const PainelConfiguracoes = ({ children }: PainelConfiguracoesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['configuracoes'],
    queryFn: fetchConfiguracoes,
    enabled: isOpen, // A busca só é feita quando o painel é aberto
    staleTime: Infinity, // Evita buscas desnecessárias
  });

  const mutation = useMutation({
    mutationFn: updateConfiguracoes,
    onSuccess: () => {
      toast.success("Configurações salvas com sucesso!");
      // Invalida as queries para forçar a atualização dos dados na tela principal
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['analiseCredito'] });
      setIsOpen(false); // Fecha o painel após o sucesso
    },
    onError: (error) => {
      // --- MELHORIA: Mostra uma mensagem de erro mais detalhada ---
      toast.error("Falha ao salvar as configurações.", {
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Painel de Configurações da Análise</DialogTitle>
          <DialogDescription>
            Ajuste os pesos dos scores para refletir a estratégia de negócio atual. A soma de cada grupo deve ser 100%.
          </DialogDescription>
        </DialogHeader>

        {query.isLoading && (
          <div className="space-y-4 py-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        )}
        
        {query.isError && (
            <div className="text-destructive text-center py-4">Erro ao carregar as configurações. Tente fechar e abrir novamente.</div>
        )}

        {query.data && (
          <ConfiguracoesForm 
            // A chave reseta o estado do formulário se os dados da API forem recarregados
            key={query.dataUpdatedAt}
            initialConfigs={query.data} 
            onSave={mutation.mutate} 
            isSaving={mutation.isPending}
            onClose={() => setIsOpen(false)} // <-- Passando a função para fechar o painel
          />
        )}
      </DialogContent>
    </Dialog>
  );
};