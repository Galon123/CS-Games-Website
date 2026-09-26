const fs = require('fs');
let c = fs.readFileSync('components/AdminPanel.tsx', 'utf8');

c = c.replace(/font-serif font-black/g, 'font-anton uppercase tracking-wider');
c = c.replace(/font-serif tracking-tight font-black/g, 'font-anton uppercase tracking-wider');
c = c.replace(/font-serif font-bold/g, 'font-anton uppercase tracking-wider');
c = c.replace(/font-serif/g, 'font-anton uppercase tracking-wider');

fs.writeFileSync('components/AdminPanel.tsx', c);
