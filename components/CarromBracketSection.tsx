'use client'

import React from 'react'
import { Activity } from 'lucide-react'

type CarromRoundKey = 'quarter_finals' | 'semi_finals' | 'finals'

interface CarromMatch {
  id: string
  round: CarromRoundKey
  roundTitle: string
  team1: { name: string }
  team2: { name: string }
  winnerTeam?: 1 | 2
}

const CARROM_MATCHES: CarromMatch[] = [
  // Quarters
  {
    id: 'q1', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Team Shivas' }, team2: { name: 'Team Samit' }, winnerTeam: 1,
  },
  {
    id: 'q2', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Team Sooraj' }, team2: { name: 'Team Prideson' }, winnerTeam: 1,
  },
  {
    id: 'q3', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Team Rohith' }, team2: { name: 'Team Lakshmi U' }, winnerTeam: 1,
  },
  {
    id: 'q4', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Team Daniel' }, team2: { name: 'Team Amal' }, winnerTeam: 2,
  },
  // Semis
  {
    id: 's1', round: 'semi_finals', roundTitle: 'Semi Finals',
    team1: { name: 'Team Shivas' }, team2: { name: 'Team Sooraj' }, winnerTeam: 2,
  },
  {
    id: 's2', round: 'semi_finals', roundTitle: 'Semi Finals',
    team1: { name: 'Team Rohith' }, team2: { name: 'Team Amal' }, winnerTeam: 1,
  },
  // Final
  {
    id: 'f1', round: 'finals', roundTitle: 'Finals',
    team1: { name: 'Team Sooraj' }, team2: { name: 'Team Rohith' }, winnerTeam: 1,
  }
]

export default function CarromBracketSection() {
  const matchesByRound: Record<CarromRoundKey, CarromMatch[]> = {
    quarter_finals: CARROM_MATCHES.filter(m => m.round === 'quarter_finals'),
    semi_finals: CARROM_MATCHES.filter(m => m.round === 'semi_finals'),
    finals: CARROM_MATCHES.filter(m => m.round === 'finals'),
  }

  const renderMatchCard = (match?: CarromMatch) => {
    if (!match) return null
    const team1Won = match.winnerTeam === 1
    const team2Won = match.winnerTeam === 2

    return (
      <div className="relative w-full md:w-72 shrink-0 bg-ink-900 border border-white/10 rounded-2xl shadow-xl p-3 z-10 flex flex-col space-y-2">
        <div className="flex justify-between items-center mb-1 px-1">
          <span className="text-[10px] font-mono text-fog font-bold uppercase tracking-wider">
            {match.roundTitle}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {/* Team 1 */}
          <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
              team1Won ? 'bg-acid/20 border border-acid/50 text-paper font-bold' : 'bg-ink-900/70 border border-white/5 text-mist'
            }`}>
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <span className={`w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center shrink-0 ${
                team1Won ? 'bg-acid text-acid-ink font-black' : 'bg-white/10 text-fog'
              }`}>
                {team1Won ? '✓' : '1'}
              </span>
              <span className="text-sm truncate">
                {match.team1.name}
              </span>
            </div>
            {team1Won && <span className="text-xs text-acid font-mono font-bold uppercase">WIN</span>}
          </div>

          {/* Team 2 */}
          <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
              team2Won ? 'bg-acid/20 border border-acid/50 text-paper font-bold' : 'bg-ink-900/70 border border-white/5 text-mist'
            }`}>
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <span className={`w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center shrink-0 ${
                team2Won ? 'bg-acid text-acid-ink font-black' : 'bg-white/10 text-fog'
              }`}>
                {team2Won ? '✓' : '2'}
              </span>
              <span className="text-sm truncate">
                {match.team2.name}
              </span>
            </div>
            {team2Won && <span className="text-xs text-acid font-mono font-bold uppercase">WIN</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full relative py-12 md:py-24 overflow-hidden z-10 mb-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-ink-950/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-acid">
              <div className="bg-acid/10 border border-acid/20 px-3 py-1 rounded-full flex items-center space-x-2">
                <Activity className="w-3 h-3" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                  Official Tournament Draw
                </span>
              </div>
              <span className="text-[10px] font-mono text-fog uppercase tracking-widest">
                • CS Games 2026 Carrom Championship
              </span>
            </div>
            
            <h2 className="font-serif font-black text-4xl sm:text-5xl text-paper uppercase tracking-wider leading-none">
              CARROM
            </h2>
            
            <p className="text-xs sm:text-sm text-mist leading-relaxed font-sans">
              Official tournament knockout draw and match progression.
            </p>
          </div>
        </div>

        {/* Bracket Scroll Area */}
        <div className="w-full overflow-x-auto pb-16 no-scrollbar relative z-10 cursor-grab active:cursor-grabbing">
          <div className="flex min-w-max md:justify-center p-4">
            <div className="flex items-stretch gap-0 relative">
              {/* Quarter Finals */}
              <div className="flex flex-col justify-between space-y-8 relative w-72 shrink-0">
                {matchesByRound.quarter_finals.map((match, i) => (
                  <div key={match.id} className="relative z-10">
                    {renderMatchCard(match)}
                  </div>
                ))}
              </div>

              {/* Connector from QF to SF */}
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
              </div>

              {/* Semi Finals */}
              <div className="flex flex-col justify-around relative w-72 shrink-0">
                {matchesByRound.semi_finals.map((match, i) => (
                  <div key={match.id} className="relative z-10 mt-16 mb-16">
                    {renderMatchCard(match)}
                  </div>
                ))}
              </div>

              {/* Connector from SF to F */}
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
              </div>

              {/* Finals */}
              <div className="flex flex-col justify-center relative w-72 shrink-0">
                {matchesByRound.finals.map((match) => (
                  <div key={match.id} className="relative z-10">
                    {renderMatchCard(match)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
