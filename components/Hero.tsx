'use client'

import React from 'react'
import Link from 'next/link'
import { useTournament } from '@/context/TournamentContext'
import {
  Trophy,
  ArrowRight,
  Crosshair,
  MapPin,
  Flame,
  Users,
  Calendar,
  Clock,
} from 'lucide-react'
import { getSportMeta, SPORT_SPECIFIC_IMAGES, isCsCupFootball } from '@/lib/sports-theme'
import CSBrandMark from '@/components/CSBrandMark'

export default function Hero() {
  const { sports, matches, leaderboards } = useTournament()

  // Find genuine CS Cup (physical football) live match or featured match
  const csCupFeatured =
    matches.find(
      (m) =>
        isCsCupFootball(m.sport?.name) &&
        (m.status === 'live' || m.status === 'upcoming')
    ) ||
    matches.find((m) => isCsCupFootball(m.sport?.name)) ||
    matches.find((m) => m.status === 'live') ||
    matches[0]

  return (
    <div className="space-y-16">
      {/* ─────────────────────────────────────────────────────────────
          NOIR EDITORIAL SPORTS-JOURNALISM HERO SHOWCASE
          Deep ink canvas (#06080A / #0B0E11), oversized display serif,
          Electric Acid accents (#D7F22B), and cinematic atmospheric depth.
          ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-8.5rem)] lg:min-h-[calc(100vh-7.5rem)] flex flex-col justify-between py-8 sm:py-12 overflow-hidden rounded-2xl border border-white/10 px-5 sm:px-8 lg:px-12 bg-gradient-to-b from-ink-800 to-ink-900 text-cream shadow-card">
        {/* Grounded Pitch Line-Art Geometry (Hairline Chalk Outlines) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-0 opacity-25">
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1280px] h-[860px] text-white/20 pointer-events-none hero-pitch-svg"
            viewBox="0 0 1200 800"
            fill="none"
            stroke="currentColor"
          >
            {/* Regulation Pitch Outlines */}
            <rect x="80" y="60" width="1040" height="680" strokeWidth="1" />
            <line x1="600" y1="60" x2="600" y2="740" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="600" cy="400" r="100" strokeWidth="1" />
            <circle cx="600" cy="400" r="3" fill="currentColor" />

            {/* Left & Right Penalty Boxes */}
            <rect x="80" y="230" width="200" height="340" strokeWidth="1" />
            <rect x="80" y="310" width="80" height="180" strokeWidth="1" />
            <path d="M 280 330 A 100 100 0 0 1 280 470" strokeWidth="1" />

            <rect x="920" y="230" width="200" height="340" strokeWidth="1" />
            <rect x="1040" y="310" width="80" height="180" strokeWidth="1" />
            <path d="M 920 330 A 100 100 0 0 0 920 470" strokeWidth="1" />

            {/* Corner Flag Arcs */}
            <path d="M 80 88 A 28 28 0 0 0 108 60" strokeWidth="1" />
            <path d="M 80 712 A 28 28 0 0 1 108 740" strokeWidth="1" />
            <path d="M 1092 60 A 28 28 0 0 0 1120 88" strokeWidth="1" />
            <path d="M 1092 740 A 28 28 0 0 1 1120 712" strokeWidth="1" />

            {/* Tactical Registration Crosshair Accents */}
            <g transform="translate(980, 80)" opacity="0.3">
              <rect x="0" y="0" width="96" height="96" strokeWidth="1" />
              <line x1="24" y1="0" x2="24" y2="96" strokeWidth="0.8" />
              <line x1="48" y1="0" x2="48" y2="96" strokeWidth="0.8" />
              <line x1="72" y1="0" x2="72" y2="96" strokeWidth="0.8" />
              <line x1="0" y1="24" x2="96" y2="24" strokeWidth="0.8" />
              <line x1="0" y1="48" x2="96" y2="48" strokeWidth="0.8" />
              <line x1="0" y1="72" x2="96" y2="72" strokeWidth="0.8" />
            </g>
          </svg>

          {/* Technical Corner Registration Marks (+) */}
          <span className="absolute top-5 left-6 text-xs font-mono text-acid/60 font-bold select-none">+</span>
          <span className="absolute top-5 right-6 text-xs font-mono text-acid/60 font-bold select-none">+</span>
          <span className="absolute bottom-5 left-6 text-xs font-mono text-acid/60 font-bold select-none">+</span>
          <span className="absolute bottom-5 right-6 text-xs font-mono text-acid/60 font-bold select-none">+</span>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ASYMMETRIC EDITORIAL CONTENT LAYER (Z-10)
            ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Dominant Editorial Display & Actions (7 Cols) */}
            <div className="lg:col-span-7 space-y-7 animate-fade-in-up">
              {/* 1. Header Metadata: University Department & Event Dates */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 select-none">
                  <CSBrandMark className="w-9 h-9 rounded-lg" />
                  <span className="text-[11px] font-mono font-medium tracking-[0.16em] uppercase text-mist">
                    DEPARTMENT OF COMPUTER SCIENCE &amp; ENGINEERING
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="bg-acid text-acid-ink font-mono font-bold text-[10px] px-3 py-0.5 rounded-full tracking-wider uppercase">
                    SEPTEMBER 22–25, 2026
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-mist font-mono text-[11px] tracking-[0.14em] uppercase">
                    ANNUAL CHAMPIONSHIP MEET
                  </span>
                </div>
              </div>

              {/* 2. Main Title in Dominant Fraunces Serif Typography */}
              <div className="space-y-3">
                <h1 className="font-serif font-black text-6xl sm:text-7xl lg:text-8xl text-paper tracking-tight leading-[0.95]">
                  CS Games.
                </h1>
                <p className="font-serif italic text-xl sm:text-3xl text-cream/90 font-light leading-snug">
                  Discipline. Strategy.{' '}
                  <span className="text-acid font-medium not-italic underline decoration-acid/60 decoration-2 underline-offset-8">
                    Championship.
                  </span>
                </p>
              </div>

              {/* 3. Flagship Tournament Notification Capsule */}
              <div className="flex items-center space-x-3 bg-white/[0.04] border border-white/12 px-4 py-2.5 rounded-xl max-w-xl">
                <span className="bg-acid text-acid-ink font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  FLAGSHIP
                </span>
                <span className="text-xs text-cream/90 font-medium truncate">
                  The CS Cup: 6v6 Football Turf Championship | Active Brackets in Progress
                </span>
              </div>

              {/* 4. Solid Editorial Description */}
              <p className="text-sm sm:text-base text-mist max-w-xl leading-relaxed font-sans">
                The premier annual sports and gaming championship of the Computer Science Department. Centered around the prestigious <strong>CS Cup Football Championship</strong> on the regulation turf, student squads compete across {sports.length} tournament divisions including Badminton, Chess, Carrom, and Esports.
              </p>

              {/* 5. High-Impact Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link href="/games" className="cta-acid group">
                  <Flame className="w-4 h-4 text-acid-ink" />
                  <span>Explore All Games</span>
                  <span className="arrow-hover ml-0.5">↗</span>
                </Link>

                <Link href="/games/football" className="cta-outline group">
                  <Crosshair className="w-4 h-4 text-acid" />
                  <span>CS Cup Pitch</span>
                  <span className="arrow-hover ml-0.5">↗</span>
                </Link>

                <Link
                  href="/leaderboards"
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded-full text-xs font-semibold tracking-wide text-mist hover:text-paper hover:bg-white/5 transition-all"
                >
                  <Trophy className="w-4 h-4 text-fog" />
                  <span>Standings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 6. Quick Graphical Stat Module */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <span className="block font-serif font-black text-2xl text-paper tracking-tight font-lining">
                    0{sports.length}
                  </span>
                  <span className="meta-label text-[10px] text-fog">Divisions</span>
                </div>
                <div>
                  <span className="block font-serif font-black text-2xl text-acid tracking-tight font-lining">
                    6v6
                  </span>
                  <span className="meta-label text-[10px] text-fog">Turf Pitch</span>
                </div>
                <div>
                  <span className="block font-serif font-black text-2xl text-paper tracking-tight font-lining">
                    100%
                  </span>
                  <span className="meta-label text-[10px] text-fog">Live Telemetry</span>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Match Scoreboard & Podium Standings (5 Cols) */}
            <div className="lg:col-span-5 space-y-5 animate-fade-in-up [animation-delay:150ms]">
              {/* 1. Featured Match Scoreboard Card */}
              <div className="bg-ink-800/90 text-cream border border-white/12 rounded-2xl p-6 space-y-5 shadow-card backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-2.5">
                    {csCupFeatured?.status === 'live' ? (
                      <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>LIVE</span>
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-acid" />
                    )}
                    <span className="font-serif font-black text-paper uppercase text-xs tracking-wider">
                      Featured Match | CS Cup
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-acid border border-acid/20">
                    6v6 FOOTBALL
                  </span>
                </div>

                {/* Scoreboard Unit */}
                {csCupFeatured ? (
                  <div className="bg-ink-900 border border-white/10 rounded-xl p-5">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
                      {/* Team A */}
                      <div className="flex flex-col items-center text-center min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-ink-800 border border-white/15 mb-2.5 flex items-center justify-center font-mono font-black text-sm text-paper shadow-subtle">
                          {(csCupFeatured.team_a?.name || 'A').substring(0, 2).toUpperCase()}
                        </div>
                        <span
                          className="font-bold text-xs text-paper truncate max-w-full block"
                          title={csCupFeatured.team_a?.name}
                        >
                          {csCupFeatured.team_a?.name || 'Team A'}
                        </span>
                        <span className="text-[10px] text-mist truncate max-w-full block mt-0.5 font-medium font-mono">
                          {csCupFeatured.team_a?.department || 'CS Squad'}
                        </span>
                      </div>

                      {/* Center Scoreboard / VS Unit */}
                      <div className="flex flex-col items-center justify-center shrink-0 px-3">
                        {csCupFeatured.status === 'upcoming' ? (
                          <div className="flex flex-col items-center justify-center space-y-1.5">
                            <div className="w-12 h-10 rounded-xl bg-ink-800 border border-white/15 flex items-center justify-center shadow-subtle">
                              <span className="font-mono font-black text-acid text-sm tracking-widest">
                                VS
                              </span>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-mist uppercase tracking-widest">
                              UPCOMING
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            {/* Score Display */}
                            <div className="flex items-center justify-center space-x-2.5">
                              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-ink-800 border border-white/15 flex items-center justify-center shadow-subtle">
                                <span className="text-2xl sm:text-3xl font-serif font-black text-paper font-lining">
                                  {csCupFeatured.team_a_score ?? 0}
                                </span>
                              </div>
                              <span className="text-acid font-mono font-black text-lg select-none px-0.5">
                                :
                              </span>
                              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-ink-800 border border-white/15 flex items-center justify-center shadow-subtle">
                                <span className="text-2xl sm:text-3xl font-serif font-black text-paper font-lining">
                                  {csCupFeatured.team_b_score ?? 0}
                                </span>
                              </div>
                            </div>

                            {/* Match Status */}
                            <div className="mt-2.5 flex items-center justify-center">
                              {csCupFeatured.status === 'live' ? (
                                <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                  {csCupFeatured.minute ? `${csCupFeatured.minute}' LIVE` : 'LIVE'}
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-mist text-[10px] font-mono font-bold uppercase tracking-wider border border-white/10">
                                  FINAL RESULT
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Team B */}
                      <div className="flex flex-col items-center text-center min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-ink-800 border border-white/15 mb-2.5 flex items-center justify-center font-mono font-black text-sm text-paper shadow-subtle">
                          {(csCupFeatured.team_b?.name || 'B').substring(0, 2).toUpperCase()}
                        </div>
                        <span
                          className="font-bold text-xs text-paper truncate max-w-full block"
                          title={csCupFeatured.team_b?.name}
                        >
                          {csCupFeatured.team_b?.name || 'Team B'}
                        </span>
                        <span className="text-[10px] text-mist truncate max-w-full block mt-0.5 font-medium font-mono">
                          {csCupFeatured.team_b?.department || 'CS Squad'}
                        </span>
                      </div>
                    </div>

                    {/* Match Date, Time & Venue Banner */}
                    {(csCupFeatured.scheduled_at || csCupFeatured.venue) && (
                      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        {csCupFeatured.scheduled_at && (
                          <div className="flex items-center space-x-2 text-mist text-[11px]">
                            <Calendar className="w-3.5 h-3.5 text-acid shrink-0" />
                            <span>
                              {new Date(csCupFeatured.scheduled_at).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span className="text-white/20">•</span>
                            <Clock className="w-3.5 h-3.5 text-acid shrink-0" />
                            <span>
                              {new Date(csCupFeatured.scheduled_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        )}

                        {csCupFeatured.venue && (
                          <div className="flex items-center space-x-1.5 text-mist text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-acid shrink-0" />
                            <span className="truncate">{csCupFeatured.venue}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-ink-900 border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3">
                    <Flame className="w-7 h-7 text-acid" />
                    <span className="text-xs font-bold text-paper">No live matches scheduled</span>
                    <p className="text-[11px] text-mist max-w-xs leading-relaxed">
                      Fixtures will appear here once scheduled by administrators in the Admin Console.
                    </p>
                    <Link
                      href="/admin"
                      className="mt-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-acid text-xs font-bold transition-colors"
                    >
                      Schedule in Admin Console →
                    </Link>
                  </div>
                )}
              </div>

              {/* 2. Podium Standings Card */}
              <div className="bg-ink-800/90 text-cream border border-white/12 rounded-2xl p-5 shadow-card backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-acid" />
                    <span className="text-xs font-serif font-black text-paper tracking-wider uppercase">
                      Podium Standings
                    </span>
                  </div>
                  <Link
                    href="/leaderboards"
                    className="text-[11px] font-bold text-acid hover:underline flex items-center space-x-1"
                  >
                    <span>Full Standings</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="divide-y divide-white/5">
                  {leaderboards.slice(0, 3).map((entry, index) => {
                    const sportName = sports.find((s) => s.id === entry.sport_id)?.name || 'Division'
                    const isCsCup = isCsCupFootball(sportName)
                    const displaySportName = isCsCup ? 'CS Cup' : sportName

                    return (
                      <div
                        key={entry.id}
                        className="py-3 flex items-center justify-between text-xs hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-black text-[11px] shrink-0 border ${
                              index === 0
                                ? 'bg-acid text-acid-ink border-acid shadow-[0_0_8px_rgba(215,242,43,0.4)]'
                                : index === 1
                                ? 'bg-white/15 text-paper border-white/20'
                                : 'bg-amber-600/20 text-amber-300 border-amber-600/30'
                            }`}
                          >
                            {index === 0 ? '👑' : `#${index + 1}`}
                          </span>
                          <div className="truncate">
                            <span className="font-bold text-paper">
                              {entry.team?.name || 'Squad'}
                            </span>
                            <span className="text-fog text-[11px] ml-1.5 font-mono">
                              ({displaySportName})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 shrink-0">
                          <span className="text-fog text-[10px] font-mono">
                            {entry.won}W - {entry.lost}L
                          </span>
                          <span className="font-mono font-bold text-paper px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-lining">
                            {entry.points} pts
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TOURNAMENT SPORT DIVISIONS SECTION (Below 100vh Fold)
          Dark Editorial photo cards with film grain, desaturated palette,
          and corner-anchored meta information.
          ───────────────────────────────────────────────────────────── */}
      <section id="divisions" className="space-y-8 pt-8 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-acid">
                Departmental Brackets
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[11px] text-mist font-mono">{sports.length} Competitions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-paper tracking-tight">
              Divisions.
            </h2>
            <p className="text-xs sm:text-sm text-mist mt-1 max-w-xl">
              Featuring the <strong>CS Cup Football Championship</strong> alongside Badminton, Chess, Carrom, and Esports.
            </p>
          </div>
          <Link
            href="/games"
            className="group inline-flex items-center space-x-2 text-xs font-mono font-bold text-acid hover:text-acid-hot transition-colors uppercase tracking-[0.14em]"
          >
            <span>View All Games Directory</span>
            <span className="arrow-hover">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sports.map((sport, idx) => {
            const meta = getSportMeta(sport)
            const Icon = meta.icon
            const isCsCup = isCsCupFootball(sport.name)

            return (
              <Link
                key={sport.id}
                href={meta.link}
                style={{ animationDelay: `${Math.min(idx * 60 + 50, 400)}ms` }}
                className={`bg-ink-800 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between border ${
                  isCsCup
                    ? 'border-acid/40 ring-1 ring-acid/20 shadow-[0_0_24px_rgba(215,242,43,0.12)]'
                    : 'border-white/10 hover:border-white/25 hover:shadow-elevated'
                } hover:-translate-y-1`}
              >
                <div>
                  {meta.imageUrl ? (
                    <div className="relative h-44 w-full overflow-hidden bg-ink-900 border-b border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={meta.imageUrl}
                        alt={sport.name}
                        className="w-full h-full object-cover grayscale-[35%] contrast-[115%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                        onError={(e) => {
                          if (isCsCupFootball(sport.name)) {
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
                      {/* Cinematic Scrim Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/40 to-transparent" />

                      {/* Corner Badges */}
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
                        <div className="w-7 h-7 rounded-lg bg-ink-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center">
                          <Icon className={`w-3.5 h-3.5 ${isCsCup ? 'text-acid' : 'text-paper'}`} />
                        </div>
                      </div>

                      {sport.venue && (
                        <div className="absolute bottom-2.5 left-3 right-3 text-[10px] text-mist font-mono font-medium truncate flex items-center space-x-1.5">
                          <MapPin className="w-3 h-3 text-acid shrink-0" />
                          <span className="truncate">{sport.venue}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-5 pb-2">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-mist border border-white/10">
                          {meta.badgeText}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-paper" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={meta.imageUrl ? 'p-5' : 'px-5 pb-4'}>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-serif font-black text-lg text-paper group-hover:text-acid transition-colors">
                        {isCsCup ? 'CS Cup (Football)' : sport.name}
                      </h3>
                      {isCsCup && (
                        <span className="text-acid font-black text-xs select-none">
                          ★
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-mist mt-1.5 leading-relaxed line-clamp-2 font-sans">
                      {isCsCup
                        ? 'The flagship 6v6 football championship of CS Games 2026 with interactive formations pitch tracking.'
                        : meta.description}
                    </p>
                    {!meta.imageUrl && sport.venue && (
                      <div className="mt-3 text-[10px] text-fog truncate flex items-center space-x-1 font-mono">
                        <MapPin className="w-3 h-3 text-acid shrink-0" />
                        <span className="truncate">{sport.venue}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 py-3.5 text-xs font-bold text-mist group-hover:text-acid flex items-center justify-between transition-colors border-t border-white/5">
                  <span className="font-mono text-[11px] tracking-wider uppercase">
                    {isCsCup ? 'Explore Pitch & Rosters' : meta.actionLabel}
                  </span>
                  <span className="arrow-hover text-sm">↗</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
