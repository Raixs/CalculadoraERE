# CalculadoraERE

Aplicación estática para calcular indemnización por ERE, finiquito y prestación por desempleo a partir de datos manuales o de una nómina en PDF o ZIP con contraseña. Todo el procesamiento ocurre en el navegador: no hay backend y no se suben archivos del usuario a ningún servidor.

## Stack

- React
- TypeScript estricto
- Vite
- Tailwind CSS
- Vitest
- Testing Library
- Playwright
- ESLint
- Prettier
- Docker
- Docker Compose
- GitHub Actions
- GitHub Pages

## Principios de la migración

- 100% client-side
- despliegue estático en GitHub Pages
- separación entre dominio, parsing, estado y UI
- sin CDNs en producción para lógica crítica
- procesamiento local de PDF y ZIP con `pdfjs-dist` y `@zip.js/zip.js`
- mantenimiento de la UX, copy y estructura SEO del proyecto original

## Estructura

```text
.
├── public/
│   ├── .nojekyll
│   └── favicon.svg
├── src/
│   ├── app/
│   ├── components/
│   ├── content/
│   ├── domain/
│   │   ├── calculos/
│   │   └── constantes/
│   ├── features/
│   │   ├── calculator/
│   │   └── document-processing/
│   ├── lib/
│   └── test/
├── e2e/
│   ├── fixtures/
│   └── tests/
├── scripts/
├── .github/workflows/
├── Dockerfile
├── docker-compose.yml
├── index.html
├── package.json
└── vite.config.ts
```

## Arquitectura

### `src/app/`

Bootstrap de React y composición global de la SPA.

### `src/components/`

Componentes visuales reutilizables: layout, modales y secciones de contenido.

### `src/features/calculator/`

Componentes de la calculadora, reducer, hook principal y mapeo entre extracción automática y formulario.

### `src/domain/`

Lógica pura de negocio:

- fechas
- normalización de formulario
- cálculo de indemnización
- cálculo de finiquito
- cálculo del paro
- composición de resultados
- constantes legales configurables

### `src/features/document-processing/`

Procesamiento local de documentos:

- validación de archivos
- lectura local de PDF
- lectura local de ZIP protegido
- heurísticas de detección de nómina
- extracción de datos desde texto
- normalización de errores

### `src/lib/`

Utilidades pequeñas y puras de fechas y parseo numérico.

### `src/content/`

Textos estáticos reutilizables para opciones, FAQs y copy visible.

## Scripts

- `npm run dev`: servidor de desarrollo de Vite
- `npm run build`: build de producción a `dist/`
- `npm run preview`: preview local de la build
- `npm run lint`: lint del proyecto
- `npm run test`: unit tests y component tests con Vitest
- `npm run test:e2e`: build + tests E2E con Playwright
- `npm run format`: formatea el código con Prettier
- `npm run check`: lint + tests + build

## Configuración local

El repositorio incluye un `.env` versionado con valores seguros por defecto para que el proyecto arranque sin pasos extra. Si necesitas sobreescribirlos localmente, crea un `.env.local`.

Variables relevantes:

- `VITE_BASE_PATH`: base de Vite para GitHub Pages o subpath
- `VITE_SITE_URL`: URL pública canónica
- `VITE_SITE_NAME`: nombre del sitio para SEO
- `VITE_CNAME`: dominio custom opcional

Ejemplo:

```bash
cp .env.example .env.local
```

## Desarrollo local

```bash
npm ci
npm run dev
```

App disponible en `http://localhost:5173`.

## Docker

### Levantar la app en desarrollo

```bash
docker compose up --build
```

La app quedará disponible en `http://localhost:5173`.

### Ejecutar tests unitarios

```bash
docker compose --profile tests run --rm unit
```

### Ejecutar tests E2E

```bash
docker compose --profile tests run --rm e2e
```

Notas:

- el servicio `app` usa polling para mejorar la detección de cambios en entornos Docker
- el servicio `e2e` usa la imagen oficial de Playwright
- la primera ejecución E2E puede tardar más por la instalación del navegador

## Testing

### Unit tests

Cubren:

- parseo y validación de fechas
- antigüedad
- indemnización
- finiquito
- paro y topes
- parseo numérico
- normalización de errores
- heurísticas de nómina
- extracción desde texto simulado

### Component tests

Cubren:

- render inicial
- cambio a modo manual
- modales de error y contraseña
- sliders
- actualización reactiva de resultados
- reset
- banners de advertencia

### E2E

Cubren:

- carga de la home
- flujo manual
- reset
- error por PDF vacío
- apertura de modal al subir ZIP

Los fixtures binarios son deliberadamente controlados y mínimos para reducir fragilidad. La extracción real de PDF está testeada a nivel unitario mediante texto simulado y a nivel de integración a través del flujo de procesamiento local.

## Build y despliegue

### Build local

```bash
npm run build
```

Genera la salida estática en `dist/`.

### GitHub Pages

El proyecto despliega con GitHub Actions a GitHub Pages:

- `CI`: lint, tests, build y Playwright
- `Deploy to GitHub Pages`: build estática y publicación de `dist/`

El workflow calcula automáticamente la configuración adecuada:

- si existe `CNAME`, asume dominio custom y base `/`
- si no existe `CNAME`, usa `https://<owner>.github.io/<repo>/` y base `/<repo>/`
- puedes sobreescribirlo con variables de repositorio:
  - `SITE_URL`
  - `BASE_PATH`
  - `SITE_NAME`

## SEO y contenido

Se mantienen equivalentes modernos de los elementos SEO del HTML original:

- `title`
- `meta description`
- `canonical`
- Open Graph
- Twitter Cards
- JSON-LD con `WebSite` y `WebPage`
- contenido visible de landing, “Cómo funciona” y FAQ

Además, el build publica:

- `robots.txt`
- `sitemap.xml`
- `.nojekyll`
- `CNAME` cuando corresponde

## Privacidad

- no existe backend
- no se suben documentos del usuario
- el PDF se procesa localmente en el navegador
- el ZIP protegido se descomprime localmente en el navegador
- el cálculo ocurre íntegramente en cliente

## Limitaciones conocidas

- la extracción depende de heurísticas y de que el PDF tenga capa de texto; no hay OCR
- si el PDF viene cifrado directamente, la app avisa y recomienda usar el ZIP original o continuar en modo manual
- el cálculo del paro es orientativo y depende de topes legales configurables

## Actualización de constantes legales

Centraliza cambios en:

- `src/domain/constantes/topesLegales.ts`

Si cambia normativa o topes del SEPE/Seguridad Social:

1. actualiza los importes y el año fuente
2. ajusta o amplía tests de topes
3. ejecuta `npm run check`

## Mejoras y correcciones introducidas en la migración

Además de la modularización, esta migración conserva el comportamiento general y mantiene correcciones ya identificadas en el monolito:

- parseo de fechas local y seguro
- antigüedad calculada por días reales
- paro sin mínimos engañosos cuando la base es `0`
- reset completo del formulario
- años de nómina con dos dígitos normalizados de forma razonable
- constantes legales aisladas

También se ha afinado la extracción de salario para evitar restar comisiones de forma incorrecta en fuentes que ya parecen salario fijo.

## Comandos recomendados

```bash
npm ci
npm run check
npm run test:e2e
docker compose up --build
```
