import {
  formatearMoneda,
  limitarNumero,
  parseEnteroInput,
  parseImporteNomina,
  parseNumeroInput,
} from '@/lib/numeros'

describe('lib/numeros', () => {
  it('parsea numeros de input', () => {
    expect(parseNumeroInput('12,5')).toBe(12.5)
    expect(parseNumeroInput('12.5')).toBe(12.5)
    expect(parseNumeroInput('')).toBe(0)
  })

  it('parsea enteros de input', () => {
    expect(parseEnteroInput('15')).toBe(15)
    expect(parseEnteroInput('15.9')).toBe(15)
    expect(parseEnteroInput(undefined)).toBe(0)
  })

  it('parsea importes de nomina con separador europeo', () => {
    expect(parseImporteNomina('2.866,67')).toBe(2866.67)
    expect(Number.isNaN(parseImporteNomina(null))).toBe(true)
  })

  it('limita valores a un rango', () => {
    expect(limitarNumero(5, 10, 20)).toBe(10)
    expect(limitarNumero(25, 10, 20)).toBe(20)
  })

  it('formatea moneda en espanol', () => {
    const resultado = formatearMoneda(1234.56)

    expect(resultado).toContain('234,56')
    expect(resultado).toContain('€')
  })
})
