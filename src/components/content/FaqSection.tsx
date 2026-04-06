import { Minus, Plus } from 'lucide-react'

import { FAQ_ITEMS } from '@/content/faq'

export function FaqSection() {
  return (
    <section
      id="preguntas-frecuentes"
      className="mt-16"
      aria-labelledby="preguntas-frecuentes-title"
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Ayuda rápida
          </p>
          <h2
            id="preguntas-frecuentes-title"
            className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl"
          >
            Preguntas frecuentes sobre ERE, finiquito y paro
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600">
            Estas respuestas resumen cómo interpretar el cálculo y qué datos conviene revisar antes
            de usar el resultado como referencia en una negociación o para preparar la
            documentación.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-gray-200 bg-gray-50 px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                {item.question}
                <Plus className="h-4 w-4 text-gray-400 group-open:hidden" aria-hidden="true" />
                <Minus
                  className="hidden h-4 w-4 text-gray-400 group-open:block"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
