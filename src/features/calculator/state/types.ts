import type { FormularioCalculadora, ModoEntrada } from '@/domain/tipos'

export type VistaCalculadora = 'upload' | 'loading' | 'calculator'
export type ScrollIntent = 'upload' | 'manual' | 'results' | null

export interface LoadingState {
  text: string
  subtext: string
}

export interface PasswordModalState {
  open: boolean
  value: string
  error: string
  pendingZipFile: File | null
  submitting: boolean
}

export interface ErrorModalState {
  open: boolean
  title: string
  message: string
  allowManual: boolean
}

export interface CalculatorUiState {
  view: VistaCalculadora
  entryMode: ModoEntrada
  extractionWarnings: string[]
  loading: LoadingState
  passwordModal: PasswordModalState
  errorModal: ErrorModalState
  scrollIntent: ScrollIntent
}

export interface CalculatorState {
  form: FormularioCalculadora
  ui: CalculatorUiState
}
