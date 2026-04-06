import type { FormularioCalculadora } from '@/domain/tipos'

interface DismissalConditionsCardProps {
  form: FormularioCalculadora
  onFieldChange: <K extends keyof FormularioCalculadora>(
    field: K,
    value: FormularioCalculadora[K],
  ) => void
  onPreavisoChange: (value: FormularioCalculadora['seleccionPreaviso']) => void
}

export function DismissalConditionsCard({
  form,
  onFieldChange,
  onPreavisoChange,
}: DismissalConditionsCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-orange-100 bg-orange-50 px-6 py-4">
        <h2 className="flex items-center text-lg font-semibold text-orange-900">
          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-sm text-white">
            2
          </span>
          Condiciones del Despido (Finiquito)
        </h2>
      </div>
      <div className="space-y-5 p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="input-fecha-despido"
            >
              Fecha efectiva del despido
            </label>
            <input
              type="date"
              id="input-fecha-despido"
              className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500"
              value={form.fechaDespido}
              onChange={(event) => onFieldChange('fechaDespido', event.target.value)}
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="input-vacaciones"
            >
              ¿Días de vacaciones pendientes?
            </label>
            <div className="relative">
              <input
                type="number"
                id="input-vacaciones"
                min="0"
                className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500"
                value={form.vacacionesPendientes}
                onChange={(event) => onFieldChange('vacacionesPendientes', event.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">días</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 border-t border-gray-100 pt-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="select-preaviso"
            >
              ¿La empresa te ha dado los 15 días de preaviso legal?
            </label>
            <select
              id="select-preaviso"
              className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500"
              value={form.seleccionPreaviso}
              onChange={(event) =>
                onPreavisoChange(event.target.value as FormularioCalculadora['seleccionPreaviso'])
              }
            >
              <option value="0">Sí, me han avisado con tiempo (No te deben nada)</option>
              <option value="15">No, me despiden hoy mismo (Te deben pagar 15 días)</option>
              <option value="custom">Me han avisado, pero con menos de 15 días...</option>
            </select>

            {form.seleccionPreaviso === 'custom' ? (
              <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <label className="mb-1 block text-sm text-gray-700" htmlFor="input-preaviso">
                  ¿Cuántos días de preaviso <b>han faltado</b> para llegar a 15?
                </label>
                <input
                  type="number"
                  id="input-preaviso"
                  min="0"
                  max="15"
                  className="block w-full rounded-md border border-gray-300 p-2 text-sm"
                  value={form.diasPreavisoPendientes}
                  onChange={(event) => onFieldChange('diasPreavisoPendientes', event.target.value)}
                />
              </div>
            ) : null}
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="input-irpf">
              Retención de IRPF para tu finiquito
            </label>
            <p className="mb-3 text-xs text-gray-500">
              La indemnización no tributa, pero el finiquito sí. Calcularemos tu "Neto" en base a
              este porcentaje.
            </p>
            <div className="relative max-w-xs">
              <input
                type="number"
                step="any"
                id="input-irpf"
                min="0"
                max="100"
                className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-orange-500 focus:ring-orange-500"
                value={form.irpf}
                onChange={(event) => onFieldChange('irpf', event.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
