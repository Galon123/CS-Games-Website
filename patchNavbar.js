const fs = require('fs');
let c = fs.readFileSync('components/Navbar.tsx', 'utf8');
c = c.replace(
`          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (`,
`          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {liveMatch && (
              <div className="flex items-center space-x-2 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute" />
                <div className="w-2 h-2 rounded-full bg-rose-500 relative" />
                <span className="text-xs font-mono font-bold text-rose-500 uppercase cursor-default">Live Match</span>
              </div>
            )}
            {navItems.map((item) => (`
);
fs.writeFileSync('components/Navbar.tsx', c);
