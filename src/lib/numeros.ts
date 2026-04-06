const formatoMoneda = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

export function parseNumeroInput(valor: string | number | null | undefined): number {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : 0
  }

  if (valor === null || valor === undefined || valor === '') {
    return 0
  }

  const normalizado = String(valor).trim().replace(',', '.')
  const numero = Number.parseFloat(normalizado)

  return Number.isFinite(numero) ? numero : 0
}

export function parseEnteroInput(valor: string | number | null | undefined): number {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? Math.trunc(valor) : 0
  }

  if (valor === null || valor === undefined || valor === '') {
    return 0
  }

  const numero = Number.parseInt(String(valor), 10)
  return Number.isFinite(numero) ? numero : 0
}

export function parseImporteNomina(importeTexto?: string | null): number {
  if (!importeTexto) {
    return Number.NaN
  }

  return Number.parseFloat(importeTexto.replace(/\./g, '').replace(',', '.'))
}

export function limitarNumero(valor: number, minimo: number, maximo: number): number {
  return Math.min(maximo, Math.max(minimo, valor))
}

export function formatearMoneda(valor: number): string {
  return formatoMoneda.format(valor)
}

export function formatearPorcentaje(valor: number): string {
  return valor.toLocaleString('es-ES', { maximumFractionDigits: 2 })
}
