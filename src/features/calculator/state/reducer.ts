import type { FormularioCalculadora, ModoEntrada } from '@/domain/tipos'
import type { CalculatorState, ScrollIntent, VistaCalculadora } from './types'

export type CalculatorAction =
  | {
      type: 'SET_FIELD'
      payload: {
        field: keyof FormularioCalculadora
        value: FormularioCalculadora[keyof FormularioCalculadora]
      }
    }
  | { type: 'SET_FORM'; payload: FormularioCalculadora }
  | { type: 'SET_VIEW'; payload: VistaCalculadora }
  | { type: 'SET_ENTRY_MODE'; payload: ModoEntrada }
  | { type: 'SET_EXTRACTION_WARNINGS'; payload: string[] }
  | {
      type: 'START_LOADING'
      payload: {
        text: string
        subtext: string
      }
    }
  | {
      type: 'SHOW_ERROR_MODAL'
      payload: {
        title: string
        message: string
        allowManual?: boolean
        backToUpload?: boolean
      }
    }
  | { type: 'HIDE_ERROR_MODAL' }
  | { type: 'OPEN_PASSWORD_MODAL'; payload: File }
  | { type: 'SET_PASSWORD_VALUE'; payload: string }
  | { type: 'SET_PASSWORD_ERROR'; payload: string }
  | { type: 'SET_PASSWORD_SUBMITTING'; payload: boolean }
  | { type: 'CLOSE_PASSWORD_MODAL' }
  | { type: 'SET_SCROLL_INTENT'; payload: ScrollIntent }
  | { type: 'RESET_APP'; payload: FormularioCalculadora }

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.field]: action.payload.value,
        },
      }

    case 'SET_FORM':
      return {
        ...state,
        form: action.payload,
      }

    case 'SET_VIEW':
      return {
        ...state,
        ui: {
          ...state.ui,
          view: action.payload,
        },
      }

    case 'SET_ENTRY_MODE':
      return {
        ...state,
        ui: {
          ...state.ui,
          entryMode: action.payload,
        },
      }

    case 'SET_EXTRACTION_WARNINGS':
      return {
        ...state,
        ui: {
          ...state.ui,
          extractionWarnings: action.payload,
        },
      }

    case 'START_LOADING':
      return {
        ...state,
        ui: {
          ...state.ui,
          view: 'loading',
          loading: action.payload,
          errorModal: {
            ...state.ui.errorModal,
            open: false,
          },
        },
      }

    case 'SHOW_ERROR_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          view: action.payload.backToUpload === false ? state.ui.view : 'upload',
          errorModal: {
            open: true,
            title: action.payload.title,
            message: action.payload.message,
            allowManual: action.payload.allowManual ?? true,
          },
          passwordModal: {
            ...state.ui.passwordModal,
            open: false,
            submitting: false,
          },
        },
      }

    case 'HIDE_ERROR_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          errorModal: {
            ...state.ui.errorModal,
            open: false,
          },
        },
      }

    case 'OPEN_PASSWORD_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          entryMode: 'file',
          passwordModal: {
            open: true,
            value: '',
            error: '',
            pendingZipFile: action.payload,
            submitting: false,
          },
        },
      }

    case 'SET_PASSWORD_VALUE':
      return {
        ...state,
        ui: {
          ...state.ui,
          passwordModal: {
            ...state.ui.passwordModal,
            value: action.payload,
          },
        },
      }

    case 'SET_PASSWORD_ERROR':
      return {
        ...state,
        ui: {
          ...state.ui,
          passwordModal: {
            ...state.ui.passwordModal,
            error: action.payload,
          },
        },
      }

    case 'SET_PASSWORD_SUBMITTING':
      return {
        ...state,
        ui: {
          ...state.ui,
          passwordModal: {
            ...state.ui.passwordModal,
            submitting: action.payload,
          },
        },
      }

    case 'CLOSE_PASSWORD_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          passwordModal: {
            open: false,
            value: '',
            error: '',
            pendingZipFile: null,
            submitting: false,
          },
        },
      }

    case 'SET_SCROLL_INTENT':
      return {
        ...state,
        ui: {
          ...state.ui,
          scrollIntent: action.payload,
        },
      }

    case 'RESET_APP':
      return {
        form: action.payload,
        ui: {
          ...state.ui,
          view: 'upload',
          entryMode: 'file',
          extractionWarnings: [],
          passwordModal: {
            open: false,
            value: '',
            error: '',
            pendingZipFile: null,
            submitting: false,
          },
          errorModal: {
            ...state.ui.errorModal,
            open: false,
          },
          scrollIntent: 'upload',
        },
      }

    default:
      return state
  }
}
