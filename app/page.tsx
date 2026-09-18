'use client'

import React, { useState } from 'react'
import Hero from '@/components/Hero'
import Link from 'next/link'
import { Trophy, ArrowRight, Star } from 'lucide-react'
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
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Live Standings Snapshot
              </h2>
              <p className="text-xs text-slate-400">
                Top ranked contenders in the {activeSport?.name || 'Tournament'} division
              </p>
            </div>
          </div>

          <Link
            href="/leaderboards"
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
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
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
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
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-medium flex items-center justify-center shrink-0 ${
                        rank === 1
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {rank === 1 ? <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> : rank}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium text-xs text-slate-200 truncate">
                        {entry.team?.name || 'Team'}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {entry.team?.department || 'CS Lab'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <div className="text-base font-bold font-mono text-blue-400">
                      {entry.points} <span className="text-[10px] font-normal text-slate-500">PTS</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {entry.won}W - {entry.lost}L
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-8 px-4 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800">
            <p className="text-xs text-slate-400">
              No standings recorded yet for {activeSport?.name || 'this'} division.
            </p>
            <Link
              href="/leaderboards"
              className="mt-2 inline-flex items-center space-x-1 text-xs text-blue-400 hover:underline"
            >
              <span>Explore full leaderboard schedule &rarr;</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
