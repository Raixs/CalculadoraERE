import type { FormularioCalculadora, ModoEntrada } from '@/domain/tipos'
import { CircleAlert, Sparkles } from 'lucide-react'

import { OPCIONES_HIJOS, OPCIONES_TIEMPO_COTIZADO } from '@/content/opciones'

interface UnemploymentCardProps {
  form: FormularioCalculadora
  entryMode: ModoEntrada
  onFieldChange: <K extends keyof FormularioCalculadora>(
    field: K,
    value: FormularioCalculadora[K],
  ) => void
}

export function UnemploymentCard({ form, entryMode, onFieldChange }: UnemploymentCardProps) {
  const isManualMode = entryMode === 'manual'

  return (
    <div
      id="seccion-paro"
      className="scroll-mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="border-b border-cyan-100 bg-cyan-50 px-6 py-4">
        <h2 className="flex items-center text-lg font-semibold text-cyan-900">
          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-sm text-white">
            4
          </span>
          Prestación por Desempleo (Paro)
        </h2>
      </div>
      <div className="space-y-5 p-6">
        <p className="mb-4 text-sm text-gray-500">
          Para estimar cuánto tiempo y cuánto dinero cobrarás de paro (SEPE), necesitamos estos tres
          datos personales.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="select-tiempo-cotizado"
            >
              Tiempo cotizado en los últimos 6 años
            </label>
            <select
              id="select-tiempo-cotizado"
              className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-cyan-500 focus:ring-cyan-500"
              value={form.tiempoCotizadoMeses}
              onChange={(event) => onFieldChange('tiempoCotizadoMeses', event.target.value)}
            >
              {OPCIONES_TIEMPO_COTIZADO.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="select-hijos">
              Hijos a cargo (menores 26 años)
            </label>
            <select
              id="select-hijos"
              className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-cyan-500 focus:ring-cyan-500"
              value={form.hijosACargo}
              onChange={(event) =>
                onFieldChange(
                  'hijosACargo',
                  event.target.value as FormularioCalculadora['hijosACargo'],
                )
              }
            >
              {OPCIONES_HIJOS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Afecta al tope máximo que puedes cobrar.</p>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="input-base-cotizacion"
            >
              Base de Cotización (Últimos 6 meses)
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                id="input-base-cotizacion"
                className={`block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-cyan-500 focus:ring-cyan-500 ${
                  isManualMode ? 'bg-white' : 'bg-cyan-50/50'
                }`}
                value={form.baseCotizacion}
                onChange={(event) => onFieldChange('baseCotizacion', event.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {isManualMode ? (
                <>
                  <CircleAlert
                    className="mr-1 inline h-3.5 w-3.5 text-cyan-500"
                    aria-hidden="true"
                  />
                  Si no la sabes, usa una estimación. Para mayor precisión, vuelve al escaneo
                  automático con tu nómina.
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 inline h-3.5 w-3.5 text-cyan-500" aria-hidden="true" />
                  Calculada automáticamente de tu nómina.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
