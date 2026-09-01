import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Blocks from './pages/Blocks'
import Icons from './pages/Icons'
import Illustrations from './pages/Illustrations'
import ComingSoon from './pages/ComingSoon'
import GoogleAnalytics from './components/GoogleAnalytics'

function App() {
  return (
    <BrowserRouter>
      <GoogleAnalytics />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blocks" element={<Blocks />} />
        <Route path="/icons" element={<Icons />} />
        <Route path="/components" element={<ComingSoon title="Components for Agents" />} />
        <Route path="/illustrations" element={<Illustrations />} />
        <Route path="/design-lab" element={<ComingSoon title="Design Lab" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
