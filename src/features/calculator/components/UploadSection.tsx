import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent, RefObject } from 'react'
import { Archive, FileText, Keyboard, Lightbulb, Lock, Pencil, Sparkles, Star } from 'lucide-react'

interface UploadSectionProps {
  sectionRef: RefObject<HTMLDivElement | null>
  onFilesSelected: (files: FileList | File[] | null | undefined) => void
  onManualMode: () => void
  onPrepareFileMode: () => void
}

export function UploadSection({
  sectionRef,
  onFilesSelected,
  onManualMode,
  onPrepareFileMode,
}: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fallbackInputRef = useRef<HTMLInputElement>(null)

  const isMobileDevice = useMemo(
    () => /android|iphone|ipad|ipod/i.test((navigator.userAgent || '').toLowerCase()),
    [],
  )

  const openFilePicker = () => {
    onPrepareFileMode()
    const targetInput = isMobileDevice ? fallbackInputRef.current : fileInputRef.current
    if (targetInput) {
      targetInput.value = ''
      targetInput.click()
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFilesSelected(event.target.files)
    event.target.value = ''
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openFilePicker()
    }
  }

  return (
    <div
      ref={sectionRef}
      id="upload-section"
      className="mx-auto grid max-w-6xl grid-cols-1 gap-6 smooth-transition lg:grid-cols-2"
    >
      <div className="relative rounded-2xl border-2 border-emerald-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          <Star className="mr-1 h-3.5 w-3.5" aria-hidden="true" /> Opción recomendada
        </span>
        <div
          className={`cursor-pointer rounded-xl border-2 border-dashed p-10 transition-colors hover:bg-gray-50 ${dragActive ? 'drag-active' : 'border-gray-300'}`}
          role="button"
          tabIndex={0}
          aria-label="Seleccionar nómina PDF o ZIP"
          aria-controls="file-input"
          onClick={openFilePicker}
          onKeyDown={handleKeyDown}
          onDragEnter={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setDragActive(true)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setDragActive(true)
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setDragActive(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setDragActive(false)
            onFilesSelected(event.dataTransfer.files)
          }}
        >
          <div className="mb-4 flex justify-center space-x-4">
            <FileText className="h-12 w-12 text-red-500" aria-hidden="true" />
            <Archive className="h-12 w-12 text-yellow-500" aria-hidden="true" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-gray-900">Sube tu nómina (PDF o ZIP)</h3>
          <p className="mb-4 text-sm text-gray-500">
            Arrastra y suelta tu archivo aquí, o haz clic para buscar
          </p>
          <p className="mb-3 text-xs text-emerald-700">
            Más rápido y más preciso: detectamos salario, fecha, IRPF y base de cotización
            automáticamente.
          </p>
          <div className="mb-2 inline-flex items-center justify-center rounded-md bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <Lock className="mr-2 h-3.5 w-3.5" aria-hidden="true" /> Procesamiento 100% Seguro y
            Local
          </div>
          <input
            ref={fileInputRef}
            type="file"
            id="file-input"
            data-testid="file-input"
            className="hidden"
            accept=".pdf,.zip,application/pdf,application/zip,application/x-zip-compressed"
            onChange={handleInputChange}
          />
          <input
            ref={fallbackInputRef}
            type="file"
            data-testid="file-input-fallback"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
        <button
          type="button"
          onClick={openFilePicker}
          className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-emerald-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 sm:w-auto"
        >
          <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" /> Escanear Nómina
        </button>
        {isMobileDevice ? (
          <p className="mt-3 text-xs text-gray-500">
            Si en móvil solo ves Foto/Vídeo, abre el menú del selector y elige <b>Archivos</b> o{' '}
            <b>Drive</b>.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div>
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
            <Keyboard className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Rellenar sin subir archivo</h3>
          <p className="mb-4 text-sm text-gray-600">
            Ideal si ahora no tienes la nómina a mano. Requiere introducir más datos manualmente.
          </p>
          <ul className="mb-5 space-y-2 text-sm text-gray-600">
            <li>Introduces salario, fechas y variables manualmente.</li>
            <li>Obtienes cálculo de indemnización, finiquito, neto y paro.</li>
            <li>Todo sigue siendo privado y local en tu navegador.</li>
          </ul>
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            <Lightbulb className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Si tienes la nómina
            disponible, el escaneo automático suele darte mejor precisión inicial.
          </p>
        </div>
        <button
          type="button"
          onClick={onManualMode}
          className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto"
        >
          <Pencil className="mr-2 h-4 w-4" aria-hidden="true" /> Continuar en Modo Manual
        </button>
        <p className="mt-3 text-xs text-gray-500">
          Podrás resetear y volver al modo de subida cuando quieras.
        </p>
      </div>
    </div>
  )
}
