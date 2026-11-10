import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import seo from './plugins/vite-plugin-seo.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seo()],
})
