import { ShieldCheck } from 'lucide-react'

export function TopNav() {
  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto h-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          <a href="./" className="flex items-center" aria-label="Inicio de CalculadoraERE">
            <ShieldCheck className="mr-3 h-8 w-8 text-emerald-600" aria-hidden="true" />
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Calculadora<span className="text-emerald-600">ERE</span>{' '}
              <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-800">
                100% Privado
              </span>
            </span>
          </a>
        </div>
      </div>
    </nav>
  )
}
