const fs = require('fs');
let c = fs.readFileSync('app/layout.tsx', 'utf8');
c = c.replace(
`<p><strong className="text-cream">Convenor:</strong> Name (Phone)</p>
                    <p><strong className="text-cream">Joint Convenors:</strong> Name 1 (Phone), Name 2 (Phone)</p>`,
`<p><strong className="text-cream">Convenor:</strong> Sreehari A (88482 04727)</p>
                    <p><strong className="text-cream">Joint Convenors:</strong> Ashwin D Sreenivas (94472 04941), Christeena Geejo (89213 57607)</p>`
);
fs.writeFileSync('app/layout.tsx', c);
