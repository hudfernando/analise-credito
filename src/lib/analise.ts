import { AnaliseCreditoResultado } from "@/types/analise-credito";


// CORREÇÃO: Interface alinhada com a estrutura do seu projeto.
export interface ResultadoEnriquecido extends AnaliseCreditoResultado {
  utilizacaoLimite: number;
  perfilPagador: string;
  scoreRisco: number;
  scoreValor: number;
  classificacaoEstrelas: number; // <-- Propriedade requerida
  classificacaoNome: string; // <-- Propriedade relacionada
  alerta: string | null; // <-- Propriedade requerida
}

// ATUALIZAÇÃO: Interface de configurações expandida para controlar toda a análise.
export interface AnaliseSettings {
  // Pesos para o cálculo do Score de Risco (0 a 1)
  pesosScoreRisco: {
    utilizacaoLimite: number;
    titulosVencidos: number;
    atrasoMedio: number;
  };
  // Divisores para normalizar os fatores de Risco e Valor
  fatores: {
    divisorUtilizacaoRisco: number; // a cada X % de uso, aumenta o risco
    multiplicadorVencidosRisco: number; // X pontos por título vencido
    divisorAtrasoRisco: number; // a cada X dias de atraso, aumenta o risco
    divisorFrequenciaValor: number; // a cada X compras, aumenta o valor
    divisorTicketMedioValor: number; // a cada R$ X de ticket, aumenta o valor
  };
  // Limites para a classificação em estrelas com base no IVE
  limitesIVE: {
    estrela5: number; // IVE >= X -> 5 estrelas
    estrela4: number; // IVE >= X -> 4 estrelas
    estrela3: number; // IVE >= X -> 3 estrelas
    estrela2: number; // IVE >= X -> 2 estrelas
  };
  // Limites para a geração de alertas
  limitesAlerta: {
    utilizacaoCredito: number; // Alerta se utilização for > X%
    diasAtrasoCritico: number; // Alerta se tiver títulos vencidos a mais de X dias
  }
}

// ATUALIZAÇÃO: Valores padrão para a nova estrutura de configurações
export const defaultSettings: AnaliseSettings = {
  pesosScoreRisco: {
    utilizacaoLimite: 0.4,
    titulosVencidos: 0.4,
    atrasoMedio: 0.2,
  },
  fatores: {
    divisorUtilizacaoRisco: 10,
    multiplicadorVencidosRisco: 2,
    divisorAtrasoRisco: 5,
    divisorFrequenciaValor: 2,
    divisorTicketMedioValor: 500,
  },
  limitesIVE: {
    estrela5: 4,
    estrela4: 1,
    estrela3: -2,
    estrela2: -5,
  },
  limitesAlerta: {
    utilizacaoCredito: 95,
    diasAtrasoCritico: 60,
  }
};

// ATUALIZAÇÃO: A função agora é 100% controlada pelo objeto 'settings'
export function performAnalysis(
  data: AnaliseCreditoResultado[],
  settings: AnaliseSettings
): ResultadoEnriquecido[] {
  return data.map((cliente) => {
    const utilizacaoLimite = cliente.limiteCredito > 0 ? (cliente.saldoDevedor / cliente.limiteCredito) * 100 : 0;
    const perfilPagador = cliente.atrasoMedioDias > 30 ? 'Atraso Crítico' : cliente.atrasoMedioDias > 5 ? 'Pontual' : 'Bom Pagador';
    
    // Score de Risco calculado com base nos settings
    const riscoUtilizacao = Math.min(utilizacaoLimite / settings.fatores.divisorUtilizacaoRisco, 10);
    const riscoVencidos = Math.min(cliente.titulosVencidos * settings.fatores.multiplicadorVencidosRisco, 10);
    const riscoAtraso = Math.min(cliente.atrasoMedioDias / settings.fatores.divisorAtrasoRisco, 10);
    const scoreRiscoBruto = (riscoUtilizacao * settings.pesosScoreRisco.utilizacaoLimite) + (riscoVencidos * settings.pesosScoreRisco.titulosVencidos) + (riscoAtraso * settings.pesosScoreRisco.atrasoMedio);
    const scoreRisco = Math.max(1, Math.min(10, Math.ceil(scoreRiscoBruto)));

    // Score de Valor calculado com base nos settings
    const valorFrequencia = Math.min(cliente.compras90Dias / settings.fatores.divisorFrequenciaValor, 5);
    const valorTicketMedio = Math.min(cliente.mediaCompra90Dias / settings.fatores.divisorTicketMedioValor, 5);
    const scoreValorBruto = valorFrequencia + valorTicketMedio;
    const scoreValor = Math.max(1, Math.min(10, Math.ceil(scoreValorBruto)));

    // Classificação em Estrelas com base nos settings
    const IVE = scoreValor - scoreRisco;
    let classificacaoEstrelas: number;
    let classificacaoNome: string;

    if (IVE >= settings.limitesIVE.estrela5) {
      classificacaoEstrelas = 5; classificacaoNome = 'Cliente Estrela';
    } else if (IVE >= settings.limitesIVE.estrela4) {
      classificacaoEstrelas = 4; classificacaoNome = 'Bom Potencial';
    } else if (IVE >= settings.limitesIVE.estrela3) {
      classificacaoEstrelas = 3; classificacaoNome = 'Neutro';
    } else if (IVE >= settings.limitesIVE.estrela2) {
      classificacaoEstrelas = 2; classificacaoNome = 'Atenção';
    } else {
      classificacaoEstrelas = 1; classificacaoNome = 'Alto Risco';
    }
    
    if (['BL', 'JU', 'TJ', 'DP'].includes(cliente.situacaoCredito.trim().toUpperCase())) {
        classificacaoEstrelas = 1;
        classificacaoNome = 'Crítico';
    }
    if (cliente.saldoDevedor === 0 && cliente.compras90Dias === 0) {
      classificacaoEstrelas = 0; classificacaoNome = 'Inativo';
    }

    // Alertas com base nos settings
    let alerta: string | null = null;
    if (cliente.situacaoCredito.toUpperCase() === 'BL') {
      alerta = 'Cliente Bloqueado!';
    } else if (cliente.diasVencidoMaisAntigo > settings.limitesAlerta.diasAtrasoCritico) {
      alerta = `Atraso superior a ${settings.limitesAlerta.diasAtrasoCritico} dias.`;
    } else if (utilizacaoLimite > settings.limitesAlerta.utilizacaoCredito) {
      alerta = `Limite de crédito quase esgotado (${Math.round(utilizacaoLimite)}%).`;
    }

    return {
      ...cliente,
      utilizacaoLimite, perfilPagador, scoreRisco, scoreValor,
      classificacaoEstrelas, classificacaoNome, alerta,
    };
  });
}