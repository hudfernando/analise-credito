import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface TabelaActionsProps {
  onExport: () => void;
}

export const TabelaActions = ({ onExport }: TabelaActionsProps) => {
  return (
    <div className="flex justify-end mb-4">
      <Button onClick={onExport} className="bg-green-600 hover:bg-green-700">
        <Download className="mr-2 h-4 w-4" />
        Exportar para Excel
      </Button>
    </div>
  );
};