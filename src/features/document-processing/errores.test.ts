import {
  normalizarMensajeError,
  obtenerDetalleErrorPDF,
  obtenerDetalleErrorZIP,
} from '@/features/document-processing/errores'

describe('errores de procesamiento', () => {
  it('normaliza distintos formatos de error', () => {
    expect(normalizarMensajeError(new Error('Boom'))).toContain('boom')
    expect(normalizarMensajeError('PASSWORD REQUIRED')).toBe('password required')
    expect(normalizarMensajeError({ code: 'E_FAIL', message: 'Zip corrupt' })).toContain(
      'zip corrupt',
    )
  })

  it('mapea errores PDF conocidos', () => {
    expect(obtenerDetalleErrorPDF('not_payroll_pdf').titulo).toBe('El PDF no parece una nómina')
    expect(obtenerDetalleErrorPDF('encrypted').titulo).toBe('PDF protegido con contraseña')
    expect(obtenerDetalleErrorPDF('pdf_without_text_layer').titulo).toBe(
      'PDF sin texto seleccionable',
    )
  })

  it('mapea errores ZIP conocidos', () => {
    expect(obtenerDetalleErrorZIP('wrong password').tipo).toBe('password')
    expect(obtenerDetalleErrorZIP('zip corrupt').titulo).toBe('ZIP no válido o dañado')
  })
})
