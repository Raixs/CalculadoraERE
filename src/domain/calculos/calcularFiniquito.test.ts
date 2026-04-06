import { calcularFiniquito } from '@/domain/calculos/calcularFiniquito'

describe('calcularFiniquito', () => {
  it('calcula vacaciones y preaviso', () => {
    const resultado = calcularFiniquito({
      salarioDiario: 100,
      salarioMensual: 2000,
      fechaDespido: new Date(2026, 3, 3),
      pagasExtraProrrateadas: true,
      vacacionesPendientes: 10,
      diasPreavisoPendientes: 15,
    })

    expect(resultado.vacaciones).toBe(1000)
    expect(resultado.preaviso).toBe(1500)
    expect(resultado.pagasExtra).toBe(0)
    expect(resultado.total).toBe(2500)
  })

  it('devenga pagas extra si no estan prorrateadas', () => {
    const resultado = calcularFiniquito({
      salarioDiario: 100,
      salarioMensual: 2000,
      fechaDespido: new Date(2026, 5, 30),
      pagasExtraProrrateadas: false,
      vacacionesPendientes: 0,
      diasPreavisoPendientes: 0,
    })

    expect(resultado.pagasExtra).toBeGreaterThan(1900)
    expect(resultado.pagasExtra).toBeLessThan(2100)
  })
})
