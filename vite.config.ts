import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/api/myhora': {
        target: 'https://myhora.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/myhora/, ''),
      },
      '/api/myhora-net': {
        target: 'https://myhora.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/myhora-net/, ''),
      },
    },
  },
})
