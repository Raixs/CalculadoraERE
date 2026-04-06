import { TOPES_LEGALES, type TopesLegales } from '@/domain/constantes/topesLegales'
import type { FormularioCalculadora, ResumenLiquidacion } from '@/domain/tipos'
import {
  calcularAntiguedadDetallada,
  formatearFechaInputLocal,
  parseDateInputLocal,
} from '@/lib/fechas'
import { normalizarFormulario } from './normalizarFormulario'
import { calcularFiniquito } from './calcularFiniquito'
import { calcularIndemnizacion } from './calcularIndemnizacion'
import { calcularParo } from './calcularParo'

export interface OpcionesCalculoLiquidacion {
  now?: Date
  topesLegales?: TopesLegales
}

export function calcularLiquidacion(
  formulario: FormularioCalculadora,
  { now = new Date(), topesLegales = TOPES_LEGALES }: OpcionesCalculoLiquidacion = {},
): ResumenLiquidacion {
  const entrada = normalizarFormulario(formulario)
  const fechaAntiguedad = parseDateInputLocal(entrada.fechaAntiguedad)
  const fechaDespido =
    parseDateInputLocal(entrada.fechaDespido) ||
    parseDateInputLocal(formatearFechaInputLocal(now)) ||
    now

  const multiplicadorPagas = entrada.pagasExtraProrrateadas ? 12 : 14
  const salarioFijoAnual = entrada.salarioMensual * multiplicadorPagas
  const salarioVariableAnual = entrada.comisionesMensuales * 12
  const salarioAnual = salarioFijoAnual + salarioVariableAnual
  const salarioDiario = salarioAnual / 365

  const antiguedad = calcularAntiguedadDetallada(fechaAntiguedad, fechaDespido)

  const indemnizacion = calcularIndemnizacion({
    salarioAnual,
    salarioDiario,
    antiguedadDias: antiguedad.totalDias,
    diasPorAno: entrada.diasIndemnizacion,
    topeMensualidades: entrada.topeMensualidades,
  })

  const finiquito = calcularFiniquito({
    salarioDiario,
    salarioMensual: entrada.salarioMensual,
    fechaDespido,
    pagasExtraProrrateadas: entrada.pagasExtraProrrateadas,
    vacacionesPendientes: entrada.vacacionesPendientes,
    diasPreavisoPendientes: entrada.diasPreavisoPendientes,
  })

  const paro = calcularParo({
    baseCotizacion: entrada.baseCotizacion,
    mesesParo: entrada.tiempoCotizadoMeses,
    hijosACargo: entrada.hijosACargo,
    topesLegales,
  })

  const bruto = indemnizacion.importeFinal + finiquito.total
  const retencionIrpf = finiquito.total * (entrada.irpf / 100)
  const neto = bruto - retencionIrpf

  return {
    salarioAnual,
    salarioDiario,
    antiguedad,
    indemnizacion,
    finiquito,
    totales: {
      bruto,
      retencionIrpf,
      neto,
    },
    paro,
    topesLegales,
  }
}
