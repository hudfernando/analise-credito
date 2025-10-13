import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { AnaliseSettings, defaultSettings } from "@/lib/analise";
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

  const handleSliderChange = (key: keyof AnaliseSettings, value: number) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = () => {
    onSettingsChange(localSettings);
    onOpenChange(false);
  };

  const handleResetToDefault = () => {
    setLocalSettings(defaultSettings);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Configurar Análise de IA</SheetTitle>
          <SheetDescription>
            Ajuste os pesos e limites para personalizar como a IA avalia o risco e o valor de cada cliente.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 px-1 space-y-6 overflow-y-auto h-[calc(100vh-150px)]">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Parâmetros de Risco</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="limiteUtilizacaoAlto">Limite de Utilização Alto (%)</Label>
                <Slider
                  id="limiteUtilizacaoAlto"
                  min={50}
                  max={150}
                  step={5}
                  value={[localSettings.limiteUtilizacaoAlto]}
                  onValueChange={([value]) => handleSliderChange('limiteUtilizacaoAlto', value)}
                />
                <span className="text-sm text-muted-foreground">Clientes com utilização acima de {localSettings.limiteUtilizacaoAlto}% recebem maior nota de risco.</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="atrasoCriticoDias">Atraso Crítico (dias)</Label>
                <Slider
                  id="atrasoCriticoDias"
                  min={15}
                  max={90}
                  step={5}
                  value={[localSettings.atrasoCriticoDias]}
                  onValueChange={([value]) => handleSliderChange('atrasoCriticoDias', value)}
                />
                <span className="text-sm text-muted-foreground">Atraso médio acima de {localSettings.atrasoCriticoDias} dias é considerado crítico.</span>
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Pesos da Análise</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pesoUtilizacao">Peso: Utilização do Limite</Label>
                <Slider
                  id="pesoUtilizacao"
                  min={1}
                  max={10}
                  step={1}
                  value={[localSettings.pesoUtilizacao]}
                  onValueChange={([value]) => handleSliderChange('pesoUtilizacao', value)}
                />
                 <span className="text-sm text-muted-foreground">Importância do uso do limite de crédito no cálculo de risco. (Valor: {localSettings.pesoUtilizacao})</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pesoTitulosVencidos">Peso: Títulos Vencidos</Label>
                <Slider
                  id="pesoTitulosVencidos"
                  min={1}
                  max={10}
                  step={1}
                  value={[localSettings.pesoTitulosVencidos]}
                  onValueChange={([value]) => handleSliderChange('pesoTitulosVencidos', value)}
                />
                <span className="text-sm text-muted-foreground">Importância da quantidade de títulos vencidos. (Valor: {localSettings.pesoTitulosVencidos})</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pesoAtrasoMedio">Peso: Atraso Médio Histórico</Label>
                <Slider
                  id="pesoAtrasoMedio"
                  min={1}
                  max={10}
                  step={1}
                  value={[localSettings.pesoAtrasoMedio]}
                  onValueChange={([value]) => handleSliderChange('pesoAtrasoMedio', value)}
                />
                 <span className="text-sm text-muted-foreground">Importância do histórico de atraso nos pagamentos. (Valor: {localSettings.pesoAtrasoMedio})</span>
              </div>
            </div>
          </div>

          {/* Novo Bloco Adicionado */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Regras Especiais</h3>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fatorDescontoBomComportamento">Desconto por Bom Comportamento (%)</Label>
                    <Slider
                        id="fatorDescontoBomComportamento"
                        min={0}
                        max={100}
                        step={5}
                        value={[localSettings.fatorDescontoBomComportamento * 100]}
                        onValueChange={([value]) => handleSliderChange('fatorDescontoBomComportamento', value / 100)}
                    />
                    <span className="text-sm text-muted-foreground">
                        Reduz a penalidade do Atraso Médio se o cliente estiver em dia. (Valor: {Math.round(localSettings.fatorDescontoBomComportamento * 100)}%)
                    </span>
                </div>
            </div>
          </div>

        </div>
        <SheetFooter className="pt-4 border-t">
          <Button variant="outline" onClick={handleResetToDefault}>Redefinir para Padrão</Button>
          <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};