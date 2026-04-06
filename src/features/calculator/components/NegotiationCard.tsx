import { Info, TrendingUp } from 'lucide-react'

import type { FormularioCalculadora, ResumenLiquidacion } from '@/domain/tipos'
import { formatearMoneda } from '@/lib/numeros'

interface NegotiationCardProps {
  form: FormularioCalculadora
  resumen: ResumenLiquidacion
  onFieldChange: <K extends keyof FormularioCalculadora>(
    field: K,
    value: FormularioCalculadora[K],
  ) => void
}

export function NegotiationCard({ form, resumen, onFieldChange }: NegotiationCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="rounded-t-2xl border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="flex items-center text-lg font-semibold text-gray-800">
          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-sm text-white">
            3
          </span>
          Escenario de Negociación (ERE)
        </h2>
      </div>
      <div className="space-y-6 p-6">
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-sm">
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div className="pr-4">
              <h3 className="mb-1 flex items-center text-base font-bold text-emerald-900">
                Tu peso en la negociación
              </h3>
              <p className="text-sm leading-relaxed text-emerald-800">
                Por cada <b>día extra por año</b> que se logre subir en el acuerdo del ERE, tu
                indemnización total aumentará en:
              </p>
            </div>
            <div className="mt-4 flex items-center justify-center rounded-lg border border-emerald-100 bg-white px-4 py-3 text-right shadow-sm sm:mt-0">
              <TrendingUp className="mr-3 h-5 w-5 text-emerald-500" aria-hidden="true" />
              <span className="text-3xl font-black text-emerald-600">
                {formatearMoneda(resumen.indemnizacion.valorPorDiaNegociacion)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="relative mb-1 flex justify-between">
            <label
              className="flex items-center text-sm font-medium text-gray-700"
              htmlFor="slider-dias"
            >
              Indemnización (Días por año trabajado)
              <span className="group relative ml-2 flex items-center">
                <Info className="h-4 w-4 cursor-help text-blue-400 transition-colors hover:text-blue-600" />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-xl group-hover:block">
                  <p className="mb-1 font-semibold">Días por año trabajado</p>
                  <p className="text-gray-300">
                    En un ERE (causas objetivas) el mínimo legal asegurado son 20 días. El despido
                    improcedente se abona a 33 días.
                  </p>
                </span>
              </span>
            </label>
            <span className="text-sm font-bold text-blue-600">{form.diasIndemnizacion} días</span>
          </div>
          <input
            type="range"
            id="slider-dias"
            min="20"
            max="33"
            value={form.diasIndemnizacion}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            onChange={(event) => onFieldChange('diasIndemnizacion', event.target.value)}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>Mínimo Legal (20)</span>
            <span>Improcedente (33)</span>
          </div>
        </div>

        <div>
          <div className="relative mb-1 flex justify-between">
            <label
              className="flex items-center text-sm font-medium text-gray-700"
              htmlFor="slider-topes"
            >
              Tope máximo (Mensualidades)
              <span className="group relative ml-2 flex items-center">
                <Info className="h-4 w-4 cursor-help text-blue-400 transition-colors hover:text-blue-600" />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-xl group-hover:block">
                  <p className="mb-1 font-semibold">Límite de la indemnización</p>
                  <p className="text-gray-300">
                    El ERE impone un límite de 12 mensualidades a cobrar. Un acuerdo puede ampliar
                    este límite hasta las 24 mensualidades.
                  </p>
                </span>
              </span>
            </label>
            <span className="text-sm font-bold text-blue-600">{form.topeMensualidades} meses</span>
          </div>
          <input
            type="range"
            id="slider-topes"
            min="12"
            max="24"
            value={form.topeMensualidades}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            onChange={(event) => onFieldChange('topeMensualidades', event.target.value)}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>ERE Objetivo (12)</span>
            <span>Máximo Legal (24)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
