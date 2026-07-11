import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/averia-serif-libre/300.css'
import '@fontsource/averia-serif-libre/400.css'
import '@fontsource/averia-serif-libre/700.css'
import '@fontsource/averia-serif-libre/400-italic.css'
import '@fontsource-variable/source-serif-4/opsz.css'
import '@fontsource-variable/inter'
import '@fontsource-variable/geist-mono'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
