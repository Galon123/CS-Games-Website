const fs = require('fs');

let c = fs.readFileSync('components/CsCupView.tsx', 'utf8');
// Section headings
c = c.replace(/font-anton tracking-wider/g, 'font-grotesk tracking-tight');

// Table headings (points table, top scorers, goalkeepers)
c = c.replace(/font-mono font-bold uppercase tracking-wider text-mist/g, 'font-anton uppercase tracking-wider text-mist text-sm');

// Team names in tables and matches
c = c.replace(/font-serif font-bold text-lg md:text-xl/g, 'font-anton uppercase text-lg md:text-xl tracking-wide');
c = c.replace(/font-serif font-bold text-lg/g, 'font-anton uppercase text-lg tracking-wide');
c = c.replace(/font-serif font-bold text-paper whitespace-nowrap/g, 'font-anton uppercase text-paper tracking-wide text-lg whitespace-nowrap');

// Meet the teams names
c = c.replace(/text-2xl font-black font-serif text-paper/g, 'text-3xl font-anton uppercase tracking-wide text-paper');

// Modal headers
c = c.replace(/font-serif font-black text-xl md:text-2xl/g, 'font-anton uppercase tracking-wide text-xl md:text-2xl');
c = c.replace(/font-serif font-black text-xl/g, 'font-anton uppercase tracking-wide text-xl');

fs.writeFileSync('components/CsCupView.tsx', c);
