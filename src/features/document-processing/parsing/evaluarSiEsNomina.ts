import type { AnalisisNomina } from '@/features/document-processing/tipos'

const SENALES_NOMINA = [
  { regex: /N[ÓO]MINA/i, peso: 2 },
  { regex: /RECIBO\s+DE\s+SALARIOS?/i, peso: 2 },
  { regex: /DEVENGOS?/i, peso: 1 },
  { regex: /DEDUCCIONES?/i, peso: 1 },
  { regex: /BASE(?:S)?\s+DE\s+COTIZACI[ÓO]N/i, peso: 1 },
  { regex: /L[ÍI]QUIDO\s+(?:A\s+PERCIBIR|TOTAL)/i, peso: 1 },
  { regex: /CONTINGENCIAS?|SEGURIDAD\s+SOCIAL/i, peso: 1 },
  { regex: /PER[ÍI]ODO\s+DE\s+(?:LIQUIDACI[ÓO]N|DEVENGO)/i, peso: 1 },
]

export function evaluarSiEsNomina(textoNormalizado: string): AnalisisNomina {
  let score = 0
  let hits = 0

  SENALES_NOMINA.forEach((senal) => {
    if (senal.regex.test(textoNormalizado)) {
      score += senal.peso
      hits += 1
    }
  })

  const strong = /N[ÓO]MINA|RECIBO\s+DE\s+SALARIOS?/i.test(textoNormalizado)
  const esNomina = (strong && score >= 3) || score >= 4

  return { esNomina, score, hits }
}
