'use client';

import { TableRow, TableCell, TableFooter } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useInView } from 'react-intersection-observer';

interface TabelaFooterProps {
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const TabelaFooter = ({ onLoadMore, hasNextPage, isFetchingNextPage }: TabelaFooterProps) => {
  // ABORDAGEM MODERNA SEM useEffect
  const { ref } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        onLoadMore();
      }
    },
  });

  return (
    <TableFooter>
      <TableRow ref={ref}>
        <TableCell colSpan={20} className="text-center">
          {isFetchingNextPage ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> :
           !hasNextPage && 'Fim dos resultados.'}
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};