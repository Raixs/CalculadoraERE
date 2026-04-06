import { TEXTO_NO_NOMINA, TEXTO_NOMINA_COMPLETA } from '@/test/fixtures/nominas'
import { evaluarSiEsNomina } from '@/features/document-processing/parsing/evaluarSiEsNomina'

describe('evaluarSiEsNomina', () => {
  it('detecta una nomina por senales fuertes', () => {
    const resultado = evaluarSiEsNomina(TEXTO_NOMINA_COMPLETA)

    expect(resultado.esNomina).toBe(true)
    expect(resultado.score).toBeGreaterThanOrEqual(4)
  })

  it('descarta un texto no relacionado', () => {
    const resultado = evaluarSiEsNomina(TEXTO_NO_NOMINA)

    expect(resultado.esNomina).toBe(false)
  })
})
