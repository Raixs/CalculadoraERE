import type { RefObject } from 'react'

import type { FormularioCalculadora, ModoEntrada, ResumenLiquidacion } from '@/domain/tipos'
import { ContractDataCard } from './ContractDataCard'
import { DismissalConditionsCard } from './DismissalConditionsCard'
import { ExtractionWarningBanner } from './ExtractionWarningBanner'
import { ManualEntryBanner } from './ManualEntryBanner'
import { NegotiationCard } from './NegotiationCard'
import { ResultsPanel } from './ResultsPanel'
import { UnemploymentCard } from './UnemploymentCard'

interface CalculatorSectionProps {
  sectionRef: RefObject<HTMLDivElement | null>
  resultsRef: RefObject<HTMLDivElement | null>
  salaryInputRef: RefObject<HTMLInputElement | null>
  form: FormularioCalculadora
  entryMode: ModoEntrada
  extractionWarnings: string[]
  resumen: ResumenLiquidacion
  onFieldChange: <K extends keyof FormularioCalculadora>(
    field: K,
    value: FormularioCalculadora[K],
  ) => void
  onPreavisoChange: (value: FormularioCalculadora['seleccionPreaviso']) => void
  onReset: () => void
}

export function CalculatorSection({
  sectionRef,
  resultsRef,
  salaryInputRef,
  form,
  entryMode,
  extractionWarnings,
  resumen,
  onFieldChange,
  onPreavisoChange,
  onReset,
}: CalculatorSectionProps) {
  const inputsOrderClass = entryMode === 'manual' ? 'order-1' : 'order-2'
  const resultsOrderClass = entryMode === 'manual' ? 'order-2' : 'order-1'

  return (
    <div
      ref={sectionRef}
      id="calculator-section"
      className="grid grid-cols-1 gap-8 lg:grid-cols-12"
    >
      {entryMode === 'manual' ? <ManualEntryBanner /> : null}
      {entryMode === 'file' ? <ExtractionWarningBanner warnings={extractionWarnings} /> : null}

      <div className={`${inputsOrderClass} space-y-6 lg:order-1 lg:col-span-7`}>
        <ContractDataCard
          form={form}
          entryMode={entryMode}
          salaryInputRef={salaryInputRef}
          onFieldChange={onFieldChange}
        />
        <DismissalConditionsCard
          form={form}
          onFieldChange={onFieldChange}
          onPreavisoChange={onPreavisoChange}
        />
        <NegotiationCard form={form} resumen={resumen} onFieldChange={onFieldChange} />
        <UnemploymentCard form={form} entryMode={entryMode} onFieldChange={onFieldChange} />
      </div>

      <div className={`${resultsOrderClass} lg:order-2 lg:col-span-5`}>
        <ResultsPanel form={form} resumen={resumen} panelRef={resultsRef} onReset={onReset} />
      </div>
    </div>
  )
}
