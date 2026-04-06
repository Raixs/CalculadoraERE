import type { RefObject } from 'react'
import { CircleCheck, Keyboard } from 'lucide-react'

import type { FormularioCalculadora, ModoEntrada } from '@/domain/tipos'

interface ContractDataCardProps {
  form: FormularioCalculadora
  entryMode: ModoEntrada
  salaryInputRef: RefObject<HTMLInputElement | null>
  onFieldChange: <K extends keyof FormularioCalculadora>(
    field: K,
    value: FormularioCalculadora[K],
  ) => void
}

export function ContractDataCard({
  form,
  entryMode,
  salaryInputRef,
  onFieldChange,
}: ContractDataCardProps) {
  const isManualMode = entryMode === 'manual'

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-6 py-4">
        <h2 className="flex items-center text-lg font-semibold text-blue-900">
          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
            1
          </span>
          Datos de tu Contrato
        </h2>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isManualMode ? 'bg-cyan-100 text-cyan-800' : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {isManualMode ? (
            <Keyboard className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <CircleCheck className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          )}
          {isManualMode ? 'Introducidos manualmente' : 'Extraídos automáticamente'}
        </span>
      </div>
      <div className="space-y-5 p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="input-salario">
              Salario Fijo Mensual
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
              <input
                ref={salaryInputRef}
                type="number"
                step="any"
                id="input-salario"
                className="block w-full rounded-md border border-gray-300 p-2.5 pl-8 text-sm focus:border-blue-500 focus:ring-blue-500"
                value={form.salarioMensual}
                onChange={(event) => onFieldChange('salarioMensual', event.target.value)}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Sueldo base + complementos fijos.</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="input-fecha">
              Fecha de inicio (Antigüedad)
            </label>
            <input
              type="date"
              id="input-fecha"
              className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.fechaAntiguedad}
              onChange={(event) => onFieldChange('fechaAntiguedad', event.target.value)}
            />
          </div>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
          <label
            className="mb-1 block text-sm font-medium text-blue-900"
            htmlFor="input-comisiones"
          >
            Promedio de Comisiones / Bonus (últimos 12 meses)
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-sm text-blue-500">€ / mes</span>
            </div>
            <input
              type="number"
              step="any"
              id="input-comisiones"
              className="block w-full rounded-md border border-blue-200 bg-white p-2.5 pl-16 text-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.comisionesMensuales}
              onChange={(event) => onFieldChange('comisionesMensuales', event.target.value)}
            />
          </div>
          <p className="mt-2 text-xs text-blue-700">
            <b>Importante:</b> La ley exige calcular el despido basándose en la media mensual de tus
            variables del último año.
          </p>
        </div>

        <div className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-3">
          <input
            id="input-prorrateo"
            type="checkbox"
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={form.pagasExtraProrrateadas}
            onChange={(event) => onFieldChange('pagasExtraProrrateadas', event.target.checked)}
          />
          <label htmlFor="input-prorrateo" className="ml-3 block text-sm text-gray-800">
            <span className="font-medium">Pagas extra prorrateadas</span>
            <br />
            <span className="text-xs text-gray-500">
              Desmarca esta casilla si cobras 14 pagas al año (Navidad, Verano).
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
