'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map, Users, Building2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/visoes/regional', label: 'Regional', icon: Map },
  { href: '/visoes/carteira', label: 'Carteira Vendedor', icon: Users },
  { href: '/visoes/municipio', label: 'Município', icon: Building2 },
  { href: '/visoes/estrelas', label: 'Clientes Estrela', icon: Star },
];

export function HeaderVisoes() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visões Estratégicas</h1>
          <p className="text-muted-foreground">Análise focada no Trimestre Móvel (Últimos 90 dias).</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>

      <nav className="flex items-center space-x-2 border-b pb-2 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-md whitespace-nowrap",
                isActive 
                  ? "bg-primary/10 text-primary hover:bg-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}