export type FuenteSalarioNomina =
  | 'default'
  | 'salario_base'
  | 'rem_total'
  | 'base_ss'
  | 'base_cotizacion'
  | 't_devengado'
  | 'liquido_percibir'
  | 'fallback'

export interface AnalisisNomina {
  esNomina: boolean
  score: number
  hits: number
}

export interface DeteccionCamposNomina {
  salario: boolean
  fechaAntiguedad: boolean
  prorrateo: boolean
  irpf: boolean
  comisiones: boolean
}

export interface DatosExtraidosNomina {
  salarioBrutoMensual: number
  fechaAntiguedad: string
  pagasExtraProrrateadas: boolean
  comisionesDetectadas: number
  irpfDetectado: number
  baseCotizacionEstimada: number
  deteccion: DeteccionCamposNomina
  fuenteSalario: FuenteSalarioNomina
  salarioBajaConfianza: boolean
  camposNoDetectados: string[]
  textoNormalizado: string
  analisisNomina: AnalisisNomina
}

export interface DetalleErrorProcesamiento {
  tipo?: 'password' | 'zip' | 'pdf'
  titulo: string
  mensaje: string
}
