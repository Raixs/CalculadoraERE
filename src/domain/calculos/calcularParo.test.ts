import { calcularParo } from '@/domain/calculos/calcularParo'

describe('calcularParo', () => {
  it('devuelve sin derecho cuando no hay cotizacion suficiente', () => {
    const resultado = calcularParo({ baseCotizacion: 2500, mesesParo: 0, hijosACargo: 0 })

    expect(resultado.estado).toBe('sin-derecho')
    expect(resultado.meses).toBe(0)
  })

  it('no aplica minimos si la base es 0', () => {
    const resultado = calcularParo({ baseCotizacion: 0, mesesParo: 24, hijosACargo: 0 })

    expect(resultado.estado).toBe('sin-base')
    expect(resultado.primerTramo).toBe(0)
    expect(resultado.segundoTramo).toBe(0)
    expect(resultado.minimoAplicado).toBe(false)
  })

  it('aplica tope maximo correctamente', () => {
    const resultado = calcularParo({ baseCotizacion: 5000, mesesParo: 24, hijosACargo: 0 })

    expect(resultado.estado).toBe('estimado')
    expect(resultado.maximoAplicado).toBe(true)
    expect(resultado.primerTramo).toBe(1225)
    expect(resultado.segundoTramo).toBe(1225)
  })

  it('aplica tope minimo con hijos', () => {
    const resultado = calcularParo({ baseCotizacion: 600, mesesParo: 24, hijosACargo: 1 })

    expect(resultado.minimoAplicado).toBe(true)
    expect(resultado.primerTramo).toBe(749)
    expect(resultado.segundoTramo).toBe(749)
  })
})
