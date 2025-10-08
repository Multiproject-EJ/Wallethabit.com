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
        }
      }
    }
  },
  plugins: []
} satisfies Config

