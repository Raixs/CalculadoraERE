import type { RefObject } from 'react'
import { Building2, CircleAlert, CircleCheck, RefreshCcw, SlidersHorizontal } from 'lucide-react'

import { obtenerEtiquetaHijos, obtenerEtiquetaTiempoCotizado } from '@/content/opciones'
import type { FormularioCalculadora, ResumenLiquidacion } from '@/domain/tipos'
import { formatearAntiguedad } from '@/lib/fechas'
import { formatearMoneda, formatearPorcentaje } from '@/lib/numeros'

interface ResultsPanelProps {
  form: FormularioCalculadora
  resumen: ResumenLiquidacion
  panelRef: RefObject<HTMLDivElement | null>
  onReset: () => void
}

function renderParoMessage(resumen: ResumenLiquidacion) {
  const { paro, topesLegales } = resumen

  if (paro.estado === 'sin-base') {
    return (
      <div className="mt-3 block rounded-lg border border-cyan-800 bg-cyan-950/50 p-2.5 text-xs leading-relaxed text-cyan-300">
        <CircleAlert className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Introduce tu base de
        cotización media de los últimos 180 días para estimar el paro. Mientras esté vacía o a 0, no
        aplicamos mínimos legales para evitar un resultado engañoso.
      </div>
    )
  }

  if (paro.maximoAplicado) {
    return (
      <div className="mt-3 block rounded-lg border border-yellow-700/50 bg-yellow-900/30 p-2.5 text-xs leading-relaxed text-yellow-300">
        <CircleAlert className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />{' '}
        <b>Tope máximo aplicado:</b> Tu prestación supera el límite legal{' '}
        {topesLegales.desempleo.anoReferencia}.{' '}
        {paro.hijosACargo === 0
          ? 'Tener hijos elevaría este tope máximo.'
          : 'Tener hijos ya ha elevado este tope, pero no puedes cobrar más de esta cantidad mensual.'}
      </div>
    )
  }

  if (paro.minimoAplicado) {
    return (
      <div className="mt-3 block rounded-lg border border-emerald-700/50 bg-emerald-900/30 p-2.5 text-xs leading-relaxed text-emerald-300">
        <CircleAlert className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />{' '}
        <b>Tope mínimo aplicado:</b> El SEPE garantiza un importe mínimo mensual{' '}
        {topesLegales.desempleo.anoReferencia} según los hijos a cargo, por lo que tu prestación se
        ha elevado a este mínimo legal.
      </div>
    )
  }

  if (paro.hijosACargo > 0) {
    return (
      <div className="mt-3 block rounded-lg border border-cyan-800 bg-cyan-950/50 p-2.5 text-xs leading-relaxed text-cyan-300">
        <CircleAlert className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Percibes tu
        porcentaje íntegro (70%/60%). Tener hijos sube los{' '}
        <b>topes máximos legales {topesLegales.desempleo.anoReferencia}</b>
        del SEPE, pero como tu base no los sobrepasa, esta variable no modifica tu prestación final.
      </div>
    )
  }

  return null
}

export function ResultsPanel({ form, resumen, panelRef, onReset }: ResultsPanelProps) {
  const tiempoCotizado = obtenerEtiquetaTiempoCotizado(form.tiempoCotizadoMeses)
    .split('(')[0]
    .trim()
  const hijos = obtenerEtiquetaHijos(form.hijosACargo).toLowerCase()
  const paroBadgeClass =
    resumen.paro.estado === 'sin-derecho'
      ? 'border-red-600 bg-red-800 text-cyan-100'
      : 'border-cyan-600 bg-cyan-800 text-cyan-100'

  return (
    <div ref={panelRef} tabIndex={-1} className="space-y-6 lg:col-span-5">
      <div className="sticky top-6 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 text-white shadow-lg">
        <div className="p-6">
          <h2 className="mb-6 text-xl font-bold">Resumen de Liquidación</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-700 pb-4">
              <p className="text-sm text-gray-400">Salario Bruto Anual Computable</p>
              <span data-testid="result-salario-anual" className="text-lg font-semibold">
                {formatearMoneda(resumen.salarioAnual)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-700 pb-4">
              <p className="text-sm text-gray-400">Antigüedad Computable</p>
              <span className="text-lg font-semibold">
                {formatearAntiguedad(resumen.antiguedad)}
              </span>
            </div>
            <div className="pt-2">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-base font-medium text-blue-400">1. Indemnización ERE</p>
                <span
                  data-testid="result-indemnizacion"
                  className="text-xl font-bold text-blue-400"
                >
                  {formatearMoneda(resumen.indemnizacion.importeFinal)}
                </span>
              </div>
              {resumen.indemnizacion.topado ? (
                <p className="text-xs text-yellow-500">
                  <CircleAlert className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Topado a{' '}
                  {form.topeMensualidades} mensualidades
                </p>
              ) : null}
            </div>
            <div className="pt-2">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-base font-medium text-orange-400">2. Finiquito Ordinario</p>
                <span className="text-xl font-bold text-orange-400">
                  {formatearMoneda(resumen.finiquito.total)}
                </span>
              </div>
              <ul className="mt-2 space-y-1 pl-2 text-xs text-gray-400">
                <li className="flex justify-between">
                  <span>Vacaciones no disfrutadas:</span>
                  <span>{formatearMoneda(resumen.finiquito.vacaciones)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Falta de preaviso:</span>
                  <span>{formatearMoneda(resumen.finiquito.preaviso)}</span>
                </li>
                {!form.pagasExtraProrrateadas ? (
                  <li className="flex justify-between">
                    <span>Pagas extra pendientes:</span>
                    <span>{formatearMoneda(resumen.finiquito.pagasExtra)}</span>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6">
          <div className="mb-4 space-y-3 border-b border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-400">Total Bruto Estimado</p>
              <span className="text-lg font-bold text-gray-300">
                {formatearMoneda(resumen.totales.bruto)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-red-400">
                IRPF ({formatearPorcentaje(Number(form.irpf))}% sobre Finiquito)
              </p>
              <span className="text-lg font-bold text-red-400">
                - {formatearMoneda(resumen.totales.retencionIrpf)}
              </span>
            </div>
            {resumen.finiquito.total === 0 ? (
              <div className="mt-2 rounded-lg border border-gray-600 bg-gray-700/50 p-3">
                <p className="text-xs leading-relaxed text-gray-300">
                  <CircleCheck
                    className="mr-1 inline h-3.5 w-3.5 text-green-400"
                    aria-hidden="true"
                  />{' '}
                  Tu finiquito ordinario es <b>0,00 €</b>. Como la indemnización ERE está exenta por
                  ley,
                  <b> no se te retiene nada de IRPF</b>.
                </p>
              </div>
            ) : null}
          </div>

          <p className="mb-1 text-sm font-medium text-emerald-100">
            <Building2 className="mr-1 inline h-4 w-4" aria-hidden="true" /> Total NETO (Al banco)
          </p>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-extrabold text-emerald-400">
              <span data-testid="result-total-neto">{formatearMoneda(resumen.totales.neto)}</span>
            </span>
          </div>
        </div>

        <div className="border-t-2 border-cyan-700 bg-cyan-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold uppercase tracking-wider text-cyan-200">
              Prestación SEPE (Paro)
            </p>
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${paroBadgeClass}`}>
              {resumen.paro.estado === 'sin-derecho'
                ? 'Sin derecho'
                : `${resumen.paro.meses} meses`}
            </span>
          </div>

          {resumen.paro.estado === 'sin-derecho' ? (
            <div>
              <p className="rounded-lg border border-red-800/50 bg-red-900/30 p-3 text-sm text-red-300">
                <CircleAlert className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Al no tener
                360 días cotizados, no tienes derecho a prestación contributiva. Consulta los
                subsidios del SEPE.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg border border-cyan-800 bg-cyan-950/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cyan-100">Primeros 6 meses</span>
                  <span className="text-lg font-bold text-white">
                    {formatearMoneda(resumen.paro.primerTramo)}{' '}
                    <span className="text-xs font-normal text-cyan-400">/mes</span>
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-cyan-800 bg-cyan-950/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cyan-100">Del mes 7 en adelante</span>
                  <span className="text-lg font-bold text-white">
                    {formatearMoneda(resumen.paro.segundoTramo)}{' '}
                    <span className="text-xs font-normal text-cyan-400">/mes</span>
                  </span>
                </div>
              </div>

              {renderParoMessage(resumen)}

              <div className="mt-3 flex items-start rounded border border-cyan-700/50 bg-cyan-800/40 p-2.5">
                <SlidersHorizontal
                  className="mr-2 mt-0.5 h-4 w-4 text-cyan-400"
                  aria-hidden="true"
                />
                <p className="text-xs leading-snug text-cyan-100">
                  Cálculo asumiendo <b className="text-white">{tiempoCotizado}</b> cotizados y{' '}
                  <b className="text-white">{hijos}</b>.
                  <a
                    href="#seccion-paro"
                    className="ml-1 font-medium text-cyan-400 underline transition-colors hover:text-white"
                  >
                    Ajustar mis datos
                  </a>
                </p>
              </div>
            </div>
          )}

          <p className="mt-4 text-[10px] leading-tight text-cyan-500">
            * Cifras brutas aproximadas. El SEPE retendrá un mínimo de IRPF (2%) y una pequeña cuota
            de Seguridad Social.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <RefreshCcw className="mr-2 inline h-4 w-4" aria-hidden="true" /> Calcular otro documento
      </button>
    </div>
  )
}
