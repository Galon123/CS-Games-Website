const fs = require('fs');

let tw = fs.readFileSync('tailwind.config.ts', 'utf8');

tw = tw.replace(/serif:\s*\[[^\]]+\]/, `serif: ['var(--font-anton)', 'sans-serif']`);
tw = tw.replace(/mono:\s*\[[^\]]+\]/, `mono: ['var(--font-dmsans)', 'sans-serif']`);

fs.writeFileSync('tailwind.config.ts', tw);
