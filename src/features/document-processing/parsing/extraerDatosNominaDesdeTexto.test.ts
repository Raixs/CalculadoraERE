import {
  TEXTO_NOMINA_COMPLETA,
  TEXTO_NOMINA_CON_SALARIO_BASE_Y_BASE_SS,
  TEXTO_NOMINA_SIN_VARIOS_CAMPOS,
} from '@/test/fixtures/nominas'
import { extraerDatosNominaDesdeTexto } from '@/features/document-processing/parsing/extraerDatosNominaDesdeTexto'
import { procesarTextoNomina } from '@/features/document-processing/parsing/procesarTextoNomina'

describe('extraerDatosNominaDesdeTexto', () => {
  it('extrae los campos clave desde un texto de nomina', () => {
    const resultado = extraerDatosNominaDesdeTexto(TEXTO_NOMINA_COMPLETA)

    expect(resultado.salarioBrutoMensual).toBeCloseTo(2566.67, 2)
    expect(resultado.comisionesDetectadas).toBe(300)
    expect(resultado.irpfDetectado).toBe(15)
    expect(resultado.fechaAntiguedad).toBe('2020-01-15')
    expect(resultado.pagasExtraProrrateadas).toBe(true)
    expect(resultado.baseCotizacionEstimada).toBeCloseTo(2866.67, 2)
    expect(resultado.camposNoDetectados).toHaveLength(0)
  })

  it('mantiene warnings cuando faltan campos', () => {
    const resultado = extraerDatosNominaDesdeTexto(TEXTO_NOMINA_SIN_VARIOS_CAMPOS)

    expect(resultado.deteccion.salario).toBe(true)
    expect(resultado.camposNoDetectados).toContain('Fecha de inicio (antigüedad)')
    expect(resultado.camposNoDetectados).toContain('Pagas extra prorrateadas (12/14 pagas)')
    expect(resultado.camposNoDetectados).toContain('Porcentaje de IRPF')
  })

  it('prioriza la base de seguridad social frente a un salario base parcial', () => {
    const resultado = extraerDatosNominaDesdeTexto(TEXTO_NOMINA_CON_SALARIO_BASE_Y_BASE_SS)

    expect(resultado.salarioBrutoMensual).toBeCloseTo(3000, 2)
    expect(resultado.baseCotizacionEstimada).toBeCloseTo(3000, 2)
    expect(resultado.fuenteSalario).toBe('base_ss')
    expect(resultado.irpfDetectado).toBeCloseTo(18.34, 2)
  })

  it('lanza error si el texto no parece una nomina', () => {
    expect(() => procesarTextoNomina('Factura 1.200,00')).toThrow('pdf_without_text_layer')
    expect(() =>
      procesarTextoNomina(
        'Factura simplificada con mucho texto para no disparar la detección de capa vacía, pero sin devengos ni deducciones ni bases.',
      ),
    ).toThrow('not_payroll_pdf')
  })
})
