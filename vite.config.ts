import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Same-origin /api in dev → Django; avoids CORS "Failed to fetch" when UI is on :5173
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const csrfToken = req.headers['x-csrftoken']
            if (csrfToken) {
              proxyReq.setHeader('x-csrftoken', csrfToken)
            }
          })
        },
      },
    },
  },
})
