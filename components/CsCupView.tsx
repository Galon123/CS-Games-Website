'use client'

import React, { useState, useEffect } from 'react'
import FootballHeroCarousel from '@/components/FootballHeroCarousel'
import SponsorsBox from '@/components/SponsorsBox'
import { Home, Calendar, Trophy, Activity } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const TEAMS = [
  { name: 'Jigarthanda FC', image: '/images/S1.png' },
  { name: 'Kandam Boiz', image: '/images/S5.png' },
  { name: 'CS3 FC', image: '/images/S3.png' },
  { name: 'Pallimoola FC', image: '/images/S7.png' },
]

const DAY2_FIXTURES = [
  { teamA: 'CS3 FC', teamB: 'Jigarthanda FC', time: '4:30 PM' },
  { teamA: 'Pallimoola FC', teamB: 'CS3 FC', time: '5:00 PM' },
  { teamA: 'Jigarthanda FC', teamB: 'Kandam Boiz', time: '5:30 PM' },
]

const DAY1_RESULTS = [
  { teamA: 'Jigarthanda FC', scoreA: 4, teamB: 'Pallimoola FC', scoreB: 1 },
  { teamA: 'Kandam Boiz', scoreA: 3, teamB: 'CS3 FC', scoreB: 1 },
  { teamA: 'Kandam Boiz', scoreA: 5, teamB: 'Pallimoola FC', scoreB: 0 },
]

const POINTS_TABLE = [
  { pos: 1, team: 'Kandam Boiz', p: 2, w: 2, d: 0, l: 0, gf: 8, ga: 1, gd: 7, pts: 6 },
  { pos: 2, team: 'Jigarthanda FC', p: 1, w: 1, d: 0, l: 0, gf: 4, ga: 1, gd: 3, pts: 3 },
  { pos: 3, team: 'CS3 FC', p: 1, w: 0, d: 0, l: 1, gf: 1, ga: 3, gd: -2, pts: 0 },
  { pos: 4, team: 'Pallimoola FC', p: 2, w: 0, d: 0, l: 2, gf: 1, ga: 9, gd: -8, pts: 0 },
]

const TOP_SCORERS = [
  { rank: 1, player: 'A. Rahman', team: 'Kandam Boiz', goals: 5, assists: 2 },
  { rank: 2, player: 'S. Kumar', team: 'Jigarthanda FC', goals: 3, assists: 1 },
  { rank: 3, player: 'J. Doe', team: 'Kandam Boiz', goals: 2, assists: 0 },
  { rank: 4, player: 'V. Raj', team: 'Jigarthanda FC', goals: 1, assists: 2 },
  { rank: 5, player: 'M. Ali', team: 'CS3 FC', goals: 1, assists: 0 },
]

const GOALKEEPERS = [
  { rank: 1, player: 'K. Nair', team: 'Kandam Boiz', played: 2, saves: 8, gc: 1, cs: 1 },
  { rank: 2, player: 'R. Menon', team: 'Jigarthanda FC', played: 1, saves: 4, gc: 1, cs: 0 },
  { rank: 3, player: 'T. Jose', team: 'CS3 FC', played: 1, saves: 6, gc: 3, cs: 0 },
  { rank: 4, player: 'A. Babu', team: 'Pallimoola FC', played: 2, saves: 12, gc: 9, cs: 0 },
]

export default function CsCupView() {
  const [activeTab, setActiveTab] = useState('home')

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
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4">
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
                        <span className="font-serif font-bold text-lg">{match.teamA}</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-fog">VS</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-serif font-bold text-lg">{match.teamB}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meet The Teams */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4">
                meet the teams
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {TEAMS.map((team, idx) => (
                  <div key={idx} className="bg-ink-900 rounded-2xl overflow-hidden border border-white/10 group shadow-card">
                    <div className="aspect-[3/4] relative">
                      <img src={team.image} alt={team.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="text-2xl font-black font-serif text-paper drop-shadow-md">{team.name}</h3>
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
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4">
                day 2 fixtures
              </h2>
              <div className="flex flex-col space-y-4">
                {DAY2_FIXTURES.map((match, idx) => (
                  <div key={idx} className="bg-ink-900 border border-white/10 rounded-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center md:items-center hover:bg-ink-800 transition-colors">
                    <div className="flex-1 flex justify-end items-center pr-4 md:pr-8">
                      <span className="font-serif font-bold text-lg md:text-xl">{match.teamA}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center px-4 md:px-8 border-x border-white/10 min-w-[120px]">
                      <span className="text-acid font-mono font-bold text-sm mb-1">{match.time}</span>
                      <span className="text-xs text-mist font-bold uppercase tracking-widest">VS</span>
                    </div>
                    <div className="flex-1 flex justify-start items-center pl-4 md:pl-8">
                      <span className="font-serif font-bold text-lg md:text-xl">{match.teamB}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Day 1 Results */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4">
                day 1 results
              </h2>
              <div className="flex flex-col space-y-4">
                {DAY1_RESULTS.map((match, idx) => (
                  <div key={idx} className="bg-ink-900 border border-white/10 rounded-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center md:items-center hover:bg-ink-800 transition-colors">
                    <div className="flex-1 flex justify-end items-center pr-4 md:pr-8">
                      <span className="font-serif font-bold text-lg md:text-xl">{match.teamA}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3 px-4 md:px-8 border-x border-white/10 min-w-[140px]">
                      <span className="text-2xl font-black text-paper">{match.scoreA}</span>
                      <span className="text-mist">-</span>
                      <span className="text-2xl font-black text-paper">{match.scoreB}</span>
                    </div>
                    <div className="flex-1 flex justify-start items-center pl-4 md:pl-8">
                      <span className="font-serif font-bold text-lg md:text-xl">{match.teamB}</span>
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
            <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4">
              points table
            </h2>
            <div className="bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-card overflow-x-auto">
              <table className="w-full text-left border-collapse">
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
                      <td className="p-4 font-serif font-bold text-paper">{row.team}</td>
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
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4">
                top scorers
              </h2>
              <div className="bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-card overflow-x-auto">
                <table className="w-full text-left border-collapse">
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
                        <td className="p-4 font-serif font-bold text-paper">{row.player}</td>
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
              <h2 className="text-3xl font-black lowercase text-paper border-b border-white/10 pb-4">
                goalkeepers
              </h2>
              <div className="bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-card overflow-x-auto">
                <table className="w-full text-left border-collapse">
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
                        <td className="p-4 font-serif font-bold text-paper">{row.player}</td>
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

      {/* Sponsors Section */}
      <section className="bg-ink-950 py-16 border-t border-white/5 mt-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <SponsorsBox />
        </div>
      </section>
    </div>
  )
}
