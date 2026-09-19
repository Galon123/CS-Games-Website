'use client'

import React from 'react'
import Link from 'next/link'
import { useTournament } from '@/context/TournamentContext'
import {
  Trophy,
  ArrowRight,
  ArrowDown,
  Crosshair,
  MapPin,
  Flame,
  Users,
  Shield,
  Zap,
  Calendar,
  Clock,
} from 'lucide-react'
import { getSportMeta, SPORT_SPECIFIC_IMAGES, isCsCupFootball } from '@/lib/sports-theme'
import CSBrandMark from '@/components/CSBrandMark'

export default function Hero() {
  const { sports, matches, leaderboards } = useTournament()

  // Find genuine CS Cup (physical football) live match or featured match (strictly excluding e-football)
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
    <div className="space-y-12">
      {/* ─────────────────────────────────────────────────────────────
          HIGH-CONTRAST EDITORIAL SPORTS-JOURNALISM HERO BANNER
          Authoritative Royal Blue Canvas (#1E40AF), Chalk White Headings,
          Ochre Gold accents, and physical offset drop shadows.
          Strictly following DESIGN.md with zero AI slop gradients or blur halos.
          ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-8.5rem)] lg:min-h-[calc(100vh-7.5rem)] flex flex-col justify-between py-6 sm:py-8 overflow-hidden rounded-2xl border-2 border-[#172554] px-4 sm:px-8 lg:px-10 bg-[#1E40AF] text-white shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]">
        {/* ─────────────────────────────────────────────────────────────
            GROUNDED SPORTS LINE-ART GEOMETRY (Chalk-White Outlines)
            Razor-thin outlines in white/20 with Ochre Gold technical markers
            ───────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-0">
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] text-white/15 pointer-events-none"
            viewBox="0 0 1200 800"
            fill="none"
            stroke="currentColor"
          >
            {/* Tactical Football Pitch Regulation Outlines */}
            <rect x="80" y="60" width="1040" height="680" strokeWidth="1.2" />
            <line x1="600" y1="60" x2="600" y2="740" strokeWidth="1.2" strokeDasharray="6 6" />
            <circle cx="600" cy="400" r="100" strokeWidth="1.2" />
            <circle cx="600" cy="400" r="3.5" fill="currentColor" />

            {/* Left & Right Penalty Boxes */}
            <rect x="80" y="230" width="200" height="340" strokeWidth="1.2" />
            <rect x="80" y="310" width="80" height="180" strokeWidth="1.2" />
            <path d="M 280 330 A 100 100 0 0 1 280 470" strokeWidth="1.2" />

            <rect x="920" y="230" width="200" height="340" strokeWidth="1.2" />
            <rect x="1040" y="310" width="80" height="180" strokeWidth="1.2" />
            <path d="M 920 330 A 100 100 0 0 0 920 470" strokeWidth="1.2" />

            {/* Corner Flag Arcs */}
            <path d="M 80 88 A 28 28 0 0 0 108 60" strokeWidth="1.2" />
            <path d="M 80 712 A 28 28 0 0 1 108 740" strokeWidth="1.2" />
            <path d="M 1092 60 A 28 28 0 0 0 1120 88" strokeWidth="1.2" />
            <path d="M 1092 740 A 28 28 0 0 1 1120 712" strokeWidth="1.2" />

            {/* Chess Board Grid Outline Accent (Top Right) */}
            <g transform="translate(980, 80)" opacity="0.4">
              <rect x="0" y="0" width="96" height="96" strokeWidth="1.2" />
              <line x1="24" y1="0" x2="24" y2="96" strokeWidth="0.8" />
              <line x1="48" y1="0" x2="48" y2="96" strokeWidth="0.8" />
              <line x1="72" y1="0" x2="72" y2="96" strokeWidth="0.8" />
              <line x1="0" y1="24" x2="96" y2="24" strokeWidth="0.8" />
              <line x1="0" y1="48" x2="96" y2="48" strokeWidth="0.8" />
              <line x1="0" y1="72" x2="96" y2="72" strokeWidth="0.8" />
            </g>

            {/* Shuttlecock Flight Trajectory Arcs (Bottom Left) */}
            <path
              d="M 120 660 C 260 560, 420 540, 560 580"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            <circle cx="560" cy="580" r="3" fill="currentColor" />
          </svg>

          {/* Technical Registration Crosshairs (+) in Ochre Amber */}
          <span className="absolute top-4 left-5 text-sm font-mono text-[#F59E0B] font-bold select-none">+</span>
          <span className="absolute top-4 right-5 text-sm font-mono text-[#F59E0B] font-bold select-none">+</span>
          <span className="absolute bottom-4 left-5 text-sm font-mono text-[#F59E0B] font-bold select-none">+</span>
          <span className="absolute bottom-4 right-5 text-sm font-mono text-[#F59E0B] font-bold select-none">+</span>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ASYMMETRIC EDITORIAL CONTENT LAYER (Z-10)
            ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: High-Contrast Display Headline & Actions (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
              {/* 1. Header Metadata: University Department Badge & Event Dates */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5 select-none">
                  <CSBrandMark className="w-9 h-9 rounded-md border-2 border-white/40 shadow-editorial-sm" />
                  <span className="text-xs font-mono font-black tracking-widest uppercase text-[#FBF9F5]">
                    DEPARTMENT OF COMPUTER SCIENCE &amp; ENGINEERING
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-[#F59E0B] text-[#1A1A1A] font-mono font-black px-2.5 py-1 rounded shadow-editorial-sm border border-[#1A1A1A] tracking-wider uppercase">
                    APRIL 18–20, 2026
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-blue-100 font-mono font-bold tracking-wider uppercase text-[11px]">
                    ANNUAL CHAMPIONSHIP MEET
                  </span>
                </div>
              </div>

              {/* 2. Main Title in Chalk White Fraunces Display Typography */}
              <div className="space-y-2">
                <h1 className="font-serif font-black text-5xl sm:text-6xl lg:text-7xl text-[#FBF9F5] tracking-tight leading-[1.05]">
                  CS GAMES 2026
                </h1>
                <p className="font-serif italic text-lg sm:text-2xl text-blue-100 font-medium leading-snug">
                  Featuring the{' '}
                  <span className="text-white font-bold not-italic underline decoration-[#F59E0B] decoration-3 underline-offset-4">
                    CS Cup Football Tournament
                  </span>{' '}
                  &amp; Inter-Batch Athletics
                </p>
              </div>

              {/* 3. Flagship Tournament Alert Capsule */}
              <div className="flex items-center space-x-3 bg-white/10 border border-white/30 px-3.5 py-2.5 rounded-md shadow-xs max-w-lg">
                <span className="bg-[#D97706] text-white font-mono text-xs font-black px-2.5 py-1 rounded shrink-0 uppercase tracking-wide border border-amber-800 shadow-2xs">
                  FLAGSHIP
                </span>
                <span className="text-xs text-white font-medium truncate">
                  The CS Cup: 6v6 Football Turf Championship • Active Brackets in Progress
                </span>
              </div>

              {/* 4. Solid Editorial Description */}
              <p className="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed font-sans">
                The premier annual sports &amp; gaming championship of the Computer Science Department. Centered around the prestigious <strong>CS Cup Football Championship</strong> on the main turf, student squads compete across {sports.length} tournament divisions including Badminton, Chess, Carroms, and Esports.
              </p>

              {/* 5. High-Impact Solid CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href="/tactics"
                  className="inline-flex items-center space-x-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#1A1A1A] px-6 py-3.5 rounded-md font-sans font-black text-xs tracking-wider uppercase shadow-editorial-sm hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all border border-[#1A1A1A]"
                >
                  <Crosshair className="w-4 h-4 text-[#1A1A1A]" />
                  <span>CS Cup Tactical Pitch</span>
                </Link>

                <Link
                  href="/leaderboards"
                  className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-[#1A1A1A] border-2 border-[#1A1A1A] px-6 py-3.5 rounded-md font-sans font-bold text-xs tracking-wider uppercase shadow-editorial-sm hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <Trophy className="w-4 h-4 text-[#D97706]" />
                  <span>Tournament Standings</span>
                </Link>

                <Link
                  href="/roster"
                  className="inline-flex items-center space-x-2 bg-blue-900/80 hover:bg-blue-900 text-white border border-white/30 px-5 py-3.5 rounded-md text-xs font-bold tracking-wide transition-all shadow-editorial-sm"
                >
                  <Users className="w-4 h-4 text-blue-200" />
                  <span>Squad Rosters</span>
                </Link>
              </div>

              {/* 6. High-Contrast Telemetry Metrics Cards */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
                <div className="p-3 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-md shadow-editorial-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <Trophy className="w-4 h-4 text-[#D97706]" />
                    <span className="font-mono font-black text-base text-[#1A1A1A]">CS Cup</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Perpetual Trophy</span>
                </div>

                <div className="p-3 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-md shadow-editorial-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="font-mono font-black text-base text-[#1A1A1A]">{sports.length} Sports</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Divisions</span>
                </div>

                <div className="p-3 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-md shadow-editorial-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <Flame className="w-4 h-4 text-[#D97706]" />
                    <span className="font-mono font-black text-base text-[#1A1A1A]">{matches.length} Games</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Fixtures</span>
                </div>

                <div className="p-3 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-md shadow-editorial-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <Shield className="w-4 h-4 text-slate-900" />
                    <span className="font-mono font-black text-base text-[#1A1A1A]">CS Dept</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Official Arena</span>
                </div>
              </div>
            </div>

            {/* Right Column: Vibrant Tactical & Interactive Visual Feature (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 animate-fade-in-up [animation-delay:150ms]">
              {/* 1. Tactile High-Contrast Featured Match Card */}
              <div className="bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl p-5 space-y-4 shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]">
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    {csCupFeatured?.status === 'live' ? (
                      <span className="bg-[#059669] text-white font-mono text-xs font-black px-2.5 py-0.5 rounded shadow-2xs flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>LIVE</span>
                      </span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    )}
                    <span className="font-serif font-black text-[#1A1A1A] uppercase text-xs tracking-wide">
                      Featured Match • CS Cup
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-[#F59E0B] text-[#1A1A1A] border border-[#1A1A1A]">
                    6v6 FOOTBALL
                  </span>
                </div>

                {/* Scoreboard Box: Robust 3-Column Symmetrical Layout */}
                {csCupFeatured ? (
                  <div className="bg-[#FBF9F5] border-2 border-[#1A1A1A] rounded-lg p-4 sm:p-5">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                      {/* Team A */}
                      <div className="flex flex-col items-center text-center min-w-0">
                        <div className="w-12 h-12 rounded-md bg-white border-2 border-[#1A1A1A] mb-2 flex items-center justify-center font-mono font-black text-sm text-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                          {(csCupFeatured.team_a?.name || 'A').substring(0, 2).toUpperCase()}
                        </div>
                        <span
                          className="font-bold text-xs text-[#1A1A1A] truncate max-w-full block"
                          title={csCupFeatured.team_a?.name}
                        >
                          {csCupFeatured.team_a?.name || 'Team A'}
                        </span>
                        <span className="text-[10px] text-slate-600 truncate max-w-full block mt-0.5 font-medium">
                          {csCupFeatured.team_a?.department || 'CS Squad'}
                        </span>
                      </div>

                      {/* Center Scoreboard / VS Unit */}
                      <div className="flex flex-col items-center justify-center shrink-0 px-2 sm:px-3">
                        {csCupFeatured.status === 'upcoming' ? (
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-9 rounded-md bg-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                              <span className="font-mono font-black text-blue-600 text-sm tracking-widest">
                                VS
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded uppercase mt-2 tracking-wider">
                              UPCOMING
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            {/* Dual Score Tabular Blocks */}
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                                <span className="text-xl sm:text-2xl font-mono font-black text-[#1A1A1A] tabular-nums">
                                  {csCupFeatured.team_a_score ?? 0}
                                </span>
                              </div>
                              <span className="text-[#1A1A1A] font-mono font-black text-lg select-none px-0.5">
                                :
                              </span>
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                                <span className="text-xl sm:text-2xl font-mono font-black text-[#1A1A1A] tabular-nums">
                                  {csCupFeatured.team_b_score ?? 0}
                                </span>
                              </div>
                            </div>

                            {/* Centered Match Status Indicator */}
                            <div className="mt-2 flex items-center justify-center">
                              {csCupFeatured.status === 'live' ? (
                                <span className="bg-[#059669] text-white font-mono text-xs font-black px-2.5 py-1 rounded tracking-wide whitespace-nowrap border border-emerald-800 shadow-2xs">
                                  {csCupFeatured.minute ? `${csCupFeatured.minute}' LIVE` : 'LIVE'}
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-black uppercase tracking-wide whitespace-nowrap border border-slate-300">
                                  FINAL RESULT
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Team B */}
                      <div className="flex flex-col items-center text-center min-w-0">
                        <div className="w-12 h-12 rounded-md bg-white border-2 border-[#1A1A1A] mb-2 flex items-center justify-center font-mono font-black text-sm text-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                          {(csCupFeatured.team_b?.name || 'B').substring(0, 2).toUpperCase()}
                        </div>
                        <span
                          className="font-bold text-xs text-[#1A1A1A] truncate max-w-full block"
                          title={csCupFeatured.team_b?.name}
                        >
                          {csCupFeatured.team_b?.name || 'Team B'}
                        </span>
                        <span className="text-[10px] text-slate-600 truncate max-w-full block mt-0.5 font-medium">
                          {csCupFeatured.team_b?.department || 'CS Squad'}
                        </span>
                      </div>
                    </div>

                    {/* Featured Match Date, Time & Venue Banner */}
                    {(csCupFeatured.scheduled_at || csCupFeatured.venue) && (
                      <div className="mt-3 pt-2.5 border-t-2 border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        {csCupFeatured.scheduled_at && (
                          <div className="flex items-center space-x-2 text-[#1A1A1A] font-bold bg-[#FBF9F5] px-2.5 py-1 rounded border-2 border-[#1A1A1A] shadow-2xs">
                            <Calendar className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                            <span>
                              {new Date(csCupFeatured.scheduled_at).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span className="text-slate-300">•</span>
                            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>
                              {new Date(csCupFeatured.scheduled_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        )}

                        {csCupFeatured.venue && (
                          <div className="flex items-center space-x-1.5 text-slate-700 text-xs font-medium bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">{csCupFeatured.venue}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#FBF9F5] border-2 border-[#1A1A1A] rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-2">
                    <Flame className="w-6 h-6 text-[#D97706]" />
                    <span className="text-xs font-bold text-[#1A1A1A]">No live matches scheduled</span>
                    <p className="text-[11px] text-slate-600 max-w-xs">
                      Fixtures will appear here once scheduled by administrators in the Admin Console.
                    </p>
                    <Link
                      href="/admin"
                      className="mt-2 px-3.5 h-10 inline-flex items-center justify-center rounded-md bg-white hover:bg-slate-50 border-2 border-[#1A1A1A] text-blue-700 text-xs font-bold shadow-editorial-sm transition-colors"
                    >
                      Schedule in Admin Console →
                    </Link>
                  </div>
                )}

              </div>

              {/* 2. Podium Standings Card with High Contrast */}
              <div className="bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl p-4 shadow-[5px_5px_0px_0px_rgba(26,26,26,1)]">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-[#D97706]" />
                    <span className="text-xs font-serif font-black text-[#1A1A1A] tracking-wide uppercase">
                      Podium Standings
                    </span>
                  </div>
                  <Link
                    href="/leaderboards"
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span>Full Standings</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="divide-y divide-slate-100">
                  {leaderboards.slice(0, 3).map((entry, index) => {
                    const sportName = sports.find((s) => s.id === entry.sport_id)?.name || 'Division'
                    const isCsCup = isCsCupFootball(sportName)
                    const displaySportName = isCsCup ? 'CS Cup' : sportName

                    return (
                      <div
                        key={entry.id}
                        className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center font-mono font-black text-[11px] shrink-0 border ${
                              index === 0
                                ? 'bg-[#F59E0B] text-[#1A1A1A] border-[#1A1A1A] shadow-2xs'
                                : index === 1
                                ? 'bg-slate-200 text-slate-800 border-slate-400'
                                : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                          >
                            {index === 0 ? '👑' : `#${index + 1}`}
                          </span>
                          <div className="truncate">
                            <span className="font-bold text-[#1A1A1A]">
                              {entry.team?.name || 'Squad'}
                            </span>
                            <span className="text-slate-500 text-[11px] ml-1.5 font-mono">
                              ({displaySportName})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 shrink-0">
                          <span className="text-slate-500 text-[10px] font-medium">
                            {entry.won}W - {entry.lost}L
                          </span>
                          <span className="font-mono font-black text-[#1A1A1A] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs tabular-nums">
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

        {/* Bottom Anchor Strip of the 100vh Hero Viewport */}
        <div className="relative z-10 pt-4 pb-1 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Quick Division Links */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar max-w-full py-0.5">
            <span className="text-white/80 font-bold text-[11px] uppercase tracking-wider shrink-0 mr-1">
              Divisions:
            </span>
            {sports.map((sport) => {
              const isCsCup = isCsCupFootball(sport.name)
              const displayName = isCsCup ? 'CS Cup (Football)' : sport.name

              return (
                <a
                  key={sport.id}
                  href="#divisions"
                  className={`shrink-0 px-2.5 py-1 rounded-md transition-all text-[11px] font-bold shadow-2xs ${
                    isCsCup
                      ? 'bg-[#F59E0B] text-[#1A1A1A] border-2 border-[#1A1A1A] font-black'
                      : 'bg-white/15 border border-white/30 text-white hover:bg-white hover:text-[#1A1A1A]'
                  }`}
                >
                  {displayName}
                </a>
              )
            })}
          </div>

          {/* Smooth Scroll Cue to Divisions Grid */}
          <a
            href="#divisions"
            className="inline-flex items-center space-x-2 text-white hover:text-[#F59E0B] font-bold transition-colors shrink-0 group select-none"
          >
            <span>Explore All {sports.length} Tournament Divisions</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#F59E0B] animate-bounce" />
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TOURNAMENT SPORT DIVISIONS SECTION (Below 100vh Fold)
          Solid white cards, zero glassmorphism or backdrop-blur.
          ───────────────────────────────────────────────────────────── */}
      <section id="divisions" className="space-y-6 pt-10 border-t border-[#E5E0D8]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
                Departmental Brackets
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono">{sports.length} Sports</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
              Tournament Divisions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Featuring the <strong>CS Cup Football Championship</strong> alongside Badminton, Chess, Carroms, and Esports.
            </p>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline font-mono">
            Select division for fixtures &rarr;
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sports.map((sport, idx) => {
            const meta = getSportMeta(sport)
            const Icon = meta.icon
            const isCsCup = isCsCupFootball(sport.name)

            return (
              <Link
                key={sport.id}
                href={meta.link}
                style={{ animationDelay: `${Math.min(idx * 60 + 50, 400)}ms` }}
                className={`bg-white rounded-xl overflow-hidden transition-all group flex flex-col justify-between shadow-editorial-sm hover:shadow-editorial-md hover:-translate-y-1 ${
                  isCsCup
                    ? 'border-2 border-[#1E40AF] ring-2 ring-blue-500/20'
                    : 'border-2 border-[#1A1A1A]'
                }`}
              >
                <div>
                  {meta.imageUrl ? (
                    /* Solid Image Cover strictly for Football/CS Cup, Badminton, Chess, and Carroms */
                    <div className="relative h-36 w-full overflow-hidden bg-slate-100 border-b-2 border-[#1A1A1A]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={meta.imageUrl}
                        alt={sport.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          if (isCsCupFootball(sport.name)) {
                            if (e.currentTarget.src !== SPORT_SPECIFIC_IMAGES.football) {
                              e.currentTarget.src = SPORT_SPECIFIC_IMAGES.football
                            }
                          }
                        }}
                      />
                      {/* Solid badge banner without backdrop-blur */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded shadow-2xs border ${
                            isCsCup
                              ? 'bg-[#153422] text-[#F59E0B] border-[#F59E0B]'
                              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]'
                          }`}
                        >
                          {isCsCup ? 'CS CUP (FOOTBALL)' : meta.badgeText}
                        </span>
                        <div className="w-6 h-6 rounded bg-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-2xs">
                          <Icon className={`w-3.5 h-3.5 ${isCsCup ? 'text-blue-600' : meta.colorClass}`} />
                        </div>
                      </div>
                      {sport.venue && (
                        <div className="absolute bottom-0 inset-x-0 bg-black/75 px-2.5 py-1 text-[10px] text-white font-mono font-medium truncate flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-[#F59E0B] shrink-0" />
                          <span className="truncate">{sport.venue}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Clean Solid Header for sports without photo */
                    <div className="p-4 pb-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-[#1A1A1A] border border-[#1A1A1A]">
                          {meta.badgeText}
                        </span>
                        <div className="w-6 h-6 rounded bg-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-2xs">
                          <Icon className={`w-3.5 h-3.5 ${meta.colorClass}`} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={meta.imageUrl ? 'p-4' : 'px-4 pb-3'}>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-serif font-black text-base text-[#1A1A1A] group-hover:text-blue-600 transition-colors">
                        {isCsCup ? 'CS Cup (Football)' : sport.name}
                      </h3>
                      {isCsCup && (
                        <span className="text-[#F59E0B] font-black text-xs select-none">
                          ★
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2 font-sans">
                      {isCsCup
                        ? 'The flagship 6v6 football championship of CS Games 2026 with interactive tactical pitch tracking.'
                        : meta.description}
                    </p>
                    {!meta.imageUrl && sport.venue && (
                      <div className="mt-2 text-[10px] text-slate-500 truncate flex items-center space-x-1 font-mono">
                        <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">{sport.venue}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-3.5 pt-2.5 text-xs font-bold text-[#1A1A1A] group-hover:text-blue-600 flex items-center justify-between transition-colors border-t border-slate-100">
                  <span>{isCsCup ? 'Explore CS Cup Pitch & Rosters' : meta.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
