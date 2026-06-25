import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/daily-tracker/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '日常记账与笔记',
        short_name: '记账笔记',
        description: '记录日常开销和学习笔记',
        theme_color: '#FF6B6B',
        background_color: '#F8F9FA',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/daily-tracker/',
        icons: [
          { src: '/daily-tracker/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/daily-tracker/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
