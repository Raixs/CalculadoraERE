export function HeroSection() {
  return (
    <header className="mb-10 text-center">
      <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        Calcula tu indemnización, finiquito y paro
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
        Sube tu nómina o rellena los datos manualmente. Soportamos <b>PDF</b> o archivos{' '}
        <b>ZIP con contraseña</b>. Tu privacidad está garantizada: procesamos todo localmente en tu
        navegador.
      </p>
      <nav
        className="mt-6 flex flex-wrap items-center justify-center gap-3"
        aria-label="Atajos de contenido"
      >
        <a
          href="#upload-section"
          className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          Ir a la calculadora
        </a>
        <a
          href="#como-funciona"
          className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cómo funciona
        </a>
        <a
          href="#preguntas-frecuentes"
          className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Preguntas frecuentes
        </a>
      </nav>
    </header>
  )
}
