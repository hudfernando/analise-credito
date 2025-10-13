import React from 'react';

// Define a estrutura de dados para cada item da legenda
interface LegendaItem {
  nome: string;
  cor: string; // Classe de cor do Tailwind CSS
}

// Lista de legendas que será exibida no painel
// Adicionei todas as situações que temos no sistema
const legendas: LegendaItem[] = [
  { nome: 'Cliente Elite', cor: 'bg-green-500' },
  { nome: 'Cliente Sólido', cor: 'bg-sky-500' },
  { nome: 'Cliente Neutro', cor: 'bg-gray-400' },
  { nome: 'Cliente de Risco', cor: 'bg-yellow-500' },
  { nome: 'Cliente Crítico', cor: 'bg-red-500' },
  { nome: 'Inativo', cor: 'bg-slate-300' },
  { nome: 'Bloqueado', cor: 'bg-black' },
  { nome: 'Jurídico', cor: 'bg-purple-600' },
  { nome: 'Protestado', cor: 'bg-orange-600' },
  { nome: 'Dep. Antecipado', cor: 'bg-teal-500' },
  { nome: 'Recadastro', cor: 'bg-pink-500' },
];

/**
 * Este componente renderiza a barra de legendas horizontal com rolagem
 * para a visualização principal do painel.
 */
export const LegendasDoPainel = () => {
  return (
    <div className="w-full">
      {/* >>> A CORREÇÃO ESTÁ AQUI <<<
        As classes do Tailwind CSS abaixo criam a barra de rolagem.
        - overflow-x-auto: Ativa a rolagem horizontal quando o conteúdo transborda.
        - whitespace-nowrap: Impede que os itens quebrem para a linha de baixo.
        - pb-2: Adiciona um pequeno espaço inferior para a barra de rolagem.
      */}
      <div className="flex items-center space-x-6 overflow-x-auto whitespace-nowrap pb-2">
        {legendas.map((item) => (
          // 'flex-shrink-0' impede que os itens sejam "espremidos" para caber na tela
          <div key={item.nome} className="flex items-center flex-shrink-0">
            <span className={`h-3 w-3 rounded-full ${item.cor} mr-2`}></span>
            <span className="text-sm font-medium text-gray-600">{item.nome}</span>
          </div>
        ))}
      </div>
    </div>
  );
};