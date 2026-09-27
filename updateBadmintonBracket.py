import re

with open('components/BadmintonBracketSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'\{/\* Quick Metrics & Reset Draw \*/\}.*?(?=\{/\* Bracket Scroll Area \*/\})'

new_metrics = """{/* Quick Metrics & Reset Draw */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isAdmin && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-mist hover:text-paper transition-all"
                title="Reset bracket back to original PDF draw"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Reset Draw</span>
              </button>
            )}
          </div>
        </div>

        """

content = re.sub(pattern, new_metrics, content, flags=re.DOTALL)

with open('components/BadmintonBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
