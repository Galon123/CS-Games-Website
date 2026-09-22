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
        className="absolute right-2 -bottom-8 w-64 h-64 text-white opacity-[0.035] pointer-events-none -rotate-6"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="20" y="20" width="160" height="160" rx="6" />
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
        className="absolute right-4 -bottom-6 w-56 h-56 text-white opacity-[0.04] pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M48 10 L52 10 M50 8 L50 14" strokeWidth="2" strokeLinecap="round" />
        <path d="M42 20 Q50 15 58 20 Q65 30 50 35 Q35 30 42 20 Z" />
        <path d="M40 35 L60 35 L56 70 L44 70 Z" />
        <path d="M30 85 L70 85 L65 70 L35 70 Z" />
        <path d="M25 90 L75 90" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  if (norm.includes('badminton')) {
    return (
      <svg
        className="absolute right-4 -bottom-6 w-56 h-56 text-white opacity-[0.04] pointer-events-none -rotate-12"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="50" cy="75" r="8" fill="currentColor" fillOpacity="0.05" />
        <path d="M44 70 L32 30 L68 30 L56 70 Z" />
        <line x1="32" y1="30" x2="68" y2="30" />
        <line x1="35" y1="40" x2="65" y2="40" />
        <line x1="38" y1="52" x2="62" y2="52" />
        <line x1="42" y1="30" x2="48" y2="70" />
        <line x1="58" y1="30" x2="52" y2="70" />
      </svg>
    )
  }
  if (norm.includes('carrom')) {
    return (
      <svg
        className="absolute right-4 -bottom-6 w-56 h-56 text-white opacity-[0.04] pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="15" y="15" width="70" height="70" rx="4" />
        <circle cx="50" cy="50" r="14" />
        <circle cx="50" cy="50" r="4" fill="currentColor" fillOpacity="0.08" />
        <circle cx="22" cy="22" r="5" />
        <circle cx="78" cy="22" r="5" />
        <circle cx="22" cy="78" r="5" />
        <circle cx="78" cy="78" r="5" />
      </svg>
    )
  }
  return (
    <svg
      className="absolute right-4 -bottom-6 w-56 h-56 text-white opacity-[0.035] pointer-events-none"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
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
    <div className="space-y-8 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className="meta-label text-acid">TOURNAMENT STANDINGS</span>
            <span className="text-white/20">•</span>
            <span className="meta-label text-fog">DIVISION POINTS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-paper tracking-tight">
            Standings.
          </h1>
          <p className="text-xs sm:text-sm text-mist max-w-xl">
            Realtime standings and division points across all {sports.length} tournament events.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fog" />
          <input
            type="text"
            placeholder="Search squad or lab..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ink-800 border border-white/15 focus:border-acid rounded-full pl-10 pr-4 py-2 text-xs text-paper placeholder-fog focus:outline-none transition-colors shadow-subtle"
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? isCsCup
                    ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                    : 'bg-white/15 text-paper border border-white/25 shadow-xs'
                  : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10 border border-white/10'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isSelected ? (isCsCup ? 'text-acid-ink' : 'text-paper') : 'text-fog'
                }`}
              />
              <span>{isCsCup ? 'CS Cup (Football)' : sport.name}</span>
            </button>
          )
        })}
      </div>

      {/* Active Division Feature Banner */}
      {activeSport && (() => {
        const meta = getSportMeta(activeSport)
        const isCsCup = isCsCupFootball(activeSport.name)
        return (
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-ink-800 shadow-card">
            {/* Dynamic Sport Line-Art Watermark */}
            {getSportWatermark(activeSport.name)}

            {meta.imageUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={meta.imageUrl}
                  alt={activeSport.name}
                  className="absolute inset-0 w-full h-full object-cover grayscale-[30%] contrast-[115%]"
                  onError={(e) => {
                    if (isCsCupFootball(activeSport.name)) {
                      if (e.currentTarget.src !== SPORT_SPECIFIC_IMAGES.football) {
                        e.currentTarget.src = SPORT_SPECIFIC_IMAGES.football
                      }
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/80 to-ink-900/45" />
              </>
            )}
            <div className="relative z-10 flex items-center justify-between p-6 sm:p-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <span className={`text-[10px] font-mono font-bold px-3 py-0.5 rounded-full border ${
                    isCsCup ? 'bg-acid text-acid-ink border-acid' : 'bg-white/5 text-mist border-white/10'
                  }`}>
                    {isCsCup ? 'CS CUP TOURNAMENT' : meta.badgeText}
                  </span>
                  {activeSport.venue && (
                    <span className="text-xs text-mist font-mono flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-acid" />
                      <span>{activeSport.venue}</span>
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-paper tracking-tight">
                  {isCsCup ? 'CS Cup (Football)' : activeSport.name} Division
                </h2>
                <p className="text-xs text-mist max-w-lg line-clamp-1">
                  {meta.description}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href={meta.link}
                  className="hidden sm:inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-acid text-acid-ink font-mono font-bold text-xs shadow-xs hover:bg-acid-hot transition-all"
                >
                  <span>Open Game Page</span>
                  <span>→</span>
                </Link>
                <div className="hidden md:block bg-ink-900/80 border border-white/15 rounded-xl px-5 py-2.5 shadow-subtle backdrop-blur-sm text-right">
                  <span className="meta-label text-[10px] text-fog block">Contenders</span>
                  <span className="text-2xl font-serif font-black text-paper font-lining">{filteredEntries.length}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Table Card */}
      <div className="bg-ink-800 border border-white/10 rounded-2xl overflow-hidden shadow-card">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-ink-900/60 text-xs">
          <span className="font-serif font-black text-paper uppercase tracking-wider">
            {isCsCupFootball(activeSport?.name) ? 'CS Cup (Football)' : activeSport?.name} Division Table
          </span>
          <span className="text-fog font-mono text-[11px]">
            3 PTS Win • 1 PT Draw
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-ink-900 text-xs font-mono font-bold text-fog tracking-wider uppercase">
                <th className="py-3.5 px-5 w-16 text-center">Rank</th>
                <th className="py-3.5 px-2 w-10 text-center">Trend</th>
                <th className="py-3.5 px-5">
                  {activeSport?.type === 'solo'
                    ? 'Competitor / Department'
                    : activeSport?.type === 'quad' || (activeSport?.name?.toLowerCase().includes('carrom') && activeSport?.type !== 'duo')
                    ? 'Contender / Department'
                    : activeSport?.type === 'duo'
                    ? 'Pair / Department'
                    : activeSport?.type === 'free_for_all'
                    ? 'Contender / Department'
                    : 'Team / Laboratory'}
                </th>
                <th className="py-3.5 px-3 text-center">Played</th>
                <th className="py-3.5 px-3 text-center text-emerald-400">Won</th>
                <th className="py-3.5 px-3 text-center text-mist">Drawn</th>
                <th className="py-3.5 px-3 text-center text-rose-400">Lost</th>
                <th className="py-3.5 px-5 text-center font-black text-paper">Points</th>
                <th className="py-3.5 px-5 text-right">
                  {activeSport?.type === 'solo' || activeSport?.type === 'free_for_all' || activeSport?.type === 'quad' || (activeSport?.name?.toLowerCase().includes('carrom') && activeSport?.type !== 'duo') ? 'Profile' : 'Roster'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry, index) => {
                  const rank = index + 1
                  const team = entry.team

                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-white/[0.02] transition-colors duration-150 group"
                    >
                      {/* Rank: Distinct Gold, Silver, Bronze Badges */}
                      <td className="py-4 px-5 text-center font-medium">
                        {rank === 1 ? (
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-black text-acid-ink bg-acid shadow-[0_0_8px_rgba(215,242,43,0.35)]"
                            title="1st Place (Gold Leader)"
                          >
                            <Crown className="w-3.5 h-3.5 fill-acid-ink text-acid-ink" />
                          </span>
                        ) : rank === 2 ? (
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-bold text-paper bg-white/15 border border-white/20"
                            title="2nd Place (Silver)"
                          >
                            <Medal className="w-3.5 h-3.5 text-paper fill-white/30" />
                          </span>
                        ) : rank === 3 ? (
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-bold text-amber-300 bg-amber-600/20 border border-amber-600/30"
                            title="3rd Place (Bronze)"
                          >
                            <Medal className="w-3.5 h-3.5 text-amber-400 fill-amber-600/30" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono text-fog font-semibold">
                            {rank}
                          </span>
                        )}
                      </td>

                      {/* Rank Movement */}
                      <td className="py-4 px-2 text-center">
                        {entry.rankChange === 'up' ? (
                          <span className="inline-flex text-emerald-400 font-bold">
                            <ArrowUp className="w-3.5 h-3.5" />
                          </span>
                        ) : entry.rankChange === 'down' ? (
                          <span className="inline-flex text-rose-400 font-bold">
                            <ArrowDown className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex text-fog">
                            <Minus className="w-3 h-3" />
                          </span>
                        )}
                      </td>

                      {/* Competitor / Team */}
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-9 h-9 rounded-xl bg-ink-900 border border-white/15 flex items-center justify-center text-xs font-bold font-mono text-paper shrink-0 group-hover:border-acid/40 transition-colors">
                            {(team?.name || entry.player?.name || '?').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-paper group-hover:text-acid transition-colors flex items-center space-x-2">
                              <span>{team?.name || entry.player?.name || 'Unassigned'}</span>
                              {rank === 1 && (
                                <span className="text-[9px] font-mono font-bold text-acid-ink bg-acid px-1.5 py-0.2 rounded-full">
                                  LEADER
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-fog font-mono mt-0.5">
                              {team?.department || entry.player?.department}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="py-4 px-3 text-center font-mono text-mist">{entry.played}</td>
                      <td className="py-4 px-3 text-center font-mono font-bold text-emerald-400">{entry.won}</td>
                      <td className="py-4 px-3 text-center font-mono text-fog">{entry.drawn}</td>
                      <td className="py-4 px-3 text-center font-mono text-rose-400">{entry.lost}</td>

                      {/* Points */}
                      <td className="py-4 px-5 text-center">
                        <span className="font-serif font-black text-sm text-paper px-3 py-1 rounded-full bg-white/5 border border-white/10 group-hover:border-acid/40 group-hover:text-acid font-lining transition-colors">
                          {entry.points}
                        </span>
                      </td>

                      {/* Roster Link */}
                      <td className="py-4 px-5 text-right">
                        <Link
                          href={`/roster?team=${team?.id}`}
                          className="inline-flex items-center space-x-1.5 text-[11px] text-mist hover:text-paper font-semibold py-1.5 px-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                        >
                          <Users className="w-3 h-3 text-fog" />
                          <span>{activeSport?.type === 'solo' ? 'Profile' : 'Roster'}</span>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-mist">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Trophy className="w-9 h-9 text-fog" />
                      <span className="text-paper font-bold text-sm">
                        No standings recorded yet for {activeSport?.name || 'this'} division.
                      </span>
                      <span className="text-xs text-fog max-w-xs leading-relaxed">
                        Matches or squad enrollments in the Admin Console will update standings automatically.
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
