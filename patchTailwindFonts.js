const fs = require('fs');

let tw = fs.readFileSync('tailwind.config.ts', 'utf8');

tw = tw.replace(
  `      fontFamily: {
        anton: ['var(--font-anton)', 'sans-serif'],
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        grotesk: ['Plus Jakarta Sans', 'Inter Tight', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },`,
  `      fontFamily: {
        anton: ['var(--font-anton)', 'sans-serif'],
        serif: ['var(--font-jakarta)', 'sans-serif'],
        grotesk: ['var(--font-jakarta)', 'sans-serif'],
        sans: ['var(--font-dmsans)', 'sans-serif'],
        mono: ['var(--font-dmsans)', 'monospace'],
      },`
);

fs.writeFileSync('tailwind.config.ts', tw);
