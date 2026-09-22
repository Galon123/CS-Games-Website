'use client'

import React, { useState, useEffect } from 'react'
import { useTournament } from '@/context/TournamentContext'
import { Team, Player } from '@/lib/types'
import {
  Users,
  Crosshair,
  MapPin,
  X,
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

  // Keyboard accessibility: Close modal on Escape key (R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModalTeam) {
        setActiveModalTeam(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModalTeam])

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

  const modalTeamPlayers = activeModalTeam
    ? players.filter((p) => p.team_id === activeModalTeam.id)
    : []

  const selectedSportObj = sports.find((s) => s.id === selectedSportFilter)

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className="meta-label text-acid">DEPARTMENT TEAMS</span>
            <span className="text-white/20">•</span>
            <span className="meta-label text-fog">ATHLETE DIRECTORY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-paper tracking-tight">
            Rosters.
          </h1>
          <p className="text-xs sm:text-sm text-mist max-w-xl">
            Browse participating departmental labs, registered athlete squads, and statistics by sport.
          </p>
        </div>

        {/* Sport Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {sports.map((sport) => {
            const isSelected = selectedSportFilter === sport.id
            return (
              <button
                key={sport.id}
                onClick={() => setSelectedSportFilter(sport.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                    : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10 border border-white/10'
                }`}
              >
                {sport.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Sport Division Filter Banner */}
      {selectedSportObj && (() => {
        const meta = getSportMeta(selectedSportObj)
        const totalEnrolled = filteredTeams.length + individualAthletes.length

        return (
          <div className="relative h-36 sm:h-40 w-full rounded-2xl overflow-hidden border border-white/10 bg-ink-800 shadow-card">
            {meta.imageUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={meta.imageUrl}
                  alt={selectedSportObj.name}
                  className="w-full h-full object-cover grayscale-[30%] contrast-[115%]"
                  onError={(e) => {
                    if (isCsCupFootball(selectedSportObj.name)) {
                      if (e.currentTarget.src !== SPORT_SPECIFIC_IMAGES.football) {
                        e.currentTarget.src = SPORT_SPECIFIC_IMAGES.football
                      }
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/75 to-ink-900/40" />
              </>
            )}
            <div className="relative z-10 h-full flex items-center justify-between p-6 sm:p-8">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-acid text-acid-ink border border-acid">
                    {meta.badgeText}
                  </span>
                  {selectedSportObj.venue && (
                    <span className="text-xs text-mist flex items-center space-x-1.5 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-acid" />
                      <span>{selectedSportObj.venue}</span>
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-paper tracking-tight">
                  {selectedSportObj.name} Division Rosters
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
                  <span className="meta-label text-[10px] text-fog block">Enrolled</span>
                  <span className="text-2xl font-serif font-black text-paper font-lining">{totalEnrolled}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Individual Athletes Section (Solo / Free-for-all events) */}
      {individualAthletes.length > 0 && (
        <div className="space-y-5 pt-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-acid" />
              <h2 className="text-xl font-serif font-black text-paper tracking-tight">
                Individual Contenders {selectedSportObj ? `• ${selectedSportObj.name}` : '(Solo Entry)'}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-mist bg-white/5 border border-white/10 px-3 py-0.5 rounded-full">
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
        <div className="space-y-5">
          {individualAthletes.length > 0 && (
            <div className="flex items-center space-x-2.5 border-b border-white/10 pb-3">
              <span className="w-2 h-2 rounded-full bg-paper" />
              <h2 className="text-xl font-serif font-black text-paper tracking-tight">
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
                  className="bg-ink-800 border border-white/10 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group hover:border-white/25 hover:shadow-elevated hover:-translate-y-1 animate-fade-in-up"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-ink-900 border border-white/15 flex items-center justify-center font-black font-mono text-sm text-paper shrink-0 shadow-subtle">
                        {(team.name || 'T').substring(0, 2).toUpperCase()}
                      </div>

                      <div className="flex flex-col items-end space-y-1.5">
                        <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-mist border border-white/10">
                          {sportName}
                        </span>
                        {isSolo ? (
                          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-acid/15 text-acid border border-acid/30">
                            1v1 Solo
                          </span>
                        ) : team.formation ? (
                          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-paper border border-white/10 font-lining">
                            Shape: {team.formation}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <h3 className="font-serif font-black text-lg text-paper group-hover:text-acid transition-colors">
                      {team.name}
                    </h3>
                    <p className="text-xs text-mist font-medium mt-0.5 mb-4">{team.department}</p>

                    {/* Manager and Icon Athlete Badges */}
                    {(team.manager || (!isSolo && !isDuo && teamRoster.some((p) => p.is_icon))) && (
                      <div className="flex flex-wrap gap-2 mb-4 text-[11px]">
                        {team.manager && (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-ink-900 border border-white/10 text-mist">
                            <span>{isSolo ? '★' : '👔'}</span>
                            <span className="text-fog">{isSolo ? 'Title:' : isDuo ? 'Seed:' : 'Mgr:'}</span>
                            <span className="text-paper font-bold truncate max-w-[130px]">{team.manager}</span>
                          </span>
                        )}
                        {!isSolo && !isDuo && teamRoster.find((p) => p.is_icon) && (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-acid/10 border border-acid/30 text-acid font-bold">
                            <span>★</span>
                            <span className="text-acid/80">Icon:</span>
                            <span className="font-black text-paper truncate max-w-[130px]">{teamRoster.find((p) => p.is_icon)?.name}</span>
                          </span>
                        )}
                      </div>
                    )}

                    <div className="bg-ink-900 rounded-xl p-4 border border-white/10 mb-5">
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-mist font-medium">{isSolo ? 'Competitor' : isDuo ? 'Pair Roster' : 'Squad Size'}</span>
                        <span className="font-bold text-paper font-mono font-lining">
                          {isSolo ? 'Solo Athlete' : isDuo ? `${teamRoster.length} Players` : `${teamRoster.length} Athletes`}
                        </span>
                      </div>

                      {/* Mini Player Avatars */}
                      <div className="flex items-center space-x-1.5 overflow-hidden">
                        {teamRoster.slice(0, 5).map((player) => {
                          const showIconHighlight = !isSolo && !isDuo && Boolean(player.is_icon)
                          return (
                            <div
                              key={player.id}
                              className={`w-8 h-8 rounded-full bg-ink-800 border overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-bold text-paper ${
                                showIconHighlight ? 'border-acid ring-2 ring-acid/30 text-acid bg-ink-900' : 'border-white/15'
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
                          <span className="text-[11px] text-fog pl-1 font-mono font-bold">
                            +{teamRoster.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center space-x-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => setActiveModalTeam(team)}
                      className="flex-1 h-10 rounded-full bg-white/5 hover:bg-white/10 text-xs font-bold text-paper border border-white/15 hover:border-white/30 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>{isSolo ? 'View Profile' : 'Full Squad Roster'}</span>
                      <span className="arrow-hover">↗</span>
                    </button>

                    {sportName.toLowerCase() === 'football' && (
                      <Link
                        href="/tactics"
                        className="h-10 px-3.5 rounded-full bg-acid hover:bg-acid-hot text-acid-ink font-bold transition-colors flex items-center justify-center shadow-glow-sm"
                        title="View Formations Pitch"
                      >
                        <Crosshair className="w-4 h-4 text-acid-ink" />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : individualAthletes.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-ink-800 border border-dashed border-white/15 space-y-3">
          <Users className="w-10 h-10 text-fog mx-auto" />
          <h3 className="font-serif font-black text-base text-paper">
            No squads or participants registered in this division yet.
          </h3>
          <p className="text-xs text-mist max-w-sm mx-auto">
            Athletes and teams can be enrolled directly via the Administration Console.
          </p>
        </div>
      ) : null}

      {/* Detailed Team & Player Roster Modal */}
      {activeModalTeam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-md animate-fade-in-up"
          onClick={() => setActiveModalTeam(null)}
        >
          <div
            className="bg-ink-800 border border-white/15 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-ink-900 border-b border-white/10 flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-13 h-13 rounded-xl bg-ink-800 border border-white/15 flex items-center justify-center font-bold font-mono text-base text-paper shrink-0 shadow-subtle">
                  {(activeModalTeam.name || 'T').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h2 className="text-2xl font-serif font-black text-paper">
                      {activeModalTeam.name}
                    </h2>
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-mist border border-white/10">
                      {getSportName(activeModalTeam.sport_id)}
                    </span>
                  </div>
                  <p className="text-xs text-mist mt-0.5">{activeModalTeam.department}</p>
                  {(() => {
                    const modalSport = sports.find((s) => s.id === activeModalTeam.sport_id)
                    const isModalSolo = modalSport?.type === 'solo' || modalSport?.name?.toLowerCase() === 'chess'
                    const isModalDuo = modalSport?.type === 'duo'

                    return (
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono">
                        {!isModalSolo && !isModalDuo && activeModalTeam.formation && (
                          <span className="text-acid bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 font-lining">
                            Shape: {activeModalTeam.formation}
                          </span>
                        )}
                        {activeModalTeam.manager && (
                          <span className="text-mist flex items-center space-x-1">
                            <span>{isModalSolo ? 'Title:' : isModalDuo ? 'Seed:' : '👔 Mgr:'}</span>
                            <span className="font-bold text-paper">{activeModalTeam.manager}</span>
                          </span>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>

              <button
                onClick={() => setActiveModalTeam(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-mist hover:text-paper transition-colors border border-white/10"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Player Roster Grid */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-ink-800">
              <div className="flex items-center justify-between text-xs text-fog border-b border-white/10 pb-3 font-mono">
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
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Verified Roster</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
            <div className="p-4 bg-ink-900 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-fog font-mono">
                Team ID: {activeModalTeam.id.substring(0, 8)}
              </span>
              <div className="flex items-center space-x-3">
                {getSportName(activeModalTeam.sport_id).toLowerCase() === 'football' && (
                  <Link
                    href="/tactics"
                    onClick={() => setActiveModalTeam(null)}
                    className="flex items-center space-x-1.5 text-xs font-bold text-acid hover:underline"
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>Open Formations</span>
                  </Link>
                )}
                <button
                  onClick={() => setActiveModalTeam(null)}
                  className="px-5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-bold text-paper transition-all border border-white/15"
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
