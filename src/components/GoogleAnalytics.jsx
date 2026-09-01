import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// gtag only fires page_view on the initial document load, so the tag in
// index.html sets send_page_view: false and every view — first one included —
// is sent from here instead. Must render inside the router.
function GoogleAnalytics() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (typeof window.gtag !== 'function') return

    window.gtag('event', 'page_view', {
      page_path: pathname + search,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, search])

  return null
}

export default GoogleAnalytics
