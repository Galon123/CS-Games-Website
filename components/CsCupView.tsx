'use client'

import React, { useState } from 'react'
import FootballHeroCarousel from '@/components/FootballHeroCarousel'
import FootballBlurredBackground from '@/components/FootballBlurredBackground'
import { Home, Calendar, Trophy, Activity, X } from 'lucide-react'

const TEAMS = [
  { name: 'Jigarthanda FC', image: '/images/S1.png', squadImage: '/teams/S1.png' },
  { name: 'CS3 FC', image: '/images/S3.png', squadImage: '/teams/S3.png' },
  { name: 'Kandam Boiz', image: '/images/S5.png', squadImage: '/teams/S5.png' },
  { name: 'Pallimoola FC', image: '/images/S7.png', squadImage: '/teams/S7.png' },
]

const ALL_MATCHES = [
  { 
    id: 'm1', teamA: 'Pallimoola FC', scoreA: 1, teamB: 'Jigarthanda FC', scoreB: 3,
    stats: {
      shotsA: 11, shotsB: 13, onTargetA: 3, onTargetB: 8, foulsA: 0, foulsB: 0,
      cornerA: 4, cornerB: 3, savesA: 5, savesB: 3,
      scorersA: ['Don ⚽'], scorersB: ['Harshith ⚽', 'Shivas ⚽', 'Sreehari ⚽']
    }
  },
  { 
    id: 'm2', teamA: 'CS3 FC', scoreA: 1, teamB: 'Kandam Boiz', scoreB: 3,
    stats: {
      shotsA: 10, shotsB: 20, onTargetA: 6, onTargetB: 10, foulsA: 1, foulsB: 0,
      cornerA: 3, cornerB: 4, savesA: 4, savesB: 7,
      scorersA: ['Sagar (OG) ⚽'], scorersB: ['Nabeel ⚽⚽', 'Hathim ⚽']
    }
  },
  { 
    id: 'm3', teamA: 'Pallimoola FC', scoreA: 0, teamB: 'Kandam Boiz', scoreB: 5,
    stats: {
      shotsA: 6, shotsB: 12, onTargetA: 4, onTargetB: 7, foulsA: 0, foulsB: 2,
      cornerA: 1, cornerB: 3, savesA: 2, savesB: 3,
      scorersA: [], scorersB: ['Nabeel ⚽⚽⚽', 'Dani ⚽⚽']
    }
  },
  {
    id: 'm4', teamA: 'CS3 FC', scoreA: 2, teamB: 'Jigarthanda FC', scoreB: 1,
    stats: {
      shotsA: 13, shotsB: 13, onTargetA: 4, onTargetB: 4, foulsA: 0, foulsB: 0,
      cornerA: 2, cornerB: 4, savesA: 3, savesB: 2,
      scorersA: ['Viswanth ⚽⚽'], scorersB: ['Abhiram ⚽']
    }
  },
  {
    id: 'm5', teamA: 'Pallimoola FC', scoreA: 1, teamB: 'CS3 FC', scoreB: 3,
    stats: {
      shotsA: 16, shotsB: 22, onTargetA: 5, onTargetB: 11, foulsA: 0, foulsB: 0,
      cornerA: 6, cornerB: 4, savesA: 9, savesB: 7,
      scorersA: ['Don ⚽'], scorersB: ['Viswanth ⚽', 'Abin ⚽', 'Sreedeep ⚽']
    }
  },
  {
    id: 'm6', teamA: 'Jigarthanda FC', scoreA: 5, teamB: 'Kandam Boiz', scoreB: 0,
    stats: {
      shotsA: 24, shotsB: 7, onTargetA: 10, onTargetB: 2, foulsA: 1, foulsB: 2,
      cornerA: 7, cornerB: 1, savesA: 1, savesB: 6,
      scorersA: ['Abhiram ⚽', 'Harshith ⚽⚽⚽⚽'], scorersB: []
    }
  }
]

const POINTS_TABLE = [
  { pos: 1, team: 'Jigarthanda FC', p: 3, w: 2, d: 0, l: 1, gf: 9, ga: 3, gd: 6, pts: 6 },
  { pos: 2, team: 'Kandam Boiz', p: 3, w: 2, d: 0, l: 1, gf: 8, ga: 6, gd: 2, pts: 6 },
  { pos: 3, team: 'CS3 FC', p: 3, w: 2, d: 0, l: 1, gf: 6, ga: 5, gd: 1, pts: 6 },
  { pos: 4, team: 'Pallimoola FC', p: 3, w: 0, d: 0, l: 3, gf: 2, ga: 11, gd: -9, pts: 0 },
]

const TOP_SCORERS = [
  { rank: 1, player: 'Harshith', team: 'Jigarthanda FC', goals: 5, assists: 0 },
  { rank: 2, player: 'Nabeel', team: 'Kandam Boiz', goals: 5, assists: 2 },
  { rank: 3, player: 'Viswanth', team: 'CS3 FC', goals: 3, assists: 1 },
  { rank: 4, player: 'Dani', team: 'Kandam Boiz', goals: 2, assists: 0 },
  { rank: 5, player: 'Don', team: 'Pallimoola FC', goals: 2, assists: 0 },
  { rank: 6, player: 'Abhiram', team: 'Jigarthanda FC', goals: 2, assists: 0 },
  { rank: 7, player: 'Sreedeep', team: 'CS3 FC', goals: 1, assists: 0 },
  { rank: 8, player: 'Abin', team: 'CS3 FC', goals: 1, assists: 1 },
  { rank: 9, player: 'Hathim', team: 'Kandam Boiz', goals: 1, assists: 1 },
  { rank: 10, player: 'Shivas', team: 'Jigarthanda FC', goals: 1, assists: 0 },
  { rank: 11, player: 'Sreehari', team: 'Jigarthanda FC', goals: 1, assists: 0 },
]

const GOALKEEPERS = [
  { rank: 1, player: 'Rohith', team: 'Kandam Boiz', played: 3, saves: 16, gc: 6, cs: 1 },
  { rank: 2, player: 'Ansif', team: 'Pallimoola FC', played: 3, saves: 16, gc: 11, cs: 0 },
  { rank: 3, player: 'Navneeth', team: 'CS3 FC', played: 2, saves: 10, gc: 2, cs: 0 },
  { rank: 4, player: 'Viswanth', team: 'CS3 FC', played: 1, saves: 4, gc: 3, cs: 0 },
  { rank: 5, player: 'Shanidh', team: 'Jigarthanda FC', played: 2, saves: 3, gc: 2, cs: 1 },
  { rank: 6, player: 'Jiyadh', team: 'Jigarthanda FC', played: 1, saves: 3, gc: 1, cs: 0 },
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

  const handleTabClick = (key: string) => {
    if (key === 'matches') {
      setActiveTab('home')
      setTimeout(() => {
        document.getElementById('matches-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    } else {
      setActiveTab(key)
    }
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-canvas text-cream selection:bg-acid selection:text-acid-ink font-sans">
      <FootballBlurredBackground />

      
      {/* Hero Section */}
      <section className="w-full">
        <FootballHeroCarousel />
      </section>

      {/* Dedicated Navbar */}
      <div className="sticky top-0 z-40 w-full bg-ink-950/80 backdrop-blur-md border-b border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-center space-x-2 md:space-x-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = (activeTab === tab.key && tab.key !== 'matches')
            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-mono text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-acid text-acid-ink shadow-[0_0_15px_rgba(215,242,43,0.3)]'
                    : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="bg-ink-950/60 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-10 border border-white/10 shadow-2xl relative z-10">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="w-full space-y-16 animate-fade-in">
            {/* Meet The Teams */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4 font-sans tracking-wider">
                meet the teams
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {TEAMS.map((team, idx) => (
                  <div key={idx} onClick={() => setSelectedTeam(team)} className="bg-ink-900 rounded-2xl overflow-hidden border border-white/10 group shadow-card cursor-pointer">
                    <div className="aspect-[3/4] relative">
                      <img src={team.image} alt={team.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                        <h3 className="text-2xl font-black font-mono text-paper drop-shadow-md">{team.name}</h3>
                        <span className="text-[10px] font-mono text-acid bg-acid/10 px-2 py-1 rounded border border-acid/20 opacity-0 group-hover:opacity-100 transition-opacity">VIEW SQUAD</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matches Section */}
            <div id="matches-section" className="space-y-8 pt-8">
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4 font-sans tracking-wider">
                matches
              </h2>
              <div className="flex flex-col space-y-4">
                {ALL_MATCHES.map((match, idx) => (
                  <div key={idx} onClick={() => setSelectedMatch(match)} className="bg-ink-900 border border-white/10 rounded-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center hover:bg-ink-800 transition-colors cursor-pointer group">
                    <div className="flex-1 flex justify-end items-center pr-4 md:pr-8 w-full md:w-auto">
                      <span className="font-mono font-bold text-lg md:text-xl text-center md:text-right">{match.teamA}</span>
                    </div>
                    
                    <div className="flex items-center justify-center min-w-[140px] my-4 md:my-0">
                      <div className="flex items-center space-x-4 bg-blue-500 text-ink-950 px-5 py-2 rounded-xl shadow-[0_0_15px_rgba(4,217,255,0.2)] group-hover:shadow-[0_0_20px_rgba(4,217,255,0.4)] transition-shadow">
                        <span className="text-2xl md:text-3xl font-black font-sans tracking-tighter">{match.scoreA}</span>
                        <span className="text-ink-950 font-black text-xl">-</span>
                        <span className="text-2xl md:text-3xl font-black font-sans tracking-tighter">{match.scoreB}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex justify-start items-center pl-4 md:pl-8 w-full md:w-auto">
                      <span className="font-mono font-bold text-lg md:text-xl text-center md:text-left">{match.teamB}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* POINTS TABLE TAB */}
        {activeTab === 'points' && (
          <div className="w-full space-y-16 animate-fade-in">
            <div className="w-full space-y-8">
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4 font-sans tracking-wider">
                points table
              </h2>
              <div className="bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-card overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-ink-950/50 border-b border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-mist">
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
                        <td className="p-4 font-mono font-bold text-paper whitespace-nowrap">{row.team}</td>
                        <td className="p-4 text-center font-mono text-fog">{row.p}</td>
                        <td className="p-4 text-center font-mono text-fog">{row.w}</td>
                        <td className="p-4 text-center font-mono text-fog">{row.d}</td>
                        <td className="p-4 text-center font-mono text-fog">{row.l}</td>
                        <td className="p-4 text-center font-mono text-fog">{row.gf}</td>
                        <td className="p-4 text-center font-mono text-fog">{row.ga}</td>
                        <td className="p-4 text-center font-mono text-fog">{row.gd > 0 ? '+' + row.gd : row.gd}</td>
                        <td className="p-4 text-center font-mono font-black text-acid">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="w-full space-y-16 animate-fade-in">
            {/* Top Scorers */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4 font-sans tracking-wider">
                top scorers
              </h2>
              <div className="bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-card overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-ink-950/50 border-b border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-mist">
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
                        <td className="p-4 font-mono font-bold text-paper whitespace-nowrap">{row.player}</td>
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
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4 font-sans tracking-wider">
                goalkeepers
              </h2>
              <div className="bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-card overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-ink-950/50 border-b border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-mist">
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
                        <td className="p-4 font-mono font-bold text-paper whitespace-nowrap">{row.player}</td>
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
        </div>
      </main>

      {/* MATCH STATS MODAL */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-ink-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <button onClick={() => setSelectedMatch(null)} className="absolute top-4 right-4 p-2 text-fog hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
              <div className="flex flex-col items-center justify-center space-y-4">
                <span className="text-xs font-mono font-bold text-acid tracking-widest uppercase">Match Stats</span>
                <div className="flex items-center justify-between w-full max-w-md">
                  <div className="flex-1 text-right">
                    <span className="font-mono font-black text-xl md:text-2xl text-paper">{selectedMatch.teamA}</span>
                  </div>
                  <div className="flex items-center justify-center px-6">
                    <div className="flex items-center space-x-3 bg-blue-500 text-ink-950 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(4,217,255,0.2)]">
                      <span className="text-3xl font-black font-sans tracking-tighter">{selectedMatch.scoreA}</span>
                      <span className="text-ink-950 font-black text-xl">-</span>
                      <span className="text-3xl font-black font-sans tracking-tighter">{selectedMatch.scoreB}</span>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-mono font-black text-xl md:text-2xl text-paper">{selectedMatch.teamB}</span>
                  </div>
                </div>
              </div>

              {/* Goalscorers */}
              {(selectedMatch.stats.scorersA?.length > 0 || selectedMatch.stats.scorersB?.length > 0) && (
                <div className="flex justify-between text-sm md:text-base font-mono text-mist bg-white/5 rounded-xl p-4 md:p-6">
                  <div className="flex-1 text-right pr-4 md:pr-6 border-r border-white/10 space-y-2">
                    {selectedMatch.stats.scorersA.map((s: string, i: number) => <div key={i} className="font-bold">{s}</div>)}
                  </div>
                  <div className="flex-1 text-left pl-4 md:pl-6 space-y-2">
                    {selectedMatch.stats.scorersB.map((s: string, i: number) => <div key={i} className="font-bold">{s}</div>)}
                  </div>
                </div>
              )}

              {/* Stats Table */}
              <div className="space-y-3 pt-4 border-t border-white/5">
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
              <h3 className="font-mono font-black text-xl text-paper">{selectedTeam.name} Squad</h3>
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
      
    </div>
  )
}
