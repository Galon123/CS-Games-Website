import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        grotesk: ['Plus Jakarta Sans', 'Inter Tight', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        ink: {
          950: 'rgb(var(--ink-950) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
        },
        'midnight-teal': 'rgb(var(--midnight-teal) / <alpha-value>)',
        pitch: {
          dark: 'rgb(var(--pitch-dark) / <alpha-value>)',
          turf: 'rgb(var(--pitch-turf) / <alpha-value>)',
          line: 'var(--pitch-line)',
        },
        acid: {
          DEFAULT: 'rgb(var(--acid) / <alpha-value>)',
          hot: 'rgb(var(--acid-hot) / <alpha-value>)',
          ink: 'rgb(var(--acid-ink) / <alpha-value>)',
          muted: 'var(--acid-muted)',
          glow: 'var(--acid-glow)',
        },
        'sky-kit': '#A9D6E5',
        'europa-orange': '#EE5A1F',
        cream: 'rgb(var(--cream) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        mist: 'rgb(var(--mist) / <alpha-value>)',
        fog: 'rgb(var(--fog) / <alpha-value>)',
        rule: {
          DEFAULT: 'var(--rule)',
          light: 'var(--rule-light)',
          strong: 'var(--rule-strong)',
        },
      },
            borderRadius: {
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        pill: '999px',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        elevated: '0 12px 32px -4px rgba(0, 0, 0, 0.6)',
        glow: '0 0 24px -2px rgba(215, 242, 43, 0.25)',
        'glow-sm': '0 0 12px -2px rgba(215, 242, 43, 0.35)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-22px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(22px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pitchDrop: {
          '0%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0.4)' },
          '65%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1.12)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        carouselProgress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        marquee: 'marquee 34s linear infinite',
        'marquee-fast': 'marquee 20s linear infinite',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'slide-in-up': 'slideInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'slide-in-down': 'slideInDown 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'pitch-drop': 'pitchDrop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'carousel-progress': 'carouselProgress linear forwards',
      },
    },
  },
  plugins: [],
}

export default config
