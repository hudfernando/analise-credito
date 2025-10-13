'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnaliseCredito } from '@/http/api';
import { AnaliseCreditoFiltros, AnaliseCreditoResultado } from '@/types/analise-credito';
import { FiltrosForm } from '@/components/analise/FiltrosForm';
import { TabelaResultados } from '@/components/analise/TabelaResultados';
import { performAnalysis, defaultSettings, ResultadoEnriquecido } from '@/lib/analise';
import { Legenda } from "@/components/analise/Legenda"; 

export default function HomePage() {
  const [filtros, setFiltros] = useState<AnaliseCreditoFiltros>({});
  const [dataError, setDataError] = useState('');
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  // A análise usará as configurações padrão, sem o painel de ajuste
  const settings = defaultSettings;

  const { data: rawData, isFetching, isError, refetch } = useQuery<AnaliseCreditoResultado[]>({
    queryKey: ['analiseCredito', filtros],
    queryFn: () => {
      const filtrosParaApi: Partial<AnaliseCreditoFiltros> = { ...filtros };
      if (typeof filtros.clienteIds === 'string' && filtros.clienteIds.trim() !== '') {
        (filtrosParaApi.clienteIds as number[]) = filtros.clienteIds
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
    // A chamada para performAnalysis usa as configurações padrão
    return performAnalysis(rawData, settings);
  }, [rawData, settings]);

  const handleSearch = () => {
    // Validações e chamada da API
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
              <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                  Análise de Crédito
              </h1>
              <p className="text-md text-gray-500 mt-1">
                  Consulte e analise a situação dos clientes.
              </p>
          </div>
          {/* O botão "Entenda a Análise", com o popover corrigido, fica aqui */}
          <Legenda />
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
    </main>
  );
}