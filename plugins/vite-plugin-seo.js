import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { pages, indexablePages, notFoundPage, headTagsFor, SITE_URL } from '../src/seo/pages.js'

const START = '<!-- seo:start -->'
const END = '<!-- seo:end -->'

function escapeAttr(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderHead(page, indent = '    ') {
  const { title, canonical, meta } = headTagsFor(page)
  const lines = [`<title>${escapeAttr(title)}</title>`]

  for (const tag of meta) {
    const key = tag.name ? `name="${tag.name}"` : `property="${tag.property}"`
    lines.push(`<meta ${key} content="${escapeAttr(tag.content)}" />`)
  }
  if (canonical) lines.push(`<link rel="canonical" href="${canonical}" />`)

  return lines.map((line) => indent + line).join('\n')
}

function htmlForPage(template, page) {
  const start = template.indexOf(START)
  const end = template.indexOf(END)
  if (start === -1 || end === -1) {
    throw new Error(`index.html is missing the ${START} … ${END} markers`)
  }
  const indent = ' '.repeat(Math.max(0, start - (template.lastIndexOf('\n', start) + 1)))
  return (
    template.slice(0, start) +
    START +
    '\n' +
    renderHead(page, indent) +
    '\n' +
    indent +
    template.slice(end)
  )
}

function renderSitemap() {
  const urls = indexablePages
    .map((page) => `  <url><loc>${SITE_URL}${page.path === '/' ? '/' : page.path}</loc></url>`)

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- Generated at build time from src/seo/pages.js — do not edit by hand. -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

/** The file each route is served from: / → index.html, /blocks → blocks.html. */
function outputFileFor(pathname) {
  return pathname === '/' ? 'index.html' : `${pathname.replace(/^\//, '')}.html`
}

/**
 * Gives every route its own HTML file with the right <head>, so crawlers and
 * link unfurlers see real per-page metadata instead of one shared shell, and
 * generates sitemap.xml from the same route list.
 *
 * The page bodies are still rendered by React in the browser; only <head> is
 * prerendered. Unknown paths get 404.html, which Vercel serves with a real
 * 404 status (vercel.json has no catch-all rewrite for that reason).
 */
export default function seoPlugin() {
  let outDir = 'dist'

  return {
    name: 'oreo-seo',

    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },

    // Serve the generated sitemap in `vite dev` too, so it can be checked
    // locally instead of only after a deploy.
    configureServer(server) {
      server.middlewares.use('/sitemap.xml', (_req, res) => {
        res.setHeader('Content-Type', 'application/xml')
        res.end(renderSitemap())
      })
    },

    async closeBundle() {
      const indexPath = path.join(outDir, 'index.html')
      const template = await readFile(indexPath, 'utf8')

      const written = []
      for (const page of [...pages, notFoundPage]) {
        const file = page === notFoundPage ? '404.html' : outputFileFor(page.path)
        const target = path.join(outDir, file)
        await mkdir(path.dirname(target), { recursive: true })
        await writeFile(target, htmlForPage(template, page))
        written.push(file)
      }

      await writeFile(path.join(outDir, 'sitemap.xml'), renderSitemap())
      written.push('sitemap.xml')

      this.info?.(`prerendered ${written.length} files: ${written.join(', ')}`)
    },
  }
}
