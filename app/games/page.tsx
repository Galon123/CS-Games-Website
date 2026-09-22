'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Trophy,
  Users,
  MapPin,
  Search,
  Crosshair,
  Flame,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  Swords,
  Gamepad2,
} from 'lucide-react'
import { useTournament } from '@/context/TournamentContext'
import {
  getSportMeta,
  getSportSlug,
  isCsCupFootball,
  SPORT_SPECIFIC_IMAGES,
} from '@/lib/sports-theme'
import CSBrandMark from '@/components/CSBrandMark'

export default function GamesDirectoryPage() {
  const { sports, teams, players, matches } = useTournament()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // Calculate live matches and fixture counts per sport
  const sportStats = useMemo(() => {
    const statsMap: Record<
      string,
      {
        teamsCount: number
        playersCount: number
        matchesCount: number
        liveMatchesCount: number
        upcomingMatchesCount: number
      }
    > = {}

    sports.forEach((sport) => {
      const sportTeams = teams.filter((t) => t.sport_id === sport.id)
      const sportTeamIds = new Set(sportTeams.map((t) => t.id))
      const sportPlayers = players.filter(
        (p) => p.sport_id === sport.id || (p.team_id && sportTeamIds.has(p.team_id))
      )
      const sportMatches = matches.filter((m) => m.sport_id === sport.id)
      const liveMatches = sportMatches.filter((m) => m.status === 'live')
      const upcomingMatches = sportMatches.filter((m) => m.status === 'upcoming')

      statsMap[sport.id] = {
        teamsCount: sportTeams.length,
        playersCount: sportPlayers.length,
        matchesCount: sportMatches.length,
        liveMatchesCount: liveMatches.length,
        upcomingMatchesCount: upcomingMatches.length,
      }
    })

    return statsMap
  }, [sports, teams, players, matches])

  // Filter sports based on search query and category filter
  const filteredSports = useMemo(() => {
    return sports.filter((sport) => {
      // Category filter
      if (activeFilter === 'cscup') {
        if (!isCsCupFootball(sport.name)) return false
      } else if (activeFilter === 'team') {
        if (sport.type !== 'team') return false
      } else if (activeFilter === 'duo') {
        if (sport.type !== 'duo') return false
      } else if (activeFilter === 'solo') {
        if (sport.type !== 'solo') return false
      } else if (activeFilter === 'quad') {
        if (sport.type !== 'quad' && sport.type !== 'free_for_all') return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const nameMatch = sport.name.toLowerCase().includes(q)
        const venueMatch = (sport.venue || '').toLowerCase().includes(q)
        const typeMatch = (sport.type || '').toLowerCase().includes(q)
        return nameMatch || venueMatch || typeMatch
      }

      return true
    })
  }, [sports, activeFilter, searchQuery])

  const totalLiveMatches = matches.filter((m) => m.status === 'live').length

  return (
    <div className="space-y-12 pb-16">
      {/* ─────────────────────────────────────────────────────────────
          BREADCRUMB & SECTION KICKER
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-fog">
          <Link href="/" className="text-mist hover:text-acid transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-paper font-semibold">Games Directory</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <span className="meta-label text-acid">DEPARTMENT DISCIPLINES</span>
              <span className="text-white/20">•</span>
              <span className="text-xs font-mono text-mist uppercase tracking-wider">
                {sports.length} Active Divisions
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-paper tracking-tight leading-[1.05]">
              Tournament Games.
            </h1>
            <p className="text-sm sm:text-base text-mist max-w-2xl leading-relaxed">
              Every tournament division has its own dedicated command center. Select any sport to inspect live match scores, schedule fixtures, view the points table standings, and study team rosters.
            </p>
          </div>

          {/* Quick CS Cup Formations Callout Card */}
          <Link
            href="/games/football"
            className="group shrink-0 bg-ink-800/90 border border-acid/30 hover:border-acid p-4 rounded-2xl transition-all shadow-card flex items-center space-x-4 max-w-md"
          >
            <div className="w-12 h-12 rounded-xl bg-acid text-acid-ink flex items-center justify-center font-black shrink-0 shadow-[0_0_12px_rgba(215,242,43,0.3)]">
              <Flame className="w-6 h-6" />
            </div>
            <div className="min-w-0 pr-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] font-black uppercase text-acid tracking-wider">
                  FLAGSHIP SHOWCASE
                </span>
                <span className="text-acid text-xs">★</span>
              </div>
              <div className="font-serif font-black text-paper text-sm group-hover:text-acid transition-colors truncate">
                The CS Cup: 6v6 Football Turf
              </div>
              <p className="text-[11px] text-mist font-mono truncate mt-0.5">
                Interactive pitch formations &amp; match telemetry
              </p>
            </div>
            <span className="text-acid font-bold text-base arrow-hover ml-auto">→</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TELEMETRY SCOREBOARD STRIP
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-ink-800/80 border border-white/10 rounded-xl p-4 sm:p-5">
          <span className="meta-label text-[10px] text-fog">Competitions</span>
          <div className="text-2xl sm:text-3xl font-serif font-black text-paper mt-1 font-lining">
            0{sports.length}
          </div>
          <span className="text-[11px] font-mono text-mist mt-1 block">Sanctioned events</span>
        </div>

        <div className="bg-ink-800/80 border border-white/10 rounded-xl p-4 sm:p-5">
          <span className="meta-label text-[10px] text-fog">Enrolled Squads</span>
          <div className="text-2xl sm:text-3xl font-serif font-black text-paper mt-1 font-lining">
            {teams.length}
          </div>
          <span className="text-[11px] font-mono text-mist mt-1 block">Across all batches</span>
        </div>

        <div className="bg-ink-800/80 border border-white/10 rounded-xl p-4 sm:p-5">
          <span className="meta-label text-[10px] text-fog">Registered Athletes</span>
          <div className="text-2xl sm:text-3xl font-serif font-black text-paper mt-1 font-lining">
            {players.length}
          </div>
          <span className="text-[11px] font-mono text-mist mt-1 block">Rostered contenders</span>
        </div>

        <div className="bg-ink-800/80 border border-white/10 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="meta-label text-[10px] text-fog">Live Telemetry</span>
            {totalLiveMatches > 0 ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ) : null}
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-black text-acid mt-1 font-lining">
            {totalLiveMatches > 0 ? `${totalLiveMatches} LIVE` : `${matches.length} Total`}
          </div>
          <span className="text-[11px] font-mono text-mist mt-1 block">
            {totalLiveMatches > 0 ? 'Fixtures in active play' : 'Scheduled fixtures'}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SEARCH & CATEGORY CONTROLS
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { key: 'all', label: 'All Disciplines' },
            { key: 'cscup', label: 'CS Cup (Football)' },
            { key: 'team', label: 'Team Squads' },
            { key: 'duo', label: 'Doubles' },
            { key: 'solo', label: 'Solo 1v1' },
            { key: 'quad', label: '1v1v1v1 / FFA' },
          ].map((cat) => {
            const isSelected = activeFilter === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-acid text-acid-ink font-bold shadow-xs'
                    : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] max-w-xs">
          <Search className="w-4 h-4 text-fog absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search game or venue..."
            className="w-full pl-9 pr-4 py-2 bg-ink-900 border border-white/15 rounded-full text-xs text-paper placeholder:text-fog focus:outline-none focus:border-acid focus:ring-1 focus:ring-acid font-mono transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-mist hover:text-paper font-mono"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          GAMES SHOWCASE GRID
          ───────────────────────────────────────────────────────────── */}
      {filteredSports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSports.map((sport, idx) => {
            const meta = getSportMeta(sport)
            const slug = getSportSlug(sport)
            const Icon = meta.icon
            const isCsCup = isCsCupFootball(sport.name)
            const stats = sportStats[sport.id] || {
              teamsCount: 0,
              playersCount: 0,
              matchesCount: 0,
              liveMatchesCount: 0,
              upcomingMatchesCount: 0,
            }

            return (
              <div
                key={sport.id}
                style={{ animationDelay: `${idx * 60}ms` }}
                className={`bg-ink-800 rounded-2xl overflow-hidden border flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 ${
                  isCsCup
                    ? 'border-acid/40 ring-1 ring-acid/20 shadow-[0_0_24px_rgba(215,242,43,0.12)]'
                    : 'border-white/10 hover:border-white/25 hover:shadow-elevated'
                }`}
              >
                <div>
                  {/* Card Visual Banner */}
                  {meta.imageUrl ? (
                    <div className="relative h-48 w-full overflow-hidden bg-ink-900 border-b border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={meta.imageUrl}
                        alt={sport.name}
                        className="w-full h-full object-cover grayscale-[30%] contrast-[110%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                        onError={(e) => {
                          if (isCsCup) {
                            if (e.currentTarget.src !== SPORT_SPECIFIC_IMAGES.football) {
                              e.currentTarget.src = SPORT_SPECIFIC_IMAGES.football
                            }
                          }
                        }}
                      />
                      {/* Dark Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/40 to-transparent" />

                      {/* Header Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md border ${
                            isCsCup
                              ? 'bg-acid text-acid-ink border-acid'
                              : 'bg-ink-900/80 text-paper border-white/20'
                          }`}
                        >
                          {isCsCup ? 'CS CUP (FOOTBALL)' : meta.badgeText}
                        </span>

                        {stats.liveMatchesCount > 0 ? (
                          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 font-mono text-[10px] font-black animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                            <span>LIVE</span>
                          </span>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-ink-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center">
                            <Icon className={`w-3.5 h-3.5 ${isCsCup ? 'text-acid' : 'text-paper'}`} />
                          </div>
                        )}
                      </div>

                      {/* Venue Footnote */}
                      {sport.venue && (
                        <div className="absolute bottom-2.5 left-3 right-3 text-[10px] text-mist font-mono font-medium truncate flex items-center space-x-1.5">
                          <MapPin className="w-3 h-3 text-acid shrink-0" />
                          <span className="truncate">{sport.venue}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-5 pb-3 border-b border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-mist border border-white/10">
                          {meta.badgeText}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-paper" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Editorial Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif font-black text-xl text-paper group-hover:text-acid transition-colors">
                        {isCsCup ? 'CS Cup (Football)' : sport.name}
                      </h2>
                      {isCsCup && (
                        <span className="text-acid font-black text-sm" title="Marquee Championship">
                          ★
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-mist leading-relaxed line-clamp-2">
                      {isCsCup
                        ? 'The flagship 6v6 football championship of CS Games 2026 with interactive tactical pitch tracking.'
                        : meta.description}
                    </p>

                    {!meta.imageUrl && sport.venue && (
                      <div className="text-[11px] text-fog font-mono flex items-center space-x-1.5 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-acid shrink-0" />
                        <span className="truncate">{sport.venue}</span>
                      </div>
                    )}

                    {/* Numerical Telemetry Metrics */}
                    <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-ink-900/60 p-2 rounded-lg border border-white/5">
                        <span className="block font-serif font-black text-sm text-paper font-lining">
                          {stats.teamsCount}
                        </span>
                        <span className="text-[9px] font-mono text-fog uppercase">Teams</span>
                      </div>
                      <div className="bg-ink-900/60 p-2 rounded-lg border border-white/5">
                        <span className="block font-serif font-black text-sm text-paper font-lining">
                          {stats.playersCount}
                        </span>
                        <span className="text-[9px] font-mono text-fog uppercase">Athletes</span>
                      </div>
                      <div className="bg-ink-900/60 p-2 rounded-lg border border-white/5">
                        <span className="block font-serif font-black text-sm text-acid font-lining">
                          {stats.matchesCount}
                        </span>
                        <span className="text-[9px] font-mono text-fog uppercase">Matches</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Link to Dedicated Page */}
                <div className="px-5 py-3.5 border-t border-white/10 bg-ink-900/40 flex items-center justify-between">
                  <Link
                    href={`/games/${slug}`}
                    className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-acid group-hover:text-acid-hot transition-colors uppercase tracking-[0.14em]"
                  >
                    <span>Enter Dedicated Page</span>
                    <span className="arrow-hover ml-0.5">→</span>
                  </Link>

                  <div className="flex items-center space-x-2">
                    {isCsCup && (
                      <Link
                        href="/tactics"
                        className="text-[11px] font-mono text-fog hover:text-mist px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                        title="Open Tactics Pitch"
                      >
                        Formations
                      </Link>
                    )}
                    <Link
                      href={`/leaderboards?sport=${encodeURIComponent(sport.name)}`}
                      className="text-[11px] font-mono text-fog hover:text-mist px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                      title="View Standings Table"
                    >
                      Table
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-ink-800/50 border border-white/10 rounded-2xl p-8 space-y-4">
          <Search className="w-10 h-10 text-fog mx-auto" />
          <h3 className="font-serif font-bold text-lg text-paper">No tournament disciplines found</h3>
          <p className="text-xs text-mist max-w-sm mx-auto">
            No games match &ldquo;{searchQuery}&rdquo;. Try adjusting your search query or category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setActiveFilter('all')
            }}
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-acid text-xs font-bold font-mono transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
