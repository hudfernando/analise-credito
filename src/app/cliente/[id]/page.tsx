'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ClienteDetalhe } from '@/types/analise-credito';
import { fetchClienteDetalhe } from '@/http/api';
import { AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { ClienteDetalheHeader } from '@/components/cliente/ClienteDetalheHeader';
import { HistoricoComprasChart } from '@/components/cliente/HistoricoComprasChart';
import { TabelaTitulosAbertos } from '@/components/cliente/TabelaTitulosAbertos';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DnaCompraCliente } from '@/components/cliente/DnaCompraCliente';
import { AnaliseMixFabricante } from '@/components/cliente/AnaliseMixFabricante';

export default function ClienteDetalhePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: cliente, isLoading, isError, error } = useQuery<ClienteDetalhe, Error>({
    queryKey: ['clienteDetalhe', id],
    queryFn: () => {
      if (!id) {
        return Promise.reject(new Error('ID do cliente inválido.'));
      }
      return fetchClienteDetalhe(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // CORREÇÃO: Adicionamos a verificação !cliente aqui, como na minha sugestão anterior
  if (isError || !cliente) {
    return (
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center flex-col gap-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
            <h2 className="text-xl font-semibold">Erro ao Carregar Cliente</h2>
            <p className="text-muted-foreground">
                {error ? error.message : "O cliente não foi encontrado ou a API está offline."}
            </p>
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar ao Dashboard
                </Link>
            </Button>
        </div>
    );
  }

  // Se chegamos aqui, 'cliente' com certeza existe.
  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Detalhes do Cliente</h1>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>

      {/* Não precisamos mais da verificação {cliente && ...} aqui,
        pois a guarda 'if (isError || !cliente)' acima já protege todo o return.
      */}
      <>
        <ClienteDetalheHeader cliente={cliente} />
        <HistoricoComprasChart historico={cliente.historicoCompras} />
        <TabelaTitulosAbertos titulos={cliente.titulos} />
        
        {/* O erro não acontece mais, pois 'cliente' está 100% definido */}
        <DnaCompraCliente clienteId={cliente.cdClien} />

      <div className="grid grid-cols-1 gap-4">
        {/* CORREÇÃO: 
          Passamos 'cliente.cdClien' (o ID do cliente) 
          e o convertemos para 'string' para garantir 
          que o tipo seja o esperado pelo componente.
        */}
        <AnaliseMixFabricante clienteId={String(cliente.cdClien)} />
      </div>
      </>
      
    </div>
  );
}