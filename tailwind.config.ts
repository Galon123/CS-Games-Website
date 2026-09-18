import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090D16',
        card: '#111827',
        'card-hover': '#162032',
        surface: {
          DEFAULT: '#1E293B',
          muted: '#0F172A',
          subtle: '#131D2E',
          border: '#1F293D',
        },
        brand: {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          dark: '#1D4ED8',
          subtle: 'rgba(37, 99, 235, 0.1)',
        },
        'neon-lime': {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          glow: 'rgba(37, 99, 235, 0.25)',
        },
        'cyber-cyan': {
          DEFAULT: '#0284C7',
          dark: '#0369A1',
          glow: 'rgba(2, 132, 199, 0.25)',
        },
        'ice-white': '#F8FAFC',
        'muted-gray': '#94A3B8',
        pitch: {
          dark: '#0e291a',
          grass: '#123824',
          line: 'rgba(255, 255, 255, 0.35)',
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.25), 0 1px 2px -1px rgba(0, 0, 0, 0.25)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.25)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
        'neon-lime': '0 2px 8px -1px rgba(37, 99, 235, 0.3)',
        'cyber-cyan': '0 2px 8px -1px rgba(2, 132, 199, 0.3)',
        'cyber-combo': '0 2px 8px -1px rgba(37, 99, 235, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config
