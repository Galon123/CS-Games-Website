import re

with open('components/CarromBracketSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_scroll_area = """          <div className="w-full overflow-x-auto pb-16 no-scrollbar relative z-10 cursor-grab active:cursor-grabbing">
            <div className="flex min-w-max md:justify-center p-4">
              <div className="flex items-stretch gap-0 relative">
                
                {/* Quarter Finals */}
                <div className="flex flex-col justify-between space-y-8 relative w-72 shrink-0">
                  {matchesByRound.quarter_finals.map((match, i) => (
                    <div key={match.id} className="relative z-10">
                      {renderMatchCard(match)}
                    </div>
                  ))}
                </div>
  
                {/* Connector from QF to SF */}
                <div className="w-10 shrink-0 hidden md:flex flex-col">
                  <div className="mb-4 pb-2.5 invisible flex items-center justify-between" aria-hidden="true">
                    <div className="h-5" />
                  </div>
                  <div className="flex flex-col justify-around flex-grow space-y-4 select-none pointer-events-none py-[35px]">
                    {[0, 1].map((pairIdx) => (
                      <div key={pairIdx} className="space-y-2 p-1.5">
                        <div className="h-[162px] flex items-center justify-center">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                            <path d="M 0 0 L 20 0 L 20 100 L 0 100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                            <path d="M 20 50 L 40 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Semi Finals */}
                <div className="flex flex-col justify-around relative w-72 shrink-0">
                  {matchesByRound.semi_finals.map((match, i) => (
                    <div key={match.id} className="relative z-10">
                      {renderMatchCard(match)}
                    </div>
                  ))}
                </div>

                {/* Connector from SF to F */}
                <div className="w-10 shrink-0 hidden md:flex flex-col">
                  <div className="mb-4 pb-2.5 invisible flex items-center justify-between" aria-hidden="true">
                    <div className="h-5" />
                  </div>
                  <div className="flex flex-col justify-around flex-grow space-y-4 select-none pointer-events-none py-28">
                    <div className="space-y-2 p-1.5">
                      <div className="h-[250px] flex items-center justify-center">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                          <path d="M 0 0 L 20 0 L 20 100 L 0 100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                          <path d="M 20 50 L 40 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finals */}
                <div className="flex flex-col justify-center relative w-72 shrink-0">
                  {matchesByRound.finals.map((match) => (
                    <div key={match.id} className="relative z-10">
                      {renderMatchCard(match)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>"""

# Replace the block from `          <div className="w-full overflow-x-auto pb-16 no-scrollbar relative z-10 cursor-grab active:cursor-grabbing">` to the end of the finals wrapper
content = re.sub(
    r'<div className="w-full overflow-x-auto pb-16 no-scrollbar relative z-10 cursor-grab active:cursor-grabbing">.*?</div>\s*</div>\s*</div>\s*</div>',
    new_scroll_area + "\n        </div>",
    content,
    flags=re.DOTALL
)

with open('components/CarromBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
