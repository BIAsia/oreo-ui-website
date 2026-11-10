/**
 * Single source of truth for the site's routes and their page metadata.
 *
 * Consumed by:
 *  - src/App.jsx            renders one <Route> per entry
 *  - src/seo/RouteMeta.jsx  keeps <head> in sync while navigating in the SPA
 *  - plugins/vite-plugin-seo.js  bakes the same tags into the built HTML and
 *                                generates sitemap.xml at build time
 *
 * Adding a route here is all that's needed: it gets a page, metadata, a
 * prerendered HTML file and (unless `sitemap: false`) a sitemap entry.
 */

export const SITE_URL = 'https://oreoui.com'
export const SITE_NAME = 'Oreo Design'
export const DEFAULT_OG_IMAGE = '/og-default.png'

export const pages = [
  {
    path: '/',
    component: 'Home',
    title: 'Oreo Design – UI Library for AI Agents',
    description:
      'Oreo is a UI library for building AI agent products — 10,000+ components and variants, 900+ styles and variables, and 420+ page templates. Ship 5x faster.',
    sitemap: true,
  },
  {
    path: '/blocks',
    component: 'Blocks',
    title: 'Blocks for Agents – Oreo Design',
    description:
      '20+ ready-made blocks for AI products — landing pages, application shells and canvas layouts, in multiple styles and variants. Coming soon from Oreo Design.',
    sitemap: true,
  },
  {
    path: '/illustrations',
    component: 'Illustrations',
    title: 'Illustrations for Agents – Oreo Design',
    description:
      '50+ illustrations for the moments in an AI product — onboarding, empty states, notices, identity checks and task completion. Coming soon from Oreo Design.',
    sitemap: true,
  },
  {
    path: '/icons',
    component: 'Icons',
    title: 'Icons for Agents – Oreo Design',
    description:
      '1,700+ icons drawn for AI agent interfaces in one consistent style, covering tools, models, files and agent states. Coming soon from Oreo Design.',
    sitemap: true,
  },
  {
    path: '/components',
    component: 'ComingSoon',
    componentProps: { title: 'Components for Agents' },
    title: 'Components for Agents – Oreo Design',
    description:
      '10,000+ components and variants for AI agent interfaces: prompt composers, tool bars, task planners, thinking states and more. Coming soon from Oreo Design.',
    // Kept out of the sitemap until the page has real content.
    sitemap: false,
  },
  {
    path: '/design-lab',
    component: 'ComingSoon',
    componentProps: { title: 'Design Lab' },
    title: 'Design Lab – Oreo Design',
    description:
      'Design Lab is where the Oreo team explores new patterns and interactions for AI product interfaces. Coming soon from Oreo Design.',
    sitemap: false,
  },
  {
    path: '/about',
    component: 'About',
    title: 'About – Oreo Design',
    description:
      'Oreo is built by product designers, design engineers and creatives from design system teams at TikTok, Meta, Tencent and frog — with a focus on craft.',
    sitemap: true,
  },
]

/** Metadata for anything that does not match a route above. */
export const notFoundPage = {
  path: '/404',
  component: 'NotFound',
  title: 'Page not found – Oreo Design',
  description:
    "This page doesn't exist. Head back to oreoui.com to explore the Oreo UI library for AI agents.",
  noindex: true,
  sitemap: false,
}

export function findPage(pathname) {
  // Treat /blocks and /blocks/ as the same page.
  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  return pages.find((page) => page.path === normalized) ?? notFoundPage
}

/**
 * The <head> tags for one page, as plain objects so both the browser and the
 * build-time HTML generator can render them from the same description.
 */
export function headTagsFor(page) {
  const canonical = page.noindex ? null : SITE_URL + (page.path === '/' ? '/' : page.path)
  const image = SITE_URL + (page.ogImage ?? DEFAULT_OG_IMAGE)

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
      { property: 'og:url', content: canonical ?? SITE_URL + '/' },
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
