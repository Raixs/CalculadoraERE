import type { FormularioCalculadora } from '@/domain/tipos'
import { formatearFechaInputLocal } from '@/lib/fechas'
import type { CalculatorState, CalculatorUiState } from './types'

export function createInitialFormState(now = new Date()): FormularioCalculadora {
  return {
    salarioMensual: '2000',
    comisionesMensuales: '0',
    fechaAntiguedad: '2020-01-01',
    fechaDespido: formatearFechaInputLocal(now),
    pagasExtraProrrateadas: true,
    diasIndemnizacion: '20',
    topeMensualidades: '12',
    vacacionesPendientes: '0',
    seleccionPreaviso: '0',
    diasPreavisoPendientes: '0',
    irpf: '15',
    tiempoCotizadoMeses: '24',
    hijosACargo: '0',
    baseCotizacion: '0',
  }
}

export function createInitialUiState(): CalculatorUiState {
  return {
    view: 'upload',
    entryMode: 'file',
    extractionWarnings: [],
    loading: {
      text: 'Procesando archivo...',
      subtext: 'Extrayendo datos de forma segura en tu navegador.',
    },
    passwordModal: {
      open: false,
      value: '',
      error: '',
      pendingZipFile: null,
      submitting: false,
    },
    errorModal: {
      open: false,
      title: '',
      message: '',
      allowManual: true,
    },
    scrollIntent: null,
  }
}

export function createInitialState(now = new Date()): CalculatorState {
  return {
    form: createInitialFormState(now),
    ui: createInitialUiState(),
  }
}
