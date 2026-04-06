import { TriangleAlert } from 'lucide-react'

interface ExtractionWarningBannerProps {
  warnings: string[]
}

export function ExtractionWarningBanner({ warnings }: ExtractionWarningBannerProps) {
  if (!warnings.length) {
    return null
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 lg:col-span-12">
      <p className="text-sm leading-relaxed text-amber-900">
        <TriangleAlert className="mr-2 inline h-4 w-4 text-amber-600" aria-hidden="true" />
        No hemos podido leer automáticamente todos los campos. Revisa estos datos antes de usar el
        resultado final:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-amber-900">
        {warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
    </div>
  )
}
