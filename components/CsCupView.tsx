'use client'

import React, { useState } from 'react'
import FootballHeroCarousel from '@/components/FootballHeroCarousel'
import SponsorsBox from '@/components/SponsorsBox'
import { Home, Calendar, Trophy, Activity, X } from 'lucide-react'

const TEAMS = [
  { name: 'Jigarthanda FC', image: '/images/S1.png', squadImage: '/teams/S1.png' },
  { name: 'Kandam Boiz', image: '/images/S5.png', squadImage: '/teams/S5.png' },
  { name: 'CS3 FC', image: '/images/S3.png', squadImage: '/teams/S3.png' },
  { name: 'Pallimoola FC', image: '/images/S7.png', squadImage: '/teams/S7.png' },
]

const DAY2_FIXTURES = [
  { id: 'f1', teamA: 'CS3 FC', teamB: 'Jigarthanda FC', time: '4:30 PM' },
  { id: 'f2', teamA: 'Pallimoola FC', teamB: 'CS3 FC', time: '5:00 PM' },
  { id: 'f3', teamA: 'Jigarthanda FC', teamB: 'Kandam Boiz', time: '5:30 PM' },
]

const DAY1_RESULTS = [
  { 
    id: 'm1', teamA: 'Pallimoola FC', scoreA: 1, teamB: 'Jigarthanda FC', scoreB: 3,
    stats: {
      shotsA: 11, shotsB: 13, onTargetA: 3, onTargetB: 8, foulsA: 0, foulsB: 0,
      yellowA: 0, yellowB: 0, redA: 0, redB: 0, offsideA: 0, offsideB: 0,
      cornerA: 4, cornerB: 3, savesA: 5, savesB: 3,
      scorersA: [], scorersB: []
    }
  },
  { 
    id: 'm2', teamA: 'CS3 FC', scoreA: 1, teamB: 'Kandam Boiz', scoreB: 3,
    stats: {
      shotsA: 10, shotsB: 20, onTargetA: 6, onTargetB: 10, foulsA: 1, foulsB: 0,
      yellowA: 0, yellowB: 0, redA: 0, redB: 0, offsideA: 0, offsideB: 0,
      cornerA: 3, cornerB: 4, savesA: 4, savesB: 7, penaltyA: 0, penaltyB: 1,
      scorersA: ['Sagar (OG)'], scorersB: ['Nabeel', 'Hathim (A: Aayas)', 'Nabeel (P)']
    }
  },
  { 
    id: 'm3', teamA: 'Pallimoola FC', scoreA: 0, teamB: 'Kandam Boiz', scoreB: 5,
    stats: {
      shotsA: 6, shotsB: 12, onTargetA: 4, onTargetB: 7, foulsA: 0, foulsB: 2,
      yellowA: 0, yellowB: 0, redA: 0, redB: 0, offsideA: 0, offsideB: 0,
      cornerA: 1, cornerB: 3, savesA: 2, savesB: 3,
      scorersA: [], scorersB: ['Nabeel (A: Hathim)', 'Nabeel', 'Dani (A: Nabeel)', 'Nabeel', 'Dani (A: Nabeel)']
    }
  },
]

const POINTS_TABLE = [
  { pos: 1, team: 'Kandam Boiz', p: 2, w: 2, d: 0, l: 0, gf: 8, ga: 1, gd: 7, pts: 6 },
  { pos: 2, team: 'Jigarthanda FC', p: 1, w: 1, d: 0, l: 0, gf: 3, ga: 1, gd: 2, pts: 3 },
  { pos: 3, team: 'CS3 FC', p: 1, w: 0, d: 0, l: 1, gf: 1, ga: 3, gd: -2, pts: 0 },
  { pos: 4, team: 'Pallimoola FC', p: 2, w: 0, d: 0, l: 2, gf: 1, ga: 8, gd: -7, pts: 0 },
]

const TOP_SCORERS = [
  { rank: 1, player: 'Nabeel', team: 'Kandam Boiz', goals: 5, assists: 2 },
  { rank: 2, player: 'Dani', team: 'Kandam Boiz', goals: 2, assists: 0 },
  { rank: 3, player: 'Hathim', team: 'Kandam Boiz', goals: 1, assists: 1 },
  { rank: 4, player: 'S. Kumar', team: 'Jigarthanda FC', goals: 2, assists: 0 }, // Mock
  { rank: 5, player: 'V. Raj', team: 'Jigarthanda FC', goals: 1, assists: 1 }, // Mock
]

const GOALKEEPERS = [
  { rank: 1, player: 'K. Nair', team: 'Kandam Boiz', played: 2, saves: 10, gc: 1, cs: 1 },
  { rank: 2, player: 'A. Babu', team: 'Pallimoola FC', played: 2, saves: 7, gc: 8, cs: 0 },
  { rank: 3, player: 'R. Menon', team: 'Jigarthanda FC', played: 1, saves: 3, gc: 1, cs: 0 },
  { rank: 4, player: 'T. Jose', team: 'CS3 FC', played: 1, saves: 4, gc: 3, cs: 0 },
]

export default function CsCupView() {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)

  const tabs = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'matches', label: 'Matches', icon: Calendar },
    { key: 'points', label: 'Points Table', icon: Trophy },
    { key: 'stats', label: 'Stats', icon: Activity },
  ]

  return (
    <div className="w-full flex flex-col min-h-screen bg-canvas text-cream selection:bg-acid selection:text-acid-ink font-sans">
      
      {/* Hero Section */}
      <section className="w-full">
        <FootballHeroCarousel />
      </section>

      {/* Dedicated Navbar */}
      <div className="sticky top-0 z-40 w-full bg-ink-950/80 backdrop-blur-md border-b border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-center space-x-2 md:space-x-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)]'
                    : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-acid-ink' : 'text-fog'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="w-full space-y-16 animate-fade-in">
            {/* Upcoming Fixtures */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4 font-grotesk tracking-tight">
                upcoming fixtures
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DAY2_FIXTURES.map((match, idx) => (
                  <div key={idx} className="bg-ink-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-acid/50 transition-colors shadow-card">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-mono font-bold text-acid uppercase tracking-wider">Day 2</span>
                      <span className="text-sm font-mono text-mist bg-white/5 px-2 py-1 rounded-md">{match.time}</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-anton uppercase text-lg tracking-wide">{match.teamA}</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-fog">VS</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-anton uppercase text-lg tracking-wide">{match.teamB}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meet The Teams */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4 font-grotesk tracking-tight">
                meet the teams
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {TEAMS.map((team, idx) => (
                  <div key={idx} onClick={() => setSelectedTeam(team)} className="bg-ink-900 rounded-2xl overflow-hidden border border-white/10 group shadow-card cursor-pointer">
                    <div className="aspect-[3/4] relative">
                      <img src={team.image} alt={team.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                        <h3 className="text-3xl font-anton uppercase tracking-wide text-paper drop-shadow-md">{team.name}</h3>
                        <span className="text-[10px] font-mono text-acid bg-acid/10 px-2 py-1 rounded border border-acid/20 opacity-0 group-hover:opacity-100 transition-opacity">VIEW SQUAD</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MATCHES TAB */}
        {activeTab === 'matches' && (
          <div className="w-full space-y-16 animate-fade-in">
            {/* Day 2 Fixtures */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4 font-grotesk tracking-tight">
                day 2 fixtures
              </h2>
              <div className="flex flex-col space-y-4">
                {DAY2_FIXTURES.map((match, idx) => (
                  <div key={idx} className="bg-ink-900 border border-white/10 rounded-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center md:items-center hover:bg-ink-800 transition-colors">
                    <div className="flex-1 flex justify-end items-center pr-4 md:pr-8 w-full md:w-auto">
                      <span className="font-anton uppercase text-lg md:text-xl tracking-wide text-center md:text-right">{match.teamA}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center px-4 md:px-8 border-y md:border-y-0 md:border-x border-white/10 min-w-[120px] py-4 md:py-0 w-full md:w-auto my-4 md:my-0">
                      <span className="text-acid font-mono font-bold text-sm mb-1">{match.time}</span>
                      <span className="text-xs text-mist font-bold uppercase tracking-widest">VS</span>
                    </div>
                    <div className="flex-1 flex justify-start items-center pl-4 md:pl-8 w-full md:w-auto">
                      <span className="font-anton uppercase text-lg md:text-xl tracking-wide text-center md:text-left">{match.teamB}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Day 1 Results */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4 font-grotesk tracking-tight">
                day 1 results
              </h2>
              <div className="flex flex-col space-y-4">
                {DAY1_RESULTS.map((match, idx) => (
                  <div key={idx} onClick={() => setSelectedMatch(match)} className="bg-ink-900 border border-white/10 rounded-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center md:items-center hover:bg-ink-800 transition-colors cursor-pointer group">
                    <div className="flex-1 flex justify-end items-center pr-4 md:pr-8 w-full md:w-auto">
                      <span className="font-anton uppercase text-lg md:text-xl tracking-wide text-center md:text-right">{match.teamA}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2 px-4 md:px-8 border-y md:border-y-0 md:border-x border-white/10 min-w-[140px] py-4 md:py-0 w-full md:w-auto my-4 md:my-0 group-hover:border-acid/30 transition-colors">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl font-black text-paper font-mono">{match.scoreA}</span>
                        <span className="text-mist font-bold">-</span>
                        <span className="text-3xl font-black text-paper font-mono">{match.scoreB}</span>
                      </div>
                      <span className="text-[10px] font-mono text-acid bg-acid/10 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">VIEW STATS</span>
                    </div>
                    <div className="flex-1 flex justify-start items-center pl-4 md:pl-8 w-full md:w-auto">
                      <span className="font-anton uppercase text-lg md:text-xl tracking-wide text-center md:text-left">{match.teamB}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* POINTS TABLE TAB */}
        {activeTab === 'points' && (
          <div className="w-full space-y-8 animate-fade-in">
            <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4 font-grotesk tracking-tight">
              points table
            </h2>
            <div className="bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-card overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-ink-950/50 border-b border-white/10 text-xs font-anton uppercase tracking-wider text-mist text-sm">
                    <th className="p-4 text-center">Pos</th>
                    <th className="p-4">Team</th>
                    <th className="p-4 text-center">P</th>
                    <th className="p-4 text-center">W</th>
                    <th className="p-4 text-center">D</th>
                    <th className="p-4 text-center">L</th>
                    <th className="p-4 text-center">GF</th>
                    <th className="p-4 text-center">GA</th>
                    <th className="p-4 text-center">GD</th>
                    <th className="p-4 text-center text-acid">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {POINTS_TABLE.map((row) => (
                    <tr key={row.pos} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-center font-mono font-bold text-fog">{row.pos}</td>
                      <td className="p-4 font-anton uppercase text-paper tracking-wide text-lg whitespace-nowrap">{row.team}</td>
                      <td className="p-4 text-center font-mono text-fog">{row.p}</td>
                      <td className="p-4 text-center font-mono text-fog">{row.w}</td>
                      <td className="p-4 text-center font-mono text-fog">{row.d}</td>
                      <td className="p-4 text-center font-mono text-fog">{row.l}</td>
                      <td className="p-4 text-center font-mono text-fog">{row.gf}</td>
                      <td className="p-4 text-center font-mono text-fog">{row.ga}</td>
                      <td className="p-4 text-center font-mono text-fog">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                      <td className="p-4 text-center font-mono font-black text-acid">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="w-full space-y-16 animate-fade-in">
            {/* Top Scorers */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4 font-grotesk tracking-tight">
                top scorers
              </h2>
              <div className="bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-card overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-ink-950/50 border-b border-white/10 text-xs font-anton uppercase tracking-wider text-mist text-sm">
                      <th className="p-4 text-center">Rank</th>
                      <th className="p-4">Player</th>
                      <th className="p-4">Team</th>
                      <th className="p-4 text-center text-acid">Goals</th>
                      <th className="p-4 text-center">Assists</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {TOP_SCORERS.map((row) => (
                      <tr key={row.rank} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 text-center font-mono font-bold text-fog">{row.rank}</td>
                        <td className="p-4 font-anton uppercase text-paper tracking-wide text-lg whitespace-nowrap">{row.player}</td>
                        <td className="p-4 font-mono text-sm text-fog">{row.team}</td>
                        <td className="p-4 text-center font-mono font-black text-acid">{row.goals}</td>
                        <td className="p-4 text-center font-mono text-fog">{row.assists}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Goalkeepers */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4 font-grotesk tracking-tight">
                goalkeepers
              </h2>
              <div className="bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-card overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-ink-950/50 border-b border-white/10 text-xs font-anton uppercase tracking-wider text-mist text-sm">
                      <th className="p-4 text-center">Rank</th>
                      <th className="p-4">Player</th>
                      <th className="p-4">Team</th>
                      <th className="p-4 text-center">Played</th>
                      <th className="p-4 text-center text-acid">Saves</th>
                      <th className="p-4 text-center text-rose-400">GC</th>
                      <th className="p-4 text-center text-emerald-400">CS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {GOALKEEPERS.map((row) => (
                      <tr key={row.rank} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 text-center font-mono font-bold text-fog">{row.rank}</td>
                        <td className="p-4 font-anton uppercase text-paper tracking-wide text-lg whitespace-nowrap">{row.player}</td>
                        <td className="p-4 font-mono text-sm text-fog">{row.team}</td>
                        <td className="p-4 text-center font-mono text-fog">{row.played}</td>
                        <td className="p-4 text-center font-mono font-black text-acid">{row.saves}</td>
                        <td className="p-4 text-center font-mono text-rose-400/80">{row.gc}</td>
                        <td className="p-4 text-center font-mono text-emerald-400/80">{row.cs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MATCH STATS MODAL */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-ink-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
            <button onClick={() => setSelectedMatch(null)} className="absolute top-4 right-4 p-2 text-fog hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 md:p-8 space-y-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <span className="text-xs font-mono font-bold text-acid tracking-widest uppercase">Match Stats</span>
                <div className="flex items-center justify-between w-full max-w-md">
                  <div className="flex-1 text-right">
                    <span className="font-anton uppercase tracking-wide text-xl md:text-2xl text-paper">{selectedMatch.teamA}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center px-6">
                    <div className="flex items-center space-x-3 text-4xl font-black font-mono">
                      <span>{selectedMatch.scoreA}</span>
                      <span className="text-mist">-</span>
                      <span>{selectedMatch.scoreB}</span>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-anton uppercase tracking-wide text-xl md:text-2xl text-paper">{selectedMatch.teamB}</span>
                  </div>
                </div>
              </div>

              {/* Goalscorers */}
              {(selectedMatch.stats.scorersA?.length > 0 || selectedMatch.stats.scorersB?.length > 0) && (
                <div className="flex justify-between text-xs font-mono text-mist bg-white/5 rounded-xl p-4">
                  <div className="flex-1 text-right pr-4 border-r border-white/10 space-y-1">
                    {selectedMatch.stats.scorersA.map((s: string, i: number) => <div key={i}>{s} ⚽</div>)}
                  </div>
                  <div className="flex-1 text-left pl-4 space-y-1">
                    {selectedMatch.stats.scorersB.map((s: string, i: number) => <div key={i}>⚽ {s}</div>)}
                  </div>
                </div>
              )}

              {/* Stats Table */}
              <div className="space-y-3">
                {[
                  { label: 'Shots', a: selectedMatch.stats.shotsA, b: selectedMatch.stats.shotsB },
                  { label: 'On Target', a: selectedMatch.stats.onTargetA, b: selectedMatch.stats.onTargetB },
                  { label: 'Saves', a: selectedMatch.stats.savesA, b: selectedMatch.stats.savesB },
                  { label: 'Corners', a: selectedMatch.stats.cornerA, b: selectedMatch.stats.cornerB },
                  { label: 'Fouls', a: selectedMatch.stats.foulsA, b: selectedMatch.stats.foulsB },
                ].map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm font-mono border-b border-white/5 pb-2">
                    <span className="flex-1 text-right font-bold text-paper">{stat.a}</span>
                    <span className="w-32 text-center text-fog tracking-wider uppercase text-[10px]">{stat.label}</span>
                    <span className="flex-1 text-left font-bold text-paper">{stat.b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SQUAD MODAL */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl bg-ink-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-ink-950">
              <h3 className="font-anton uppercase tracking-wide text-xl text-paper">{selectedTeam.name} Squad</h3>
              <button onClick={() => setSelectedTeam(null)} className="p-2 text-fog hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-ink-950">
              <img src={selectedTeam.squadImage} alt={`${selectedTeam.name} Squad`} className="w-full h-auto rounded-xl object-contain border border-white/5" />
            </div>
          </div>
        </div>
      )}

      {/* Sponsors Section */}
      <SponsorsBox />
    </div>
  )
}
