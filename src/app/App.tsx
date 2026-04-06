import { useEffect, useRef } from 'react'

import { FaqSection } from '@/components/content/FaqSection'
import { HowItWorksSection } from '@/components/content/HowItWorksSection'
import { HeroSection } from '@/components/layout/HeroSection'
import { TopNav } from '@/components/layout/TopNav'
import { ErrorModal } from '@/components/modals/ErrorModal'
import { PasswordModal } from '@/components/modals/PasswordModal'
import { LoadingSection } from '@/features/calculator/components/LoadingSection'
import { UploadSection } from '@/features/calculator/components/UploadSection'
import { CalculatorSection } from '@/features/calculator/components/CalculatorSection'
import { useCalculatorApp } from '@/features/calculator/hooks/useCalculatorApp'

export default function App() {
  const { state, resumen, actions } = useCalculatorApp()
  const uploadSectionRef = useRef<HTMLDivElement>(null)
  const calculatorSectionRef = useRef<HTMLDivElement>(null)
  const resultsPanelRef = useRef<HTMLDivElement>(null)
  const salaryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!state.ui.scrollIntent) {
      return
    }

    const scrollBehavior: ScrollBehavior = 'smooth'
    const isMobileLayout = window.innerWidth < 1024

    window.requestAnimationFrame(() => {
      if (state.ui.scrollIntent === 'upload') {
        uploadSectionRef.current?.scrollIntoView({ behavior: scrollBehavior, block: 'start' })
      }

      if (state.ui.scrollIntent === 'manual') {
        calculatorSectionRef.current?.scrollIntoView({ behavior: scrollBehavior, block: 'start' })
        salaryInputRef.current?.focus({ preventScroll: true })
      }

      if (state.ui.scrollIntent === 'results') {
        const target = isMobileLayout ? resultsPanelRef.current : calculatorSectionRef.current
        target?.scrollIntoView({ behavior: scrollBehavior, block: 'start' })

        if (isMobileLayout) {
          resultsPanelRef.current?.focus({ preventScroll: true })
        }
      }
    })

    actions.clearScrollIntent()
  }, [actions, state.ui.scrollIntent])

  return (
    <div className="flex min-h-screen flex-col text-gray-800 antialiased">
      <TopNav />

      <main className="mx-auto w-full max-w-6xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <HeroSection />

        {state.ui.view === 'upload' ? (
          <UploadSection
            sectionRef={uploadSectionRef}
            onFilesSelected={actions.handleFiles}
            onManualMode={actions.openManualMode}
            onPrepareFileMode={actions.prepareFileMode}
          />
        ) : null}

        {state.ui.view === 'loading' ? (
          <LoadingSection title={state.ui.loading.text} subtitle={state.ui.loading.subtext} />
        ) : null}

        {state.ui.view === 'calculator' ? (
          <CalculatorSection
            sectionRef={calculatorSectionRef}
            resultsRef={resultsPanelRef}
            salaryInputRef={salaryInputRef}
            form={state.form}
            entryMode={state.ui.entryMode}
            extractionWarnings={state.ui.extractionWarnings}
            resumen={resumen}
            onFieldChange={actions.updateField}
            onPreavisoChange={actions.setPreavisoSelection}
            onReset={actions.resetApp}
          />
        ) : null}

        <HowItWorksSection />
        <FaqSection />
      </main>

      <PasswordModal
        open={state.ui.passwordModal.open}
        password={state.ui.passwordModal.value}
        error={state.ui.passwordModal.error}
        submitting={state.ui.passwordModal.submitting}
        onChange={actions.setZipPassword}
        onCancel={actions.cancelZipPassword}
        onSubmit={actions.submitZipPassword}
      />

      <ErrorModal
        open={state.ui.errorModal.open}
        title={state.ui.errorModal.title || 'Error al leer el Documento'}
        message={state.ui.errorModal.message}
        allowManual={state.ui.errorModal.allowManual}
        onRetry={actions.closeErrorAndRetry}
        onContinue={actions.closeErrorAndProceed}
      />
    </div>
  )
}
