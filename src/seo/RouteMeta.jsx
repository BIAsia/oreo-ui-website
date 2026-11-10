import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { findPage, headTagsFor } from './pages'

function selectorFor({ name, property }) {
  return name ? `meta[name="${name}"]` : `meta[property="${property}"]`
}

function upsertMeta(tag) {
  const { name, property, content } = tag
  const selector = selectorFor(tag)
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
  // Selectors written on the previous route, so a tag only some pages carry
  // (robots, today) is removed again rather than left behind.
  const written = useRef(null)

  useLayoutEffect(() => {
    const tags = headTagsFor(findPage(pathname))
    const selectors = tags.meta.map(selectorFor)

    document.title = tags.title
    tags.meta.forEach(upsertMeta)
    upsertCanonical(tags.canonical)

    written.current
      ?.filter((selector) => !selectors.includes(selector))
      .forEach((selector) => document.head.querySelector(selector)?.remove())
    written.current = selectors
  }, [pathname])

  return null
}
