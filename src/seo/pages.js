/**
 * Single source of truth for the site's routes and their page metadata.
 *
 * Consumed by:
 *  - src/App.jsx            renders one <Route> per entry and says what each
 *                           path renders
 *  - src/seo/RouteMeta.jsx  keeps <head> in sync while navigating in the SPA
 *  - plugins/vite-plugin-seo.js  bakes the same tags into the built HTML and
 *                                generates sitemap.xml at build time
 *
 * Adding a route here gets it a page, metadata, a prerendered HTML file and,
 * unless it is `noindex`, a sitemap entry. Its nav link, if it needs one, is
 * still added separately in src/components/Navbar.jsx.
 */

export const SITE_URL = 'https://oreoui.com'
export const SITE_NAME = 'Oreo Design'
// One link-preview image for the whole site. A per-page image would have to
// carry its own og:image:width/height, which headTagsFor hardcodes below.
export const DEFAULT_OG_IMAGE = '/og-default.png'

export const pages = [
  {
    path: '/',
    title: 'Oreo Design – UI Library for AI Agents',
    description:
      'Oreo is a UI library for building AI agent products — 10,000+ components and variants, 900+ styles and variables, and 420+ page templates. Ship 5x faster.',
  },
  {
    path: '/blocks',
    title: 'Blocks for Agents – Oreo Design',
    description:
      '20+ ready-made blocks for AI products — landing pages, application shells and canvas layouts, in multiple styles and variants. Coming soon from Oreo Design.',
  },
  {
    path: '/illustrations',
    title: 'Illustrations for Agents – Oreo Design',
    description:
      '50+ illustrations for the moments in an AI product — onboarding, empty states, notices, identity checks and task completion. Coming soon from Oreo Design.',
  },
  {
    path: '/icons',
    title: 'Icons for Agents – Oreo Design',
    description:
      '1,700+ icons drawn for AI agent interfaces in one consistent style, covering tools, models, files and agent states. Coming soon from Oreo Design.',
  },
  {
    path: '/components',
    title: 'Components for Agents – Oreo Design',
    description:
      '10,000+ components and variants for AI agent interfaces: prompt composers, tool bars, task planners, thinking states and more. Coming soon from Oreo Design.',
    // A placeholder: kept out of search and out of the sitemap until it has
    // real content. Drop this line once the page is worth landing on.
    noindex: true,
  },
  {
    path: '/design-lab',
    title: 'Design Lab – Oreo Design',
    description:
      'Design Lab is where the Oreo team explores new patterns and interactions for AI product interfaces. Coming soon from Oreo Design.',
    noindex: true,
  },
  {
    path: '/about',
    title: 'About – Oreo Design',
    description:
      'Oreo is built by product designers, design engineers and creatives from design system teams at TikTok, Meta, Tencent and frog — with a focus on craft.',
  },
]

/** Metadata for anything that does not match a route above. */
export const notFoundPage = {
  path: '/404',
  title: 'Page not found – Oreo Design',
  description:
    "This page doesn't exist. Head back to oreoui.com to explore the Oreo UI library for AI agents.",
  noindex: true,
}

/** The pages search engines should know about: everything not held back. */
export const indexablePages = pages.filter((page) => !page.noindex)

export function findPage(pathname) {
  // Treat /blocks, /blocks/ and /Blocks as the same page: the router matches
  // paths case-insensitively, so the head has to agree with what it renders.
  const trimmed =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  const normalized = trimmed.toLowerCase()
  return pages.find((page) => page.path === normalized) ?? notFoundPage
}

/**
 * The <head> tags for one page, as plain objects so both the browser and the
 * build-time HTML generator can render them from the same description.
 */
export function headTagsFor(page) {
  const url = SITE_URL + (page.path === '/' ? '/' : page.path)
  // A page held back from search gets no canonical, but still names itself in
  // og:url so a shared link unfurls as the page it actually is.
  const canonical = page.noindex ? null : url
  const image = SITE_URL + DEFAULT_OG_IMAGE

  return {
    title: page.title,
    canonical,
    meta: [
      { name: 'description', content: page.description },
      ...(page.noindex ? [{ name: 'robots', content: 'noindex' }] : []),
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: page.title },
      { property: 'og:description', content: page.description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: page.title },
      { name: 'twitter:description', content: page.description },
      { name: 'twitter:image', content: image },
    ],
  }
}
