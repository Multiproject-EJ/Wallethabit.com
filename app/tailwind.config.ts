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
      },
      keyframes: {
        'bar-bounce': {
          '0%, 100%': { transform: 'scaleY(0.85)' },
          '50%': { transform: 'scaleY(1)' }
        },
        orbital: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' }
        },
        dash: {
          '0%': { strokeDasharray: '1, 150', strokeDashoffset: '30' },
          '50%': { strokeDasharray: '90, 150', strokeDashoffset: '-20' },
          '100%': { strokeDasharray: '90, 150', strokeDashoffset: '-120' }
        },
        'dot-blink': {
          '0%, 80%, 100%': { opacity: '0.2' },
          '40%': { opacity: '1' }
        }
      },
      animation: {
        'bar-bounce': 'bar-bounce 1.6s ease-in-out infinite',
        orbital: 'orbital 6s linear infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        dash: 'dash 2.6s ease-in-out infinite',
        'dot-blink': 'dot-blink 1.4s ease-in-out infinite'
      }
    }
  },
  plugins: []
} satisfies Config

