'use client'

import React from 'react'
import { useTournament } from '@/context/TournamentContext'
import Link from 'next/link'
import { Trophy, Radio, ArrowRight } from 'lucide-react'

export default function LiveTicker() {
  const { matches, isSupabaseLive, sports } = useTournament()

  const liveMatches = matches.filter((m) => m.status === 'live')
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming')

  const marqueeItems = [
    ...liveMatches.map((m) => ({
      type: 'live' as const,
      id: m.id,
      sport: m.sport?.name || 'Match',
      text: `${m.team_a?.name} ${m.team_a_score ?? 0} - ${m.team_b_score ?? 0} ${m.team_b?.name}`,
      minute: m.minute ? `${m.minute}'` : 'LIVE',
    })),
    {
      type: 'announcement' as const,
      id: 'flagship-announcement',
      sport: 'CS CUP',
      text: 'ANNUAL 6v6 FOOTBALL TOURNAMENT • OFFICIAL PITCH ACTIVE',
      minute: 'FLAGSHIP',
    },
    ...upcomingMatches.slice(0, 3).map((m) => ({
      type: 'upcoming' as const,
      id: m.id,
      sport: m.sport?.name || 'Fixture',
      text: `${m.team_a?.name} vs ${m.team_b?.name}`,
      minute: 'UPCOMING',
    })),
    {
      type: 'event' as const,
      id: 'tourney-info',
      sport: 'CS GAMES 2026',
      text: `${sports.length} DIVISIONS ACTIVE • PERPETUAL TROPHY ON THE LINE`,
      minute: 'OFFICIAL',
    },
  ]

  // Duplicate items for continuous seamless loop
  const tickerItems = [...marqueeItems, ...marqueeItems]

  return (
    <aside
      aria-label="Live Match Ticker"
      className="bg-[#F59E0B] border-b-2 border-[#1A1A1A] text-[#1A1A1A] text-xs py-2 px-3 sm:px-4 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4">
        {/* Left: Solid Charcoal Live Indicator Badge */}
        <div className="flex items-center space-x-2 shrink-0 z-10 bg-[#F59E0B] pr-2">
          <span className="bg-[#1A1A1A] text-white font-mono text-xs font-black px-2.5 py-0.5 rounded shadow-[2px_2px_0px_0px_rgba(26,26,26,0.2)] tracking-wider uppercase flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span>LIVE</span>
          </span>
          <span className="hidden sm:inline font-mono font-black text-xs text-[#1A1A1A] tracking-wider uppercase">
            TICKER
          </span>
        </div>

        {/* Center: Continuous Marquee Scrolling Track */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center space-x-4 animate-marquee pause-on-hover whitespace-nowrap will-change-transform py-0.5">
            {tickerItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="inline-flex items-center space-x-2 shrink-0 font-mono text-xs"
              >
                {item.type === 'live' ? (
                  <Link
                    href="/leaderboards"
                    className="inline-flex items-center space-x-2 bg-white text-[#1A1A1A] px-2.5 py-0.5 rounded border border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:bg-slate-50 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <span className="bg-[#059669] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                      {item.minute}
                    </span>
                    <span className="font-bold text-[11px] uppercase tracking-wide">
                      {item.sport}:
                    </span>
                    <span className="font-black text-xs">
                      {item.text}
                    </span>
                  </Link>
                ) : item.type === 'announcement' ? (
                  <div className="inline-flex items-center space-x-1.5 bg-[#1A1A1A] text-white px-2.5 py-0.5 rounded border border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,0.3)]">
                    <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span className="text-[#F59E0B] font-bold text-[10px] uppercase">
                      {item.sport}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-bold text-[11px]">
                      {item.text}
                    </span>
                  </div>
                ) : item.type === 'upcoming' ? (
                  <div className="inline-flex items-center space-x-1.5 bg-white/80 text-[#1A1A1A] px-2 py-0.5 rounded border border-[#1A1A1A]/40">
                    <span className="text-[10px] font-bold text-slate-700 uppercase">
                      [UPCOMING] {item.sport}:
                    </span>
                    <span className="font-semibold text-[11px]">
                      {item.text}
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-1.5 text-[#1A1A1A] font-bold text-[11px]">
                    <span className="text-black/60 font-black">★</span>
                    <span>{item.text}</span>
                  </div>
                )}
                <span className="text-[#1A1A1A]/40 select-none font-bold">/</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Solid High-Contrast Telemetry Status */}
        <div className="shrink-0 hidden md:flex items-center space-x-2 bg-[#F59E0B] pl-2 z-10">
          <Link
            href="/leaderboards"
            className="flex items-center space-x-1 text-[11px] font-mono font-bold text-[#1A1A1A] hover:underline"
          >
            <span>All Fixtures</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-[#1A1A1A]/40">•</span>
          <div className="flex items-center space-x-1.5 bg-[#1A1A1A] text-[#FBF9F5] text-[10px] font-mono font-bold px-2 py-0.5 rounded">
            <span className={`w-2 h-2 rounded-full ${isSupabaseLive ? 'bg-emerald-400' : 'bg-blue-400'}`} />
            <span>{isSupabaseLive ? 'LIVE' : 'SYNC'}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

