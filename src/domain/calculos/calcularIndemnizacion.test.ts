import { calcularIndemnizacion } from '@/domain/calculos/calcularIndemnizacion'

describe('calcularIndemnizacion', () => {
  it('calcula la indemnizacion sin tope', () => {
    const resultado = calcularIndemnizacion({
      salarioAnual: 28000,
      salarioDiario: 28000 / 365,
      antiguedadDias: 365 * 5,
      diasPorAno: 20,
      topeMensualidades: 12,
    })

    expect(resultado.topado).toBe(false)
    expect(resultado.anosParaCalculo).toBe(5)
    expect(resultado.importeFinal).toBeCloseTo((28000 / 365) * 20 * 5, 2)
  })

  it('aplica el tope de mensualidades', () => {
    const resultado = calcularIndemnizacion({
      salarioAnual: 120000,
      salarioDiario: 120000 / 365,
      antiguedadDias: 365 * 20,
      diasPorAno: 33,
      topeMensualidades: 12,
    })

    expect(resultado.topado).toBe(true)
    expect(resultado.importeFinal).toBe(120000)
  })
})
