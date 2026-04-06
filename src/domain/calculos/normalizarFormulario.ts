import type { EntradaCalculoNormalizada, FormularioCalculadora } from '@/domain/tipos'
import { limitarNumero, parseEnteroInput, parseNumeroInput } from '@/lib/numeros'

export function normalizarFormulario(formulario: FormularioCalculadora): EntradaCalculoNormalizada {
  const diasPreavisoPendientes =
    formulario.seleccionPreaviso === 'custom'
      ? parseEnteroInput(formulario.diasPreavisoPendientes)
      : parseEnteroInput(formulario.seleccionPreaviso)

  return {
    salarioMensual: Math.max(0, parseNumeroInput(formulario.salarioMensual)),
    comisionesMensuales: Math.max(0, parseNumeroInput(formulario.comisionesMensuales)),
    fechaAntiguedad: formulario.fechaAntiguedad,
    fechaDespido: formulario.fechaDespido,
    pagasExtraProrrateadas: formulario.pagasExtraProrrateadas,
    diasIndemnizacion: limitarNumero(parseEnteroInput(formulario.diasIndemnizacion), 20, 33),
    topeMensualidades: limitarNumero(parseEnteroInput(formulario.topeMensualidades), 12, 24),
    vacacionesPendientes: Math.max(0, parseEnteroInput(formulario.vacacionesPendientes)),
    diasPreavisoPendientes: limitarNumero(diasPreavisoPendientes, 0, 15),
    irpf: limitarNumero(parseNumeroInput(formulario.irpf), 0, 100),
    tiempoCotizadoMeses: limitarNumero(parseEnteroInput(formulario.tiempoCotizadoMeses), 0, 24),
    hijosACargo: limitarNumero(parseEnteroInput(formulario.hijosACargo), 0, 2) as 0 | 1 | 2,
    baseCotizacion: Math.max(0, parseNumeroInput(formulario.baseCotizacion)),
  }
}
