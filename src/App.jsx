import { createElement } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Blocks from './pages/Blocks'
import Icons from './pages/Icons'
import Illustrations from './pages/Illustrations'
import ComingSoon from './pages/ComingSoon'
import NotFound from './pages/NotFound'
import GoogleAnalytics from './components/GoogleAnalytics'
import RouteMeta from './seo/RouteMeta'
import { pages } from './seo/pages'

// Routes come from src/seo/pages.js so that the pages, their metadata, the
// prerendered HTML and sitemap.xml can never drift apart.
const components = { Home, About, Blocks, Icons, Illustrations, ComingSoon }

const missing = pages.filter((page) => !components[page.component])
if (missing.length) {
  throw new Error(
    `src/seo/pages.js names components that src/App.jsx does not import: ` +
      missing.map((page) => `${page.path} → ${page.component}`).join(', '),
  )
}

function App() {
  return (
    <BrowserRouter>
      <RouteMeta />
      <GoogleAnalytics />
      <Routes>
        {pages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={createElement(components[page.component], page.componentProps)}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
