import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        card: '#1E293B',
        'card-hover': '#24344D',
        'neon-lime': {
          DEFAULT: '#84CC16',
          glow: 'rgba(132, 204, 22, 0.4)',
          dark: '#65A30D',
        },
        'cyber-cyan': {
          DEFAULT: '#06B6D4',
          glow: 'rgba(6, 182, 212, 0.4)',
          dark: '#0891B2',
        },
        'ice-white': '#F8FAFC',
        'muted-gray': '#9CA3AF',
        pitch: {
          dark: '#064e3b',
          line: '#10b981',
          grass: '#065f46',
        }
      },
      backgroundImage: {
        'cyber-grid': 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 1px, transparent 1px)',
        'pitch-pattern': 'repeating-linear-gradient(0deg, rgba(16, 185, 129, 0.05) 0px, rgba(16, 185, 129, 0.05) 40px, transparent 40px, transparent 80px)',
      },
      boxShadow: {
        'neon-lime': '0 0 20px -3px rgba(132, 204, 22, 0.35)',
        'cyber-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'cyber-combo': '0 0 15px -3px rgba(6, 182, 212, 0.25), 0 0 25px -5px rgba(132, 204, 22, 0.2)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
