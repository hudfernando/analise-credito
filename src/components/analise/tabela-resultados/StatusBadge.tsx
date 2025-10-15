// src/components/analise/StatusBadge.tsx

import { Badge } from "@/components/ui/badge";

/**
 * Define as propriedades que o componente StatusBadge espera receber.
 * @param {string} status - O código da situação do cliente (ex: 'LI', 'BL').
 */
interface StatusBadgeProps {
  status: string;
}

// Mapeia os códigos de status para textos e variantes de cor do componente Badge.
// Isso centraliza a regra de negócio de exibição em um único lugar.
const statusMap: { [key: string]: { text: string; variant: "default" | "destructive" | "secondary" | "outline" } } = {
  'LI': { text: 'Liberado', variant: 'default' }, // 'default' geralmente é verde ou a cor primária
  'BL': { text: 'Bloqueado', variant: 'destructive' }, // 'destructive' é vermelho
  'JU': { text: 'Jurídico', variant: 'destructive' },
  'TJ': { text: 'Protestado', variant: 'destructive' },
  'IN': { text: 'Inativo', variant: 'secondary' }, // 'secondary' é cinza
};

/**
 * Um componente que renderiza um Badge colorido e com texto descritivo
 * com base no código da situação de crédito do cliente.
 */
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  // Procura o status no mapa. Se não encontrar, usa um padrão 'outline' com o próprio código.
  const statusInfo = statusMap[status?.trim().toUpperCase()] || { text: status, variant: 'outline' };

  return (
    <Badge variant={statusInfo.variant} className="capitalize">
      {statusInfo.text}
    </Badge>
  );
};