import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Define environment variables for production build
    'import.meta.env.VITE_API_URL': JSON.stringify('https://backend-ej1d.onrender.com/api')
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://backend-ej1d.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
