import re

with open('components/CarromBracketSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Quarter Finals
old_qf = """              {/* Quarter Finals */}
              <div className="flex flex-col justify-between space-y-8 relative w-72 shrink-0">
                {matchesByRound.quarter_finals.map((match, i) => (
                  <div key={match.id} className="relative z-10">
                    {renderMatchCard(match)}
                  </div>
                ))}
              </div>"""

new_qf = """              {/* Quarter Finals */}
              <div className="w-72 shrink-0 flex flex-col justify-around flex-grow space-y-8">
                <div className="space-y-16 p-2 rounded-xl bg-white/[0.015] border border-white/5 relative z-10">
                  {matchesByRound.quarter_finals[0] && renderMatchCard(matchesByRound.quarter_finals[0])}
                  {matchesByRound.quarter_finals[1] && renderMatchCard(matchesByRound.quarter_finals[1])}
                </div>
                <div className="space-y-16 p-2 rounded-xl bg-white/[0.015] border border-white/5 relative z-10">
                  {matchesByRound.quarter_finals[2] && renderMatchCard(matchesByRound.quarter_finals[2])}
                  {matchesByRound.quarter_finals[3] && renderMatchCard(matchesByRound.quarter_finals[3])}
                </div>
              </div>"""
content = content.replace(old_qf, new_qf)

# 2. Update QF to SF connector
old_qf_sf_connector = """              {/* Connector from QF to SF */}
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
              </div>"""

new_qf_sf_connector = """              {/* Connector from QF to SF */}
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
              </div>"""
content = content.replace(old_qf_sf_connector, new_qf_sf_connector)

# 3. Update Semi Finals
old_sf = """              {/* Semi Finals */}
              <div className="flex flex-col justify-around relative w-72 shrink-0">
                {matchesByRound.semi_finals.map((match, i) => (
                  <div key={match.id} className="relative z-10 mt-16 mb-16">
                    {renderMatchCard(match)}
                  </div>
                ))}
              </div>"""

new_sf = """              {/* Semi Finals */}
              <div className="w-72 shrink-0 flex flex-col justify-around flex-grow space-y-16">
                <div className="space-y-48 p-2 rounded-xl bg-white/[0.015] border border-white/5 relative z-10">
                  {matchesByRound.semi_finals[0] && renderMatchCard(matchesByRound.semi_finals[0])}
                  {matchesByRound.semi_finals[1] && renderMatchCard(matchesByRound.semi_finals[1])}
                </div>
              </div>"""
content = content.replace(old_sf, new_sf)

# 4. Update SF to F connector
old_sf_f_connector = """              {/* Connector from SF to F */}
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
              </div>"""

new_sf_f_connector = """              {/* Connector from SF to F */}
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
              </div>"""
content = content.replace(old_sf_f_connector, new_sf_f_connector)

old_card = """className="relative w-full md:w-72 shrink-0 bg-ink-900 border border-white/10 rounded-2xl shadow-xl p-3 z-10 flex flex-col space-y-2">"""
new_card = """className="relative w-full md:w-72 shrink-0 bg-ink-900 border border-white/10 rounded-2xl shadow-xl p-3 z-10 flex flex-col justify-between h-[162px]">"""
content = content.replace(old_card, new_card)

with open('components/CarromBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
