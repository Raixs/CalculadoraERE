export const MS_POR_DIA = 1000 * 60 * 60 * 24

export interface AntiguedadDetallada {
  totalDias: number
  anos: number
  meses: number
  dias: number
}

export function formatearFechaInputLocal(fecha = new Date()): string {
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function parseDateInputLocal(valor: string | null | undefined): Date | null {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return null
  }

  const [year, month, day] = valor.split('-').map(Number)
  const fecha = new Date(year, month - 1, day)

  if (
    Number.isNaN(fecha.getTime()) ||
    fecha.getFullYear() !== year ||
    fecha.getMonth() !== month - 1 ||
    fecha.getDate() !== day
  ) {
    return null
  }

  return fecha
}

export function calcularDiasNaturalesEntreFechas(
  fechaInicio: Date | null | undefined,
  fechaFin: Date | null | undefined,
): number {
  if (!(fechaInicio instanceof Date) || !(fechaFin instanceof Date)) {
    return 0
  }

  if (Number.isNaN(fechaInicio.getTime()) || Number.isNaN(fechaFin.getTime())) {
    return 0
  }

  const inicioUTC = Date.UTC(
    fechaInicio.getFullYear(),
    fechaInicio.getMonth(),
    fechaInicio.getDate(),
  )
  const finUTC = Date.UTC(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate())

  if (finUTC <= inicioUTC) {
    return 0
  }

  return Math.floor((finUTC - inicioUTC) / MS_POR_DIA)
}

export function calcularAntiguedadDetallada(
  fechaInicio: Date | null | undefined,
  fechaFin: Date | null | undefined,
): AntiguedadDetallada {
  const totalDias = calcularDiasNaturalesEntreFechas(fechaInicio, fechaFin)

  if (!fechaInicio || !fechaFin || totalDias === 0) {
    return { totalDias: 0, anos: 0, meses: 0, dias: 0 }
  }

  let anos = fechaFin.getFullYear() - fechaInicio.getFullYear()
  let meses = fechaFin.getMonth() - fechaInicio.getMonth()
  let dias = fechaFin.getDate() - fechaInicio.getDate()

  if (dias < 0) {
    meses -= 1
    dias += new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 0).getDate()
  }

  if (meses < 0) {
    anos -= 1
    meses += 12
  }

  return {
    totalDias,
    anos: Math.max(0, anos),
    meses: Math.max(0, meses),
    dias: Math.max(0, dias),
  }
}

export function formatearAntiguedad(detalle: AntiguedadDetallada): string {
  const formatearUnidad = (valor: number, singular: string, plural: string) =>
    `${valor} ${valor === 1 ? singular : plural}`

  const partes = [
    formatearUnidad(detalle.anos, 'año', 'años'),
    formatearUnidad(detalle.meses, 'mes', 'meses'),
  ]

  if (detalle.dias > 0) {
    partes.push(formatearUnidad(detalle.dias, 'día', 'días'))
  }

  if (partes.length === 2) {
    return `${partes[0]} y ${partes[1]}`
  }

  return `${partes[0]}, ${partes[1]} y ${partes[2]}`
}

export function normalizarAnoNomina(
  textoAno: string | null | undefined,
  currentYear = new Date().getFullYear(),
): string | null {
  if (!textoAno) {
    return null
  }

  if (textoAno.length === 4) {
    return textoAno
  }

  const yearNum = Number.parseInt(textoAno, 10)
  if (!Number.isFinite(yearNum)) {
    return null
  }

  let normalizado = 2000 + yearNum
  if (normalizado > currentYear + 1) {
    normalizado -= 100
  }

  return String(normalizado)
}
