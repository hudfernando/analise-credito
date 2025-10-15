// src/components/analise/Configuracoes.tsx
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { AnaliseSettings, defaultSettings } from "@/lib/analise";
import { produce } from 'immer';
import { useEffect, useState } from "react";

interface ConfiguracoesProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  settings: AnaliseSettings;
  onSettingsChange: (newSettings: AnaliseSettings) => void;
}

export const Configuracoes = ({ isOpen, onOpenChange, settings, onSettingsChange }: ConfiguracoesProps) => {
  const [localSettings, setLocalSettings] = useState<AnaliseSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  const handleNestedChange = <K extends keyof AnaliseSettings, SK extends keyof AnaliseSettings[K]>(
    key: K,
    subKey: SK,
    value: number
  ) => {
    const newSettings = produce(localSettings, draft => {
        (draft[key] as any)[subKey] = value;
    });
    setLocalSettings(newSettings);
  };
  
  const handleSaveChanges = () => { onSettingsChange(localSettings); onOpenChange(false); };
  const handleResetToDefault = () => { setLocalSettings(defaultSettings); };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Configurar Análise de IA</SheetTitle>
          <SheetDescription>Ajuste os pesos e limites para personalizar a avaliação de cada cliente.</SheetDescription>
        </SheetHeader>
        <div className="py-6 px-1 space-y-6 overflow-y-auto h-[calc(100vh-150px)]">
          
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">Pesos do Score de Risco</h3>
            <p className="text-sm text-muted-foreground mb-4">Defina a importância de cada fator no cálculo do risco.</p>
            {Object.keys(localSettings.pesosScoreRisco).map(key => (
              <div className="space-y-2 mb-4" key={key}>
                <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                <Slider value={[localSettings.pesosScoreRisco[key as keyof typeof localSettings.pesosScoreRisco] * 100]} onValueChange={([v]) => handleNestedChange('pesosScoreRisco', key as keyof typeof localSettings.pesosScoreRisco, v / 100)} />
                <span className="text-sm text-muted-foreground">Peso: {Math.round(localSettings.pesosScoreRisco[key as keyof typeof localSettings.pesosScoreRisco] * 100)}%</span>
              </div>
            ))}
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">Limites da Classificação (IVE)</h3>
            <p className="text-sm text-muted-foreground mb-4">Defina a pontuação mínima do IVE (Valor - Risco) para cada nível.</p>
            {Object.keys(localSettings.limitesIVE).map(key => (
              <div className="space-y-2 mb-4" key={key}>
                <Label>{`IVE Mínimo para ${key.replace('estrela', '')} Estrelas`}</Label>
                <Slider min={-10} max={10} step={1} value={[localSettings.limitesIVE[key as keyof typeof localSettings.limitesIVE]]} onValueChange={([v]) => handleNestedChange('limitesIVE', key as keyof typeof localSettings.limitesIVE, v)} />
                 {/* --- CORREÇÃO APLICADA AQUI --- */}
                 <span className="text-sm text-muted-foreground">IVE &gt;= {localSettings.limitesIVE[key as keyof typeof localSettings.limitesIVE]}</span>
              </div>
            ))}
          </div>
          
        </div>
        <SheetFooter className="pt-4 border-t">
          <Button variant="outline" onClick={handleResetToDefault}>Redefinir</Button>
          <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};