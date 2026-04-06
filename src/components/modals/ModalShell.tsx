import { useEffect, useRef } from 'react'
import type { PropsWithChildren } from 'react'

interface ModalShellProps extends PropsWithChildren {
  open: boolean
  titleId: string
  maxWidthClass?: string
  onRequestClose?: () => void
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function ModalShell({
  open,
  titleId,
  maxWidthClass = 'sm:max-w-md',
  onRequestClose,
  children,
}: ModalShellProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const dialogElement = dialogRef.current
    const focusables = dialogElement?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    const target = dialogElement?.querySelector<HTMLElement>('[data-autofocus]') || focusables?.[0]

    window.requestAnimationFrame(() => {
      target?.focus({ preventScroll: true })
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onRequestClose?.()
        return
      }

      if (event.key !== 'Tab' || !dialogElement) {
        return
      }

      const nodes = dialogElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (!nodes.length) {
        return
      }

      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus({ preventScroll: true })
    }
  }, [open, onRequestClose])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-10 overflow-y-auto"
      aria-labelledby={titleId}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm" aria-hidden="true" />
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
          &#8203;
        </span>
        <div
          ref={dialogRef}
          className={`inline-block w-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:align-middle sm:p-6 ${maxWidthClass}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
