import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    force: true,
    exclude: [
      'workbox-background-sync',
      'workbox-broadcast-update',
      'workbox-cacheable-response',
      'workbox-core',
      'workbox-expiration',
      'workbox-google-analytics',
      'workbox-navigation-preload',
      'workbox-precaching',
      'workbox-range-requests',
      'workbox-recipes',
      'workbox-routing',
      'workbox-streams',
      'workbox-strategies',
      'workbox-window',
    ],
  },
})
