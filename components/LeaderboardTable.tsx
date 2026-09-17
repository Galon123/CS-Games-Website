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
          <h1 className="text-2xl sm:text-3xl font-black text-ice-white font-mono tracking-tight">
            LEADERBOARDS & RANKINGS
          </h1>
          <p className="text-xs text-muted-gray mt-1">
            Realtime tournament division standings synced across all {sports.length} events.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-gray" />
          <input
            type="text"
            placeholder="Search teams or labs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyber-cyan rounded-xl pl-9 pr-3 py-1.5 text-xs text-ice-white placeholder-slate-500 focus:outline-none"
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all shrink-0 ${
                isSelected
                  ? 'bg-slate-800 text-neon-lime border border-neon-lime/40 shadow-sm'
                  : 'bg-slate-900/60 text-muted-gray hover:text-white border border-slate-800/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? meta.colorClass : 'text-slate-400'}`} />
              <span>{sport.name}</span>
            </button>
          )
        })}
      </div>

      {/* Table Card */}
      <div className="bg-card border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/40 text-xs font-mono">
          <span className="font-bold text-ice-white uppercase">
            {activeSport?.name} DIVISION
          </span>
          <span className="text-muted-gray">
            3 PTS Win • 1 PT Draw
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/60 text-muted-gray font-mono uppercase">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-2 w-8 text-center">Δ</th>
                <th className="py-3 px-4">Squad / Laboratory</th>
                <th className="py-3 px-3 text-center">Played</th>
                <th className="py-3 px-3 text-center text-emerald-400">Won</th>
                <th className="py-3 px-3 text-center text-slate-400">Drawn</th>
                <th className="py-3 px-3 text-center text-rose-400">Lost</th>
                <th className="py-3 px-4 text-center font-bold text-neon-lime">Points</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry, index) => {
                  const rank = index + 1
                  const team = entry.team

                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${
                            rank === 1
                              ? 'text-amber-400 bg-amber-950/40 border border-amber-500/40'
                              : rank === 2
                              ? 'text-slate-300 bg-slate-700/40'
                              : 'text-slate-500'
                          }`}
                        >
                          {rank === 1 ? <Star className="w-3 h-3 fill-amber-400" /> : rank}
                        </span>
                      </td>

                      {/* Rank Movement */}
                      <td className="py-3.5 px-2 text-center">
                        {entry.rankChange === 'up' ? (
                          <span className="inline-flex text-neon-lime font-bold">
                            <ArrowUp className="w-3 h-3" />
                          </span>
                        ) : entry.rankChange === 'down' ? (
                          <span className="inline-flex text-rose-500 font-bold">
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
                            <div className="font-bold text-ice-white group-hover:text-neon-lime transition-colors">
                              {team?.name || 'Team'}
                            </div>
                            <div className="text-[11px] text-muted-gray">{team?.department}</div>
                          </div>
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="py-3.5 px-3 text-center font-mono text-slate-300">{entry.played}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-emerald-400">{entry.won}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-400">{entry.drawn}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-rose-400">{entry.lost}</td>

                      {/* Points */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-black text-sm text-neon-lime px-2 py-0.5 rounded bg-neon-lime/10">
                          {entry.points}
                        </span>
                      </td>

                      {/* Roster Link */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/roster?team=${team?.id}`}
                          className="inline-flex items-center space-x-1 text-[11px] text-muted-gray hover:text-white font-mono py-1 px-2 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors"
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
                  <td colSpan={9} className="py-12 text-center text-muted-gray font-mono">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Trophy className="w-8 h-8 text-slate-700" />
                      <span className="text-slate-400 font-bold">
                        No standings recorded yet for {activeSport?.name || 'this'} division.
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Matches or team registrations will populate rank metrics automatically.
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
