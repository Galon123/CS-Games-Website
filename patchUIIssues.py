import os
import re

# 1. Update layout.tsx footer
with open('app/layout.tsx', 'r', encoding='utf-8') as f:
    layout = f.read()
layout = layout.replace('<footer className="border-t border-white/10 bg-ink-900 py-12 text-xs text-mist">', '<footer className="border-t border-white/10 bg-ink-950 relative z-20 py-12 text-xs text-mist">')
with open('app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(layout)

# 2. Update ChessBlurredBackground.tsx (use /posters/chess.jpg and remove SVG)
with open('components/ChessBlurredBackground.tsx', 'r', encoding='utf-8') as f:
    chess_bg = f.read()

chess_bg = chess_bg.replace(
    "'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=2400&auto=format&fit=crop&q=85'",
    "'/posters/chess.jpg'"
)
# Remove the SVG geometry
chess_bg = re.sub(r'\{/\* Chess board geometry \*/\}.*?</svg>\s*</div>', '', chess_bg, flags=re.DOTALL)
with open('components/ChessBlurredBackground.tsx', 'w', encoding='utf-8') as f:
    f.write(chess_bg)

# 3. Update ChessHeroCarousel.tsx (use /posters/chess.jpg)
with open('components/ChessHeroCarousel.tsx', 'r', encoding='utf-8') as f:
    chess_hero = f.read()

chess_hero = re.sub(r"url:\s*'.*?'", "url: '/posters/chess.jpg'", chess_hero)
with open('components/ChessHeroCarousel.tsx', 'w', encoding='utf-8') as f:
    f.write(chess_hero)

# 4. Update GameDetailView.tsx (Remove SponsorsBox)
with open('components/GameDetailView.tsx', 'r', encoding='utf-8') as f:
    gd = f.read()
gd = re.sub(r'<SponsorsBox />', '', gd)
with open('components/GameDetailView.tsx', 'w', encoding='utf-8') as f:
    f.write(gd)

# 5. Update ChessView.tsx (Remove SponsorsBox, Semi-transparent wrapper, Badminton toggle)
with open('components/ChessView.tsx', 'r', encoding='utf-8') as f:
    chess = f.read()

chess = re.sub(r'<SponsorsBox />', '', chess)
chess = re.sub(r"import SponsorsBox from '@/components/SponsorsBox'\n", '', chess)

# Badminton toggle replacement
old_toggle = r'\{/\* Category Toggle \(Badminton Style\) \*/\}.*?</div>\s*</main>'
new_toggle = """        {/* Category Toggle (Badminton Style) */}
        <div className="flex bg-ink-900 border border-white/5 p-1 rounded-xl items-center mx-auto w-full max-w-2xl mb-8 z-10 relative backdrop-blur-sm shadow-xl">
          <button
            onClick={() => setCategory('mens')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-mono font-bold transition-all ${
              category === 'mens'
                ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                : 'text-mist hover:text-paper hover:bg-white/5'
            }`}
          >
            <span>Men's Chess</span>
          </button>
          <button
            onClick={() => setCategory('womens')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-mono font-bold transition-all ${
              category === 'womens'
                ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                : 'text-mist hover:text-paper hover:bg-white/5'
            }`}
          >
            <span>Women's Chess</span>
          </button>
        </div>
      </main>"""
chess = re.sub(old_toggle, new_toggle, chess, flags=re.DOTALL)

# Add semi-transparent wrapper to the content area
content_area_start = r'\{/\* Content Area \*/\}\s*<div className="animate-fade-in min-h-\[50vh\]">'
content_area_replacement = """        {/* Content Area */}
        <div className="animate-fade-in min-h-[50vh] bg-ink-950/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10 shadow-2xl">"""
chess = re.sub(content_area_start, content_area_replacement, chess)
# we need to close this div, but the end of main is already closed correctly. The div replaced is just the wrapper.

with open('components/ChessView.tsx', 'w', encoding='utf-8') as f:
    f.write(chess)


# 6. Update CsCupView.tsx (Remove SponsorsBox, Semi-transparent wrapper)
with open('components/CsCupView.tsx', 'r', encoding='utf-8') as f:
    cscup = f.read()

cscup = re.sub(r'<SponsorsBox />', '', cscup)
cscup = re.sub(r"import SponsorsBox from '@/components/SponsorsBox'\n", '', cscup)

content_area_start_cscup = r'\{/\* Content Area \*/\}\s*<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in min-h-\[50vh\]">'
content_area_replacement_cscup = """        {/* Content Area */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in min-h-[50vh] relative z-10">
          <div className="bg-ink-950/60 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-10 border border-white/10 shadow-2xl">"""
cscup = re.sub(content_area_start_cscup, content_area_replacement_cscup, cscup)

# Now we need to add the closing `</div>` right before `</main>`
cscup = re.sub(r'</main>', '  </div>\n        </main>', cscup)

with open('components/CsCupView.tsx', 'w', encoding='utf-8') as f:
    f.write(cscup)
