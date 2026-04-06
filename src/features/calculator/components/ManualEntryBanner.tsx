import { Pencil } from 'lucide-react'

export function ManualEntryBanner() {
  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 lg:col-span-12">
      <p className="text-sm leading-relaxed text-cyan-900">
        <Pencil className="mr-2 inline h-4 w-4 text-cyan-600" aria-hidden="true" />
        Estás en modo manual. Completa tus datos y verás el cálculo al instante. Si tienes tu nómina
        en PDF/ZIP, el escaneo automático suele darte mayor precisión inicial.
      </p>
    </div>
  )
}
