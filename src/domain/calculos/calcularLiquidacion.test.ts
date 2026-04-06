import type { FormularioCalculadora } from '@/domain/tipos'
import { calcularLiquidacion } from '@/domain/calculos/calcularLiquidacion'

const FORMULARIO_BASE: FormularioCalculadora = {
  salarioMensual: '2000',
  comisionesMensuales: '0',
  fechaAntiguedad: '2020-01-01',
  fechaDespido: '2026-04-03',
  pagasExtraProrrateadas: true,
  diasIndemnizacion: '20',
  topeMensualidades: '12',
  vacacionesPendientes: '0',
  seleccionPreaviso: '0',
  diasPreavisoPendientes: '0',
  irpf: '15',
  tiempoCotizadoMeses: '24',
  hijosACargo: '0',
  baseCotizacion: '2500',
}

describe('calcularLiquidacion', () => {
  it('compone el resumen completo', () => {
    const resumen = calcularLiquidacion(FORMULARIO_BASE, {
      now: new Date(2026, 3, 3),
    })

    expect(resumen.salarioAnual).toBe(24000)
    expect(resumen.antiguedad.totalDias).toBeGreaterThan(0)
    expect(resumen.indemnizacion.importeFinal).toBeGreaterThan(0)
    expect(resumen.finiquito.total).toBe(0)
    expect(resumen.totales.neto).toBeCloseTo(resumen.totales.bruto, 2)
    expect(resumen.paro.estado).toBe('estimado')
  })

  it('usa la fecha actual si la fecha de despido es invalida', () => {
    const resumen = calcularLiquidacion(
      {
        ...FORMULARIO_BASE,
        fechaDespido: '',
      },
      {
        now: new Date(2026, 3, 3),
      },
    )

    expect(resumen.antiguedad.totalDias).toBeGreaterThan(0)
  })

  it('aplica retencion IRPF solo sobre el finiquito', () => {
    const resumen = calcularLiquidacion(
      {
        ...FORMULARIO_BASE,
        vacacionesPendientes: '10',
        seleccionPreaviso: '15',
        irpf: '10',
      },
      {
        now: new Date(2026, 3, 3),
      },
    )

    expect(resumen.finiquito.total).toBeGreaterThan(0)
    expect(resumen.totales.retencionIrpf).toBeCloseTo(resumen.finiquito.total * 0.1, 2)
  })
})
