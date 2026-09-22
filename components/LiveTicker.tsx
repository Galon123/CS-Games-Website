'use client'

import React from 'react'
import { useTournament } from '@/context/TournamentContext'
import Link from 'next/link'
import { Trophy, ArrowRight } from 'lucide-react'

export default function LiveTicker() {
  const { matches, isSupabaseLive, sports } = useTournament()

  const liveMatches = matches.filter((m) => m.status === 'live')
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming')

  const marqueeItems = [
    ...liveMatches.map((m) => ({
      type: 'live' as const,
      id: m.id,
      sport: m.sport?.name || 'Match',
      text:
        m.is_free_for_all || m.sport?.type === 'free_for_all'
          ? `Free For All Mass Showdown | All ${m.participants?.length || 'Enrolled'} Competitors in Action`
          : `${m.team_a?.name || 'Team A'} ${m.team_a_score ?? 0} : ${m.team_b_score ?? 0} ${m.team_b?.name || 'Team B'}`,
      minute: m.minute ? `${m.minute}'` : 'LIVE',
    })),
    {
      type: 'announcement' as const,
      id: 'flagship-announcement',
      sport: 'CS CUP',
      text: 'ANNUAL 6v6 FOOTBALL TOURNAMENT | OFFICIAL TURF ACTIVE',
      minute: 'FLAGSHIP',
    },
    ...upcomingMatches.slice(0, 3).map((m) => ({
      type: 'upcoming' as const,
      id: m.id,
      sport: m.sport?.name || 'Fixture',
      text:
        m.is_free_for_all || m.sport?.type === 'free_for_all'
          ? `Free For All Championship | All ${m.participants?.length || 'Enrolled'} Competitors Participating`
          : `${m.team_a?.name || 'Team A'} vs ${m.team_b?.name || 'Team B'}`,
      minute: 'UPCOMING',
    })),
    {
      type: 'event' as const,
      id: 'tourney-info',
      sport: 'CS GAMES 2026',
      text: `${sports.length} DIVISIONS ACTIVE | PERPETUAL TROPHY ON THE LINE`,
      minute: 'OFFICIAL',
    },
  ]

  // Duplicate items for continuous seamless loop
  const tickerItems = [...marqueeItems, ...marqueeItems]

  return (
    <aside
      aria-label="Live Match Ticker"
      className="bg-ink-800 border-b border-white/10 text-mist text-xs py-2 px-3 sm:px-4 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4">
        {/* Left: Electric Acid Live Indicator Badge */}
        <div className="flex items-center space-x-2 shrink-0 z-10 bg-ink-800 pr-2">
          <span className="bg-acid text-acid-ink font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase flex items-center space-x-1.5 shadow-[0_0_12px_rgba(215,242,43,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-acid-ink animate-ping" />
            <span>LIVE</span>
          </span>
          <span className="hidden sm:inline font-mono font-bold text-[10px] text-paper tracking-[0.14em] uppercase">
            FEED
          </span>
        </div>

        {/* Center: Continuous Marquee Scrolling Track */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center space-x-6 animate-marquee pause-on-hover whitespace-nowrap will-change-transform py-0.5">
            {tickerItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="inline-flex items-center space-x-3 shrink-0 font-mono text-xs"
              >
                {item.type === 'live' ? (
                  <Link
                    href="/leaderboards"
                    className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-paper px-2.5 py-0.5 rounded-full border border-white/15 transition-all active:translate-y-0.5"
                  >
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                      {item.minute}
                    </span>
                    <span className="font-bold text-[11px] uppercase tracking-wide text-acid">
                      {item.sport}:
                    </span>
                    <span className="font-bold text-xs text-paper font-lining">
                      {item.text}
                    </span>
                  </Link>
                ) : item.type === 'announcement' ? (
                  <div className="inline-flex items-center space-x-2 bg-white/[0.04] text-paper px-2.5 py-0.5 rounded-full border border-white/10">
                    <Trophy className="w-3 h-3 text-acid" />
                    <span className="text-acid font-bold text-[10px] uppercase tracking-wider">
                      {item.sport}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-[11px] text-mist tracking-wide">
                      {item.text}
                    </span>
                  </div>
                ) : item.type === 'upcoming' ? (
                  <div className="inline-flex items-center space-x-1.5 text-mist px-2 py-0.5">
                    <span className="text-[10px] font-bold text-fog uppercase tracking-wider">
                      UPCOMING:
                    </span>
                    <span className="text-paper text-[11px] font-medium">
                      {item.sport} &bull; {item.text}
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 text-mist font-medium text-[11px]">
                    <span className="text-acid">★</span>
                    <span className="text-cream">{item.text}</span>
                  </div>
                )}
                <span className="text-white/15 select-none font-bold">|</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Telemetry Status */}
        <div className="shrink-0 hidden md:flex items-center space-x-3 bg-ink-800 pl-2 z-10">
          <Link
            href="/leaderboards"
            className="flex items-center space-x-1 text-[11px] font-mono font-medium text-mist hover:text-paper transition-colors"
          >
            <span>All Fixtures</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-white/20">•</span>
          <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 text-paper text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSupabaseLive ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-acid shadow-[0_0_6px_rgba(215,242,43,0.8)]'
              }`}
            />
            <span className="tracking-widest uppercase">{isSupabaseLive ? 'LIVE' : 'SYNC'}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
