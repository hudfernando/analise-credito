import { Loader2, ServerCrash, SearchX } from "lucide-react";

interface TabelaStatusProps {
  isPending: boolean;
  isError: boolean;
  hasData: boolean;
}

export const TabelaStatus = ({ isPending, isError, hasData }: TabelaStatusProps) => {
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 border border-azul-claro/20 rounded-lg mt-6">
        <Loader2 className="h-12 w-12 animate-spin text-azul-claro" />
        <p className="mt-4 text-lg">Carregando dados...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 border border-red-500/50 rounded-lg mt-6 bg-red-500/10">
        <ServerCrash className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-lg text-red-400">Ocorreu um erro ao buscar os dados.</p>
        <p className="text-sm text-gray-400">Verifique a conexão com a API e tente novamente.</p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 border border-azul-claro/20 rounded-lg mt-6">
        <SearchX className="h-12 w-12 text-azul-claro/50" />
        <p className="mt-4 text-lg">Nenhum resultado encontrado.</p>
        <p className="text-sm text-gray-400">Ajuste os filtros e tente novamente.</p>
      </div>
    );
  }

  return null;
};