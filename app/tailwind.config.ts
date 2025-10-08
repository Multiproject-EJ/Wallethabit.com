import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF6FF',
          100: '#D9E9FF',
          200: '#B6D4FF',
          300: '#8FB9FF',
          400: '#5E94FF',
          500: '#3C6FFF',
          600: '#274DE6',
          700: '#1D3ABA',
          800: '#1B318F',
          900: '#182B70',
        },
        accent: {
          400: '#F97360',
          500: '#F25C4E',
          600: '#D94841',
        },
        ink: {
          50: '#F8F9FB',
          100: '#EFF1F6',
          200: '#D8DDE7',
          300: '#B3BACD',
          400: '#8A93AB',
          500: '#626D89',
          600: '#454E63',
          700: '#2D3443',
          800: '#1B2131',
          900: '#101521',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 25px 50px -12px rgba(63, 99, 241, 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
