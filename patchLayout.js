const fs = require('fs');
let c = fs.readFileSync('app/layout.tsx', 'utf8');
c = c.replace(
`import Navbar from '@/components/Navbar'`,
`import Navbar from '@/components/Navbar'
import LiveMatchOverlay from '@/components/LiveMatchOverlay'`
);
c = c.replace(
`          <TournamentProvider>
            <Navbar />`,
`          <TournamentProvider>
            <Navbar />
            <LiveMatchOverlay />`
);
fs.writeFileSync('app/layout.tsx', c);
