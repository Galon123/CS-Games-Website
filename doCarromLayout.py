import re

with open('components/CarromBracketSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Quarter Finals rendering to use pairs
old_qf = """                {/* Quarter Finals */}
                <div className="flex flex-col justify-between space-y-8 relative w-72 shrink-0">
                  {matchesByRound.quarter_finals.map((match, i) => (
                    <div key={match.id} className="relative z-10">
                      {renderMatchCard(match)}
                    </div>
                  ))}
                </div>"""

new_qf = """                {/* Quarter Finals */}
                <div className="w-72 shrink-0 flex flex-col justify-around flex-grow space-y-4">
                  {/* Pair 1: Q1 & Q2 */}
                  <div className="space-y-2 p-1.5 rounded-xl bg-white/[0.015] border border-white/5 relative z-10">
                    {matchesByRound.quarter_finals[0] && renderMatchCard(matchesByRound.quarter_finals[0])}
                    {matchesByRound.quarter_finals[1] && renderMatchCard(matchesByRound.quarter_finals[1])}
                  </div>
                  {/* Pair 2: Q3 & Q4 */}
                  <div className="space-y-2 p-1.5 rounded-xl bg-white/[0.015] border border-white/5 relative z-10">
                    {matchesByRound.quarter_finals[2] && renderMatchCard(matchesByRound.quarter_finals[2])}
                    {matchesByRound.quarter_finals[3] && renderMatchCard(matchesByRound.quarter_finals[3])}
                  </div>
                </div>"""

content = content.replace(old_qf, new_qf)

# Wait, what about Semi Finals? Semi Finals feed into Finals. 
# There are 2 Semi Finals. Are they grouped? No, they don't need to be grouped because they feed into a single Final.
# Let's check how the Semi Finals to Final connector is structured.
# In my injected SVG:
old_sf = """                {/* Semi Finals */}
                <div className="flex flex-col justify-around relative w-72 shrink-0">
                  {matchesByRound.semi_finals.map((match, i) => (
                    <div key={match.id} className="relative z-10">
                      {renderMatchCard(match)}
                    </div>
                  ))}
                </div>"""

new_sf = """                {/* Semi Finals */}
                <div className="w-72 shrink-0 flex flex-col justify-around flex-grow space-y-4 py-[35px]">
                  <div className="space-y-2 p-1.5 relative z-10 h-full flex flex-col justify-between">
                    {matchesByRound.semi_finals[0] && renderMatchCard(matchesByRound.semi_finals[0])}
                    <div className="h-[120px]" /> {/* Spacer to push them apart to match the SVG */}
                    {matchesByRound.semi_finals[1] && renderMatchCard(matchesByRound.semi_finals[1])}
                  </div>
                </div>"""

# Let's look at Badminton's Semi-Final layout to make it perfectly identical.
