// Caminho: src/components/configuracao/PesoSlider.tsx

'use client';

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PesoSliderProps {
  // --- CORREÇÃO APLICADA: Adicionada a propriedade 'label' ---
  label: string; 
  valor: number;
  onValueChange: (valor: number) => void;
}

export const PesoSlider = ({ label, valor, onValueChange }: PesoSliderProps) => {
  const displayValue = Math.round(valor * 100);

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      {/* --- CORREÇÃO APLICADA: Usando 'label' para o texto --- */}
      <Label className="col-span-2 text-sm">{label}</Label>
      <Slider
        className="col-span-1"
        value={[displayValue]}
        onValueChange={([v]) => onValueChange(v / 100)}
        max={100}
        step={1}
      />
      <span className="col-span-1 text-right text-sm font-medium tabular-nums text-muted-foreground">
        {displayValue}%
      </span>
    </div>
  );
};