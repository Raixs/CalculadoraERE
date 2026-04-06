import type { DatosExtraidosNomina } from '@/features/document-processing/tipos'
import {
  extraerDatosNominaDesdeTexto,
  normalizarTextoDocumento,
} from './extraerDatosNominaDesdeTexto'
import { evaluarSiEsNomina } from './evaluarSiEsNomina'

export function procesarTextoNomina(texto: string): DatosExtraidosNomina {
  const textoNormalizado = normalizarTextoDocumento(texto)

  if (textoNormalizado.length < 40) {
    throw new Error('pdf_without_text_layer')
  }

  const analisisNomina = evaluarSiEsNomina(textoNormalizado)
  if (!analisisNomina.esNomina) {
    throw new Error('not_payroll_pdf')
  }

  return extraerDatosNominaDesdeTexto(textoNormalizado)
}
