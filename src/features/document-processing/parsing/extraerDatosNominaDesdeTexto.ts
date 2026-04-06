import { TOPES_LEGALES } from '@/domain/constantes/topesLegales'
import { normalizarAnoNomina } from '@/lib/fechas'
import { parseImporteNomina } from '@/lib/numeros'
import type {
  DatosExtraidosNomina,
  FuenteSalarioNomina,
} from '@/features/document-processing/tipos'
import { evaluarSiEsNomina } from './evaluarSiEsNomina'

interface FuenteSalarioConfig {
  id: FuenteSalarioNomina
  bajaConfianza: boolean
  regexes: RegExp[]
}

const FUENTES_SALARIO: FuenteSalarioConfig[] = [
  {
    id: 'salario_base',
    bajaConfianza: false,
    regexes: [/(?:SALARIO\s+BASE|SUELDO\s+BASE)[^\d]{0,180}(\d{1,3}(?:\.\d{3})*,\d{2})/i],
  },
  {
    id: 'rem_total',
    bajaConfianza: false,
    regexes: [
      /(?:REM(?:UNERACI[ÓO]N)?\.?\s*TOTAL|RETRIBUCI[ÓO]N\s+TOTAL)[^\d]{0,180}(\d{1,3}(?:\.\d{3})*,\d{2})/i,
    ],
  },
  {
    id: 'base_ss',
    bajaConfianza: false,
    regexes: [
      /(?:BASE\s*S\.?\s*S\.?|BASE\s+SEGURIDAD\s+SOCIAL|BASE\s+CC|B\.?\s*C\.?\s*C\.?)[^\d]{0,180}(\d{1,3}(?:\.\d{3})*,\d{2})/i,
    ],
  },
  {
    id: 'base_cotizacion',
    bajaConfianza: false,
    regexes: [
      /(?:BASE(?:S)?\s+DE\s+COTIZACI[ÓO]N(?:\s+POR\s+CONTINGENCIAS\s+COMUNES)?)[^\d]{0,180}(\d{1,3}(?:\.\d{3})*,\d{2})/i,
    ],
  },
  {
    id: 't_devengado',
    bajaConfianza: true,
    regexes: [
      /(?:T\.?\s*DEVENGAD(?:O|OS)|TOTAL\s+DEVENGAD(?:O|OS)|TOTAL\s+DEVENGO)[^\d]{0,180}(\d{1,3}(?:\.\d{3})*,\d{2})/i,
    ],
  },
  {
    id: 'liquido_percibir',
    bajaConfianza: true,
    regexes: [
      /(?:L[ÍI]QUIDO\s+A\s+PERCIBIR|NETO\s+A\s+PERCIBIR)[^\d]{0,180}(\d{1,3}(?:\.\d{3})*,\d{2})/i,
    ],
  },
]

const FUENTES_QUE_INCLUYEN_VARIABLE = new Set<FuenteSalarioNomina>([
  'rem_total',
  'base_ss',
  'base_cotizacion',
  't_devengado',
  'liquido_percibir',
  'fallback',
])

export function normalizarTextoDocumento(texto: string): string {
  return texto.replace(/\s+/g, ' ').trim()
}

export function extraerDatosNominaDesdeTexto(texto: string): DatosExtraidosNomina {
  const textoNormalizado = normalizarTextoDocumento(texto)
  const analisisNomina = evaluarSiEsNomina(textoNormalizado)

  const extraido: DatosExtraidosNomina = {
    salarioBrutoMensual: 2000,
    fechaAntiguedad: '2020-01-01',
    pagasExtraProrrateadas: false,
    comisionesDetectadas: 0,
    irpfDetectado: 15,
    baseCotizacionEstimada: 0,
    deteccion: {
      salario: false,
      fechaAntiguedad: false,
      prorrateo: false,
      irpf: false,
      comisiones: false,
    },
    fuenteSalario: 'default',
    salarioBajaConfianza: false,
    camposNoDetectados: [],
    textoNormalizado,
    analisisNomina,
  }

  const antiguedadRegex =
    /(?:ANTIGUEDA\s*D|ANTIG[UÜ]EDAD|FECHA ALTA)[\s\S]{1,100}?(\d{1,2})\s+(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|OCT|NOV|DIC)\s+(\d{2,4})/i
  const antiguedadMatch = textoNormalizado.match(antiguedadRegex)
  if (antiguedadMatch) {
    const day = antiguedadMatch[1].padStart(2, '0')
    const monthNames: Record<string, string> = {
      ENE: '01',
      FEB: '02',
      MAR: '03',
      ABR: '04',
      MAY: '05',
      JUN: '06',
      JUL: '07',
      AGO: '08',
      SEP: '09',
      OCT: '10',
      NOV: '11',
      DIC: '12',
    }
    const month = monthNames[antiguedadMatch[2].toUpperCase()]
    const year = normalizarAnoNomina(antiguedadMatch[3])

    if (month && year) {
      extraido.fechaAntiguedad = `${year}-${month}-${day}`
      extraido.deteccion.fechaAntiguedad = true
    }
  }

  const prorrataPositiva = /(?:PAGAS?\s+EXTRAS?|P\.P\.EXTRAS?|PRORRATA)/i.test(textoNormalizado)
  const prorrataNegativa =
    /(?:14\s+PAGAS|NO\s+PRORRATEAD(?:A|AS)|PAGAS?\s+EXTRAS?\s+NO\s+PRORRATEADAS)/i.test(
      textoNormalizado,
    )
  if (prorrataPositiva && !prorrataNegativa) {
    extraido.pagasExtraProrrateadas = true
    extraido.deteccion.prorrateo = true
  } else if (prorrataNegativa) {
    extraido.pagasExtraProrrateadas = false
    extraido.deteccion.prorrateo = true
  }

  const comisionRegex =
    /(?:COMISI[OÓ]N(?:ES)?|INCENTIVO(?:S)?|BONUS)[^\d]{1,15}(\d{1,3}(?:\.\d{3})*,\d{2})/i
  const comisionMatch = textoNormalizado.match(comisionRegex)
  if (comisionMatch) {
    extraido.comisionesDetectadas = parseImporteNomina(comisionMatch[1])
    extraido.deteccion.comisiones = true
  }

  const irpfRegex = /I\.?R\.?P\.?F\.?[^\d]{0,5}(\d{1,2}(?:,\d{1,2})?)/i
  const irpfMatch = textoNormalizado.match(irpfRegex)
  if (irpfMatch) {
    extraido.irpfDetectado = Number.parseFloat(irpfMatch[1].replace(',', '.'))
    extraido.deteccion.irpf = true
  }

  for (const fuente of FUENTES_SALARIO) {
    for (const salarioRegex of fuente.regexes) {
      const salarioMatch = textoNormalizado.match(salarioRegex)
      if (!salarioMatch) {
        continue
      }

      const candidatoSalario = parseImporteNomina(salarioMatch[1])
      if (
        !Number.isFinite(candidatoSalario) ||
        candidatoSalario < 450 ||
        candidatoSalario > 50000
      ) {
        continue
      }

      extraido.salarioBrutoMensual = candidatoSalario
      extraido.deteccion.salario = true
      extraido.fuenteSalario = fuente.id
      extraido.salarioBajaConfianza = fuente.bajaConfianza
      break
    }

    if (extraido.deteccion.salario) {
      break
    }
  }

  const importes = [...textoNormalizado.matchAll(/\b(\d{1,3}(?:\.\d{3})*,\d{2})\b/g)].map((match) =>
    parseImporteNomina(match[1]),
  )
  const importesUnicos = [...new Set(importes)].filter((valor) => valor > 500)
  const frecuenciaImportes = new Map<string, number>()
  importes.forEach((valor) => {
    if (!Number.isFinite(valor) || valor <= 500) {
      return
    }

    const key = valor.toFixed(2)
    frecuenciaImportes.set(key, (frecuenciaImportes.get(key) || 0) + 1)
  })

  if (!extraido.deteccion.salario && importesUnicos.length > 0) {
    importesUnicos.sort((a, b) => b - a)
    const valoresOrdenados = /COSTE EMPRESA/i.test(textoNormalizado)
      ? importesUnicos.slice(1)
      : importesUnicos

    const candidatoRecurrente = [...frecuenciaImportes.entries()]
      .map(([valor, repeticiones]) => ({ valor: Number.parseFloat(valor), repeticiones }))
      .filter((item) => item.valor >= 700 && item.valor <= 15000 && item.repeticiones >= 2)
      .sort((a, b) => b.repeticiones - a.repeticiones || b.valor - a.valor)[0]

    const candidatoFallback =
      candidatoRecurrente?.valor ||
      valoresOrdenados.find((valor) => valor >= 700 && valor <= 15000) ||
      valoresOrdenados[0] ||
      importesUnicos[0]

    if (Number.isFinite(candidatoFallback)) {
      extraido.salarioBrutoMensual = candidatoFallback
      extraido.deteccion.salario = true
      extraido.fuenteSalario = 'fallback'
      extraido.salarioBajaConfianza = true
    }
  }

  if (
    extraido.comisionesDetectadas > 0 &&
    FUENTES_QUE_INCLUYEN_VARIABLE.has(extraido.fuenteSalario) &&
    extraido.salarioBrutoMensual > extraido.comisionesDetectadas
  ) {
    extraido.salarioBrutoMensual -= extraido.comisionesDetectadas
  }

  const salarioTotalMensualizado = extraido.salarioBrutoMensual + extraido.comisionesDetectadas
  const baseSeguridadSocialEstimada = extraido.pagasExtraProrrateadas
    ? salarioTotalMensualizado
    : salarioTotalMensualizado + (extraido.salarioBrutoMensual * 2) / 12

  extraido.baseCotizacionEstimada = Math.min(
    baseSeguridadSocialEstimada,
    TOPES_LEGALES.seguridadSocial.baseMaximaMensualCotizacion,
  )

  if (!extraido.deteccion.salario) {
    extraido.camposNoDetectados.push('Salario fijo mensual')
  }

  if (extraido.salarioBajaConfianza) {
    extraido.camposNoDetectados.push(
      'Salario detectado con baja confianza (revisa el importe mensual).',
    )
  }

  if (!extraido.deteccion.fechaAntiguedad) {
    extraido.camposNoDetectados.push('Fecha de inicio (antigüedad)')
  }

  if (!extraido.deteccion.prorrateo) {
    extraido.camposNoDetectados.push('Pagas extra prorrateadas (12/14 pagas)')
  }

  if (!extraido.deteccion.irpf) {
    extraido.camposNoDetectados.push('Porcentaje de IRPF')
  }

  return extraido
}
