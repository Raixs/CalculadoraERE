import type { DatosExtraidosNomina } from '@/features/document-processing/tipos'
import { isPdfFile, isZipFile } from './validarArchivo'
import { procesarPdfLocal } from './pdf/procesarPdfLocal'
import { leerPdfDesdeZipProtegido } from './zip/leerPdfDesdeZipProtegido'

export interface ResultadoArchivoProcesado {
  datos: DatosExtraidosNomina
  origen: 'pdf' | 'zip'
  nombrePdfInterno?: string
  totalPdfsInternos?: number
}

export async function procesarArchivo(
  archivo: File,
  passwordZip?: string,
): Promise<ResultadoArchivoProcesado> {
  if (isPdfFile(archivo)) {
    const arrayBuffer = await archivo.arrayBuffer()
    const datos = await procesarPdfLocal(arrayBuffer)
    return { datos, origen: 'pdf' }
  }

  if (isZipFile(archivo)) {
    if (!passwordZip) {
      throw new Error('zip_password_required')
    }

    const pdfExtraido = await leerPdfDesdeZipProtegido(archivo, passwordZip)
    const datos = await procesarPdfLocal(pdfExtraido.buffer)

    return {
      datos,
      origen: 'zip',
      nombrePdfInterno: pdfExtraido.nombrePdf,
      totalPdfsInternos: pdfExtraido.totalPdfs,
    }
  }

  throw new Error('unsupported_file_type')
}
