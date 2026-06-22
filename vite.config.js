import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cross-origin isolation enables SharedArrayBuffer, which the Python compiler
// uses for interactive stdin. `credentialless` keeps cross-origin CDN assets
// (Pyodide, Monaco, Google Fonts) loading without requiring CORP headers.
const crossOriginIsolation = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless',
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    headers: crossOriginIsolation,
  },
  preview: {
    headers: crossOriginIsolation,
  },
})
