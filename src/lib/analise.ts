import { AnaliseCreditoResultado } from "@/types/analise-credito";

// 1. Adicionar o novo fator de desconto na interface de configurações
export interface AnaliseSettings {
  limiteUtilizacaoAlto: number;
  atrasoLeveDias: number;
  atrasoCriticoDias: number;
  pesoUtilizacao: number;
  pesoTitulosVencidos: number;
  pesoAtrasoMedio: number;
  pesoValor: number;
  pesoRisco: number;
  fatorDescontoBomComportamento: number; // Ex: 0.75 para 75% de desconto
}

export type ResultadoEnriquecido = AnaliseCreditoResultado & {
  utilizacaoLimite: number | null;
  perfilPagador: string;
  scoreRisco: number;
  scoreValor: number;
  classificacaoEstrelas: number;
  classificacaoNome: string;
  alerta: string | null;
};

// 2. Adicionar o valor padrão para o novo fator
export const defaultSettings: AnaliseSettings = {
  limiteUtilizacaoAlto: 85,
  atrasoLeveDias: 5,
  atrasoCriticoDias: 30,
  pesoUtilizacao: 5,
  pesoTitulosVencidos: 3,
  pesoAtrasoMedio: 2,
  pesoValor: 1.0,
  pesoRisco: 1.5,
  fatorDescontoBomComportamento: 0.75, // Desconto padrão de 75%
};

const parseCurrency = (value: string | number): number => {
  if (typeof value === 'number') return value;
  return parseFloat(value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
};

export function performAnalysis(
  data: AnaliseCreditoResultado[],
  settings: AnaliseSettings
): ResultadoEnriquecido[] {
  if (!data) return [];

  // Mapeia o código da situação de crédito para um nome mais descritivo
  const situacaoMap: { [key: string]: string } = {
    DP: 'Depósito Antecipado',
    RECA: 'Recadastro Pendente',
    BL: 'Bloqueado',
    JU: 'Jurídico',
    TJ: 'Protestado',
    PRCA: 'Pré-Cadastro',
  };

  return data.map(cliente => {
    // --- LÓGICA DE PARSING (sem alteração) ---
    const saldoDevedor = parseCurrency(cliente.saldoDevedor);
    const limiteCredito = parseCurrency(cliente.limiteDeCredito);
    const utilizacaoLimite = limiteCredito > 0 ? (saldoDevedor / limiteCredito) * 100 : null;

    // ======================= REGRA DE PRIORIDADE PELA SITUAÇÃO =======================
    const situacaoCliente = cliente.situacaoCredito.trim().toUpperCase();
    const situacoesCriticas = ['DP', 'RECA', 'BL', 'JU', 'TJ', 'PRCA'];

    if (situacoesCriticas.includes(situacaoCliente)) {
      return {
        ...cliente,
        utilizacaoLimite: utilizacaoLimite,
        perfilPagador: situacaoMap[situacaoCliente] || 'Crítico',
        scoreRisco: 10, // Risco máximo
        scoreValor: 0,  // Valor mínimo
        classificacaoEstrelas: 1,
        classificacaoNome: `Cliente Crítico (${situacaoMap[situacaoCliente]})`,
        alerta: `Atenção: Cliente com status "${situacaoMap[situacaoCliente]}"`,
      };
    }
    // ============================ FIM DA NOVA REGRA ===============================

    // Se o cliente não tem uma situação crítica, a análise continua normalmente...
    
    let perfilPagador = 'Pontual';
    if (cliente.atrasoMedioDias < 0) perfilPagador = 'Antecipado';
    else if (cliente.atrasoMedioDias > settings.atrasoCriticoDias) perfilPagador = 'Atraso Crítico';
    else if (cliente.atrasoMedioDias > settings.atrasoLeveDias) perfilPagador = 'Atraso Leve';

    // ... (O restante da lógica de cálculo de score, IVE, estrelas e alertas continua o mesmo) ...
    let pontuacaoUtilizacao;
    if (utilizacaoLimite === null || utilizacaoLimite <= 0) {
        pontuacaoUtilizacao = 0;
    } else {
        const utilizacaoRatio = utilizacaoLimite / 100;
        pontuacaoUtilizacao = Math.min(Math.pow(utilizacaoRatio, 2) * 10, 10);
    }
    const pontuacaoTitulosVencidos = Math.min(cliente.titulosVencidos / 5, 1) * 10;
    const pontuacaoAtrasoMedio = Math.min(cliente.atrasoMedioDias / 60, 1) * 10;
    if (cliente.titulosVencidos === 0 && cliente.diasDoVencidoMaisAntigo === 0) {
        pontuacaoUtilizacao *= (1 - settings.fatorDescontoBomComportamento);
    }
    const totalPesosRisco = settings.pesoUtilizacao + settings.pesoTitulosVencidos + settings.pesoAtrasoMedio;
    let scoreRisco = ((pontuacaoUtilizacao * settings.pesoUtilizacao) + (pontuacaoTitulosVencidos * settings.pesoTitulosVencidos) + (pontuacaoAtrasoMedio * settings.pesoAtrasoMedio)) / totalPesosRisco;
    const mediaCompra = parseCurrency(cliente.mediaCompra90Dias);
    const pontuacaoFrequencia = Math.min(cliente.compras90Dias / 10, 1) * 10;
    const pontuacaoMediaCompra = Math.min(mediaCompra / 5000, 1) * 10;
    let scoreValor = (pontuacaoFrequencia + pontuacaoMediaCompra) / 2;
    const ive = (scoreValor * settings.pesoValor) - (scoreRisco * settings.pesoRisco);
    let classificacaoEstrelas: number;
    let classificacaoNome: string;
    if (ive > 5.0) {
        classificacaoEstrelas = 5; classificacaoNome = 'Cliente Elite (AAA)';
    } else if (ive > 2.0) {
        classificacaoEstrelas = 4; classificacaoNome = 'Cliente Sólido (AA)';
    } else if (ive > -1.0) {
        classificacaoEstrelas = 3; classificacaoNome = 'Cliente Neutro (A)';
    } else if (ive > -4.0) {
        classificacaoEstrelas = 2; classificacaoNome = 'Cliente de Risco (B)';
    } else {
        classificacaoEstrelas = 1; classificacaoNome = 'Cliente Crítico (C)';
    }
    if (saldoDevedor === 0 && cliente.compras90Dias === 0) {
        classificacaoNome = 'Cliente Inativo';
        classificacaoEstrelas = 0;
        scoreRisco = 0;
        scoreValor = 0;
        perfilPagador = 'Sem Histórico Recente';
    }
    let alerta = null;
    if (utilizacaoLimite && utilizacaoLimite > 110) {
        alerta = 'Cliente operando acima do limite!';
    } else if (cliente.diasDoVencidoMaisAntigo > 60) {
        alerta = 'Possui dívida antiga em aberto.';
    }

    return {
      ...cliente,
      utilizacaoLimite: utilizacaoLimite,
      perfilPagador: perfilPagador,
      scoreRisco: scoreRisco,
      scoreValor: scoreValor,
      classificacaoEstrelas: classificacaoEstrelas,
      classificacaoNome: classificacaoNome,
      alerta: alerta,
    };
  });
}