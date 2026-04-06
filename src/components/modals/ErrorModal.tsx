import { TriangleAlert } from 'lucide-react'

import { ModalShell } from './ModalShell'

interface ErrorModalProps {
  open: boolean
  title: string
  message: string
  allowManual: boolean
  onRetry: () => void
  onContinue: () => void
}

export function ErrorModal({
  open,
  title,
  message,
  allowManual,
  onRetry,
  onContinue,
}: ErrorModalProps) {
  return (
    <ModalShell open={open} titleId="error-modal-title" maxWidthClass="sm:max-w-sm">
      <div data-testid="error-modal">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <TriangleAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900" id="error-modal-title">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2">
        <button
          data-autofocus
          type="button"
          onClick={onRetry}
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none sm:text-sm"
        >
          Reintentar Escaneo
        </button>
        {allowManual ? (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:text-sm"
          >
            Continuar sin escaneo
          </button>
        ) : null}
      </div>
    </ModalShell>
  )
}
