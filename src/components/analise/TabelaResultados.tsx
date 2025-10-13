'use client';

import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { ResultadoEnriquecido } from '@/lib/analise';
import { Table } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";

// Importando os componentes filhos
import { TabelaStatus } from './tabela-resultados/TabelaStatus';
import { TabelaActions } from './tabela-resultados/TabelaActions';
import { TabelaHeader } from './tabela-resultados/TabelaHeader';
import { TabelaBody } from './tabela-resultados/TabelaBody';

interface TabelaResultadosProps {
  resultados: ResultadoEnriquecido[] | undefined;
  isPending: boolean;
  isError: boolean;
}

type SortConfig = { key: keyof ResultadoEnriquecido; direction: 'asc' | 'desc'; } | null;

export const TabelaResultados = ({ resultados, isPending, isError }: TabelaResultadosProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const sortedResultados = useMemo(() => {
    // ... (lógica de ordenação continua a mesma)
    if (!resultados) return [];
    let sortableItems = [...resultados];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || bValue === null) return 0;
        
        const parseCurrency = (value: string) => parseFloat(value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());

        let aComparable: string | number = aValue;
        let bComparable: string | number = bValue;
        
        if (typeof aValue === 'string' && aValue.includes('R$')) {
            aComparable = parseCurrency(aValue);
            bComparable = parseCurrency(bValue as string);
        }

        if (aComparable < bComparable) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aComparable > bComparable) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [resultados, sortConfig]);

  const handleSort = (key: keyof ResultadoEnriquecido) => {
    // ... (lógica de handleSort continua a mesma)
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    if (!sortedResultados) return;

    const dataToExport = sortedResultados.map(item => ({
      'Cliente ID': item.clienteId,
      'Nome do Cliente': item.nomeCliente,
      'Classificação (Nome)': item.classificacaoNome,
      'Classificação (Estrelas)': item.classificacaoEstrelas,
      'Score de Risco (1-10)': item.scoreRisco,
      'Score de Valor (1-10)': item.scoreValor,
      'Alerta': item.alerta ?? '', // Usa string vazia se o alerta for nulo
      'Perfil do Pagador': item.perfilPagador,
      'Saldo Devedor': item.saldoDevedor,
      'Limite de Crédito': item.limiteDeCredito,
      'Saldo p/ Compras': item.saldoParaCompras,
      'Notas de Crédito': item.notasDeCredito,
      'Títulos Vencidos': item.titulosVencidos,
      'Títulos a Vencer': item.titulosAVencer,
      'Vencido Mais Antigo (dias)': item.diasDoVencidoMaisAntigo,
      'Atraso Médio (dias)': item.atrasoMedioDias,
      'Maior Compra': item.maiorCompra,
      'Compras (90d)': item.compras90Dias,

      // ==================> INÍCIO DA CORREÇÃO <==================
      // Adiciona um valor padrão 'R$ 0,00' se os dados estiverem nulos ou indefinidos
      'Média Compra (90d)': item.mediaCompra90Dias ?? 'R$ 0,00',
      'Vencimento (7d)': item.vencimento7Dias ?? 'R$ 0,00',
      // Para a porcentagem, usa 'N/A' (Não Aplicável) se o valor for nulo
      'Utilização do Limite (%)': item.utilizacaoLimite !== null ? item.utilizacaoLimite.toFixed(2) : 'N/A',
      // ==================> FIM DA CORREÇÃO <==================
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Análise de Crédito");
    XLSX.writeFile(workbook, `analise_credito_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`);
  };

  const hasData = !!(resultados && resultados.length > 0);
  const showTable = !isPending && !isError && hasData;

  return (
    <TooltipProvider>
      <div className="mt-6">
        <TabelaStatus isPending={isPending} isError={isError} hasData={hasData} />

        {showTable && (
          <>
            <TabelaActions onExport={handleExport} />
            <div className="relative w-full overflow-auto border border-azul-claro/20 rounded-lg max-h-[65vh]">
              <Table className="whitespace-nowrap">
                <TabelaHeader onSort={handleSort} />
                <TabelaBody resultados={sortedResultados} />
              </Table>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
};