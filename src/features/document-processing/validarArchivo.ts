import { MAX_FILE_SIZE_MB } from '@/features/document-processing/constantes'
import type { DetalleErrorProcesamiento } from '@/features/document-processing/tipos'

export interface ArchivoSeleccionable {
  name?: string
  type?: string
  size?: number
}

export function isZipFile(file: ArchivoSeleccionable): boolean {
  const name = (file.name || '').toLowerCase()
  const type = (file.type || '').toLowerCase()

  return (
    name.endsWith('.zip') || type === 'application/zip' || type === 'application/x-zip-compressed'
  )
}

export function isPdfFile(file: ArchivoSeleccionable): boolean {
  const name = (file.name || '').toLowerCase()
  const type = (file.type || '').toLowerCase()

  return name.endsWith('.pdf') || type === 'application/pdf' || type === 'application/x-pdf'
}

export function validarArchivoSeleccionado(
  file: ArchivoSeleccionable | null | undefined,
): DetalleErrorProcesamiento | null {
  if (!file) {
    return null
  }

  if (!file.size) {
    return {
      titulo: 'Archivo vacío',
      mensaje: 'El archivo seleccionado está vacío. Vuelve a intentarlo con un PDF o ZIP válido.',
    }
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return {
      titulo: 'Archivo demasiado grande',
      mensaje: `El tamaño máximo soportado es ${MAX_FILE_SIZE_MB} MB. Intenta comprimirlo o usar otra versión más ligera.`,
    }
  }

  if (!isPdfFile(file) && !isZipFile(file)) {
    return {
      titulo: 'Formato no soportado',
      mensaje: 'Solo se admiten archivos PDF o ZIP con PDF en su interior.',
    }
  }

  return null
}
