'use client'

import React, { useState } from 'react'
import Hero from '@/components/Hero'
import Link from 'next/link'
import { Trophy, ArrowRight, Star } from 'lucide-react'
import { useTournament } from '@/context/TournamentContext'
import { getSportMeta, isCsCupFootball } from '@/lib/sports-theme'

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

  return (
    <div className="space-y-12 pb-8">
      {/* High-Impact Hero Showcase */}
      <Hero />

      {/* High-Contrast Standings Snapshot Section */}
      <section className="bg-white border-2 border-[#1A1A1A] rounded-xl p-6 space-y-6 shadow-editorial-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-[#F59E0B] border-2 border-[#1A1A1A] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              <Trophy className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div>
              <h2 className="text-base font-serif font-black text-[#1A1A1A] tracking-tight">
                Live Standings Snapshot
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Top ranked contenders in the {isCsCupActive ? 'CS Cup (Football)' : activeSport?.name || 'Tournament'} division
              </p>
            </div>
          </div>

          <Link
            href="/leaderboards"
            className="inline-flex items-center space-x-1.5 text-xs font-black text-[#1E40AF] hover:text-[#1A1A1A] transition-colors uppercase tracking-wide"
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
            const isSportCsCup = isCsCupFootball(sport.name)
            const displayName = isSportCsCup ? 'CS Cup (Football)' : sport.name

            return (
              <button
                key={sport.id}
                onClick={() => setSelectedSportId(sport.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? isSportCsCup
                      ? 'bg-[#F59E0B] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
                      : 'bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
                    : 'bg-white text-slate-700 hover:text-[#1A1A1A] border border-slate-300 hover:border-[#1A1A1A]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? (isSportCsCup ? 'text-[#1A1A1A]' : 'text-white') : 'text-slate-500'}`} />
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
                  className="bg-white border-2 border-[#1A1A1A] rounded-lg p-4 flex items-center justify-between shadow-editorial-sm hover:-translate-y-0.5 transition-all animate-fade-in-up"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-md text-xs font-mono font-black flex items-center justify-center shrink-0 border ${
                        rank === 1
                          ? 'bg-[#F59E0B] text-[#1A1A1A] border-[#1A1A1A] shadow-2xs'
                          : rank === 2
                          ? 'bg-slate-200 text-slate-800 border-slate-400'
                          : rank === 3
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#1A1A1A] truncate">
                        {entry.team?.name || 'Team'}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate font-mono">
                        {entry.team?.department || 'CS Lab'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <div className="text-base font-black font-mono text-[#1E40AF]">
                      {entry.points} <span className="text-[10px] font-normal text-slate-500">PTS</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono font-medium">
                      {entry.won}W - {entry.lost}L
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-8 px-4 text-center rounded-xl bg-slate-50 border-2 border-dashed border-slate-300">
            <p className="text-xs text-slate-600 font-medium">
              No standings recorded yet for {activeSport?.name || 'this'} division.
            </p>
            <Link
              href="/leaderboards"
              className="mt-2 inline-flex items-center space-x-1 text-xs font-bold text-[#1E40AF] hover:underline"
            >
              <span>Explore full leaderboard schedule &rarr;</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
