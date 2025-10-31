import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Note: Codex-only workflow. Vite runs in GitHub Actions (pages.yml).
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'WalletHabit',
        short_name: 'WalletHabit',
        description: 'Calm, motivating personal finance companion.',
        theme_color: '#0f172a',
        background_color: '#0b1120',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        lang: 'en-GB',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,json,woff2}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
