import type { DetalleErrorProcesamiento } from '@/features/document-processing/tipos'
import { PASSWORD_ERROR_DEFAULT } from './constantes'

export function normalizarMensajeError(error: unknown): string {
  if (!error) {
    return ''
  }

  if (typeof error === 'string') {
    return error.toLowerCase()
  }

  if (error instanceof Error) {
    return `${error.name} ${error.message}`.toLowerCase()
  }

  if (typeof error === 'object') {
    const value = error as Record<string, unknown>
    return `${String(value.name ?? '')} ${String(value.code ?? '')} ${String(value.message ?? '')}`
      .toLowerCase()
      .trim()
  }

  return String(error).toLowerCase()
}

export function obtenerDetalleErrorPDF(error: unknown): DetalleErrorProcesamiento {
  const texto = normalizarMensajeError(error)

  if (texto.includes('not_payroll_pdf')) {
    return {
      tipo: 'pdf',
      titulo: 'El PDF no parece una nómina',
      mensaje:
        'No hemos encontrado suficientes señales de nómina (devengos, deducciones, bases de cotización, etc.). Sube una nómina válida o usa el modo manual.',
    }
  }

  if (texto.includes('password') || texto.includes('encrypted')) {
    return {
      tipo: 'pdf',
      titulo: 'PDF protegido con contraseña',
      mensaje:
        'Este PDF está cifrado y no puede leerse directamente. Si lo recibiste en ZIP, súbelo como ZIP para desbloquearlo primero.',
    }
  }

  if (
    texto.includes('invalidpdf') ||
    texto.includes('formaterror') ||
    texto.includes('missingpdf') ||
    texto.includes('xref') ||
    texto.includes('corrupt')
  ) {
    return {
      tipo: 'pdf',
      titulo: 'PDF no compatible o dañado',
      mensaje:
        'No hemos podido interpretar la estructura del PDF. Intenta exportarlo de nuevo o subir otra versión.',
    }
  }

  if (texto.includes('without_text_layer')) {
    return {
      tipo: 'pdf',
      titulo: 'PDF sin texto seleccionable',
      mensaje:
        'El documento parece escaneado como imagen. La extracción automática no es fiable en este caso; puedes continuar en modo manual.',
    }
  }

  return {
    tipo: 'pdf',
    titulo: 'Error procesando el PDF',
    mensaje:
      'No hemos podido extraer los datos de la nómina automáticamente. Puedes continuar con introducción manual.',
  }
}

export function obtenerDetalleErrorZIP(error: unknown): DetalleErrorProcesamiento {
  const texto = normalizarMensajeError(error)

  if (texto.includes('password')) {
    return {
      tipo: 'password',
      titulo: 'Contraseña incorrecta',
      mensaje: PASSWORD_ERROR_DEFAULT,
    }
  }

  if (
    texto.includes('invalid') ||
    texto.includes('central') ||
    texto.includes('zip') ||
    texto.includes('corrupt') ||
    texto.includes('signature')
  ) {
    return {
      tipo: 'zip',
      titulo: 'ZIP no válido o dañado',
      mensaje:
        'No hemos podido abrir el ZIP. Verifica que esté completo y vuelve a descargarlo o exportarlo.',
    }
  }

  return {
    tipo: 'zip',
    titulo: 'No se pudo leer el ZIP',
    mensaje:
      'Ha ocurrido un error al descomprimir el archivo. Puedes intentarlo de nuevo o continuar en modo manual.',
  }
}
