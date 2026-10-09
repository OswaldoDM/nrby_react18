import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: 'https://oswaldodm.github.io/nrby_react18/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

