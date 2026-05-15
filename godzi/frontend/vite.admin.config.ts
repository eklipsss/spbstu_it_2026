import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'admin',
  envDir: '.',
  publicDir: '../public',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@styles': path.resolve(__dirname, './src/shared/styles'),
      '@assets': path.resolve(__dirname, './src/shared/assets'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@styles/vars' as *;`,
      },
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname)],
    },
  },
  build: {
    outDir: '../dist-admin',
    emptyOutDir: true,
  },
})
