import re

with open('components/CarromBracketSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_return = """  return (
    <section className="w-full relative py-12 md:py-24 overflow-hidden z-10 mb-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-ink-950/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-acid">
              <div className="bg-acid/10 border border-acid/20 px-3 py-1 rounded-full flex items-center space-x-2">
                <Activity className="w-3 h-3" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                  Official Tournament Draw
                </span>
              </div>
              <span className="text-[10px] font-mono text-fog uppercase tracking-widest">
                • CS Games 2026 Carrom Championship
              </span>
            </div>
            
            <h2 className="font-serif font-black text-4xl sm:text-5xl text-paper uppercase tracking-wider leading-none">
              CARROM
            </h2>
            
            <p className="text-xs sm:text-sm text-mist leading-relaxed font-sans">
              Official tournament knockout draw and match progression.
            </p>
          </div>
        </div>

        {/* Bracket Scroll Area */}
        <div className="w-full overflow-x-auto pb-16 no-scrollbar relative z-10 cursor-grab active:cursor-grabbing">
          <div className="flex min-w-max md:justify-center p-4">
            <div className="flex items-stretch gap-0 relative">
              
              {/* Quarter Finals */}
              <div className="w-72 shrink-0 flex flex-col justify-around flex-grow space-y-8">
                {/* Pair A: QF-1 & QF-2 */}
                <div className="space-y-16 p-2 rounded-xl bg-white/[0.015] border border-white/5 relative z-10">
                  {matchesByRound.quarter_finals[0] && renderMatchCard(matchesByRound.quarter_finals[0])}
                  {matchesByRound.quarter_finals[1] && renderMatchCard(matchesByRound.quarter_finals[1])}
                </div>
                {/* Pair B: QF-3 & QF-4 */}
                <div className="space-y-16 p-2 rounded-xl bg-white/[0.015] border border-white/5 relative z-10">
                  {matchesByRound.quarter_finals[2] && renderMatchCard(matchesByRound.quarter_finals[2])}
                  {matchesByRound.quarter_finals[3] && renderMatchCard(matchesByRound.quarter_finals[3])}
                </div>
              </div>

              {/* Connector QF to SF */}
              <div className="w-10 shrink-0 hidden md:flex flex-col">
                <div className="flex flex-col justify-around flex-grow space-y-8 select-none pointer-events-none">
                  {[0, 1].map((pairIdx) => (
                    <div key={pairIdx} className="h-[520px] flex items-center">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                        <path d="M 0,25 H 20 V 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                        <path d="M 0,75 H 20 V 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                        <line x1="20" y1="50" x2="40" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semi Finals */}
              <div className="w-72 shrink-0 flex flex-col justify-around flex-grow space-y-16">
                <div className="space-y-48 p-2 rounded-xl bg-white/[0.015] border border-white/5 relative z-10">
                  {matchesByRound.semi_finals[0] && renderMatchCard(matchesByRound.semi_finals[0])}
                  {matchesByRound.semi_finals[1] && renderMatchCard(matchesByRound.semi_finals[1])}
                </div>
              </div>

              {/* Connector SF to F */}
              <div className="w-10 shrink-0 hidden md:flex flex-col">
                <div className="flex flex-col justify-around flex-grow select-none pointer-events-none">
                  <div className="h-[600px] flex items-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                      <path d="M 0,25 H 20 V 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                      <path d="M 0,75 H 20 V 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                      <line x1="20" y1="50" x2="40" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Finals */}
              <div className="w-72 shrink-0 flex flex-col justify-center relative">
                <div className="relative z-10 p-2">
                  {matchesByRound.finals[0] && renderMatchCard(matchesByRound.finals[0])}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
"""

content = re.sub(r'  return \(\s*<section className="w-full relative.*?\)\s*}', new_return, content, flags=re.DOTALL)

# Ensure match card has exactly h-[162px]
old_card_class = """className={`relative w-full md:w-72 shrink-0 bg-ink-900 border border-white/10 rounded-2xl shadow-xl p-3 z-10 flex flex-col space-y-2`}>"""
new_card_class = """className={`relative w-full md:w-72 shrink-0 bg-ink-900 border border-white/10 rounded-2xl shadow-xl p-3 z-10 flex flex-col justify-between h-[162px]`}>"""
content = content.replace(old_card_class, new_card_class)

with open('components/CarromBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
