import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('three') || id.includes('@react-three')) return 'three'
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('framer-motion')) return 'framer'
          if (id.includes('react') || id.includes('zustand')) return 'vendor'
        },
      },
    },
  },
})
