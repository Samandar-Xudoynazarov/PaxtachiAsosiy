import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://10.252.56.105:8080',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: '',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://10.252.56.105:8080',
        changeOrigin: true,
        secure: false,
      },
      '/super-admin': {
        target: 'http://10.252.56.105:8080',
        changeOrigin: true,
        secure: false,
      },
      '/user': {
        target: 'http://10.252.56.105:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})