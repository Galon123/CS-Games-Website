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
      fontFamily: {
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        grotesk: ['Plus Jakarta Sans', 'Inter Tight', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        canvas: '#06080A',
        ink: {
          900: '#06080A',
          800: '#0B0E11',
          700: '#11161A',
          600: '#1A2127',
          500: '#263038',
        },
        'midnight-teal': '#0E1A18',
        pitch: {
          dark: '#07130E',
          turf: '#0B1B15',
          line: 'rgba(255, 255, 255, 0.16)',
        },
        acid: {
          DEFAULT: '#D7F22B',
          hot: '#C8FF00',
          ink: '#0B0E11',
          muted: 'rgba(215, 242, 43, 0.12)',
          glow: 'rgba(215, 242, 43, 0.28)',
        },
        'sky-kit': '#A9D6E5',
        'europa-orange': '#EE5A1F',
        cream: '#ECE9E1',
        paper: '#FFFFFF',
        mist: 'rgba(255, 255, 255, 0.65)',
        fog: 'rgba(255, 255, 255, 0.35)',
        rule: {
          DEFAULT: 'rgba(255, 255, 255, 0.12)',
          light: 'rgba(255, 255, 255, 0.07)',
          strong: 'rgba(255, 255, 255, 0.22)',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '18px',
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
      },
    },
  },
  plugins: [],
}

export default config
