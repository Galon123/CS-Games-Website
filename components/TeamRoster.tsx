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
  MapPin,
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getSportMeta, SPORT_SPECIFIC_IMAGES, isCsCupFootball } from '@/lib/sports-theme'
import { PlayerCard } from './PlayerCard'

export default function TeamRoster() {
  const { sports, teams, players } = useTournament()
  const searchParams = useSearchParams()

  // Default to first sport if available, otherwise empty string
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('')
  const [activeModalTeam, setActiveModalTeam] = useState<Team | null>(null)

  // Initialize selectedSportFilter to first sport once sports load
  useEffect(() => {
    if (!selectedSportFilter && sports.length > 0) {
      setSelectedSportFilter(sports[0].id)
    }
  }, [sports, selectedSportFilter])

  // Handle URL search param ?team=...
  useEffect(() => {
    const teamParam = searchParams.get('team')
    if (teamParam) {
      const found = teams.find((t) => t.id === teamParam)
      if (found) {
        setActiveModalTeam(found)
        if (found.sport_id) {
          setSelectedSportFilter(found.sport_id)
        }
      }
    }
  }, [searchParams, teams])

  const filteredTeams = teams.filter((team) => {
    return team.sport_id === selectedSportFilter
  })

  // Individual athletes enrolled directly without teams (for solo & free_for_all events) in the selected sport
  const individualAthletes = players.filter((player) => {
    if (player.team_id) return false
    return player.sport_id === selectedSportFilter
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

  const selectedSportObj = sports.find((s) => s.id === selectedSportFilter)
  const isDirectEnrollmentSport = selectedSportObj?.type === 'solo' || selectedSportObj?.type === 'free_for_all'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
              Teams &amp; Squad Rosters
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse participating departmental labs, registered athlete squads, and statistics by sport.
          </p>
        </div>

        {/* Sport Filter Tabs (Specific Sports Only) */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {sports.map((sport) => {
            const isSelected = selectedSportFilter === sport.id
            return (
              <button
                key={sport.id}
                onClick={() => setSelectedSportFilter(sport.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-[#E5E0D8]'
                }`}
              >
                {sport.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Sport Division Filter Banner with Sport Display Image */}
      {selectedSportObj && (() => {
        const meta = getSportMeta(selectedSportObj)
        const totalEnrolled = filteredTeams.length + individualAthletes.length

        return (
          <div className="relative h-28 sm:h-32 w-full rounded-lg overflow-hidden border border-[#E5E0D8] bg-white">
            {meta.imageUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={meta.imageUrl}
                  alt={selectedSportObj.name}
                  className="w-full h-full object-cover opacity-20"
                  onError={(e) => {
                    if (isCsCupFootball(selectedSportObj.name)) {
                      if (e.currentTarget.src !== SPORT_SPECIFIC_IMAGES.football) {
                        e.currentTarget.src = SPORT_SPECIFIC_IMAGES.football
                      }
                    }
                  }}
                />
                <div className="absolute inset-0 bg-white/90" />
              </>
            )}
            <div className="relative z-10 h-full flex items-center justify-between p-5">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${meta.bgBadgeClass}`}>
                    {meta.badgeText}
                  </span>
                  {selectedSportObj.venue && (
                    <span className="text-[11px] text-slate-600 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      <span>{selectedSportObj.venue}</span>
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1A1A1A] tracking-tight">
                  {selectedSportObj.name} Division Rosters
                </h2>
                <p className="text-xs text-slate-600 max-w-md line-clamp-1">
                  {meta.description}
                </p>
              </div>

              <div className="hidden sm:flex items-center space-x-3 text-right">
                <div className="bg-white border border-[#E5E0D8] rounded-md px-3.5 py-2 shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">Enrolled</span>
                  <span className="text-lg font-bold text-slate-900 font-mono">{totalEnrolled}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Individual Athletes Section (Solo / Free-for-all events) */}
      {individualAthletes.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h2 className="text-lg font-serif font-black text-[#1A1A1A] tracking-tight">
                Individual Contenders {selectedSportObj ? `• ${selectedSportObj.name}` : '(Solo & Open Entry)'}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-full">
              {individualAthletes.length} {individualAthletes.length === 1 ? 'Athlete' : 'Athletes'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {individualAthletes.map((athlete) => {
              const athleteSport = sports.find((s) => s.id === athlete.sport_id)
              return (
                <PlayerCard
                  key={athlete.id}
                  player={athlete}
                  sportName={athleteSport?.name}
                  sportType={athleteSport?.type}
                  variant="public"
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Teams Grid */}
      {filteredTeams.length > 0 ? (
        <div className="space-y-4">
          {individualAthletes.length > 0 && (
            <div className="flex items-center space-x-2 border-b-2 border-[#1A1A1A] pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <h2 className="text-lg font-serif font-black text-[#1A1A1A] tracking-tight">
                Team Squads
              </h2>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team, index) => {
              const sportObj = sports.find((s) => s.id === team.sport_id)
              const sportName = sportObj?.name || getSportName(team.sport_id)
              const isSolo = sportObj?.type === 'solo' || sportName.toLowerCase() === 'chess'
              const isDuo = sportObj?.type === 'duo'
              const teamRoster = players.filter((p) => p.team_id === team.id)

              return (
                <div
                  key={team.id}
                  style={{ animationDelay: `${Math.min(index * 60, 500)}ms` }}
                  className="bg-white border-2 border-[#1A1A1A] rounded-xl p-5 transition-all flex flex-col justify-between group shadow-editorial-sm hover:shadow-editorial-md hover:-translate-y-1 animate-fade-in-up"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border-2 border-[#1A1A1A] flex items-center justify-center font-black font-mono text-sm text-[#1A1A1A] shrink-0 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                        {(team.name || 'T').substring(0, 2).toUpperCase()}
                      </div>

                      <div className="flex flex-col items-end space-y-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getSportBadgeColor(
                            sportName
                          )}`}
                        >
                          {sportName}
                        </span>
                        {isSolo ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1E40AF] text-white border border-[#172554]">
                            1v1 Solo
                          </span>
                        ) : team.formation ? (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-[#1A1A1A] border border-[#1A1A1A]">
                            {team.formation}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <h3 className="font-serif font-black text-base text-[#1A1A1A] group-hover:text-[#1E40AF] transition-colors">
                      {team.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mb-3">{team.department}</p>

                    {/* Manager and Icon Player Badges (Team Squads Only for Icon) */}
                    {(team.manager || (!isSolo && !isDuo && teamRoster.some((p) => p.is_icon))) && (
                      <div className="flex flex-wrap gap-1.5 mb-3 text-[11px]">
                        {team.manager && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-800 font-medium">
                            <span>{isSolo ? '⭐' : '👔'}</span>
                            <span className="text-slate-500">{isSolo ? 'Title:' : isDuo ? 'Seed:' : 'Mgr:'}</span>
                            <span className="text-slate-900 font-bold truncate max-w-[130px]">{team.manager}</span>
                          </span>
                        )}
                        {!isSolo && !isDuo && teamRoster.find((p) => p.is_icon) && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 font-bold">
                            <span>⭐</span>
                            <span className="text-amber-800">Icon:</span>
                            <span className="font-black text-amber-950 truncate max-w-[130px]">{teamRoster.find((p) => p.is_icon)?.name}</span>
                          </span>
                        )}
                      </div>
                    )}

                    <div className="bg-[#FBF9F5] rounded-lg p-3 border border-slate-200 mb-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-600 font-medium">{isSolo ? 'Competitor' : isDuo ? 'Pair Roster' : 'Squad Size'}</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {isSolo ? 'Solo Athlete' : isDuo ? `${teamRoster.length} Players` : `${teamRoster.length} Athletes`}
                        </span>
                      </div>

                      {/* Mini Player Avatars */}
                      <div className="flex items-center space-x-1 overflow-hidden">
                        {teamRoster.slice(0, 5).map((player) => {
                          const showIconHighlight = !isSolo && !isDuo && Boolean(player.is_icon)
                          return (
                            <div
                              key={player.id}
                              className={`w-7 h-7 rounded-full bg-white border-2 overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-700 ${
                                showIconHighlight ? 'border-[#D97706] ring-2 ring-[#D97706]/40 text-[#D97706] bg-[#1A1A1A]' : 'border-[#1A1A1A]'
                              }`}
                              title={`${player.name} (${player.role})${showIconHighlight ? ' ★ Icon' : ''}`}
                            >
                              {player.photo_url ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={player.photo_url}
                                  alt={player.name}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = 'none'
                                  }}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                (player.name || 'P')[0]?.toUpperCase()
                              )}
                            </div>
                          )
                        })}
                        {teamRoster.length > 5 && (
                          <span className="text-[10px] text-slate-600 pl-1 font-mono font-bold">
                            +{teamRoster.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setActiveModalTeam(team)}
                      className="flex-1 h-10 rounded-md bg-white hover:bg-slate-50 text-xs font-bold text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-2xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <span>{isSolo ? 'View Profile' : 'Full Roster'}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-700" />
                    </button>

                    {sportName.toLowerCase() === 'football' && (
                      <Link
                        href="/tactics"
                        className="h-10 px-3 rounded-md bg-[#F59E0B] hover:bg-[#D97706] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-2xs transition-colors flex items-center justify-center"
                        title="View Formations Pitch"
                      >
                        <Crosshair className="w-4 h-4 text-[#1A1A1A]" />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : individualAthletes.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-white border-2 border-dashed border-[#1A1A1A]/30 space-y-3">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-serif font-black text-sm text-slate-900">
            No squads or participants registered in this division yet.
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Athletes and teams can be enrolled directly via the Administration Console.
          </p>
        </div>
      ) : null}

      {/* Detailed Team & Player Roster Modal */}
      {activeModalTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150">
          <div className="bg-white border-2 border-[#1A1A1A] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-editorial-lg">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold font-mono text-sm text-slate-700 shrink-0 shadow-2xs">
                  {(activeModalTeam.name || 'T').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-serif font-black text-[#1A1A1A]">
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
                  <p className="text-xs text-slate-500 mt-0.5">{activeModalTeam.department}</p>
                  {(() => {
                    const modalSport = sports.find((s) => s.id === activeModalTeam.sport_id)
                    const isModalSolo = modalSport?.type === 'solo' || modalSport?.name?.toLowerCase() === 'chess'
                    const isModalDuo = modalSport?.type === 'duo'

                    return (
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                        {!isModalSolo && !isModalDuo && activeModalTeam.formation && (
                          <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                            Shape: {activeModalTeam.formation}
                          </span>
                        )}
                        {activeModalTeam.manager && (
                          <span className="text-slate-600 flex items-center space-x-1">
                            <span>{isModalSolo ? 'Title:' : isModalDuo ? 'Seed:' : '👔 Mgr:'}</span>
                            <span className="font-medium text-slate-900">{activeModalTeam.manager}</span>
                          </span>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>

              <button
                onClick={() => setActiveModalTeam(null)}
                className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200 shadow-2xs"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Player Roster Grid */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-white">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                <span>
                  {(() => {
                    const modalSport = sports.find((s) => s.id === activeModalTeam.sport_id)
                    const isModalSolo = modalSport?.type === 'solo' || modalSport?.name?.toLowerCase() === 'chess'
                    const isModalDuo = modalSport?.type === 'duo'
                    return isModalSolo
                      ? 'Competitor Profile'
                      : isModalDuo
                      ? `Pair Members (${modalTeamPlayers.length})`
                      : `Athletes & Roster (${modalTeamPlayers.length})`
                  })()}
                </span>
                <span className="text-emerald-700 font-medium">Status: Verified Eligible</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {modalTeamPlayers.map((player) => {
                  const modalSport = sports.find((s) => s.id === activeModalTeam.sport_id)
                  return (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      teamName={activeModalTeam.name}
                      sportName={modalSport?.name}
                      sportType={modalSport?.type}
                      variant="public"
                    />
                  )
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Team ID: {activeModalTeam.id.substring(0, 8)}
              </span>
              <div className="flex items-center space-x-3">
                {getSportName(activeModalTeam.sport_id).toLowerCase() === 'football' && (
                  <Link
                    href="/tactics"
                    onClick={() => setActiveModalTeam(null)}
                    className="flex items-center space-x-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>Open Formations</span>
                  </Link>
                )}
                <button
                  onClick={() => setActiveModalTeam(null)}
                  className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-xs font-medium text-slate-700 transition-all border border-slate-200 shadow-2xs"
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
