import {
  calcularAntiguedadDetallada,
  calcularDiasNaturalesEntreFechas,
  formatearAntiguedad,
  formatearFechaInputLocal,
  normalizarAnoNomina,
  parseDateInputLocal,
} from '@/lib/fechas'

describe('lib/fechas', () => {
  it('parsea fechas locales validas', () => {
    const fecha = parseDateInputLocal('2026-04-03')

    expect(fecha).not.toBeNull()
    expect(fecha?.getFullYear()).toBe(2026)
    expect(fecha?.getMonth()).toBe(3)
    expect(fecha?.getDate()).toBe(3)
  })

  it('rechaza fechas invalidas o vacias', () => {
    expect(parseDateInputLocal('')).toBeNull()
    expect(parseDateInputLocal('2026-02-31')).toBeNull()
    expect(parseDateInputLocal('03/04/2026')).toBeNull()
  })

  it('formatea fecha para input local', () => {
    expect(formatearFechaInputLocal(new Date(2026, 3, 3))).toBe('2026-04-03')
  })

  it('calcula dias naturales sin redondear a meses', () => {
    expect(calcularDiasNaturalesEntreFechas(new Date(2024, 0, 31), new Date(2024, 1, 1))).toBe(1)
  })

  it('calcula antiguedad detallada con precision', () => {
    const antiguedad = calcularAntiguedadDetallada(new Date(2020, 0, 15), new Date(2024, 0, 14))

    expect(antiguedad).toEqual({
      totalDias: 1460,
      anos: 3,
      meses: 11,
      dias: 30,
    })
  })

  it('formatea antiguedad legible', () => {
    expect(formatearAntiguedad({ totalDias: 1460, anos: 3, meses: 11, dias: 30 })).toBe(
      '3 años, 11 meses y 30 días',
    )
    expect(formatearAntiguedad({ totalDias: 365, anos: 1, meses: 0, dias: 0 })).toBe(
      '1 año y 0 meses',
    )
  })

  it('normaliza anos de dos digitos sin generar fechas futuras imposibles', () => {
    expect(normalizarAnoNomina('99', 2026)).toBe('1999')
    expect(normalizarAnoNomina('20', 2026)).toBe('2020')
    expect(normalizarAnoNomina('2020', 2026)).toBe('2020')
    expect(normalizarAnoNomina('AA', 2026)).toBeNull()
  })
})
