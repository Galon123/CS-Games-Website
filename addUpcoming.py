import re

with open('components/BadmintonBracketSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

upcoming_html = """          {/* Upcoming Matches Preview (Added as requested) */}
          <div className="mt-6 mb-4 flex items-center justify-between bg-acid/5 border border-acid/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-acid/10 rounded-lg">
                <Calendar className="w-5 h-5 text-acid" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-paper font-mono uppercase tracking-wider">Upcoming Key Matches</h3>
                <p className="text-xs text-mist">
                  {category === 'mens' 
                    ? "Next: M-QF-2 (Prideson/Lee vs Shivas/Sahil), M-QF-3 (Anirudh/Francis vs Team Ayushraj)" 
                    : "Next: W-SF-1 (Team Glenys vs Team Devananda), W-SF-2 (Team Archana vs Team Sushma)"}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex space-x-2">
              <div className="px-3 py-1 bg-ink-900 border border-white/10 rounded-full text-[10px] text-fog font-mono">
                {category === 'mens' ? 'Quarter Finals' : 'Semi Finals'}
              </div>
            </div>
          </div>

          {/* 3. MAIN BRACKET VIEW"""

content = content.replace('{/* 3. MAIN BRACKET VIEW', upcoming_html)

with open('components/BadmintonBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
