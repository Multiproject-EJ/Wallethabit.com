import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1fa3a3',
          dark: '#117d7d',
          light: '#a8ecec'
        },
        primary: {
          DEFAULT: '#0f766e',
          light: '#14b8a6',
          dark: '#0b4f4a'
        },
        coral: '#f98473',
        navy: '#1f2a44',
        gold: '#f3c969',
        sand: {
          DEFAULT: '#f6f7f9',
          darker: '#e2e6ec'
        },
        midnight: {
          DEFAULT: '#101622',
          accent: '#4ade80'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        uplift: '0 25px 50px -12px rgba(15, 118, 110, 0.15)'
      }
    }
  },
  plugins: []
} satisfies Config

