import type { DesgloseFiniquito } from '@/domain/tipos'
import { calcularDiasNaturalesEntreFechas } from '@/lib/fechas'

export interface EntradaFiniquito {
  salarioDiario: number
  salarioMensual: number
  fechaDespido: Date
  pagasExtraProrrateadas: boolean
  vacacionesPendientes: number
  diasPreavisoPendientes: number
}

export function calcularFiniquito({
  salarioDiario,
  salarioMensual,
  fechaDespido,
  pagasExtraProrrateadas,
  vacacionesPendientes,
  diasPreavisoPendientes,
}: EntradaFiniquito): DesgloseFiniquito {
  const vacaciones = vacacionesPendientes * salarioDiario
  const preaviso = diasPreavisoPendientes * salarioDiario

  let pagasExtra = 0
  if (!pagasExtraProrrateadas) {
    const inicioAno = new Date(fechaDespido.getFullYear(), 0, 1)
    const diasDevengados = calcularDiasNaturalesEntreFechas(inicioAno, fechaDespido) + 1
    const pagasExtraAnuales = salarioMensual * 2
    pagasExtra = pagasExtraAnuales * (diasDevengados / 365)
  }

  return {
    vacaciones,
    preaviso,
    pagasExtra,
    total: vacaciones + preaviso + pagasExtra,
  }
}
