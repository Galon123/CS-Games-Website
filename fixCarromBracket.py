import re

with open('components/CarromBracketSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the entire Bracket Scroll Area
new_bracket_html = """          {/* Bracket Scroll Area */}
          <div className="w-full overflow-x-auto pb-16 no-scrollbar relative z-10 cursor-grab active:cursor-grabbing">
            <div className="flex min-w-max md:justify-center p-4">
              <div className="flex items-stretch gap-0 relative">
                {/* Quarter Finals */}
                <div className="flex flex-col justify-between space-y-8 w-72 shrink-0 relative z-10">
                  {matchesByRound.quarter_finals.map((match, i) => (
                    <div key={match.id} className="relative z-10">
                      {renderMatchCard(match)}
                    </div>
                  ))}
                </div>

                {/* Connector from QF to SF */}
                <div className="w-10 md:w-16 shrink-0 flex flex-col hidden md:flex">
                  <div className="flex flex-col justify-around flex-grow space-y-4 select-none pointer-events-none py-10">
                    {[0, 1].map((pairIdx) => (
                      <div key={pairIdx} className="space-y-2 p-1.5">
                        <div className="h-[120px] flex items-center justify-center">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                            <path d="M 0 10 L 20 10 L 20 90 L 0 90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                            <path d="M 20 50 L 40 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Semi Finals */}
                <div className="flex flex-col justify-around w-72 shrink-0 relative z-10">
                  {matchesByRound.semi_finals.map((match, i) => (
                    <div key={match.id} className="relative z-10">
                      {renderMatchCard(match)}
                    </div>
                  ))}
                </div>

                {/* Connector from SF to F */}
                <div className="w-10 md:w-16 shrink-0 flex flex-col hidden md:flex">
                  <div className="flex flex-col justify-around flex-grow space-y-4 select-none pointer-events-none py-32">
                    <div className="space-y-2 p-1.5">
                      <div className="h-[220px] flex items-center justify-center">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                          <path d="M 0 10 L 20 10 L 20 90 L 0 90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                          <path d="M 20 50 L 40 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finals */}
                <div className="flex flex-col justify-center w-72 shrink-0 relative z-10">
                  {matchesByRound.finals.map((match) => (
                    <div key={match.id} className="relative z-10">
                      {renderMatchCard(match)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>"""

content = re.sub(r'\{\/\* Bracket Scroll Area \*\/}.*?</div>\s*</div>\s*</div>', new_bracket_html, content, flags=re.DOTALL)

with open('components/CarromBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
