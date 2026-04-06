import { FileUp, Scale, UserRound } from 'lucide-react'

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="mt-16 space-y-8" aria-labelledby="como-funciona-title">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Calculadora laboral
            </p>
            <h2
              id="como-funciona-title"
              className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl"
            >
              Calculadora de ERE, finiquito e indemnización en España
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Esta herramienta te ayuda a estimar la indemnización por despido colectivo o acuerdo
              de ERE, el finiquito ordinario y la prestación por desempleo a partir de tu salario,
              antigüedad, variables salariales, vacaciones pendientes y base de cotización.
            </p>
            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Puedes usar el escaneo de nómina en PDF o ZIP con contraseña para ahorrar tiempo, o
              introducir los datos a mano si prefieres revisar cada campo manualmente. En ambos
              casos, el cálculo se hace en tu navegador para mantener la privacidad de tu
              documentación laboral.
            </p>
          </div>
          <aside className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <h3 className="text-lg font-semibold text-emerald-900">Qué calcula esta página</h3>
            <ul className="mt-4 space-y-3 text-sm text-emerald-900">
              <li>Indemnización por días por año trabajado y tope de mensualidades.</li>
              <li>Finiquito con vacaciones, pagas extra pendientes y falta de preaviso.</li>
              <li>Estimación del paro según cotización, hijos a cargo y topes SEPE.</li>
            </ul>
          </aside>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <FileUp aria-hidden="true" className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Escaneo de nómina local</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Si subes tu nómina, la calculadora intenta detectar salario fijo, fecha de antigüedad,
            IRPF y base de cotización. Esto acelera el cálculo inicial y reduce errores de
            transcripción.
          </p>
        </article>
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
            <Scale aria-hidden="true" className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Cálculo orientativo y editable
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Puedes ajustar los días por año trabajado, los topes de mensualidades, el preaviso o las
            pagas extra para simular distintos escenarios de negociación dentro de un ERE.
          </p>
        </article>
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
            <UserRound aria-hidden="true" className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Privacidad de tus datos</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            No necesitas enviar la nómina a un servidor externo. El tratamiento del PDF y el cálculo
            del ERE se hacen en el propio dispositivo, algo especialmente útil si manejas
            documentación sensible.
          </p>
        </article>
      </div>
    </section>
  )
}
