import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@styles': path.resolve(__dirname, './src/shared/styles'),
      '@assets': path.resolve(__dirname, './src/shared/assets')
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@styles/vars' as *;`
      }
    }
  }
})
