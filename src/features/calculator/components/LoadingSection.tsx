interface LoadingSectionProps {
  title: string
  subtitle: string
}

export function LoadingSection({ title, subtitle }: LoadingSectionProps) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />
      <h3 className="text-xl font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}
