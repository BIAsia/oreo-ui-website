import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Blocks from './pages/Blocks'
import Icons from './pages/Icons'
import ComingSoon from './pages/ComingSoon'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blocks" element={<Blocks />} />
        <Route path="/icons" element={<Icons />} />
        <Route path="/components" element={<ComingSoon title="Components for Agents" />} />
        <Route path="/illustrations" element={<ComingSoon title="Illustrations for Agents" />} />
        <Route path="/design-lab" element={<ComingSoon title="Design Lab" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
