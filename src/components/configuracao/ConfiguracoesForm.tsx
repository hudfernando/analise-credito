// Caminho: src/components/configuracao/ConfiguracoesForm.tsx
'use client';

import { useState, useEffect } from "react";
import { Configuracao } from "@/types/analise-credito";
import { PesoSlider } from "./PesoSlider";
import { toast } from "sonner";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Save } from "lucide-react";

interface ConfiguracoesFormProps {
  initialConfigs: Configuracao[];
  onSave: (updatedConfigs: Configuracao[]) => void;
  isSaving: boolean;
  onClose: () => void;
}

export const ConfiguracoesForm = ({ initialConfigs, onSave, isSaving, onClose }: ConfiguracoesFormProps) => {
  const [configs, setConfigs] = useState(initialConfigs);

  useEffect(() => {
    setConfigs(initialConfigs);
  }, [initialConfigs]);

  const handleValueChange = (nome: string, newValue: number) => {
    setConfigs(currentConfigs =>
      currentConfigs.map(c => c.nome === nome ? { ...c, valor: newValue } : c)
    );
  };

  const handleSubmit = () => {
    const totalRisco = configs.filter(c => c.nome.startsWith('PesoRisco')).reduce((sum, c) => sum + c.valor, 0);
    const totalValor = configs.filter(c => c.nome.startsWith('PesoValor')).reduce((sum, c) => sum + c.valor, 0);
    // --- MUDANÇA: Adicionada validação para os novos pesos ---
    const totalInadimplencia = configs.filter(c => c.nome.startsWith('PesoInadimplencia')).reduce((sum, c) => sum + c.valor, 0);

    // Valida se a soma de cada grupo está próxima de 1 (100%)
    if (Math.abs(totalRisco - 1) > 0.01 || Math.abs(totalValor - 1) > 0.01 || Math.abs(totalInadimplencia - 1) > 0.01) {
      toast.warning("A soma dos pesos de cada grupo (Risco, Valor e Inadimplência) deve ser 100%.");
      return;
    }
    
    onSave(configs);
  };

  const getLabel = (nome: string) => {
      if (nome === 'PesoRiscoLimite') return 'Uso do Limite de Crédito';
      if (nome === 'PesoRiscoVencidos') return 'Títulos Vencidos';
      if (nome === 'PesoRiscoAtraso') return 'Atraso Médio';
      if (nome === 'PesoValorFrequencia') return 'Frequência de Compras';
      if (nome === 'PesoValorTicketMedio') return 'Ticket Médio';
      // --- MUDANÇA: Adicionados labels para os novos pesos ---
      if (nome === 'PesoInadimplenciaAtraso') return 'Atraso Histórico';
      if (nome === 'PesoInadimplenciaDivida') return 'Dívida Atual';
      if (nome === 'PesoInadimplenciaComprometimento') return 'Comprometimento Financeiro';
      return nome;
  }

  return (
    <div className="space-y-6 py-4">
      <div>
        <h4 className="font-semibold mb-4 text-center">Score de Risco</h4>
        <div className="space-y-4">
          {configs.filter(c => c.nome.startsWith('PesoRisco')).map(c => (
            <PesoSlider 
              key={c.nome} 
              label={getLabel(c.nome)}
              valor={c.valor} 
              onValueChange={(newValue) => handleValueChange(c.nome, newValue)} 
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-4 text-center">Score de Valor</h4>
        <div className="space-y-4">
          {configs.filter(c => c.nome.startsWith('PesoValor')).map(c => (
            <PesoSlider 
              key={c.nome} 
              label={getLabel(c.nome)}
              valor={c.valor} 
              onValueChange={(newValue) => handleValueChange(c.nome, newValue)} 
            />
          ))}
        </div>
      </div>

      {/* --- MUDANÇA: Adicionada nova seção para os sliders de Inadimplência --- */}
      <div>
        <h4 className="font-semibold mb-4 text-center">Previsão de Inadimplência</h4>
        <div className="space-y-4">
          {configs.filter(c => c.nome.startsWith('PesoInadimplencia')).map(c => (
            <PesoSlider 
              key={c.nome} 
              label={getLabel(c.nome)}
              valor={c.valor} 
              onValueChange={(newValue) => handleValueChange(c.nome, newValue)} 
            />
          ))}
        </div>
      </div>

      <DialogFooter className="mt-8">
         <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar Alterações
        </Button>
      </DialogFooter>
    </div>
  );
};