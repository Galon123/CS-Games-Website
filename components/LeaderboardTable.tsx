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
  MapPin,
  Medal,
  Crown,
} from 'lucide-react'
import Link from 'next/link'
import { getSportMeta, SPORT_SPECIFIC_IMAGES, isCsCupFootball } from '@/lib/sports-theme'

function getSportWatermark(sportName: string) {
  const norm = (sportName || '').toLowerCase()
  if (isCsCupFootball(sportName)) {
    return (
      <svg
        className="absolute right-2 -bottom-8 w-64 h-64 text-slate-900 opacity-[0.035] pointer-events-none -rotate-6"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="20" y="20" width="160" height="160" rx="8" />
        <circle cx="100" cy="100" r="34" />
        <line x1="100" y1="20" x2="100" y2="180" strokeDasharray="4 4" />
        <path d="M70 20 L70 60 L130 60 L130 20" />
        <path d="M70 180 L70 140 L130 140 L130 180" />
        <path d="M50 100 Q100 130 150 100" strokeDasharray="3 3" />
      </svg>
    )
  }
  if (norm.includes('chess')) {
    return (
      <svg
        className="absolute right-4 -bottom-6 w-56 h-56 text-slate-900 opacity-[0.04] pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M48 10 L52 10 M50 8 L50 14" strokeWidth="2" strokeLinecap="round" />
        <path d="M42 20 Q50 15 58 20 Q65 30 50 35 Q35 30 42 20 Z" />
        <path d="M40 35 L60 35 L56 70 L44 70 Z" />
        <path d="M30 85 L70 85 L65 70 L35 70 Z" />
        <path d="M25 90 L75 90" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="40" x2="90" y2="40" strokeDasharray="2 4" strokeWidth="1" />
        <line x1="10" y1="60" x2="90" y2="60" strokeDasharray="2 4" strokeWidth="1" />
      </svg>
    )
  }
  if (norm.includes('badminton')) {
    return (
      <svg
        className="absolute right-4 -bottom-6 w-56 h-56 text-slate-900 opacity-[0.04] pointer-events-none -rotate-12"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="50" cy="75" r="8" fill="currentColor" fillOpacity="0.05" />
        <path d="M44 70 L32 30 L68 30 L56 70 Z" />
        <line x1="32" y1="30" x2="68" y2="30" />
        <line x1="35" y1="40" x2="65" y2="40" />
        <line x1="38" y1="52" x2="62" y2="52" />
        <line x1="42" y1="30" x2="48" y2="70" />
        <line x1="58" y1="30" x2="52" y2="70" />
        <path d="M10 90 Q30 20 85 25" strokeDasharray="3 3" strokeWidth="1.2" />
      </svg>
    )
  }
  if (norm.includes('carrom')) {
    return (
      <svg
        className="absolute right-4 -bottom-6 w-56 h-56 text-slate-900 opacity-[0.04] pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="15" y="15" width="70" height="70" rx="4" />
        <circle cx="50" cy="50" r="14" />
        <circle cx="50" cy="50" r="4" fill="currentColor" fillOpacity="0.08" />
        <circle cx="22" cy="22" r="5" />
        <circle cx="78" cy="22" r="5" />
        <circle cx="22" cy="78" r="5" />
        <circle cx="78" cy="78" r="5" />
        <line x1="30" y1="30" x2="70" y2="70" strokeDasharray="2 3" strokeWidth="1" />
        <line x1="70" y1="30" x2="30" y2="70" strokeDasharray="2 3" strokeWidth="1" />
      </svg>
    )
  }
  return (
    <svg
      className="absolute right-4 -bottom-6 w-56 h-56 text-slate-900 opacity-[0.035] pointer-events-none"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" />
      <polygon points="50,28 73,42 73,68 50,82 27,68 27,42" strokeDasharray="3 3" />
      <circle cx="50" cy="55" r="10" />
    </svg>
  )
}

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
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
            Tournament Standings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
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
            className="w-full bg-white border border-[#E5E0D8] focus:border-blue-500 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Sport Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        {sports.map((sport) => {
          const isSelected = sport.id === selectedSportId
          const meta = getSportMeta(sport)
          const Icon = meta.icon
          const isCsCup = isCsCupFootball(sport.name)

          return (
            <button
              key={sport.id}
              onClick={() => setSelectedSportId(sport.id)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? isCsCup
                    ? 'bg-[#F59E0B] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] font-black'
                    : 'bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
                  : 'bg-white text-slate-700 hover:text-[#1A1A1A] hover:bg-slate-50 border border-slate-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? (isCsCup ? 'text-[#1A1A1A]' : 'text-white') : 'text-slate-500'}`} />
              <span>{isCsCup ? 'CS Cup (Football)' : sport.name}</span>
            </button>
          )
        })}
      </div>

      {/* Active Division Feature Banner with Sport-Specific Vector Watermark */}
      {activeSport && (() => {
        const meta = getSportMeta(activeSport)
        const isCsCup = isCsCupFootball(activeSport.name)
        return (
          <div className="relative rounded-xl overflow-hidden border-2 border-[#1A1A1A] bg-white shadow-editorial-md">
            {/* Dynamic Sport-Specific Line-Art Watermark */}
            {getSportWatermark(activeSport.name)}

            {meta.imageUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={meta.imageUrl}
                  alt={activeSport.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-15"
                  onError={(e) => {
                    if (isCsCupFootball(activeSport.name)) {
                      if (e.currentTarget.src !== SPORT_SPECIFIC_IMAGES.football) {
                        e.currentTarget.src = SPORT_SPECIFIC_IMAGES.football
                      }
                    }
                  }}
                />
                <div className="absolute inset-0 bg-white/90" />
              </>
            )}
            <div className="relative z-10 flex items-center justify-between p-5 sm:p-6">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-md border ${
                    isCsCup ? 'bg-[#153422] text-[#F59E0B] border-[#F59E0B]' : meta.bgBadgeClass
                  }`}>
                    {isCsCup ? 'CS CUP TOURNAMENT' : meta.badgeText}
                  </span>
                  {activeSport.venue && (
                    <span className="text-[11px] text-slate-700 font-mono flex items-center space-x-1 font-bold">
                      <MapPin className="w-3 h-3 text-[#1E40AF]" />
                      <span>{activeSport.venue}</span>
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A] tracking-tight">
                  {isCsCup ? 'CS Cup (Football)' : activeSport.name} Division
                </h2>
                <p className="text-xs text-slate-600 max-w-md line-clamp-1 font-medium">
                  {meta.description}
                </p>
              </div>

              <div className="hidden sm:flex items-center space-x-3 text-right">
                <div className="bg-white border-2 border-[#1A1A1A] rounded-lg px-4 py-2 shadow-editorial-sm">
                  <span className="text-[10px] text-slate-600 uppercase block font-bold font-mono">Contenders</span>
                  <span className="text-xl font-black text-[#1A1A1A] font-mono">{filteredEntries.length}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Table Card */}
      <div className="bg-white border-2 border-[#1A1A1A] rounded-xl overflow-hidden shadow-editorial-md">
        <div className="px-5 py-3 border-b-2 border-[#1A1A1A] flex items-center justify-between bg-[#FBF9F5] text-xs">
          <span className="font-serif font-black text-[#1A1A1A] uppercase tracking-wide">
            {isCsCupFootball(activeSport?.name) ? 'CS Cup (Football)' : activeSport?.name} Division Standings
          </span>
          <span className="text-slate-600 font-mono font-bold text-[11px]">
            3 PTS Win • 1 PT Draw
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50 text-xs font-mono font-black text-slate-700 tracking-wider uppercase">
                <th className="py-3 px-4 w-14 text-center">Rank</th>
                <th className="py-3 px-2 w-8 text-center">Δ</th>
                <th className="py-3 px-4">
                  {activeSport?.type === 'solo'
                    ? 'Competitor / Department'
                    : activeSport?.type === 'duo'
                    ? 'Pair / Department'
                    : activeSport?.type === 'free_for_all'
                    ? 'Contender / Department'
                    : 'Team / Laboratory'}
                </th>
                <th className="py-3 px-3 text-center">Played</th>
                <th className="py-3 px-3 text-center text-emerald-800">Won</th>
                <th className="py-3 px-3 text-center text-slate-700">Drawn</th>
                <th className="py-3 px-3 text-center text-rose-800">Lost</th>
                <th className="py-3 px-4 text-center font-black text-[#1A1A1A]">Points</th>
                <th className="py-3 px-4 text-right">
                  {activeSport?.type === 'solo' || activeSport?.type === 'free_for_all' ? 'Profile' : 'Roster'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry, index) => {
                  const rank = index + 1
                  const team = entry.team
                  const isTop3 = rank <= 3

                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-50 transition-colors duration-150 group"
                    >
                      {/* Rank: Distinct Gold, Silver, Bronze Badges */}
                      <td className="py-3.5 px-4 text-center font-medium">
                        {rank === 1 ? (
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-mono font-black text-amber-900 bg-amber-100/90 border border-amber-300 shadow-2xs ring-1 ring-amber-400/40"
                            title="1st Place (Gold Leader)"
                          >
                            <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                          </span>
                        ) : rank === 2 ? (
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-mono font-bold text-slate-800 bg-slate-200/80 border border-slate-300 shadow-2xs ring-1 ring-slate-300/60"
                            title="2nd Place (Silver)"
                          >
                            <Medal className="w-3.5 h-3.5 text-slate-600 fill-slate-400/30" />
                          </span>
                        ) : rank === 3 ? (
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-mono font-bold text-amber-950 bg-amber-200/60 border border-amber-300 shadow-2xs ring-1 ring-amber-400/30"
                            title="3rd Place (Bronze)"
                          >
                            <Medal className="w-3.5 h-3.5 text-amber-700 fill-amber-600/30" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-mono text-slate-500 font-semibold">
                            {rank}
                          </span>
                        )}
                      </td>

                      {/* Rank Movement */}
                      <td className="py-3.5 px-2 text-center">
                        {entry.rankChange === 'up' ? (
                          <span className="inline-flex text-emerald-600 font-bold">
                            <ArrowUp className="w-3 h-3" />
                          </span>
                        ) : entry.rankChange === 'down' ? (
                          <span className="inline-flex text-rose-600 font-bold">
                            <ArrowDown className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="inline-flex text-slate-400">
                            <Minus className="w-3 h-3" />
                          </span>
                        )}
                      </td>

                      {/* Competitor / Team */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold font-mono text-slate-700 shrink-0 group-hover:border-blue-300 transition-colors">
                            {(team?.name || entry.player?.name || '?').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center space-x-1.5">
                              <span>{team?.name || entry.player?.name || '—'}</span>
                              {rank === 1 && (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-sans">
                                  LEADER
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{team?.department || entry.player?.department}</div>
                          </div>
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="py-3.5 px-3 text-center font-mono text-slate-700">{entry.played}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-emerald-700">{entry.won}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-600">{entry.drawn}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-rose-700">{entry.lost}</td>

                      {/* Points */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-sm text-slate-900 px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 transition-colors duration-200 group-hover:border-blue-300 group-hover:bg-blue-50/60 group-hover:text-blue-700">
                          {entry.points}
                        </span>
                      </td>

                      {/* Roster Link */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/roster?team=${team?.id}`}
                          className="inline-flex items-center space-x-1.5 text-[11px] text-slate-700 hover:text-slate-900 font-medium py-1 px-2.5 rounded-md bg-white hover:bg-slate-50 transition-colors border border-slate-200 shadow-2xs hover:border-slate-300"
                        >
                          <Users className="w-3 h-3 text-slate-500" />
                          <span>{activeSport?.type === 'solo' ? 'Profile' : 'Roster'}</span>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Trophy className="w-8 h-8 text-slate-400" />
                      <span className="text-slate-800 font-semibold">
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
