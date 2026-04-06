import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const distDir = join(process.cwd(), 'dist')
mkdirSync(distDir, { recursive: true })

const rawSiteUrl = process.env.VITE_SITE_URL?.trim() || 'https://calculadoraere.es/'
const normalizedSiteUrl = rawSiteUrl.endsWith('/') ? rawSiteUrl : `${rawSiteUrl}/`
const parsedUrl = new URL(normalizedSiteUrl)
const rootUrl = `${parsedUrl.origin}${parsedUrl.pathname}`
const cNameFromFile = existsSync(join(process.cwd(), 'CNAME'))
  ? readFileSync(join(process.cwd(), 'CNAME'), 'utf8').trim()
  : ''
const cName = process.env.VITE_CNAME?.trim() || cNameFromFile
const disableCName = process.env.VITE_DISABLE_CNAME === 'true'

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${rootUrl}sitemap.xml\n`
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${rootUrl}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n  </url>\n</urlset>\n`

writeFileSync(join(distDir, 'robots.txt'), robots)
writeFileSync(join(distDir, 'sitemap.xml'), sitemap)
writeFileSync(join(distDir, '.nojekyll'), '')

const cNamePath = join(distDir, 'CNAME')
if (!disableCName && cName) {
  writeFileSync(cNamePath, `${cName}\n`)
} else if (existsSync(cNamePath)) {
  rmSync(cNamePath)
}
