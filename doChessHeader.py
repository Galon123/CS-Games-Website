import re

with open('components/ChessView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_header_block = """        {/* Tournament Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
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
        </div>"""

new_header_block = """        {/* Tournament Header */}
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
        </div>"""

content = content.replace(old_header_block, new_header_block)
with open('components/ChessView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
