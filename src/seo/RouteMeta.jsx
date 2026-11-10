import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { findPage, headTagsFor } from './pages'

function upsertMeta({ name, property, content }) {
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    if (name) el.setAttribute('name', name)
    else el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!href) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Keeps <head> in sync with the current route.
 *
 * The build bakes the same tags into each prerendered HTML file, so crawlers
 * that don't run JavaScript already see them; this only matters once the user
 * navigates inside the SPA. Must render inside the router.
 */
export default function RouteMeta() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const tags = headTagsFor(findPage(pathname))

    document.title = tags.title
    tags.meta.forEach(upsertMeta)
    upsertCanonical(tags.canonical)

    // A page that is not noindex must not inherit the 404 page's robots tag.
    if (!tags.meta.some((tag) => tag.name === 'robots')) {
      document.head.querySelector('meta[name="robots"]')?.remove()
    }
  }, [pathname])

  return null
}
