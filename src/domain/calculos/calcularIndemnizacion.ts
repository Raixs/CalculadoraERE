import type { DesgloseIndemnizacion } from '@/domain/tipos'

export interface EntradaIndemnizacion {
  salarioAnual: number
  salarioDiario: number
  antiguedadDias: number
  diasPorAno: number
  topeMensualidades: number
}

export function calcularIndemnizacion({
  salarioAnual,
  salarioDiario,
  antiguedadDias,
  diasPorAno,
  topeMensualidades,
}: EntradaIndemnizacion): DesgloseIndemnizacion {
  const anosParaCalculo = antiguedadDias / 365
  const valorPorDiaNegociacion = anosParaCalculo * salarioDiario
  const importeBruto = anosParaCalculo * diasPorAno * salarioDiario
  const mensualidadReferencia = salarioAnual / 12
  const importeTopado = topeMensualidades * mensualidadReferencia
  const topado = importeBruto > importeTopado

  return {
    anosParaCalculo,
    valorPorDiaNegociacion,
    importeBruto,
    mensualidadReferencia,
    importeTopado,
    importeFinal: topado ? importeTopado : importeBruto,
    topado,
  }
}
