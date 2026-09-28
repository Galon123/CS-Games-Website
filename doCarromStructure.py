import re

with open('components/CarromBracketSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_scroll_area = """          <div className="w-full overflow-x-auto pb-16 no-scrollbar relative z-10 cursor-grab active:cursor-grabbing">
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
          </div>"""

# Ensure Carrom match card has fixed height exactly like Badminton (h-[162px])
old_card_class = """className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden shadow-card ${"""
new_card_class = """className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden shadow-card h-[162px] flex flex-col justify-between ${"""
content = content.replace(old_card_class, new_card_class)

# Replace the block
content = re.sub(
    r'<div className="w-full overflow-x-auto pb-16 no-scrollbar relative z-10 cursor-grab active:cursor-grabbing">.*?</div>\s*</div>\s*</div>\s*</div>',
    new_scroll_area + "\n        </div>",
    content,
    flags=re.DOTALL
)

with open('components/CarromBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
