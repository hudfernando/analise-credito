'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnaliseCredito } from '@/http/api';
import { AnaliseCreditoFiltros, AnaliseCreditoResultado } from '@/types/analise-credito';
import { FiltrosForm } from '@/components/analise/FiltrosForm';
import { TabelaResultados } from '@/components/analise/TabelaResultados';
// ATUALIZAÇÃO: Importando também AnaliseSettings e o componente Configuracoes
import { performAnalysis, defaultSettings, ResultadoEnriquecido, AnaliseSettings } from '@/lib/analise';
import { Legenda } from "@/components/analise/Legenda";
// NOVO: Importando o componente de Configurações e o ícone
import { Configuracoes } from '@/components/analise/Configuracoes';
import { Button } from '@/components/ui/button';
import { Cog,BookOpen  } from 'lucide-react';
import { DocumentacaoSistema } from '@/components/analise/DocumentacaoSistema';


export default function HomePage() {
  const [filtros, setFiltros] = useState<AnaliseCreditoFiltros>({});
  const [dataError, setDataError] = useState('');
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  // --- INÍCIO DA ATUALIZAÇÃO ---
  // A constante 'settings' agora é um estado, permitindo que seja alterada.
  const [settings, setSettings] = useState<AnaliseSettings>(defaultSettings);
  // NOVO: Estado para controlar a visibilidade do painel de configurações.
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  // --- FIM DA ATUALIZAÇÃO ---+
  const [isDocOpen, setIsDocOpen] = useState(false);

  const { data: rawData, isFetching, isError, refetch } = useQuery<AnaliseCreditoResultado[]>({
    queryKey: ['analiseCredito', filtros],
    queryFn: () => {
      // Sua lógica de tratamento de filtros está perfeita e foi mantida.
      const filtrosParaApi: Partial<AnaliseCreditoFiltros> = { ...filtros };
      if (typeof filtros.clienteIds === 'string' && filtros.clienteIds.trim() !== '') {
        (filtrosParaApi.clienteIds as unknown as number[]) = filtros.clienteIds
          .split(',')
          .map((id) => parseInt(id.trim(), 10))
          .filter((id) => !isNaN(id));
      } else {
        delete filtrosParaApi.clienteIds;
      }
      return fetchAnaliseCredito(filtrosParaApi as AnaliseCreditoFiltros);
    },
    enabled: false,
    retry: false,
  });

  const enrichedData = useMemo((): ResultadoEnriquecido[] => {
    if (!rawData) return [];
    // A chamada para performAnalysis agora usa o estado 'settings', que é dinâmico.
    return performAnalysis(rawData, settings);
  }, [rawData, settings]); // A dependência [settings] já estava aqui, o que é ótimo!

  const handleSearch = () => {
    // Sua lógica de validação foi mantida.
    const dateRegex = /^\d{8}$/;
    if (filtros.dataInicial && !dateRegex.test(filtros.dataInicial.replace(/\D/g, ''))) {
      setDataError('Data Inicial inválida. Use DDMMYYYY.');
      return;
    }
     if (filtros.dataFinal && !dateRegex.test(filtros.dataFinal.replace(/\D/g, ''))) {
      setDataError('Data Final inválida. Use DDMMYYYY.');
      return;
    }
    setDataError('');
    setBuscaRealizada(true);
    refetch();
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
          <div className="text-left">
              <h1 className="text-3xl font-bold tracking-tight text-gray-200">
                  Análise de Crédito
              </h1>
              <p className="text-md text-gray-500 mt-1">
                  Consulte e analise a situação dos clientes.
              </p>
          </div>
          {/* ATUALIZAÇÃO: Adicionando um contêiner para os botões de ação */}
          <div className="flex items-center gap-2">
            <Legenda />
            {/* NOVO: Botão que abre o painel de configurações */}
            <Button variant="outline" onClick={() => setIsConfigOpen(true)}>
              <Cog className="mr-2 h-4 w-4" />
              Configurações
            </Button>
            {/* NOVO: Botão para abrir a documentação */}
            <Button variant="outline" onClick={() => setIsDocOpen(true)}>
              <BookOpen className="mr-2 h-4 w-4" />
              Documentação
            </Button>
          </div>
      </header>

      <FiltrosForm
        filtros={filtros}
        setFiltros={setFiltros}
        handleSearch={handleSearch}
        isSearching={isFetching}
        dataError={dataError}
      />

      {buscaRealizada && (
        <div className="mt-8">
          <TabelaResultados
            resultados={enrichedData}
            isPending={isFetching}
            isError={isError}
          />
        </div>
      )}

      {/* NOVO: Componente de configurações renderizado aqui */}
      <Configuracoes
        isOpen={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* NOVO: Renderização do componente de documentação */}
      <DocumentacaoSistema
        isOpen={isDocOpen}
        onOpenChange={setIsDocOpen}
      />
    </main>
  );
}