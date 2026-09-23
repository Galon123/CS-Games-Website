'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Trophy,
  Users,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Flame,
  Crosshair,
  Shield,
  Activity,
  AlertCircle,
  X,
  BookOpen,
  Share2,
} from 'lucide-react'
import { useTournament } from '@/context/TournamentContext'
import {
  findSportBySlugOrId,
  getSportSlug,
  getSportMeta,
  isCsCupFootball,
  SPORT_SPECIFIC_IMAGES,
} from '@/lib/sports-theme'
import { Team, Player, Match, LeaderboardEntry } from '@/lib/types'
import { PlayerCard } from '@/components/PlayerCard'
import TacticalBoard from '@/components/TacticalBoard'
import BadmintonHeroCarousel from '@/components/BadmintonHeroCarousel'
import BadmintonBlurredBackground from '@/components/BadmintonBlurredBackground'
import BadmintonBracketSection from '@/components/BadmintonBracketSection'

interface GameDetailViewProps {
  sportSlug?: string
}

export default function GameDetailView({ sportSlug }: GameDetailViewProps) {
  const params = useParams()
  const rawSlug = sportSlug || (typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '')
  const slug = rawSlug || ''

  const { sports, teams, players, matches, leaderboards, isAdmin } = useTournament()

  // Find sport by slug or id
  const sport = useMemo(() => {
    return findSportBySlugOrId(sports, slug)
  }, [sports, slug])

  const isCsCup = sport ? isCsCupFootball(sport.name) : false
  const isBadminton = sport
    ? sport.name.toLowerCase().includes('badminton') || slug === 'badminton'
    : slug === 'badminton'
  const sportMeta = sport ? getSportMeta(sport) : null

  // Active tab state
  const [activeTab, setActiveTab] = useState<'fixtures' | 'standings' | 'squads' | 'tactics' | 'rules'>('fixtures')
  const [fixturesFilter, setFixturesFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all')
  const [activeModalTeam, setActiveModalTeam] = useState<Team | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Keyboard accessibility: Close team roster modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModalTeam) {
        setActiveModalTeam(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModalTeam])

  // Teams belonging to this sport
  const sportTeams = useMemo(() => {
    if (!sport) return []
    return teams.filter((t) => t.sport_id === sport.id)
  }, [teams, sport])

  const sportTeamIds = useMemo(() => new Set(sportTeams.map((t) => t.id)), [sportTeams])

  // Players belonging to this sport (either directly assigned or belonging to a sport team)
  const sportPlayers = useMemo(() => {
    if (!sport) return []
    return players.filter(
      (p) => p.sport_id === sport.id || (p.team_id && sportTeamIds.has(p.team_id))
    )
  }, [players, sport, sportTeamIds])

  // Matches for this sport
  const sportMatches = useMemo(() => {
    if (!sport) return []
    return matches.filter((m) => m.sport_id === sport.id)
  }, [matches, sport])

  // Filtered matches based on status sub-filter
  const filteredMatches = useMemo(() => {
    if (fixturesFilter === 'all') return sportMatches
    return sportMatches.filter((m) => m.status === fixturesFilter)
  }, [sportMatches, fixturesFilter])

  // Leaderboard entries for this sport
  const sportLeaderboards = useMemo(() => {
    if (!sport) return []
    return leaderboards
      .filter((l) => l.sport_id === sport.id)
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        const gdA = a.goalDifference ?? 0
        const gdB = b.goalDifference ?? 0
        return gdB - gdA
      })
  }, [leaderboards, sport])

  const liveMatchesCount = sportMatches.filter((m) => m.status === 'live').length
  const upcomingMatchesCount = sportMatches.filter((m) => m.status === 'upcoming').length
  const completedMatchesCount = sportMatches.filter((m) => m.status === 'completed').length

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  // Loading or Hydrating State
  if (sports.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-acid border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-mist uppercase tracking-widest">
          Loading Tournament Division...
        </p>
      </div>
    )
  }

  // Not Found State
  if (!sport) {
    return (
      <div className="space-y-8 py-12 max-w-2xl mx-auto text-center">
        <div className="bg-ink-800 border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-acid">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-paper">
              Game Division Not Found
            </h1>
            <p className="text-xs sm:text-sm text-mist leading-relaxed">
              No tournament discipline matches identifier &ldquo;{slug}&rdquo;. Please select from our active departmental competitions below.
            </p>
          </div>

          {/* Quick links to active sports */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap justify-center gap-2">
            {sports.map((s) => {
              const sSlug = getSportSlug(s)
              const isCs = isCsCupFootball(s.name)
              return (
                <Link
                  key={s.id}
                  href={`/games/${sSlug}`}
                  className="px-4 py-2 rounded-full text-xs font-mono font-bold bg-white/5 hover:bg-white/10 text-paper border border-white/10 hover:border-acid/40 transition-colors"
                >
                  {isCs ? 'CS Cup (Football)' : s.name} &rarr;
                </Link>
              )
            })}
          </div>

          <div className="pt-4">
            <Link
              href="/games"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-acid text-acid-ink text-xs font-black tracking-wider uppercase shadow-xs hover:bg-acid-hot transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Games Directory</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const SportIcon = sportMeta?.icon || Trophy

  return (
    <div className="space-y-10 pb-20 relative">
      {/* ─────────────────────────────────────────────────────────────
          ATMOSPHERIC BLURRED PROFESSIONAL BADMINTON ARENA BACKGROUND
          Fixed z-0 background, smoothly blurred, clearly visible
          ───────────────────────────────────────────────────────────── */}
      {isBadminton && <BadmintonBlurredBackground />}

      <div className="relative z-10 space-y-10">
        {/* ─────────────────────────────────────────────────────────────
            1. BREADCRUMBS, BACK ACTION & QUICK GAME SWITCHER
            ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-fog">
            <Link href="/" className="text-mist hover:text-acid transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/games" className="text-mist hover:text-acid transition-colors">
              Games
            </Link>
            <span>/</span>
            <span className="text-paper font-semibold">
              {isCsCup ? 'CS Cup (Football)' : sport.name}
            </span>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-mist hover:text-paper transition-colors"
              title="Share this game link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied URL!' : 'Share'}</span>
            </button>

            <Link
              href="/games"
              className="group flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-semibold text-mist hover:text-paper transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>All Games</span>
            </Link>
          </div>
        </div>

        {/* Quick Game Switcher Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-fog shrink-0 pr-1">
            Jump to:
          </span>
          {sports.map((s) => {
            const sSlug = getSportSlug(s)
            const isCurrent = s.id === sport.id
            const isCs = isCsCupFootball(s.name)
            const label = isCs ? 'CS Cup (Football)' : s.name

            return (
              <Link
                key={s.id}
                href={`/games/${sSlug}`}
                className={`px-3.5 py-1 rounded-full text-xs font-mono font-medium transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-acid text-acid-ink font-bold shadow-xs'
                    : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10 border border-white/10'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION FOR THIS DEDICATED GAME
          For Badminton: Hero Presentation Carousel
          ───────────────────────────────────────────────────────────── */}
      {isBadminton ? (
        <BadmintonHeroCarousel />
      ) : (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-ink-800 to-ink-900 shadow-card">
          {/* Cinematic Imagery Background (if available) */}
          {sportMeta?.imageUrl && (
            <div className="absolute inset-0 pointer-events-none select-none opacity-30 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sportMeta.imageUrl}
                alt={sport.name}
                className="w-full h-full object-cover grayscale-[25%] contrast-[115%]"
                onError={(e) => {
                  if (isCsCup) {
                    if (e.currentTarget.src !== SPORT_SPECIFIC_IMAGES.football) {
                      e.currentTarget.src = SPORT_SPECIFIC_IMAGES.football
                    }
                  } else if (
                    sport.name.toLowerCase().includes('e-football') ||
                    sport.name.toLowerCase().includes('efootball') ||
                    sport.name.toLowerCase().includes('e football')
                  ) {
                    if (e.currentTarget.src !== SPORT_SPECIFIC_IMAGES['e-football']) {
                      e.currentTarget.src = SPORT_SPECIFIC_IMAGES['e-football']
                    }
                  } else if (
                    sport.name.toLowerCase().includes('mini militia') ||
                    sport.name.toLowerCase().includes('mini miltia') ||
                    sport.name.toLowerCase().includes('mini-militia') ||
                    sport.name.toLowerCase().includes('mini-miltia')
                  ) {
                    if (e.currentTarget.src !== SPORT_SPECIFIC_IMAGES['mini-militia']) {
                      e.currentTarget.src = SPORT_SPECIFIC_IMAGES['mini-militia']
                    }
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/50 to-transparent" />
            </div>
          )}

          {/* Tactical Pitch Lines Watermark (if Football) */}
          {isCsCup && (
            <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-10 select-none overflow-hidden hidden sm:block">
              <svg className="w-full h-full text-white" viewBox="0 0 600 400" fill="none" stroke="currentColor">
                <rect x="50" y="30" width="500" height="340" strokeWidth="1.5" />
                <line x1="300" y1="30" x2="300" y2="370" strokeWidth="1.5" strokeDasharray="6 6" />
                <circle cx="300" cy="200" r="60" strokeWidth="1.5" />
                <rect x="50" y="120" width="120" height="160" strokeWidth="1.5" />
                <rect x="430" y="120" width="120" height="160" strokeWidth="1.5" />
              </svg>
            </div>
          )}

          {/* Content Layer */}
          <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                  isCsCup
                    ? 'bg-acid text-acid-ink border-acid shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                    : 'bg-white/10 text-paper border-white/20'
                }`}
              >
                {isCsCup ? 'MARQUEE CHAMPIONSHIP' : sportMeta?.badgeText}
              </span>

              {liveMatchesCount > 0 && (
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black border border-emerald-500/40 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{liveMatchesCount} MATCH IN PLAY</span>
                </span>
              )}

              {sport.venue && (
                <div className="flex items-center space-x-1.5 text-xs text-mist font-mono">
                  <MapPin className="w-3.5 h-3.5 text-acid shrink-0" />
                  <span>{sport.venue}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-paper tracking-tight leading-[1.05]">
                  {isCsCup ? 'The CS Cup.' : `${sport.name}.`}
                </h1>
                {isCsCup && <span className="text-acid text-2xl font-black">★</span>}
              </div>
              <p className="text-sm sm:text-base text-cream/90 leading-relaxed font-sans">
                {isCsCup
                  ? 'The premier 6v6 football championship of CS Games 2026. Battled on the regulation synthetic turf pitch with live formation tracking and player telemetry.'
                  : sportMeta?.description}
              </p>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-ink-900/60 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono uppercase text-fog block">Registered Teams</span>
                <span className="font-serif font-black text-2xl text-paper mt-0.5 block font-lining">
                  {sportTeams.length}
                </span>
                <span className="text-[10px] font-mono text-mist">Competing squads</span>
              </div>

              <div className="bg-ink-900/60 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono uppercase text-fog block">Active Athletes</span>
                <span className="font-serif font-black text-2xl text-paper mt-0.5 block font-lining">
                  {sportPlayers.length}
                </span>
                <span className="text-[10px] font-mono text-mist">Rostered players</span>
              </div>

              <div className="bg-ink-900/60 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono uppercase text-fog block">Total Fixtures</span>
                <span className="font-serif font-black text-2xl text-acid mt-0.5 block font-lining">
                  {sportMatches.length}
                </span>
                <span className="text-[10px] font-mono text-mist">
                  {completedMatchesCount} finished
                </span>
              </div>

              <div className="bg-ink-900/60 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono uppercase text-fog block">Tournament Type</span>
                <span className="font-mono font-bold text-sm text-paper mt-1 block uppercase">
                  {sport.type === 'team'
                    ? 'Squad 6v6'
                    : sport.type === 'duo'
                    ? 'Doubles'
                    : sport.type === 'solo'
                    ? '1v1 Solo'
                    : '1v1v1v1'}
                </span>
                <span className="text-[10px] font-mono text-mist">Official bracket</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. INTERACTIVE SECTION TABS NAVIGATION
          Sticky, accessible tabs with counter badges (hidden for Badminton)
          ───────────────────────────────────────────────────────────── */}
      {!isBadminton && (
        <div className="sticky top-16 sm:top-18 z-30 bg-ink-900/90 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-white/10">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
            {[
              {
                key: 'fixtures',
                label: 'Fixtures & Matches',
                count: sportMatches.length,
                icon: Calendar,
              },
              {
                key: 'standings',
                label: 'Points Table',
                count: sportLeaderboards.length,
                icon: Trophy,
              },
              {
                key: 'squads',
                label: 'Squads & Rosters',
                count: sportTeams.length > 0 ? sportTeams.length : sportPlayers.length,
                icon: Users,
              },
              ...(isCsCup
                ? [
                    {
                      key: 'tactics',
                      label: 'CS Cup Pitch Formations',
                      count: undefined,
                      icon: Crosshair,
                    },
                  ]
                : []),
              {
                key: 'rules',
                label: 'Regulations & Venue',
                count: undefined,
                icon: BookOpen,
              },
            ].map((tab) => {
              const Icon = tab.icon
              const isSelected = activeTab === tab.key

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? isCsCup && tab.key === 'tactics'
                        ? 'bg-acid text-acid-ink font-black shadow-[0_0_12px_rgba(215,242,43,0.3)]'
                        : 'bg-white/15 text-paper border border-white/25 shadow-xs font-bold'
                      : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected ? (isCsCup && tab.key === 'tactics' ? 'text-acid-ink' : 'text-acid') : 'text-fog'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {typeof tab.count === 'number' && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-paper font-bold' : 'bg-white/10 text-mist'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. TAB CONTENT 1: FIXTURES & LIVE MATCHES
          ───────────────────────────────────────────────────────────── */}
      {(isBadminton || activeTab === 'fixtures') && (
        <div className="space-y-6 animate-fade-in-up">
          {isBadminton ? (
            <div className="space-y-8">
              {/* Dedicated Badminton Doubles Tournament Knockout Section */}
              <BadmintonBracketSection />

              {/* Supplementary registered matches if any exist in the database */}
              {sportMatches.length > 0 && (
                <div className="pt-8 border-t border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-serif font-black text-paper tracking-tight">
                        Additional Scheduled Matches.
                      </h3>
                      <p className="text-xs text-mist mt-0.5">
                        Supplementary departmental exhibition fixtures
                      </p>
                    </div>

                    {/* Sub-filter chips & Admin Action */}
                    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
                      <div className="flex items-center space-x-1.5">
                        {[
                          { key: 'all', label: `All (${sportMatches.length})` },
                          { key: 'live', label: `Live (${liveMatchesCount})` },
                          { key: 'upcoming', label: `Upcoming (${upcomingMatchesCount})` },
                          { key: 'completed', label: `Final (${completedMatchesCount})` },
                        ].map((f) => (
                          <button
                            key={f.key}
                            onClick={() => setFixturesFilter(f.key as any)}
                            className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                              fixturesFilter === f.key
                                ? 'bg-acid text-acid-ink font-bold'
                                : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10 border border-white/10'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium transition-colors shrink-0"
                          title="Open Admin Console to edit fixtures and live scores"
                        >
                          <Shield className="w-3 h-3 text-emerald-400" />
                          <span>Admin Edit</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {filteredMatches.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredMatches.map((match) => {
                        const isLive = match.status === 'live'
                        const isUpcoming = match.status === 'upcoming'

                        const teamA = match.team_a || teams.find((t) => t.id === match.team_a_id)
                        const teamB = match.team_b || teams.find((t) => t.id === match.team_b_id)

                        const playerA = match.player_a || players.find((p) => p.id === match.player_a_id)
                        const playerB = match.player_b || players.find((p) => p.id === match.player_b_id)

                        const nameA = teamA?.name || playerA?.name || 'Contender A'
                        const nameB = teamB?.name || playerB?.name || 'Contender B'
                        const deptA = teamA?.department || playerA?.department || 'CS Lab'
                        const deptB = teamB?.department || playerB?.department || 'CS Lab'

                        return (
                          <div
                            key={match.id}
                            className={`bg-ink-800 rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between ${
                              isLive
                                ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/30'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                                <div className="flex items-center space-x-2">
                                  {isLive ? (
                                    <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black border border-emerald-500/30 animate-pulse">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                      <span>{match.minute ? `${match.minute}' LIVE` : 'LIVE IN PLAY'}</span>
                                    </span>
                                  ) : isUpcoming ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-mist font-mono text-[10px] font-bold border border-white/10 uppercase">
                                      UPCOMING
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-fog font-mono text-[10px] font-bold border border-white/10 uppercase">
                                      FINAL RESULT
                                    </span>
                                  )}
                                </div>

                                {match.venue && (
                                  <div className="flex items-center space-x-1 text-[11px] font-mono text-mist">
                                    <MapPin className="w-3 h-3 text-acid shrink-0" />
                                    <span className="truncate max-w-[140px]">{match.venue}</span>
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2">
                                <div className="flex flex-col items-center text-center min-w-0">
                                  <div className="w-11 h-11 rounded-xl bg-ink-900 border border-white/15 mb-2 flex items-center justify-center font-mono font-black text-xs text-paper shadow-subtle">
                                    {nameA.substring(0, 2).toUpperCase()}
                                  </div>
                                  <span className="font-bold text-xs text-paper truncate max-w-full block" title={nameA}>
                                    {nameA}
                                  </span>
                                  <span className="text-[10px] text-mist truncate max-w-full block mt-0.5 font-mono">
                                    {deptA}
                                  </span>
                                </div>

                                <div className="flex flex-col items-center justify-center shrink-0 px-2">
                                  {isUpcoming ? (
                                    <div className="w-10 h-8 rounded-lg bg-ink-900 border border-white/15 flex items-center justify-center">
                                      <span className="font-mono font-black text-acid text-xs tracking-wider">
                                        VS
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      <span
                                        className={`font-serif font-black text-2xl font-lining ${
                                          (match.team_a_score ?? 0) > (match.team_b_score ?? 0)
                                            ? 'text-acid'
                                            : 'text-paper'
                                        }`}
                                      >
                                        {match.team_a_score ?? 0}
                                      </span>
                                      <span className="text-fog font-mono font-bold">:</span>
                                      <span
                                        className={`font-serif font-black text-2xl font-lining ${
                                          (match.team_b_score ?? 0) > (match.team_a_score ?? 0)
                                            ? 'text-acid'
                                            : 'text-paper'
                                        }`}
                                      >
                                        {match.team_b_score ?? 0}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col items-center text-center min-w-0">
                                  <div className="w-11 h-11 rounded-xl bg-ink-900 border border-white/15 mb-2 flex items-center justify-center font-mono font-black text-xs text-paper shadow-subtle">
                                    {nameB.substring(0, 2).toUpperCase()}
                                  </div>
                                  <span className="font-bold text-xs text-paper truncate max-w-full block" title={nameB}>
                                    {nameB}
                                  </span>
                                  <span className="text-[10px] text-mist truncate max-w-full block mt-0.5 font-mono">
                                    {deptB}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {match.scheduled_at && (
                              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-mist">
                                <div className="flex items-center space-x-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-acid shrink-0" />
                                  <span suppressHydrationWarning>
                                    {new Date(match.scheduled_at).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <Clock className="w-3.5 h-3.5 text-acid shrink-0" />
                                  <span suppressHydrationWarning>
                                    {new Date(match.scheduled_at).toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-paper tracking-tight">
                {isCsCup ? 'CS Cup Match Schedule.' : `${sport.name} Fixtures.`}
              </h2>
              <p className="text-xs text-mist mt-0.5">
                Live scores, upcoming fixtures, and final championship results
              </p>
            </div>

            {/* Sub-filter chips & Admin Action */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center space-x-1.5">
                {[
                  { key: 'all', label: `All (${sportMatches.length})` },
                  { key: 'live', label: `Live (${liveMatchesCount})` },
                  { key: 'upcoming', label: `Upcoming (${upcomingMatchesCount})` },
                  { key: 'completed', label: `Final (${completedMatchesCount})` },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFixturesFilter(f.key as any)}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                      fixturesFilter === f.key
                        ? 'bg-acid text-acid-ink font-bold'
                        : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium transition-colors shrink-0"
                  title="Open Admin Console to edit fixtures and live scores"
                >
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>Admin Edit</span>
                </Link>
              )}
            </div>
          </div>

          {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatches.map((match) => {
                const isLive = match.status === 'live'
                const isUpcoming = match.status === 'upcoming'

                const teamA = match.team_a || teams.find((t) => t.id === match.team_a_id)
                const teamB = match.team_b || teams.find((t) => t.id === match.team_b_id)

                const playerA = match.player_a || players.find((p) => p.id === match.player_a_id)
                const playerB = match.player_b || players.find((p) => p.id === match.player_b_id)

                const nameA = teamA?.name || playerA?.name || 'Contender A'
                const nameB = teamB?.name || playerB?.name || 'Contender B'
                const deptA = teamA?.department || playerA?.department || 'CS Lab'
                const deptB = teamB?.department || playerB?.department || 'CS Lab'

                const isQuad = match.is_quad || sport.type === 'quad'

                return (
                  <div
                    key={match.id}
                    className={`bg-ink-800 rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between ${
                      isLive
                        ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/30'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      {/* Match Status Header */}
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                        <div className="flex items-center space-x-2">
                          {isLive ? (
                            <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black border border-emerald-500/30 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>{match.minute ? `${match.minute}' LIVE` : 'LIVE IN PLAY'}</span>
                            </span>
                          ) : isUpcoming ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-mist font-mono text-[10px] font-bold border border-white/10 uppercase">
                              UPCOMING
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-fog font-mono text-[10px] font-bold border border-white/10 uppercase">
                              FINAL RESULT
                            </span>
                          )}
                        </div>

                        {match.venue && (
                          <div className="flex items-center space-x-1 text-[11px] font-mono text-mist">
                            <MapPin className="w-3 h-3 text-acid shrink-0" />
                            <span className="truncate max-w-[140px]">{match.venue}</span>
                          </div>
                        )}
                      </div>

                      {/* Head-to-Head Scoreboard Grid */}
                      {!isQuad ? (
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2">
                          {/* Contender A */}
                          <div className="flex flex-col items-center text-center min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-ink-900 border border-white/15 mb-2 flex items-center justify-center font-mono font-black text-xs text-paper shadow-subtle">
                              {nameA.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-xs text-paper truncate max-w-full block" title={nameA}>
                              {nameA}
                            </span>
                            <span className="text-[10px] text-mist truncate max-w-full block mt-0.5 font-mono">
                              {deptA}
                            </span>
                          </div>

                          {/* Center Scoreboard / VS */}
                          <div className="flex flex-col items-center justify-center shrink-0 px-2">
                            {isUpcoming ? (
                              <div className="w-10 h-8 rounded-lg bg-ink-900 border border-white/15 flex items-center justify-center">
                                <span className="font-mono font-black text-acid text-xs tracking-wider">
                                  VS
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`font-serif font-black text-2xl font-lining ${
                                    (match.team_a_score ?? 0) > (match.team_b_score ?? 0)
                                      ? 'text-acid'
                                      : 'text-paper'
                                  }`}
                                >
                                  {match.team_a_score ?? 0}
                                </span>
                                <span className="text-fog font-mono font-bold">:</span>
                                <span
                                  className={`font-serif font-black text-2xl font-lining ${
                                    (match.team_b_score ?? 0) > (match.team_a_score ?? 0)
                                      ? 'text-acid'
                                      : 'text-paper'
                                  }`}
                                >
                                  {match.team_b_score ?? 0}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Contender B */}
                          <div className="flex flex-col items-center text-center min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-ink-900 border border-white/15 mb-2 flex items-center justify-center font-mono font-black text-xs text-paper shadow-subtle">
                              {nameB.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-xs text-paper truncate max-w-full block" title={nameB}>
                              {nameB}
                            </span>
                            <span className="text-[10px] text-mist truncate max-w-full block mt-0.5 font-mono">
                              {deptB}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Quad 4-Way Match View (for Carrom) */
                        <div className="py-2 space-y-2">
                          <div className="text-[10px] font-mono text-fog uppercase text-center mb-1">
                            1v1v1v1 Board Scores
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <div className="bg-ink-900 p-2 rounded-lg border border-white/5 flex items-center justify-between">
                              <span className="text-paper truncate">{nameA}</span>
                              <span className="font-bold text-acid">{match.team_a_score ?? 0} pts</span>
                            </div>
                            <div className="bg-ink-900 p-2 rounded-lg border border-white/5 flex items-center justify-between">
                              <span className="text-paper truncate">{nameB}</span>
                              <span className="font-bold text-acid">{match.team_b_score ?? 0} pts</span>
                            </div>
                            <div className="bg-ink-900 p-2 rounded-lg border border-white/5 flex items-center justify-between">
                              <span className="text-mist truncate">{match.player_c?.name || 'Player C'}</span>
                              <span className="font-bold text-paper">{match.player_c_score ?? 0} pts</span>
                            </div>
                            <div className="bg-ink-900 p-2 rounded-lg border border-white/5 flex items-center justify-between">
                              <span className="text-mist truncate">{match.player_d?.name || 'Player D'}</span>
                              <span className="font-bold text-paper">{match.player_d_score ?? 0} pts</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Schedule Timing Footer */}
                    {match.scheduled_at && (
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-mist">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-acid shrink-0" />
                          <span suppressHydrationWarning>
                            {new Date(match.scheduled_at).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-acid shrink-0" />
                          <span suppressHydrationWarning>
                            {new Date(match.scheduled_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-ink-800/60 border border-dashed border-white/15 rounded-2xl p-10 text-center space-y-3">
              <Calendar className="w-8 h-8 text-fog mx-auto" />
              <h3 className="font-serif font-bold text-base text-paper">No matches scheduled</h3>
              <p className="text-xs text-mist max-w-sm mx-auto">
                No fixtures currently recorded under the &ldquo;{fixturesFilter}&rdquo; filter for this sport.
              </p>
              <Link
                href="/admin"
                className="mt-2 inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-acid hover:underline"
              >
                <span>Schedule fixtures in Admin Console &rarr;</span>
              </Link>
            </div>
          )}
          </>
        )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. TAB CONTENT 2: STANDINGS & POINTS TABLE
          ───────────────────────────────────────────────────────────── */}
      {!isBadminton && activeTab === 'standings' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-paper tracking-tight">
                {isCsCup ? 'CS Cup Leaderboard.' : `${sport.name} Standings.`}
              </h2>
              <p className="text-xs text-mist mt-0.5">
                Official points standings, match record, and qualification rankings
              </p>
            </div>

            <Link
              href="/leaderboards"
              className="text-xs font-mono font-bold text-acid hover:text-acid-hot flex items-center space-x-1"
            >
              <span>View All Tournament Standings</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {sportLeaderboards.length > 0 ? (
            <div className="bg-ink-800 rounded-2xl border border-white/10 overflow-hidden shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-ink-900/60 text-[10px] font-mono uppercase tracking-[0.14em] text-fog">
                      <th className="py-3.5 px-4 font-bold">Pos</th>
                      <th className="py-3.5 px-4 font-bold">Contender / Squad</th>
                      <th className="py-3.5 px-3 font-bold text-center">P</th>
                      <th className="py-3.5 px-3 font-bold text-center">W</th>
                      <th className="py-3.5 px-3 font-bold text-center">D</th>
                      <th className="py-3.5 px-3 font-bold text-center">L</th>
                      <th className="py-3.5 px-3 font-bold text-center">GD</th>
                      <th className="py-3.5 px-5 font-bold text-right text-acid">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs font-mono">
                    {sportLeaderboards.map((entry, idx) => {
                      const rank = idx + 1
                      const name = entry.team?.name || entry.player?.name || 'Contender'
                      const dept = entry.team?.department || entry.player?.department || 'CS Department'

                      return (
                        <tr
                          key={entry.id}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <span
                              className={`w-6 h-6 rounded-md text-[11px] font-mono font-black inline-flex items-center justify-center ${
                                rank === 1
                                  ? 'bg-acid text-acid-ink font-bold shadow-[0_0_8px_rgba(215,242,43,0.3)]'
                                  : rank === 2
                                  ? 'bg-white/15 text-paper'
                                  : rank === 3
                                  ? 'bg-amber-600/20 text-amber-300'
                                  : 'text-fog'
                              }`}
                            >
                              {rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 min-w-[200px]">
                            <div className="font-bold text-paper">{name}</div>
                            <div className="text-[10px] text-fog">{dept}</div>
                          </td>

                          <td className="py-3.5 px-3 text-center text-paper">{entry.played}</td>
                          <td className="py-3.5 px-3 text-center text-emerald-400 font-bold">{entry.won}</td>
                          <td className="py-3.5 px-3 text-center text-fog">{entry.drawn}</td>
                          <td className="py-3.5 px-3 text-center text-rose-400">{entry.lost}</td>
                          <td className="py-3.5 px-3 text-center text-mist">
                            {entry.goalDifference !== undefined
                              ? entry.goalDifference > 0
                                ? `+${entry.goalDifference}`
                                : entry.goalDifference
                              : 0}
                          </td>

                          <td className="py-3.5 px-5 text-right font-serif font-black text-base text-acid font-lining">
                            {entry.points}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-ink-800/60 border border-dashed border-white/15 rounded-2xl p-10 text-center space-y-3">
              <Trophy className="w-8 h-8 text-fog mx-auto" />
              <h3 className="font-serif font-bold text-base text-paper">No points table data</h3>
              <p className="text-xs text-mist max-w-sm mx-auto">
                Standings for this division have not been initialized yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. TAB CONTENT 3: SQUADS & ATHLETE ROSTERS
          ───────────────────────────────────────────────────────────── */}
      {!isBadminton && activeTab === 'squads' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-paper tracking-tight">
                {isCsCup ? 'CS Cup Teams & Lineups.' : `${sport.name} Registered Squads.`}
              </h2>
              <p className="text-xs text-mist mt-0.5">
                Inspect participating teams, star icon athletes, and official squad rosters
              </p>
            </div>

            <Link
              href="/roster"
              className="text-xs font-mono font-bold text-acid hover:text-acid-hot flex items-center space-x-1"
            >
              <span>View All Tournament Rosters</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {sportTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sportTeams.map((team) => {
                const teamPlayers = players.filter((p) => p.team_id === team.id)
                const iconPlayer = teamPlayers.find((p) => p.is_icon)

                return (
                  <div
                    key={team.id}
                    className="bg-ink-800 rounded-2xl border border-white/10 p-5 space-y-4 hover:border-white/25 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-ink-900 border border-white/15 flex items-center justify-center font-mono font-black text-sm text-paper shadow-subtle">
                          {team.name.substring(0, 2).toUpperCase()}
                        </div>
                        {team.formation && (
                          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-acid border border-acid/20">
                            {team.formation}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-serif font-black text-lg text-paper">{team.name}</h3>
                        <p className="text-xs text-mist font-mono mt-0.5">{team.department}</p>
                        {team.manager && (
                          <p className="text-[11px] text-fog font-mono mt-1">
                            Manager: <span className="text-cream">{team.manager}</span>
                          </p>
                        )}
                      </div>

                      {/* Icon Player Spotlight */}
                      {iconPlayer && (
                        <div className="bg-ink-900/80 p-2.5 rounded-xl border border-acid/25 flex items-center space-x-3">
                          <div className="w-7 h-7 rounded-full bg-acid text-acid-ink font-black text-xs flex items-center justify-center shrink-0">
                            ★
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] font-mono font-bold uppercase text-acid block">
                              ICON PLAYER
                            </span>
                            <span className="text-xs font-bold text-paper truncate block">
                              {iconPlayer.name} ({iconPlayer.role})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Button to inspect full modal roster */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-mono text-fog">
                        {teamPlayers.length} rostered players
                      </span>

                      <button
                        onClick={() => setActiveModalTeam(team)}
                        className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono font-bold text-paper hover:text-acid transition-colors"
                      >
                        Inspect Squad →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* If solo sport without team containers, list registered players directly */
            sportPlayers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sportPlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    sportName={sport.name}
                    sportType={sport.type}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-ink-800/60 border border-dashed border-white/15 rounded-2xl p-10 text-center space-y-3">
                <Users className="w-8 h-8 text-fog mx-auto" />
                <h3 className="font-serif font-bold text-base text-paper">No squads enrolled</h3>
                <p className="text-xs text-mist max-w-sm mx-auto">
                  No teams or athletes currently registered for this division. Register squads via the Admin Portal.
                </p>
                <Link
                  href="/admin"
                  className="mt-2 inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-acid hover:underline"
                >
                  <span>Register squads in Admin Console &rarr;</span>
                </Link>
              </div>
            )
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. TAB CONTENT 4: FORMATIONS STUDIO (CS CUP FOOTBALL ONLY)
          ───────────────────────────────────────────────────────────── */}
      {isCsCup && activeTab === 'tactics' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="meta-label text-acid">INTERACTIVE 6v6 PITCH</span>
                <span className="text-white/20">•</span>
                <span className="text-xs font-mono text-mist">The CS Cup Studio</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-paper tracking-tight">
                CS Cup Tactical Pitch &amp; Squad Formations.
              </h2>
              <p className="text-xs text-mist mt-0.5">
                Explore starting lineups, draggable tactical positions, and regulation presets (2-2-1, 2-1-2, 3-1-1, 1-3-1, 1-2-2)
              </p>
            </div>

            <Link
              href="/tactics"
              className="text-xs font-mono font-bold text-acid hover:text-acid-hot flex items-center space-x-1"
            >
              <span>Full Screen Formations Studio</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <TacticalBoard />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          8. TAB CONTENT 5: REGULATIONS & VENUE GUIDELINES
          ───────────────────────────────────────────────────────────── */}
      {!isBadminton && activeTab === 'rules' && (
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-paper tracking-tight">
              {isCsCup ? 'The CS Cup Regulations & Guidelines.' : `${sport.name} Regulations & Guidelines.`}
            </h2>
            <p className="text-xs text-mist">
              Official tournament rules, scoring mechanics, court standards, and tie-breaker guidelines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Match Duration & Formats */}
            <div className="bg-ink-800 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-acid" />
                <h3 className="font-serif font-bold text-base text-paper">Match Format &amp; Duration</h3>
              </div>
              <ul className="text-xs text-mist space-y-2 font-sans list-disc list-inside leading-relaxed">
                {isCsCup ? (
                  <>
                    <li>Match Duration: Two 20-minute halves with a 5-minute halftime interval.</li>
                    <li>6v6 Regulation: 1 Goalkeeper + 5 Outfield players on synthetic turf.</li>
                    <li>Substitutions: Rolling substitutions allowed at the referee whistle (up to 4 bench reserves).</li>
                    <li>No Offside Rule: Offsides are not applied on the 6v6 turf pitch.</li>
                  </>
                ) : sport.name.toLowerCase().includes('badminton') ? (
                  <>
                    <li>Match Duration: Best of 3 sets to 21 points using rally scoring.</li>
                    <li>Doubles Knockout: 2 players per side; service rotation strictly enforced.</li>
                    <li>Deuce Rule: At 20-20, side leading by 2 wins; capped at 30 points maximum.</li>
                    <li>Interval: 60-second break when either side reaches 11 points; 2 minutes between games.</li>
                  </>
                ) : sport.name.toLowerCase().includes('chess') ? (
                  <>
                    <li>Time Control: 15 minutes base time + 5 seconds increment per move (FIDE Rapid).</li>
                    <li>Solo 1v1 Format: Swiss System rounds leading to knockout semifinals.</li>
                    <li>Touch-Move: Strict touch-move rules apply once a piece is deliberately contacted.</li>
                    <li>Digital Clocks: Official digital tournament timers provided at all tables.</li>
                  </>
                ) : sport.name.toLowerCase().includes('carrom') ? (
                  <>
                    <li>Target Score: 29 points or 8 boards, whichever is achieved first.</li>
                    <li>Quad 1v1v1v1 Showdown: Four solo contenders compete simultaneously on one board.</li>
                    <li>Piece Values: White = 2 pts, Black = 1 pt, Queen (Red) = 3 pts (must be covered).</li>
                    <li>Foul Rule: Pocketing the striker incurs a 1-piece deduction (due piece returned to center).</li>
                  </>
                ) : (
                  <>
                    <li>Sanctioned departmental tournament rules apply to all scheduled fixtures.</li>
                    <li>Athletes must report to court marshals 15 minutes before scheduled start time.</li>
                    <li>Rolling substitutions or set structures are overseen by official referees.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Box 2: Points & Scoring System */}
            <div className="bg-ink-800 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-2.5">
                <Trophy className="w-4 h-4 text-acid" />
                <h3 className="font-serif font-bold text-base text-paper">Points &amp; Tie-Breakers</h3>
              </div>
              <ul className="text-xs text-mist space-y-2 font-sans list-disc list-inside leading-relaxed">
                <li>Points Allocation: 3 Points for Win, 1 Point for Draw, 0 Points for Loss.</li>
                <li>Standings Tie-Breaker: Goal/Point difference, followed by head-to-head result.</li>
                {isCsCup && (
                  <li>Knockout Matches: 5 minutes Golden Goal extra time; best-of-3 penalties if tied.</li>
                )}
                <li>Forfeits: Failure to field a minimum squad results in 0-3 walkover deduction.</li>
              </ul>
            </div>

            {/* Box 3: Venue Information */}
            <div className="bg-ink-800 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-acid" />
                <h3 className="font-serif font-bold text-base text-paper">Venue &amp; Logistics</h3>
              </div>
              <div className="text-xs text-mist space-y-2 font-sans leading-relaxed">
                <p>
                  <strong>Official Location:</strong> {sport.venue || 'Campus Sports Complex'}
                </p>
                <p>
                  Athletes must wear appropriate footwear for the designated surface (turf studs for football; non-marking rubber soles for indoor badminton; casual for chess and carrom).
                </p>
                <p>
                  First-aid stations and hydration booths are stationed adjacent to the main courts.
                </p>
              </div>
            </div>

            {/* Box 4: Code of Conduct & Fair Play */}
            <div className="bg-ink-800 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-acid" />
                <h3 className="font-serif font-bold text-base text-paper">Fair Play Protocol</h3>
              </div>
              <p className="text-xs text-mist leading-relaxed font-sans">
                The Computer Science Department sports championship emphasizes mutual respect, athletic honor, and positive competition. Decisions of student referees and tournament marshals are final. Unsportsmanlike conduct results in immediate card penalties or disqualification from remaining fixtures.
              </p>
            </div>
          </div>
        </div>
      )}

      </div>

      {/* ─────────────────────────────────────────────────────────────
          9. SQUAD ROSTER INSPECTOR MODAL (ACCESSIBLE, ESC-DISMISSIBLE)
          ───────────────────────────────────────────────────────────── */}
      {activeModalTeam && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-team-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveModalTeam(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-ink-800 border border-white/15 rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 text-acid border border-acid/20 uppercase">
                    {sport.name} Squad
                  </span>
                  {activeModalTeam.formation && (
                    <span className="text-[10px] font-mono text-fog font-medium">
                      Shape: {activeModalTeam.formation}
                    </span>
                  )}
                </div>
                <h3 id="modal-team-title" className="font-serif font-black text-2xl text-paper">
                  {activeModalTeam.name}
                </h3>
                <p className="text-xs text-mist font-mono">
                  {activeModalTeam.department} {activeModalTeam.manager ? `• Manager: ${activeModalTeam.manager}` : ''}
                </p>
              </div>

              <button
                onClick={() => setActiveModalTeam(null)}
                className="p-2 rounded-lg text-mist hover:text-paper hover:bg-white/10 transition-colors"
                aria-label="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Players Grid */}
            <div className="space-y-3">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-fog">
                Roster Athletes ({players.filter((p) => p.team_id === activeModalTeam.id).length})
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {players
                  .filter((p) => p.team_id === activeModalTeam.id)
                  .map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      teamName={activeModalTeam.name}
                      sportName={sport.name}
                      sportType={sport.type}
                    />
                  ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-fog">
                Press Esc or click outside to dismiss
              </span>

              <button
                onClick={() => setActiveModalTeam(null)}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-paper border border-white/10 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
