'use client'

import React from 'react'
import { useTournament } from '@/context/TournamentContext'
import Link from 'next/link'

export default function LiveTicker() {
  const { matches, isSupabaseLive } = useTournament()

  const liveMatches = matches.filter((m) => m.status === 'live')
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming')

  return (
    <aside aria-label="Live Match Ticker" className="bg-[#060911] border-b border-slate-800/60 text-xs py-1.5 px-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Clean Live Indicator */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-semibold text-[11px] text-slate-300 tracking-wide uppercase">
            Live Matches
          </span>
        </div>

        {/* Center: Clean Match Capsules */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center space-x-3 py-0.5">
          {liveMatches.length > 0 ? (
            liveMatches.map((match) => (
              <Link
                key={match.id}
                href="/leaderboards"
                className="flex items-center space-x-2.5 shrink-0 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-[11px] transition-all group"
              >
                <span className="text-emerald-400 font-semibold text-[10px] uppercase">
                  {match.sport?.name} {match.minute ? `• ${match.minute}'` : ''}
                </span>
                <span className="text-slate-200 font-medium group-hover:text-white transition-colors">
                  {match.team_a?.name}
                </span>
                <span className="font-mono font-bold text-white px-1.5 py-0.2 rounded bg-slate-800">
                  {match.team_a_score} - {match.team_b_score}
                </span>
                <span className="text-slate-200 font-medium group-hover:text-white transition-colors">
                  {match.team_b?.name}
                </span>
              </Link>
            ))
          ) : (
            <span className="text-slate-500 text-xs">No live fixtures currently in progress</span>
          )}

          {upcomingMatches.slice(0, 2).map((match) => (
            <div
              key={match.id}
              className="flex items-center space-x-2 shrink-0 text-slate-400 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900/60 border border-slate-800/40"
            >
              <span className="text-slate-500 text-[10px] uppercase font-medium">Upcoming</span>
              <span>{match.team_a?.name} vs {match.team_b?.name}</span>
            </div>
          ))}
        </div>

        {/* Right: Subtle Telemetry Status */}
        <div className="shrink-0 hidden sm:flex items-center space-x-1.5 text-[11px] text-slate-400">
          <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseLive ? 'bg-emerald-400' : 'bg-blue-400'}`} />
          <span>{isSupabaseLive ? 'Supabase Live' : 'Local Standalone'}</span>
        </div>
      </div>
    </aside>
  )
}
