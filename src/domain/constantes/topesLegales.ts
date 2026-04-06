export interface TopesLegales {
  seguridadSocial: {
    anoReferencia: number
    baseMaximaMensualCotizacion: number
  }
  desempleo: {
    anoReferencia: number
    minimoSinHijos: number
    minimoConHijos: number
    maximoSinHijos: number
    maximoConUnHijo: number
    maximoConDosOMasHijos: number
  }
}

export const TOPES_LEGALES: TopesLegales = {
  seguridadSocial: {
    anoReferencia: 2025,
    baseMaximaMensualCotizacion: 4909.5,
  },
  desempleo: {
    anoReferencia: 2026,
    minimoSinHijos: 560,
    minimoConHijos: 749,
    maximoSinHijos: 1225,
    maximoConUnHijo: 1400,
    maximoConDosOMasHijos: 1575,
  },
}
