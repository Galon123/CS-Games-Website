const fs = require('fs');
let c = fs.readFileSync('tailwind.config.ts', 'utf8');
c = c.replace(
`      fontFamily: {
        serif:`,
`      fontFamily: {
        anton: ['var(--font-anton)', 'sans-serif'],
        serif:`
);
fs.writeFileSync('tailwind.config.ts', c);
