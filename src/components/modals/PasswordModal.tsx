import { Lock } from 'lucide-react'

import { ModalShell } from './ModalShell'

interface PasswordModalProps {
  open: boolean
  password: string
  error: string
  submitting: boolean
  onChange: (value: string) => void
  onCancel: () => void
  onSubmit: () => void
}

export function PasswordModal({
  open,
  password,
  error,
  submitting,
  onChange,
  onCancel,
  onSubmit,
}: PasswordModalProps) {
  return (
    <ModalShell
      open={open}
      titleId="password-modal-title"
      maxWidthClass="sm:max-w-md"
      onRequestClose={onCancel}
    >
      <div data-testid="password-modal">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <Lock className="h-6 w-6 text-yellow-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg font-bold leading-6 text-gray-900" id="password-modal-title">
            Nómina Protegida con Contraseña
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Este archivo ZIP está bloqueado. Generalmente, la gestoría usa tu <b>DNI o NIE</b>{' '}
              (con letra mayúscula) como contraseña.
            </p>
          </div>
          <form
            className="mt-4"
            onSubmit={(event) => {
              event.preventDefault()
              onSubmit()
            }}
          >
            <input
              data-autofocus
              type="password"
              id="zip-password-input"
              name="zip_access_key"
              className="block w-full rounded-md border border-gray-300 p-3 text-center font-mono text-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="Ej: 12345678Z"
              value={password}
              onChange={(event) => onChange(event.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              data-bwignore="true"
              data-1p-ignore="true"
              data-lpignore="true"
            />
            {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
          </form>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
        >
          Cancelar
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={onSubmit}
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm"
        >
          {submitting ? 'Desbloqueando...' : 'Desbloquear Archivo'}
        </button>
      </div>
    </ModalShell>
  )
}
