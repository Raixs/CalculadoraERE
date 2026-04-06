import type { TopesLegales } from '@/domain/constantes/topesLegales'
import type { AntiguedadDetallada } from '@/lib/fechas'

export type ModoEntrada = 'file' | 'manual'
export type ModoFuenteContrato = 'automatico' | 'manual'
export type SeleccionPreaviso = '0' | '15' | 'custom'
export type OpcionHijos = '0' | '1' | '2'
export type EstadoParo = 'sin-derecho' | 'sin-base' | 'estimado'

export interface FormularioCalculadora {
  salarioMensual: string
  comisionesMensuales: string
  fechaAntiguedad: string
  fechaDespido: string
  pagasExtraProrrateadas: boolean
  diasIndemnizacion: string
  topeMensualidades: string
  vacacionesPendientes: string
  seleccionPreaviso: SeleccionPreaviso
  diasPreavisoPendientes: string
  irpf: string
  tiempoCotizadoMeses: string
  hijosACargo: OpcionHijos
  baseCotizacion: string
}

export interface EntradaCalculoNormalizada {
  salarioMensual: number
  comisionesMensuales: number
  fechaAntiguedad: string
  fechaDespido: string
  pagasExtraProrrateadas: boolean
  diasIndemnizacion: number
  topeMensualidades: number
  vacacionesPendientes: number
  diasPreavisoPendientes: number
  irpf: number
  tiempoCotizadoMeses: number
  hijosACargo: 0 | 1 | 2
  baseCotizacion: number
}

export interface DesgloseIndemnizacion {
  anosParaCalculo: number
  valorPorDiaNegociacion: number
  importeBruto: number
  mensualidadReferencia: number
  importeTopado: number
  importeFinal: number
  topado: boolean
}

export interface DesgloseFiniquito {
  vacaciones: number
  preaviso: number
  pagasExtra: number
  total: number
}

export interface DesgloseParo {
  estado: EstadoParo
  meses: number
  primerTramo: number
  segundoTramo: number
  minimoAplicado: boolean
  maximoAplicado: boolean
  topeMinimo: number
  topeMaximo: number
  hijosACargo: 0 | 1 | 2
  baseCotizacion: number
}

export interface ResumenLiquidacion {
  salarioAnual: number
  salarioDiario: number
  antiguedad: AntiguedadDetallada
  indemnizacion: DesgloseIndemnizacion
  finiquito: DesgloseFiniquito
  totales: {
    bruto: number
    retencionIrpf: number
    neto: number
  }
  paro: DesgloseParo
  topesLegales: TopesLegales
}
