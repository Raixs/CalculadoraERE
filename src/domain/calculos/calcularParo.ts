import { TOPES_LEGALES, type TopesLegales } from '@/domain/constantes/topesLegales'
import type { DesgloseParo } from '@/domain/tipos'

export interface EntradaParo {
  baseCotizacion: number
  mesesParo: number
  hijosACargo: 0 | 1 | 2
  topesLegales?: TopesLegales
}

export function calcularParo({
  baseCotizacion,
  mesesParo,
  hijosACargo,
  topesLegales = TOPES_LEGALES,
}: EntradaParo): DesgloseParo {
  if (mesesParo <= 0) {
    return {
      estado: 'sin-derecho',
      meses: 0,
      primerTramo: 0,
      segundoTramo: 0,
      minimoAplicado: false,
      maximoAplicado: false,
      topeMinimo: 0,
      topeMaximo: 0,
      hijosACargo,
      baseCotizacion,
    }
  }

  let topeMinimo = topesLegales.desempleo.minimoSinHijos
  let topeMaximo = topesLegales.desempleo.maximoSinHijos

  if (hijosACargo === 1) {
    topeMinimo = topesLegales.desempleo.minimoConHijos
    topeMaximo = topesLegales.desempleo.maximoConUnHijo
  }

  if (hijosACargo >= 2) {
    topeMinimo = topesLegales.desempleo.minimoConHijos
    topeMaximo = topesLegales.desempleo.maximoConDosOMasHijos
  }

  if (baseCotizacion <= 0) {
    return {
      estado: 'sin-base',
      meses: mesesParo,
      primerTramo: 0,
      segundoTramo: 0,
      minimoAplicado: false,
      maximoAplicado: false,
      topeMinimo,
      topeMaximo,
      hijosACargo,
      baseCotizacion,
    }
  }

  let primerTramo = baseCotizacion * 0.7
  let segundoTramo = baseCotizacion * 0.6
  let minimoAplicado = false
  let maximoAplicado = false

  if (primerTramo > topeMaximo) {
    primerTramo = topeMaximo
    maximoAplicado = true
  }

  if (primerTramo < topeMinimo) {
    primerTramo = topeMinimo
    minimoAplicado = true
  }

  if (segundoTramo > topeMaximo) {
    segundoTramo = topeMaximo
    maximoAplicado = true
  }

  if (segundoTramo < topeMinimo) {
    segundoTramo = topeMinimo
    minimoAplicado = true
  }

  return {
    estado: 'estimado',
    meses: mesesParo,
    primerTramo,
    segundoTramo,
    minimoAplicado,
    maximoAplicado,
    topeMinimo,
    topeMaximo,
    hijosACargo,
    baseCotizacion,
  }
}
