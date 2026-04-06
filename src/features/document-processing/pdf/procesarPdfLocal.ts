import type { DatosExtraidosNomina } from '@/features/document-processing/tipos'
import { procesarTextoNomina } from '@/features/document-processing/parsing/procesarTextoNomina'
import { leerTextoPdfLocal } from './leerTextoPdfLocal'

export async function procesarPdfLocal(arrayBuffer: ArrayBuffer): Promise<DatosExtraidosNomina> {
  const texto = await leerTextoPdfLocal(arrayBuffer)
  return procesarTextoNomina(texto)
}
