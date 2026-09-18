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
            <Users className="w-6 h-6 text-cyber-cyan" />
            <h1 className="text-2xl sm:text-3xl font-black text-ice-white tracking-tight">
              TEAMS & PLAYER ROSTERS
            </h1>
          </div>
          <p className="text-sm text-muted-gray mt-1">
            Browse participating departmental labs, registered athlete squads, and statistics.
          </p>
        </div>

        {/* Sport Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedSportFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all shrink-0 ${
              selectedSportFilter === 'all'
                ? 'bg-slate-800 text-cyber-cyan border border-cyber-cyan/40'
                : 'bg-slate-900/60 text-muted-gray hover:text-white border border-slate-800'
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all shrink-0 ${
                  isSelected
                    ? 'bg-slate-800 text-neon-lime border border-neon-lime/40'
                    : 'bg-slate-900/60 text-muted-gray hover:text-white border border-slate-800'
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
                className="bg-card border border-slate-800 hover:border-cyber-cyan/60 rounded-2xl p-6 transition-all hover:shadow-cyber-cyan flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-slate-700 group-hover:border-neon-lime overflow-hidden transition-colors shadow-sm shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={team.logo_url}
                        alt={team.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border ${getSportBadgeColor(
                          sportName
                        )}`}
                      >
                        {sportName}
                      </span>
                      {team.formation && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {team.formation}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-ice-white group-hover:text-cyber-cyan transition-colors">
                    {team.name}
                  </h3>
                  <p className="text-xs text-muted-gray mb-3">{team.department}</p>

                  {/* Manager and Icon Player Badges */}
                  {(team.manager || teamRoster.some((p) => p.is_icon)) && (
                    <div className="flex flex-wrap gap-1.5 mb-3 text-[11px] font-mono">
                      {team.manager && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300">
                          <span>👔</span>
                          <span className="text-muted-gray">Mgr:</span>
                          <span className="text-ice-white font-semibold truncate max-w-[130px]">{team.manager}</span>
                        </span>
                      )}
                      {teamRoster.find((p) => p.is_icon) && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300">
                          <span>⭐</span>
                          <span className="text-amber-200/80">Icon:</span>
                          <span className="font-bold truncate max-w-[130px]">{teamRoster.find((p) => p.is_icon)?.name}</span>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800/80 mb-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-gray font-mono">Squad Size</span>
                      <span className="font-mono font-bold text-neon-lime">
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
                        <span className="text-[10px] font-mono text-slate-500 pl-1">
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
                    className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono font-semibold text-ice-white hover:text-cyber-cyan border border-slate-800 hover:border-cyber-cyan/40 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>Full Roster</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {sportName.toLowerCase() === 'football' && (
                    <Link
                      href="/tactics"
                      className="p-2.5 rounded-xl bg-neon-lime/10 hover:bg-neon-lime text-neon-lime hover:text-slate-950 border border-neon-lime/30 transition-all"
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
        <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <Users className="w-10 h-10 text-slate-700 mx-auto" />
          <h3 className="font-bold text-sm text-slate-300 font-mono">
            No squads or teams registered in this division yet.
          </h3>
          <p className="text-xs text-muted-gray max-w-sm mx-auto font-mono">
            Teams and athlete rosters can be added via the Administration Console.
          </p>
        </div>
      )}

      {/* Detailed Team & Player Roster Modal */}
      {activeModalTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border-2 border-cyber-cyan/50 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900/90 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-neon-lime/50 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeModalTeam.logo_url}
                    alt={activeModalTeam.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-black text-ice-white font-mono">
                      {activeModalTeam.name}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getSportBadgeColor(
                        getSportName(activeModalTeam.sport_id)
                      )}`}
                    >
                      {getSportName(activeModalTeam.sport_id)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-gray mt-1">{activeModalTeam.department}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {activeModalTeam.formation && (
                      <span className="text-[11px] font-mono text-neon-lime">
                        Shape: {activeModalTeam.formation}
                      </span>
                    )}
                    {activeModalTeam.manager && (
                      <span className="text-[11px] font-mono text-ice-white flex items-center space-x-1">
                        <span>👔 Mgr:</span>
                        <span className="font-bold text-cyan-300">{activeModalTeam.manager}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModalTeam(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Player Roster Grid */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between text-xs font-mono text-muted-gray border-b border-slate-800 pb-2">
                <span>ATHLETES & ROSTER ({modalTeamPlayers.length})</span>
                <span>STATUS: VERIFIED ELIGIBLE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {modalTeamPlayers.map((player) => {
                  const isIcon = Boolean(player.is_icon)
                  return (
                    <div
                      key={player.id}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                        isIcon
                          ? 'bg-slate-900/90 border-2 border-amber-400/70 shadow-[0_0_15px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/40'
                          : 'bg-slate-900/80 border border-slate-800 hover:border-neon-lime/40'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-slate-800 border overflow-hidden shrink-0 ${
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
                          <span className="font-bold text-sm text-ice-white truncate flex items-center space-x-1">
                            <span>{player.name}</span>
                            {isIcon && <span className="text-amber-400 text-xs">⭐</span>}
                          </span>
                          <span className={`text-xs font-mono font-black px-1.5 py-0.2 rounded ${
                            isIcon ? 'bg-amber-400/20 text-amber-300' : 'text-neon-lime bg-neon-lime/10'
                          }`}>
                            #{player.jersey_number}
                          </span>
                        </div>
                        <div className="text-xs text-cyber-cyan font-mono truncate flex items-center justify-between mt-0.5">
                          <span>{player.role}</span>
                          {isIcon && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-bold font-mono">
                              ⭐ ICON
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-gray font-mono mt-0.5 flex items-center space-x-2">
                          <span>PTS/G: {player.stats?.goalsOrPoints ?? 0}</span>
                          <span>•</span>
                          <span>RTG: {player.stats?.rating ?? 8.5}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-muted-gray font-mono">
                CS Athletic ID: {activeModalTeam.id.substring(0, 8)}
              </span>
              <div className="flex items-center space-x-3">
                {getSportName(activeModalTeam.sport_id).toLowerCase() === 'football' && (
                  <Link
                    href="/tactics"
                    onClick={() => setActiveModalTeam(null)}
                    className="flex items-center space-x-1.5 text-xs font-mono font-bold text-neon-lime hover:underline"
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>Open Tactical Board</span>
                  </Link>
                )}
                <button
                  onClick={() => setActiveModalTeam(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white transition-all"
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
