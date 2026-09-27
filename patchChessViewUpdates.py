import os
import re

with open('components/ChessView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add ChessBlurredBackground import
content = content.replace("import ChessHeroCarousel from '@/components/ChessHeroCarousel'", "import ChessHeroCarousel from '@/components/ChessHeroCarousel'\nimport ChessBlurredBackground from '@/components/ChessBlurredBackground'")

# Add ChessBlurredBackground usage
content = content.replace('<div className="w-full flex flex-col min-h-screen bg-canvas text-cream selection:bg-acid selection:text-acid-ink font-sans">', '<div className="w-full flex flex-col min-h-screen bg-canvas text-cream selection:bg-acid selection:text-acid-ink font-sans">\n      <ChessBlurredBackground />\n')

# Replace category toggle with badminton-like style, and the Standings/Rounds toggle with sticky navbar
new_nav = """
        {/* Category Toggle (Badminton Style) */}
        <div className="flex bg-white/5 p-1 rounded-xl items-center mx-auto w-fit mb-8 z-10 relative backdrop-blur-sm">
          <button
            onClick={() => setCategory('mens')}
            className={`flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg font-mono font-bold transition-all ${
              category === 'mens'
                ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                : 'text-mist hover:text-paper hover:bg-white/5'
            }`}
          >
            <span>Men's Chess</span>
          </button>
          <button
            onClick={() => setCategory('womens')}
            className={`flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg font-mono font-bold transition-all ${
              category === 'womens'
                ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                : 'text-mist hover:text-paper hover:bg-white/5'
            }`}
          >
            <span>Women's Chess</span>
          </button>
        </div>
      </main>

      {/* Dedicated Navbar (CS Cup Style) */}
      <div className="sticky top-0 z-40 w-full bg-ink-950/80 backdrop-blur-md border-b border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-center space-x-2 md:space-x-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('standings')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-bold font-mono text-sm transition-all whitespace-nowrap ${
              activeTab === 'standings' ? 'bg-white/10 text-paper border border-white/20' : 'text-fog hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Standings</span>
          </button>
          <button
            onClick={() => setActiveTab('rounds')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-bold font-mono text-sm transition-all whitespace-nowrap ${
              activeTab === 'rounds' ? 'bg-white/10 text-paper border border-white/20' : 'text-fog hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Rounds</span>
          </button>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12 z-10 relative">
"""

# We need to replace the old toggles:
old_toggles_pattern = r'\{/\* Category & Section Toggles \*/\}.*?\{/\* Content Area \*/\}'
content = re.sub(old_toggles_pattern, new_nav + '\n        {/* Content Area */}', content, flags=re.DOTALL)

with open('components/ChessView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

