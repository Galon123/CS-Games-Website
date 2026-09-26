const fs = require('fs');

let c = fs.readFileSync('components/Navbar.tsx', 'utf8');

c = c.replace(/font-anton uppercase/g, 'font-grotesk lowercase');

fs.writeFileSync('components/Navbar.tsx', c);
