const fs = require('fs');
let code = fs.readFileSync('components/SponsorsBox.tsx', 'utf8');

const newRender = `  return (
    <>
      <div className="w-full flex flex-col items-center justify-center space-y-12 py-8 relative">
        
        {isAdmin && (
          <div className="absolute top-0 right-0 flex items-center space-x-2 z-10">
            <button
              onClick={handleOpenConfigure}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-none bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-acid" />
              <span>Configure</span>
            </button>
            <button
              onClick={startAddSponsor}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-none bg-acid text-ink-950 font-mono font-bold text-xs hover:bg-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        )}

        {/* Group by Tier */}
        {Object.entries(
          sponsors.reduce((acc, sponsor) => {
            const tier = sponsor.tier || 'PARTNER';
            if (!acc[tier]) acc[tier] = [];
            acc[tier].push(sponsor);
            return acc;
          }, {})
        ).map(([tier, tierSponsors]) => (
          <div key={tier} className="flex flex-col items-center space-y-6 w-full">
            <h3 className="text-sm font-mono font-bold tracking-[0.2em] uppercase text-mist opacity-80">
              {tier}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16">
              {tierSponsors.map(sponsor => (
                <div key={sponsor.id} className="group flex flex-col items-center cursor-pointer" onClick={() => {
                  if (isAdmin) startEditSponsor(sponsor);
                  else if (sponsor.websiteUrl && sponsor.websiteUrl !== '#') window.open(sponsor.websiteUrl, '_blank');
                }}>
                  {sponsor.logoUrl && !brokenImages[sponsor.id] ? (
                    <img 
                      src={sponsor.logoUrl} 
                      alt={sponsor.name}
                      className="h-12 sm:h-16 object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                      onError={() => handleImageError(sponsor.id)}
                    />
                  ) : (
                    <span className="text-2xl font-black tracking-tight text-white/70 group-hover:text-white transition-colors">
                      {sponsor.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
      </div>
`;

// use regex to replace everything from the first "return (" up to "{mounted && isEditorOpen && createPortal("
code = code.replace(/return\s*\(\s*<>\s*(?:.|\n|\r)*?(\{mounted && isEditorOpen && createPortal\()/m, newRender + '\n      $1');

fs.writeFileSync('components/SponsorsBox.tsx', code);
