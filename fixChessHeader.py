import re

# 1. Update ChessView.tsx
with open('components/ChessView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The Tournament Header in ChessView
old_header = """        {/* Tournament Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">"""
new_header = """        {/* Tournament Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-6">
          <div className="bg-ink-800/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-card w-full flex flex-col md:flex-row md:items-end justify-between gap-6">"""

content = content.replace(old_header, new_header)

# I need to close the extra div after the Tournament Header content.
# The header ends right before {/* Navigation Tabs */}
old_end_header = """            </div>
          </div>
        </div>

        {/* Navigation Tabs */}"""
new_end_header = """            </div>
          </div>
          </div>
        </div>

        {/* Navigation Tabs */}"""

if old_end_header in content:
    content = content.replace(old_end_header, new_end_header)
else:
    # try another match
    content = content.replace('            </div>\n          </div>\n\n        {/* Navigation Tabs */}', '            </div>\n          </div>\n        </div>\n\n        {/* Navigation Tabs */}')

with open('components/ChessView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update BadmintonBracketSection.tsx pills
with open('components/BadmintonBracketSection.tsx', 'r', encoding='utf-8') as f:
    badminton_content = f.read()

old_pills = """{/* Men's vs Women's Doubles Tab Switcher */}
          <div className="w-full grid grid-cols-2 gap-2 bg-ink-900/80 p-1.5 rounded-xl border border-white/10">"""

new_pills = """{/* Men's vs Women's Doubles Tab Switcher */}
          <div className="w-full grid grid-cols-2 gap-2 mt-6">"""

badminton_content = badminton_content.replace(old_pills, new_pills)

with open('components/BadmintonBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(badminton_content)

