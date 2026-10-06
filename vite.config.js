import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Apex Drift 3D - Ultimate Driving Simulator',
        short_name: 'ApexDrift3D',
        description: 'Realistic 3D WebGL car driving game with open world, time trial, and highway traffic.',
        theme_color: '#090d16',
        background_color: '#090d16',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'fullscreen'],
        orientation: 'landscape',
        start_url: '/',
        scope: '/',
        id: '/',
        categories: ['games', 'racing', 'entertainment'],
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,glb,wasm}'],
        maximumFileSizeToCacheInBytes: 25 * 1024 * 1024,
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
})
