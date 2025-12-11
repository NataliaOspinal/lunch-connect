import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Fix para Vercel + STOMP
export default defineConfig({
  plugins: [tailwindcss(), react()],

  optimizeDeps: {
    include: ['@stomp/stompjs']
  },

  build: {
    commonjsOptions: {
      include: [/stompjs/, /node_modules/]
    },
    rollupOptions: {
      external: []
    }
  }
})
