import re

with open('components/ChessView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Move Category Toggle into the Header Container
old_header = """        {/* Tournament Header */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 relative z-10 mb-8">
          <div className="bg-ink-800/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-card flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-acid">
                <div className="bg-acid/10 border border-acid/20 px-3 py-1 rounded-full flex items-center space-x-2">
                  <Activity className="w-3 h-3" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                    Official Tournament Draw
                  </span>
                </div>
                <span className="text-[10px] font-mono text-fog uppercase tracking-widest">
                  • CS Games 2026 Chess Championship
                </span>
              </div>
              
              <h2 className="font-serif font-black text-4xl sm:text-5xl text-paper uppercase tracking-wider leading-none">
                CHESS TOURNAMENT
              </h2>
              
              <p className="text-xs sm:text-sm text-mist leading-relaxed font-sans">
                Official tournament standings and match progression across all championship rounds.
              </p>
            </div>
          </div>
        </div>

        {/* Category Toggle (Badminton Style) */}
        <div className="flex bg-ink-900 border border-white/5 p-1 rounded-xl items-center mx-auto w-full max-w-2xl mb-8 z-10 relative backdrop-blur-sm shadow-xl">"""

new_header = """        {/* Tournament Header */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 relative z-10 mb-8">
          <div className="bg-ink-800/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-card flex flex-col gap-6 w-full">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-acid">
                <div className="bg-acid/10 border border-acid/20 px-3 py-1 rounded-full flex items-center space-x-2">
                  <Activity className="w-3 h-3" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                    Official Tournament Draw
                  </span>
                </div>
                <span className="text-[10px] font-mono text-fog uppercase tracking-widest">
                  • CS Games 2026 Chess Championship
                </span>
              </div>
              
              <h2 className="font-serif font-black text-4xl sm:text-5xl text-paper uppercase tracking-wider leading-none">
                CHESS TOURNAMENT
              </h2>
              
              <p className="text-xs sm:text-sm text-mist leading-relaxed font-sans">
                Official tournament standings and match progression across all championship rounds.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 w-full">
              {/* Category Toggle (Badminton Style) */}
              <div className="w-full grid grid-cols-2 gap-2 mt-2">"""

# For the closing divs, we need to adjust because we removed a wrapper around Category Toggle.
# In original, Category Toggle ends with:
old_toggle_end = """            </button>
          </div>"""
new_toggle_end = """            </button>
              </div>
            </div>
          </div>
        </div>"""

if old_header in content:
    content = content.replace(old_header, new_header)
    # The first instance of old_toggle_end after the toggle
    content = content.replace(old_toggle_end, new_toggle_end, 1)


# 2. Fix Navbar background
old_navbar = """        {/* Dedicated Navbar (CS Cup Style) */}
        <div className="sticky top-0 z-40 w-full bg-ink-950/80 backdrop-blur-md border-b border-white/10">"""

new_navbar = """        {/* Dedicated Navbar (CS Cup Style) */}
        <div className="sticky top-0 z-40 w-full pt-4">"""

content = content.replace(old_navbar, new_navbar)

with open('components/ChessView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
