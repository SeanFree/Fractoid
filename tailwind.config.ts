import type { Config } from 'tailwindcss'
import { plugins } from './src/tailwind'

export default {
  prefix: 'fx-',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,html,vue}'],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
      },
      colors: {
        primary: '#1976d2',
        secondary: '#26a69a',
        accent: '#9c27b0',
        dark: '#1d1d1d',
        positive: '#21ba45',
        negative: '#c10015',
        info: '#31ccec',
        warning: '#f2c037',
      },
    },
  },
  plugins,
} satisfies Config
