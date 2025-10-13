'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Settings } from 'lucide-react'; // Importe o ícone de engrenagem
import { fetchAnaliseCredito } from '@/http/api';
import { AnaliseCreditoFiltros, AnaliseCreditoResultado } from '@/types/analise-credito';
import { FiltrosForm } from '@/components/analise/FiltrosForm';
import { TabelaResultados } from '@/components/analise/TabelaResultados';
import { performAnalysis, defaultSettings, AnaliseSettings, ResultadoEnriquecido } from '@/lib/analise';
import { Configuracoes } from '@/components/analise/Configuracoes';
import { LegendasDoPainel } from "@/components/analise/LegendasDoPainel";
import { Legenda } from "@/components/analise/Legenda"; 
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [filtros, setFiltros] = useState<AnaliseCreditoFiltros>({});
  const [dataError, setDataError] = useState('');
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const [settings, setSettings] = useState<AnaliseSettings>(defaultSettings);

  // --- MUDANÇA 1: Estado para controlar o painel de configurações ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { data: rawData, isFetching, isError, refetch } = useQuery<AnaliseCreditoResultado[]>({
    queryKey: ['analiseCredito', filtros],
    queryFn: () => {
      const filtrosParaApi: Partial<AnaliseCreditoFiltros> = { ...filtros };
      if (typeof filtros.clienteIds === 'string' && filtros.clienteIds.trim() !== '') {
        (filtrosParaApi.clienteIds as number[]) = filtros.clienteIds
          .split(',')
          .map((id: string) => parseInt(id.trim(), 10))
          .filter((id: number) => !isNaN(id));
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
    return performAnalysis(rawData, settings);
  }, [rawData, settings]);

  const handleSearch = () => {
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
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-700">
          Painel de Inteligência de Crédito
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Utilize os filtros para consultar e analisar a situação dos clientes.
        </p>
      </header>

      <div className='flex justify-end gap-2 mb-4'>
        {/* --- MUDANÇA 2: Um botão simples que abre o painel --- */}
        <Button variant="outline" size="sm" className="h-8" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
        </Button>
        <Legenda />
      </div>

      {/* --- MUDANÇA 3: O componente é chamado aqui, fora do fluxo visual, e controlado pelo estado --- */}
      <Configuracoes
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
      />

      <FiltrosForm
        filtros={filtros}
        setFiltros={setFiltros}
        handleSearch={handleSearch}
        isSearching={isFetching}
        dataError={dataError}
      />

      {buscaRealizada && (
         <div className="mt-8 space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <LegendasDoPainel />
          </div>
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