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

// The route list lives in src/seo/pages.js, which also drives the prerendered
// HTML and sitemap.xml. This says what each of those paths renders; a path
// with nothing here falls through to the not-found page rather than taking
// the whole app down — so development says loudly when one is missing.
// The two ComingSoon entries are keyed so that moving between them remounts
// the page instead of reusing its form state.
const elements = {
  '/': <Home />,
  '/blocks': <Blocks />,
  '/illustrations': <Illustrations />,
  '/icons': <Icons />,
  '/components': <ComingSoon key="/components" title="Components for Agents" />,
  '/design-lab': <ComingSoon key="/design-lab" title="Design Lab" />,
  '/about': <About />,
}

if (import.meta.env.DEV) {
  const unmapped = pages.filter((page) => !elements[page.path])
  if (unmapped.length) {
    console.error(
      `[routes] src/seo/pages.js lists ${unmapped
        .map((page) => page.path)
        .join(', ')} with no entry in the elements map above, so they would be ` +
        `prerendered and put in sitemap.xml while rendering the not-found page.`,
    )
  }
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
