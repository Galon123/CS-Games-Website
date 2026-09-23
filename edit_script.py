import re

with open('components/GameDetailView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. nextMatch logic
content = content.replace(
'''  const upcomingMatchesCount = sportMatches.filter((m) => m.status === 'upcoming').length''',
'''  const upcomingMatches = sportMatches.filter((m) => m.status === 'upcoming')
  const upcomingMatchesCount = upcomingMatches.length
  const nextMatch = [...upcomingMatches].sort((a,b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime())[0]

  const renderTabsNav = () => (
    <div className="sticky top-16 sm:top-18 z-30 bg-ink-900/90 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-white/10 mb-6">
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
        {(isCsCup ? [
          {
            key: 'home',
            label: 'Home',
            count: undefined,
            icon: Home,
          },
          {
            key: 'matches',
            label: 'Matches',
            count: sportMatches.length,
            icon: Calendar,
          },
          {
            key: 'table',
            label: 'Table',
            count: leaderboards.filter(l => l.sport_id === sport?.id).length,
            icon: Trophy,
          },
          {
            key: 'stats',
            label: 'Stats',
            count: players.filter(p => p.team?.sport_id === sport?.id).length,
            icon: Activity,
          }
        ] : [
          {
            key: 'fixtures',
            label: 'Fixtures & Matches',
            count: sportMatches.length,
            icon: Calendar,
          },
          {
            key: 'standings',
            label: 'Points Table',
            count: leaderboards.filter(l => l.sport_id === sport?.id).length,
            icon: Trophy,
          },
          {
            key: 'squads',
            label: 'Squads & Rosters',
            count: teams.filter(t => t.sport_id === sport?.id).length > 0 ? teams.filter(t => t.sport_id === sport?.id).length : players.filter(p => p.team?.sport_id === sport?.id).length,
            icon: Users,
          },
          {
            key: 'rules',
            label: 'Regulations & Venue',
            count: undefined,
            icon: BookOpen,
          },
        ]).map((tab) => {
          const Icon = tab.icon
          const isSelected = activeTab === tab.key

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={` + '`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${' + '''
                isSelected
                  ? isCsCup && tab.key === 'tactics'
                    ? 'bg-acid text-acid-ink font-black shadow-[0_0_12px_rgba(215,242,43,0.3)]'
                    : 'bg-white/15 text-paper border border-white/25 shadow-xs font-bold'
                  : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10 border border-white/10'
              }''' + '`' + '''}
            >
              <Icon
                className={` + '`w-3.5 h-3.5 ${' + '''
                  isSelected ? (isCsCup && tab.key === 'tactics' ? 'text-acid-ink' : 'text-acid') : 'text-fog'
                }''' + '`' + '''}
              />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={` + '`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${' + '''
                    isSelected ? 'bg-white/20 text-paper font-bold' : 'bg-white/10 text-mist'
                  }''' + '`' + '''}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )'''
)

# 2. Add upcoming matches box to home tab
home_tab_box = '''
          <div className="bg-ink-800 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-card">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-paper tracking-tight">
              Welcome to CS Cup 2026.
            </h2>
            <p className="text-sm text-mist leading-relaxed font-sans">
              The grand departmental football showdown is here. Explore the Matches, check the latest Points Table, and view detailed player Stats using the navigation tabs above.
            </p>
          </div>

          {/* Upcoming Matches Box */}
          <div 
            className="bg-ink-800 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-card flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all" 
            onClick={() => setActiveTab('matches')}
          >
            <div>
              <h3 className="font-serif font-bold text-lg text-paper flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-acid" />
                <span>Upcoming Matches</span>
              </h3>
              <p className="text-sm text-mist mt-1">
                {upcomingMatchesCount > 0 
                  ? `${upcomingMatchesCount} matches scheduled. Next: ${nextMatch?.team_a?.name || 'TBD'} vs ${nextMatch?.team_b?.name || 'TBD'}`
                  : 'No upcoming matches currently scheduled.'}
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-full group-hover:bg-acid group-hover:text-acid-ink text-acid transition-colors">
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </div>
          </div>
'''
content = content.replace(
    '<div className="bg-ink-800 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-card">\n            <h2 className="text-xl sm:text-2xl font-serif font-black text-paper tracking-tight">\n              Welcome to CS Cup 2026.\n            </h2>\n            <p className="text-sm text-mist leading-relaxed font-sans">\n              The grand departmental football showdown is here. Explore the Matches, check the latest Points Table, and view detailed player Stats using the navigation tabs above.\n            </p>\n          </div>',
    home_tab_box.strip()
)

# 3. Conditionally hide jump to
content = content.replace(
'''{/* Quick Game Switcher Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">''',
'''{/* Quick Game Switcher Bar */}
        {!isCsCup && (
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">'''
)
content = content.replace(
'''                </Link>
              )
            })}
          </div>
        </div>''',
'''                </Link>
              )
            })}
          </div>
        )}
        </div>'''
)

# 4. Use renderTabsNav for CS Cup (above carousel)
content = content.replace(
    ') : isCsCup ? (\n        <div className="space-y-6">\n          <FootballHeroCarousel />',
    ') : isCsCup ? (\n        <div className="space-y-6">\n          {renderTabsNav()}\n          <FootballHeroCarousel />'
)

# 5. Hide old tabs for CS Cup
import re
pattern = r'<div className="sticky top-16.*?</button>\s*\)\s*}\)}\s*</div>\s*</div>'
content = re.sub(pattern, '{!isCsCup && renderTabsNav()}', content, flags=re.DOTALL)

with open('components/GameDetailView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
