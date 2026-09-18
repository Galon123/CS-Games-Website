'use client'

import React, { useState, useEffect } from 'react'
import { useTournament } from '@/context/TournamentContext'
import { Team, Player } from '@/lib/types'
import {
  Users,
  Shield,
  Trophy,
  ExternalLink,
  X,
  Sparkles,
  Crosshair,
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getSportMeta } from '@/lib/sports-theme'

export default function TeamRoster() {
  const { sports, teams, players } = useTournament()
  const searchParams = useSearchParams()

  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('all')
  const [activeModalTeam, setActiveModalTeam] = useState<Team | null>(null)

  // Handle URL search param ?team=...
  useEffect(() => {
    const teamParam = searchParams.get('team')
    if (teamParam) {
      const found = teams.find((t) => t.id === teamParam)
      if (found) {
        setActiveModalTeam(found)
      }
    }
  }, [searchParams, teams])

  const filteredTeams = teams.filter((team) => {
    if (selectedSportFilter === 'all') return true
    return team.sport_id === selectedSportFilter
  })

  const getSportName = (sportId: string) => {
    return sports.find((s) => s.id === sportId)?.name || 'Sport'
  }

  const getSportBadgeColor = (sportName: string) => {
    return getSportMeta(sportName).bgBadgeClass
  }

  const modalTeamPlayers = activeModalTeam
    ? players.filter((p) => p.team_id === activeModalTeam.id)
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Teams & Squad Rosters
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse participating departmental labs, registered athlete squads, and statistics.
          </p>
        </div>

        {/* Sport Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedSportFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              selectedSportFilter === 'all'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80 hover:bg-slate-800/40'
            }`}
          >
            All Sports
          </button>
          {sports.map((sport) => {
            const isSelected = selectedSportFilter === sport.id
            return (
              <button
                key={sport.id}
                onClick={() => setSelectedSportFilter(sport.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                {sport.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const sportName = getSportName(team.sport_id)
            const teamRoster = players.filter((p) => p.team_id === team.id)

            return (
              <div
                key={team.id}
                className="bg-card border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={team.logo_url}
                        alt={team.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getSportBadgeColor(
                          sportName
                        )}`}
                      >
                        {sportName}
                      </span>
                      {team.formation && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                          {team.formation}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                    {team.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">{team.department}</p>

                  {/* Manager and Icon Player Badges */}
                  {(team.manager || teamRoster.some((p) => p.is_icon)) && (
                    <div className="flex flex-wrap gap-1.5 mb-3 text-[11px]">
                      {team.manager && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300">
                          <span>👔</span>
                          <span className="text-slate-400">Mgr:</span>
                          <span className="text-white font-medium truncate max-w-[130px]">{team.manager}</span>
                        </span>
                      )}
                      {teamRoster.find((p) => p.is_icon) && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300">
                          <span>⭐</span>
                          <span className="text-amber-400/80">Icon:</span>
                          <span className="font-medium truncate max-w-[130px]">{teamRoster.find((p) => p.is_icon)?.name}</span>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-800/80 mb-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-400">Squad Size</span>
                      <span className="font-semibold text-white">
                        {teamRoster.length} Athletes
                      </span>
                    </div>

                    {/* Mini Player Avatars */}
                    <div className="flex items-center space-x-1 overflow-hidden">
                      {teamRoster.slice(0, 5).map((player) => (
                        <div
                          key={player.id}
                          className={`w-6 h-6 rounded-full bg-slate-800 border overflow-hidden shrink-0 ${
                            player.is_icon ? 'border-amber-400 ring-1 ring-amber-400/50' : 'border-slate-700'
                          }`}
                          title={`${player.name} (${player.role})${player.is_icon ? ' ★ Icon' : ''}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={player.photo_url}
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {teamRoster.length > 5 && (
                        <span className="text-[10px] text-slate-400 pl-1 font-medium">
                          +{teamRoster.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => setActiveModalTeam(team)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-200 hover:text-white border border-slate-700/80 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>Full Roster</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {sportName.toLowerCase() === 'football' && (
                    <Link
                      href="/tactics"
                      className="p-2 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 transition-all"
                      title="View on Tactical Pitch"
                    >
                      <Crosshair className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-semibold text-sm text-slate-300">
            No squads or teams registered in this division yet.
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Teams and athlete rosters can be added via the Administration Console.
          </p>
        </div>
      )}

      {/* Detailed Team & Player Roster Modal */}
      {activeModalTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900/80 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeModalTeam.logo_url}
                    alt={activeModalTeam.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-white">
                      {activeModalTeam.name}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getSportBadgeColor(
                        getSportName(activeModalTeam.sport_id)
                      )}`}
                    >
                      {getSportName(activeModalTeam.sport_id)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{activeModalTeam.department}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                    {activeModalTeam.formation && (
                      <span className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                        Shape: {activeModalTeam.formation}
                      </span>
                    )}
                    {activeModalTeam.manager && (
                      <span className="text-slate-300 flex items-center space-x-1">
                        <span>👔 Mgr:</span>
                        <span className="font-medium text-white">{activeModalTeam.manager}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModalTeam(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Player Roster Grid */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span>Athletes & Roster ({modalTeamPlayers.length})</span>
                <span>Status: Verified Eligible</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {modalTeamPlayers.map((player) => {
                  const isIcon = Boolean(player.is_icon)
                  return (
                    <div
                      key={player.id}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                        isIcon
                          ? 'bg-slate-900 border border-amber-500/40 shadow-sm'
                          : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-lg bg-slate-800 border overflow-hidden shrink-0 ${
                        isIcon ? 'border-amber-400' : 'border-slate-700'
                      }`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={player.photo_url}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-white truncate flex items-center space-x-1">
                            <span>{player.name}</span>
                            {isIcon && <span className="text-amber-400 text-xs">⭐</span>}
                          </span>
                          <span className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded ${
                            isIcon ? 'bg-amber-400/20 text-amber-300' : 'text-slate-300 bg-slate-800'
                          }`}>
                            #{player.jersey_number}
                          </span>
                        </div>
                        <div className="text-xs text-blue-400 truncate flex items-center justify-between mt-0.5">
                          <span>{player.role}</span>
                          {isIcon && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-medium">
                              ⭐ ICON
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-2">
                          <span>Points: {player.stats?.goalsOrPoints ?? 0}</span>
                          <span>•</span>
                          <span>Rating: {player.stats?.rating ?? 8.5}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Team ID: {activeModalTeam.id.substring(0, 8)}
              </span>
              <div className="flex items-center space-x-3">
                {getSportName(activeModalTeam.sport_id).toLowerCase() === 'football' && (
                  <Link
                    href="/tactics"
                    onClick={() => setActiveModalTeam(null)}
                    className="flex items-center space-x-1.5 text-xs font-medium text-blue-400 hover:underline"
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>Open Tactical Board</span>
                  </Link>
                )}
                <button
                  onClick={() => setActiveModalTeam(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-all border border-slate-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
