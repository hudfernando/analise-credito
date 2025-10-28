// Caminho: src/components/analise/tabela-resultados/TabelaActions.tsx

'use client';

import { Button } from "@/components/ui/button";
// --- MUDANÇA AQUI ---
// Removemos a importação do arquivo antigo e importamos nosso novo tipo de dados.
import { AnaliseCompleta } from "@/types/analise-credito"; 
import { FileDown } from "lucide-react";
import * as XLSX from 'xlsx';

interface TabelaActionsProps {
  // --- MUDANÇA AQUI ---
  // A prop agora espera uma lista do nosso novo tipo 'AnaliseCompleta'.
  resultados: AnaliseCompleta[];
}

export const TabelaActions = ({ resultados }: TabelaActionsProps) => {
  
  const handleExport = () => {
    if (resultados.length === 0) {
      // Adiciona um alerta ou simplesmente não faz nada se não houver dados.
      console.log("Não há dados para exportar.");
      return;
    }

    // Mapeia os dados para um formato mais amigável para o Excel
    const dataToExport = resultados.map(r => ({
      'Cliente ID': r.clienteId,
      'Nome do Cliente': r.nomeCliente,
      'Situação Crédito': r.situacaoCredito,
      'Classificação': `${r.classificacaoEstrelas} Estrela(s)`,
      'Segmento': r.segmento,
      'Score Risco': r.scoreRisco,
      'Score Valor': r.scoreValor,
      'IVE': r.ive,
      'Limite de Crédito': r.limiteCredito,
      'Saldo Devedor': r.saldoDevedor,
      'Compras (90d)': r.compras90Dias,
      'Atraso Médio (dias)': r.atrasoMedioDias,
      'Títulos Vencidos': r.titulosVencidos,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AnaliseDeCredito");

    // Gera o arquivo e inicia o download
    XLSX.writeFile(workbook, "Analise_de_Credito.xlsx");
  };

  return (
    <div className="flex justify-end mb-4">
      <Button onClick={handleExport} disabled={resultados.length === 0}>
        <FileDown className="mr-2 h-4 w-4" />
        Exportar
      </Button>
    </div>
  );
};