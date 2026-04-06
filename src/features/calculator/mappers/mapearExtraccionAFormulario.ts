import type { FormularioCalculadora } from '@/domain/tipos'
import type { DatosExtraidosNomina } from '@/features/document-processing/tipos'

export function mapearExtraccionAFormulario(
  formularioActual: FormularioCalculadora,
  datos: DatosExtraidosNomina,
): FormularioCalculadora {
  return {
    ...formularioActual,
    salarioMensual: datos.salarioBrutoMensual.toFixed(2),
    comisionesMensuales: datos.comisionesDetectadas.toFixed(2),
    fechaAntiguedad: datos.fechaAntiguedad,
    pagasExtraProrrateadas: datos.pagasExtraProrrateadas,
    irpf: String(datos.irpfDetectado),
    baseCotizacion: datos.baseCotizacionEstimada.toFixed(2),
  }
}
