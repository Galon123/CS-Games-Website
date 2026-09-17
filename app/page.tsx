'use client'

import React, { useState } from 'react'
import Hero from '@/components/Hero'
import Link from 'next/link'
import { Trophy, ArrowRight, Star, ShieldAlert } from 'lucide-react'
import { useTournament } from '@/context/TournamentContext'
import { getSportMeta } from '@/lib/sports-theme'

export default function HomePage() {
  const { leaderboards, sports } = useTournament()
  const [selectedSportId, setSelectedSportId] = useState<string>('')

  // Determine active sport for snapshot (default to football or first available sport)
  const activeSport =
    sports.find((s) => s.id === selectedSportId) ||
    sports.find((s) => s.name.toLowerCase() === 'football') ||
    sports[0]

  const topEntries = leaderboards
    .filter((l) => l.sport_id === activeSport?.id)
    .slice(0, 4)

  return (
    <div className="space-y-12 pb-8">
      {/* High-Impact Hero Showcase */}
      <Hero />

      {/* Clean Standings Snapshot Section */}
      <section className="bg-card border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-neon-lime/10 border border-neon-lime/30 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-neon-lime" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ice-white font-mono uppercase tracking-tight">
                Live Standings Snapshot
              </h2>
              <p className="text-xs text-muted-gray">
                Top ranked contenders in the {activeSport?.name || 'Tournament'} division
              </p>
            </div>
          </div>

          <Link
            href="/leaderboards"
            className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-neon-lime hover:text-white transition-colors"
          >
            <span>View All {sports.length} Sports Standings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Division Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {sports.map((sport) => {
            const isSelected = sport.id === activeSport?.id
            const meta = getSportMeta(sport)
            const Icon = meta.icon

            return (
              <button
                key={sport.id}
                onClick={() => setSelectedSportId(sport.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-slate-800 text-neon-lime border border-neon-lime/40 shadow-sm'
                    : 'bg-slate-900/60 text-muted-gray hover:text-white border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-neon-lime' : 'text-slate-400'}`} />
                <span>{sport.name}</span>
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
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                        rank === 1
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rank === 1 ? <Star className="w-3.5 h-3.5 fill-amber-400" /> : rank}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-ice-white truncate">
                        {entry.team?.name || 'Team'}
                      </div>
                      <div className="text-[10px] text-muted-gray font-mono truncate">
                        {entry.team?.department || 'CS Lab'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <div className="text-base font-black font-mono text-neon-lime">
                      {entry.points} <span className="text-[10px] font-normal text-slate-500">PTS</span>
                    </div>
                    <div className="text-[10px] text-muted-gray font-mono">
                      {entry.won}W - {entry.lost}L
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-8 px-4 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
            <p className="text-xs text-muted-gray font-mono">
              No standings recorded yet for {activeSport?.name || 'this'} division.
            </p>
            <Link
              href="/leaderboards"
              className="mt-2 inline-flex items-center space-x-1 text-xs font-mono text-cyber-cyan hover:underline"
            >
              <span>Explore full leaderboard schedule &rarr;</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
