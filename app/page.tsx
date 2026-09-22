'use client'

import React, { useState } from 'react'
import Hero from '@/components/Hero'
import Link from 'next/link'
import { Trophy, ArrowRight } from 'lucide-react'
import { useTournament } from '@/context/TournamentContext'
import { getSportMeta, getSportSlug, isCsCupFootball } from '@/lib/sports-theme'

export default function HomePage() {
  const { leaderboards, sports } = useTournament()
  const [selectedSportId, setSelectedSportId] = useState<string>('')

  // Determine active sport for snapshot (default to CS Cup / football or first available sport)
  const activeSport =
    sports.find((s) => s.id === selectedSportId) ||
    sports.find((s) => isCsCupFootball(s.name)) ||
    sports[0]

  const topEntries = leaderboards
    .filter((l) => l.sport_id === activeSport?.id)
    .slice(0, 4)

  const isCsCupActive = isCsCupFootball(activeSport?.name)
  const activeSlug = activeSport ? getSportSlug(activeSport) : 'football'

  return (
    <div className="space-y-16 pb-12">
      {/* High-Impact Hero Showcase */}
      <Hero />

      {/* Live Standings Snapshot Section */}
      <section className="bg-ink-800/90 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-7 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-ink-900 border border-white/15 flex items-center justify-center shrink-0 shadow-subtle">
              <Trophy className="w-5 h-5 text-acid" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-paper tracking-tight">
                Standings.
              </h2>
              <p className="text-xs text-mist font-medium mt-0.5">
                Top ranked contenders in the {isCsCupActive ? 'CS Cup (Football)' : activeSport?.name || 'Tournament'} division
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href={`/games/${activeSlug}`}
              className="group inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-acid hover:text-acid-hot transition-colors uppercase tracking-[0.14em]"
            >
              <span>{isCsCupActive ? 'CS Cup Page' : `${activeSport?.name || 'Game'} Hub`}</span>
              <span className="arrow-hover">→</span>
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/leaderboards"
              className="group inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-mist hover:text-paper transition-colors uppercase tracking-[0.14em]"
            >
              <span>Full Board</span>
              <span className="arrow-hover">↗</span>
            </Link>
          </div>
        </div>

        {/* Division Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {sports.map((sport) => {
            const isSelected = sport.id === activeSport?.id
            const meta = getSportMeta(sport)
            const Icon = meta.icon
            const isSportCsCup = isCsCupFootball(sport.name)
            const displayName = isSportCsCup ? 'CS Cup (Football)' : sport.name

            return (
              <button
                key={sport.id}
                onClick={() => setSelectedSportId(sport.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? isSportCsCup
                      ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                      : 'bg-white/15 text-paper border border-white/25 shadow-xs'
                    : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10 border border-white/10'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isSelected ? (isSportCsCup ? 'text-acid-ink' : 'text-paper') : 'text-fog'
                  }`}
                />
                <span>{displayName}</span>
              </button>
            )
          })}
        </div>

        {/* Streamlined Snapshot Cards or Empty State */}
        {topEntries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topEntries.map((entry, idx) => {
              const rank = idx + 1
              return (
                <div
                  key={entry.id}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className="bg-ink-900 border border-white/10 rounded-xl p-4 sm:p-5 flex items-center justify-between transition-all duration-200 hover:border-white/25 hover:-translate-y-0.5 animate-fade-in-up"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-lg text-xs font-mono font-black flex items-center justify-center shrink-0 border ${
                        rank === 1
                          ? 'bg-acid text-acid-ink border-acid shadow-[0_0_8px_rgba(215,242,43,0.35)]'
                          : rank === 2
                          ? 'bg-white/15 text-paper border-white/20'
                          : rank === 3
                          ? 'bg-amber-600/20 text-amber-300 border-amber-600/30'
                          : 'bg-white/5 text-mist border-white/10'
                      }`}
                    >
                      {rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-paper truncate">
                        {entry.team?.name || 'Team'}
                      </div>
                      <div className="text-[11px] text-fog truncate font-mono mt-0.5">
                        {entry.team?.department || 'CS Lab'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <div className="text-base font-serif font-black text-acid font-lining">
                      {entry.points} <span className="text-[10px] font-sans font-normal text-fog">PTS</span>
                    </div>
                    <div className="text-[10px] text-fog font-mono">
                      {entry.won}W - {entry.lost}L
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-10 px-4 text-center rounded-xl bg-ink-900/60 border border-dashed border-white/15">
            <p className="text-xs text-mist font-medium">
              No standings recorded yet for {activeSport?.name || 'this'} division.
            </p>
            <Link
              href="/leaderboards"
              className="mt-2.5 inline-flex items-center space-x-1.5 text-xs font-bold text-acid hover:underline"
            >
              <span>Explore full leaderboard schedule &rarr;</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
