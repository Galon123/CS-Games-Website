const fs = require('fs');
let c = fs.readFileSync('components/Navbar.tsx', 'utf8');
c = c.replace('font-grotesk lowercase', 'font-anton uppercase');
fs.writeFileSync('components/Navbar.tsx', c);
