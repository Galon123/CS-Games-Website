'use client'

import React from 'react'
import { useTournament } from '@/context/TournamentContext'
import Link from 'next/link'

export default function LiveTicker() {
  const { matches, isSupabaseLive } = useTournament()

  const liveMatches = matches.filter((m) => m.status === 'live')
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming')

  return (
    <aside aria-label="Live Match Ticker" className="bg-[#0B1120] border-b border-slate-800/80 text-xs py-1.5 px-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Clean Minimalist Live Indicator */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-mono font-bold text-[11px] text-slate-300 tracking-wider">
            ARENA TICKER
          </span>
        </div>

        {/* Center: Clean Match Capsules */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center space-x-4 py-0.5">
          {liveMatches.length > 0 ? (
            liveMatches.map((match) => (
              <Link
                key={match.id}
                href="/leaderboards"
                className="flex items-center space-x-2 shrink-0 px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyber-cyan/50 text-[11px] transition-all group"
              >
                <span className="text-neon-lime font-mono font-bold">
                  {match.sport?.name} {match.minute ? `• ${match.minute}'` : ''}
                </span>
                <span className="text-ice-white font-medium group-hover:text-cyber-cyan transition-colors">
                  {match.team_a?.name}
                </span>
                <span className="font-mono font-black text-neon-lime px-1.5 py-0.5 rounded bg-black/40">
                  {match.team_a_score} - {match.team_b_score}
                </span>
                <span className="text-ice-white font-medium group-hover:text-cyber-cyan transition-colors">
                  {match.team_b?.name}
                </span>
              </Link>
            ))
          ) : (
            <span className="text-slate-500 text-xs font-mono">No live matches in progress</span>
          )}

          {upcomingMatches.slice(0, 2).map((match) => (
            <div
              key={match.id}
              className="flex items-center space-x-2 shrink-0 text-slate-400 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900/40"
            >
              <span className="text-slate-500 font-mono text-[10px] uppercase">Upcoming</span>
              <span>{match.team_a?.name} vs {match.team_b?.name}</span>
            </div>
          ))}
        </div>

        {/* Right: Subtle Telemetry Status */}
        <div className="shrink-0 hidden sm:flex items-center space-x-1.5 font-mono text-[10px] text-slate-400">
          <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseLive ? 'bg-neon-lime' : 'bg-cyber-cyan'}`} />
          <span>{isSupabaseLive ? 'Supabase Live' : 'Local Standalone'}</span>
        </div>
      </div>
    </aside>
  )
}
