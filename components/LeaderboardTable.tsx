'use client'

import React, { useState } from 'react'
import { useTournament } from '@/context/TournamentContext'
import {
  Trophy,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  Users,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { getSportMeta } from '@/lib/sports-theme'

interface LeaderboardTableProps {
  initialSportName?: string
}

export default function LeaderboardTable({ initialSportName }: LeaderboardTableProps) {
  const { sports, leaderboards } = useTournament()

  // Find sport by initialSportName or default to Football
  const initialSport = sports.find((s) => s.name.toLowerCase() === initialSportName?.toLowerCase()) || sports[0]
  const [selectedSportId, setSelectedSportId] = useState<string>(initialSport?.id || sports[0]?.id)
  const [searchQuery, setSearchQuery] = useState('')

  const activeSport = sports.find((s) => s.id === selectedSportId) || sports[0]

  // Filter leaderboards by selected sport
  const filteredEntries = leaderboards
    .filter((entry) => entry.sport_id === selectedSportId)
    .filter((entry) => {
      if (!searchQuery) return true
      const teamName = entry.team?.name.toLowerCase() || ''
      const dept = entry.team?.department.toLowerCase() || ''
      return teamName.includes(searchQuery.toLowerCase()) || dept.includes(searchQuery.toLowerCase())
    })

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Tournament Standings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Realtime standings and division points across all {sports.length} events.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams or labs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Sport Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        {sports.map((sport) => {
          const isSelected = sport.id === selectedSportId
          const meta = getSportMeta(sport)
          const Icon = meta.icon

          return (
            <button
              key={sport.id}
              onClick={() => setSelectedSportId(sport.id)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                isSelected
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{sport.name}</span>
            </button>
          )
        })}
      </div>

      {/* Table Card */}
      <div className="bg-card border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/40 text-xs">
          <span className="font-semibold text-slate-200 uppercase tracking-wide">
            {activeSport?.name} Division Standings
          </span>
          <span className="text-slate-400">
            3 PTS Win • 1 PT Draw
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-medium uppercase text-[11px]">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-2 w-8 text-center">Δ</th>
                <th className="py-3 px-4">Team / Laboratory</th>
                <th className="py-3 px-3 text-center">Played</th>
                <th className="py-3 px-3 text-center text-emerald-400">Won</th>
                <th className="py-3 px-3 text-center text-slate-400">Drawn</th>
                <th className="py-3 px-3 text-center text-rose-400">Lost</th>
                <th className="py-3 px-4 text-center font-semibold text-white">Points</th>
                <th className="py-3 px-4 text-right">Roster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry, index) => {
                  const rank = index + 1
                  const team = entry.team

                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 text-center font-medium">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs ${
                            rank === 1
                              ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 font-bold'
                              : rank === 2
                              ? 'text-slate-300 bg-slate-800 font-semibold'
                              : 'text-slate-400'
                          }`}
                        >
                          {rank === 1 ? <Star className="w-3 h-3 fill-amber-400" /> : rank}
                        </span>
                      </td>

                      {/* Rank Movement */}
                      <td className="py-3.5 px-2 text-center">
                        {entry.rankChange === 'up' ? (
                          <span className="inline-flex text-emerald-400 font-bold">
                            <ArrowUp className="w-3 h-3" />
                          </span>
                        ) : entry.rankChange === 'down' ? (
                          <span className="inline-flex text-rose-400 font-bold">
                            <ArrowDown className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="inline-flex text-slate-600">
                            <Minus className="w-3 h-3" />
                          </span>
                        )}
                      </td>

                      {/* Team */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={team?.logo_url || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=128&h=128&fit=crop'}
                              alt={team?.name || 'Team'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                              {team?.name || 'Team'}
                            </div>
                            <div className="text-[11px] text-slate-400">{team?.department}</div>
                          </div>
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="py-3.5 px-3 text-center font-mono text-slate-300">{entry.played}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-medium text-emerald-400">{entry.won}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-400">{entry.drawn}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-rose-400">{entry.lost}</td>

                      {/* Points */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-sm text-white px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700/60">
                          {entry.points}
                        </span>
                      </td>

                      {/* Roster Link */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/roster?team=${team?.id}`}
                          className="inline-flex items-center space-x-1.5 text-[11px] text-slate-300 hover:text-white font-medium py-1 px-2.5 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700/80"
                        >
                          <Users className="w-3 h-3" />
                          <span>Roster</span>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Trophy className="w-8 h-8 text-slate-600" />
                      <span className="text-slate-300 font-medium">
                        No standings recorded yet for {activeSport?.name || 'this'} division.
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Matches or team enrollments will update standings automatically.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
