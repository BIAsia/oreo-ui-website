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

// The route list lives in src/seo/pages.js, so the pages, their metadata, the
// prerendered HTML and sitemap.xml can't drift apart. This maps each of those
// paths to what it renders; a path with nothing here falls through to the
// not-found page rather than taking the whole app down.
const elements = {
  '/': <Home />,
  '/blocks': <Blocks />,
  '/illustrations': <Illustrations />,
  '/icons': <Icons />,
  '/components': <ComingSoon title="Components for Agents" />,
  '/design-lab': <ComingSoon title="Design Lab" />,
  '/about': <About />,
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
            element={elements[page.path] ?? <NotFound />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
