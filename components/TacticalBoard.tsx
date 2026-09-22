'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTournament } from '@/context/TournamentContext'
import { Player, Team } from '@/lib/types'
import {
  Crosshair,
  Shield,
  Info,
  Lock,
  Sparkles,
} from 'lucide-react'
import { isCsCupFootball } from '@/lib/sports-theme'

export default function TacticalBoard() {
  const { sports, teams, players, updateTeamFormation, updatePlayerPosition, isAdmin } = useTournament()

  // Find genuine football / CS Cup sport dynamically
  const footballSport = sports.find((s) => isCsCupFootball(s.name)) || sports[0]
  const footballTeams = teams.filter((t) => t.sport_id === footballSport?.id)
  const [selectedTeamId, setSelectedTeamId] = useState<string>(footballTeams[0]?.id || '')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [tacticalViewMode, setTacticalViewMode] = useState<'positions' | 'numbers' | 'roles'>('roles')
  const [isRepositioning, setIsRepositioning] = useState(false)

  const activeTeam = footballTeams.find((t) => t.id === selectedTeamId) || footballTeams[0]
  const teamPlayers = players.filter((p) => p.team_id === activeTeam?.id)

  const starting6 = teamPlayers.slice(0, 6)
  const benchPlayers = teamPlayers.slice(6)

  const availableFormations = ['2-2-1', '2-1-2', '3-1-1', '1-3-1', '1-2-2']

  const handleFormationChange = (formation: string) => {
    if (!isAdmin) return
    if (activeTeam) {
      updateTeamFormation(activeTeam.id, formation)
    }
  }

  // Handle clicking on the pitch when a player is selected to reposition them (Admin only)
  const handlePitchClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdmin || !isRepositioning || !selectedPlayer) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(5, Math.min(95, Math.round(((e.clientX - rect.left) / rect.width) * 100)))
    const y = Math.max(5, Math.min(95, Math.round(((e.clientY - rect.top) / rect.height) * 100)))

    updatePlayerPosition(selectedPlayer.id, x, y)
    setSelectedPlayer((prev) => (prev ? { ...prev, position_x: x, position_y: y } : null))
  }

  if (footballTeams.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-ink-800 border border-white/15 text-acid">
            <Crosshair className="w-5 h-5 text-acid" />
          </div>
          <div>
            <span className="meta-label text-fog">TACTICAL STUDIO</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-paper tracking-tight">
              Formations.
            </h1>
          </div>
        </div>

        <div className="bg-ink-800 border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto my-12">
          <div className="w-14 h-14 rounded-xl bg-ink-900 border border-white/15 flex items-center justify-center text-acid">
            <Shield className="w-7 h-7 text-acid" />
          </div>
          <h2 className="text-xl font-serif font-bold text-paper">No CS Cup Teams Registered</h2>
          <p className="text-xs sm:text-sm text-mist max-w-sm leading-relaxed">
            There are currently no squads enrolled under 6v6 Football. Enroll teams and configure formations in the Admin Console.
          </p>
          <Link
            href="/admin"
            className="cta-acid mt-2"
          >
            <span>Open Admin Console</span>
            <span className="arrow-hover ml-0.5">↗</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Team Switcher */}
      <div className="relative overflow-hidden bg-ink-800 p-6 sm:p-7 rounded-2xl border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-card">
        {/* Subtle Pitch Watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none -rotate-12 translate-x-10 translate-y-10">
          <svg className="w-64 h-64 text-white" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="20" y="20" width="160" height="160" rx="6" />
            <circle cx="100" cy="100" r="32" />
            <path d="M100 20 L100 180" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="relative z-10 space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className="meta-label text-acid">CS CUP • FOOTBALL</span>
            <span className="text-white/20">•</span>
            <span className="meta-label text-fog">TACTICAL STUDIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-paper tracking-tight">
            Formations.
          </h1>
          <p className="text-xs sm:text-sm text-mist max-w-xl leading-relaxed">
            6v6 turf pitch matrix, dynamic player coordinates, and live formation postures for the CS Cup football championship.
          </p>
        </div>

        {/* Team Selector Pills */}
        <div className="relative z-10 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {footballTeams.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                setSelectedTeamId(team.id)
                setSelectedPlayer(null)
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                team.id === activeTeam?.id
                  ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                  : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>{team.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Formations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pitch Display (8 Cols) */}
        <div className="lg:col-span-8 space-y-5 animate-slide-in-left">
          {/* Pitch Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ink-800 p-4 rounded-xl border border-white/10 shadow-subtle">
            {/* Formation Selector / Status */}
            {isAdmin ? (
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-acid uppercase tracking-wider">Formation:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {availableFormations.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleFormationChange(fmt)}
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                        activeTeam?.formation === fmt
                          ? 'bg-acid text-acid-ink shadow-[0_0_8px_rgba(215,242,43,0.3)] font-black'
                          : 'bg-white/5 text-mist hover:text-paper hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <span className="text-xs text-mist font-medium">Official Formation:</span>
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 text-paper font-mono font-bold text-xs border border-white/15">
                  <Lock className="w-3 h-3 text-acid" />
                  <span className="text-acid font-lining">{activeTeam?.formation || '2-2-1'}</span>
                  <span className="text-[10px] text-fog ml-1">(Admin Set)</span>
                </div>
              </div>
            )}

            {/* Display Mode Switcher */}
            <div className="flex items-center space-x-1 text-xs self-end sm:self-auto font-mono bg-ink-900 p-1 rounded-full border border-white/10">
              <button
                onClick={() => setTacticalViewMode('roles')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                  tacticalViewMode === 'roles' ? 'bg-acid text-acid-ink' : 'text-mist hover:text-paper'
                }`}
              >
                Roles
              </button>
              <button
                onClick={() => setTacticalViewMode('numbers')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                  tacticalViewMode === 'numbers' ? 'bg-acid text-acid-ink' : 'text-mist hover:text-paper'
                }`}
              >
                Jerseys
              </button>
              <button
                onClick={() => setTacticalViewMode('positions')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                  tacticalViewMode === 'positions' ? 'bg-acid text-acid-ink' : 'text-mist hover:text-paper'
                }`}
              >
                Coords
              </button>
            </div>
          </div>

          {/* 2D Tactical Football Pitch Container */}
          <div
            onClick={handlePitchClick}
            className={`relative w-full aspect-[4/5] sm:aspect-[16/11] min-h-[460px] sm:min-h-0 rounded-2xl overflow-hidden border border-white/15 shadow-elevated tactical-pitch select-none transition-all ${
              isRepositioning ? 'cursor-crosshair ring-2 ring-acid shadow-[0_0_24px_rgba(215,242,43,0.3)]' : 'cursor-default'
            }`}
          >
            {/* Pitch Markings Overlay */}
            <div className="absolute inset-4 sm:inset-5 border border-white/20 rounded pointer-events-none">
              {/* Halfway Line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2" />
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-32 sm:h-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>

              {/* Top Penalty Area (Opponent) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-16 sm:h-24 border-b border-x border-white/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-8 sm:h-12 border-b border-x border-white/20" />
                <div className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>

              {/* Bottom Penalty Area (Our Goal) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-16 sm:h-24 border-t border-x border-white/20">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-8 sm:h-12 border-t border-x border-white/20" />
                <div className="absolute top-2.5 sm:top-3.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>

              {/* Corner Arcs */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-b border-r border-white/20 rounded-br-full" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-b border-l border-white/20 rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-t border-r border-white/20 rounded-tr-full" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-t border-l border-white/20 rounded-tl-full" />
            </div>

            {/* Pitch Orientation Labels */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] uppercase text-white/30 font-mono font-medium tracking-[0.2em] pointer-events-none">
              OPPOSITION HALF (ATTACK)
            </div>
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] uppercase text-white/30 font-mono font-medium tracking-[0.2em] pointer-events-none">
              DEFENSIVE HALF (GOAL)
            </div>

            {/* Repositioning Banner */}
            {isRepositioning && selectedPlayer && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-acid text-acid-ink text-xs font-bold px-4 py-1.5 rounded-full shadow-glow z-30 animate-pulse whitespace-nowrap">
                Click anywhere on turf to place {selectedPlayer.name}
              </div>
            )}

            {/* Player Nodes on the Pitch (Starting 6) */}
            {starting6.map((player, idx) => {
              const isSelected = selectedPlayer?.id === player.id
              const isGK = player.role.toLowerCase().includes('goalkeeper')
              const isIcon = Boolean(player.is_icon)
              const showTooltipBelow = player.position_y < 35

              return (
                <div
                  key={player.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedPlayer(player)
                  }}
                  style={{
                    left: `${player.position_x}%`,
                    top: `${player.position_y}%`,
                    animationDelay: `${idx * 75}ms`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform duration-200 z-20 animate-pitch-drop ${
                    isSelected ? 'scale-115 z-30' : 'hover:scale-110'
                  }`}
                >
                  {/* Floating Dossier Tooltip Card on Hover */}
                  <div
                    className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-40 w-52 p-3 rounded-xl bg-ink-800/95 border border-white/20 shadow-elevated text-cream transition-all duration-150 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 backdrop-blur-md ${
                      showTooltipBelow ? 'top-full mt-3' : 'bottom-full mb-3'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-ink-900 border border-white/15 shrink-0 flex items-center justify-center font-mono font-bold text-xs text-paper">
                        {player.photo_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>#{player.jersey_number}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-paper truncate flex items-center space-x-1">
                          <span className="truncate">{player.name}</span>
                          {isIcon && <span className="text-acid text-[10px]">★</span>}
                        </div>
                        <div className="text-[10px] text-acid font-medium truncate mt-0.5">
                          {player.role}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-mist font-mono">
                      <span className="truncate">{activeTeam?.name}</span>
                      <span className="text-paper font-bold font-lining">
                        {isGK ? 'GK' : `POS (${Math.round(player.position_x)}, ${Math.round(player.position_y)})`}
                      </span>
                    </div>
                  </div>

                  {/* Icon Athlete Gold Star Pill */}
                  {isIcon && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-acid text-acid-ink text-[10px] font-black flex items-center justify-center shadow-subtle border border-ink-900 z-30">
                      ★
                    </div>
                  )}

                  {/* Player Disc Node with Large Serif Lining Number */}
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 mx-auto rounded-full flex items-center justify-center font-serif font-black text-sm sm:text-base font-lining shadow-card transition-all duration-200 ${
                      isSelected
                        ? 'bg-acid text-acid-ink ring-4 ring-acid/40 shadow-glow scale-110'
                        : isIcon
                        ? 'bg-ink-800 text-acid ring-2 ring-acid border border-acid/60'
                        : isGK
                        ? 'bg-europa-orange text-paper ring-1 ring-white/40 border border-white/20'
                        : 'bg-ink-800 text-paper ring-1 ring-white/30 border border-white/15'
                    }`}
                  >
                    {tacticalViewMode === 'numbers' ? (
                      `#${player.jersey_number}`
                    ) : tacticalViewMode === 'positions' ? (
                      `${Math.round(player.position_x)}`
                    ) : (
                      player.jersey_number
                    )}
                  </div>

                  {/* Player Name Tag Beneath */}
                  <div
                    className={`mt-1 px-2 py-0.5 rounded-full text-[10px] text-center whitespace-nowrap shadow-subtle transition-colors flex items-center justify-center space-x-1 ${
                      isSelected
                        ? 'bg-acid text-acid-ink font-bold'
                        : isIcon
                        ? 'bg-ink-800 text-acid border border-acid/40 font-bold'
                        : 'bg-ink-900/90 text-cream border border-white/15 font-medium'
                    }`}
                  >
                    <span>{player.name.split(' ')[0]}</span>
                    {isIcon && <span className="text-acid text-[9px]">★</span>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pitch Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-mist px-1 gap-3 font-mono">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-ink-800 border border-white/30" />
                <span>Outfield</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-europa-orange" />
                <span>Goalkeeper</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-ink-800 border border-acid" />
                <span className="text-acid">★ Icon Disc</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-acid" />
                <span className="text-paper">Selected</span>
              </span>
            </div>
            <span className="text-fog font-sans">Click athlete node to view dossier</span>
          </div>
        </div>

        {/* Formations Info & Player Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-5 animate-slide-in-right">
          {/* Selected Player Card or Default Overview */}
          {selectedPlayer ? (
            <div key={selectedPlayer.id} className="bg-ink-800 rounded-2xl p-6 space-y-5 border border-white/12 shadow-card animate-slide-in-up">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className={`w-4 h-4 ${selectedPlayer.is_icon ? 'text-acid' : 'text-paper'}`} />
                  <span className={`text-xs font-serif font-black uppercase tracking-wider ${selectedPlayer.is_icon ? 'text-acid' : 'text-paper'}`}>
                    Athlete Dossier
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="text-xs text-fog hover:text-paper font-mono"
                >
                  [Dismiss]
                </button>
              </div>

              {/* Icon Athlete Banner */}
              {selectedPlayer.is_icon && (
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-acid/10 border border-acid/30 text-acid text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-acid" />
                  <span>Team Icon Athlete ★</span>
                </div>
              )}

              {/* Player Identity */}
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-xl bg-ink-900 border overflow-hidden shrink-0 flex items-center justify-center font-mono font-bold text-sm shadow-subtle ${
                  selectedPlayer.is_icon ? 'border-acid/60 text-acid' : 'border-white/15 text-paper'
                }`}>
                  {selectedPlayer.photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={selectedPlayer.photo_url}
                      alt={selectedPlayer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    `#${selectedPlayer.jersey_number}`
                  )}
                </div>
                <div>
                  <div className="text-lg font-serif font-black text-paper leading-tight flex items-center space-x-1.5">
                    <span>{selectedPlayer.name}</span>
                    {selectedPlayer.is_icon && <span className="text-acid text-sm">★</span>}
                  </div>
                  <div className="text-xs text-acid font-mono font-medium mt-0.5">
                    {selectedPlayer.role} • #{selectedPlayer.jersey_number}
                  </div>
                  <div className="text-xs text-fog mt-0.5">
                    {activeTeam.name}
                  </div>
                </div>
              </div>

              {/* Player Tactical Details */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-ink-900 p-3 rounded-xl border border-white/10">
                  <div className="meta-label text-[10px] text-fog">Position</div>
                  <div className="text-sm font-bold text-paper truncate mt-1">
                    {selectedPlayer.role}
                  </div>
                </div>
                <div className="bg-ink-900 p-3 rounded-xl border border-white/10">
                  <div className="meta-label text-[10px] text-fog">Squad Number</div>
                  <div className="text-sm font-bold font-serif text-acid mt-1 font-lining">
                    #{selectedPlayer.jersey_number}
                  </div>
                </div>
              </div>

              {/* Reposition Action (Admin Only) */}
              <div className="pt-2">
                {isAdmin ? (
                  <button
                    onClick={() => setIsRepositioning(!isRepositioning)}
                    className={`w-full h-11 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      isRepositioning
                        ? 'bg-acid text-acid-ink shadow-glow'
                        : 'bg-white/5 hover:bg-white/10 text-paper border border-white/15'
                    }`}
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>{isRepositioning ? 'Cancel Repositioning' : 'Reposition on Turf (Admin)'}</span>
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-fog bg-ink-900 p-3 rounded-xl border border-white/10 flex items-center justify-center space-x-2 font-mono">
                    <Lock className="w-3.5 h-3.5 text-fog shrink-0" />
                    <span>Position coordinates locked by Administrator</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div key="overview" className="bg-ink-800 border border-white/12 rounded-2xl p-6 space-y-5 shadow-card animate-slide-in-up">
              <div className="flex items-center space-x-2 text-paper">
                <Shield className="w-4 h-4 text-acid" />
                <h3 className="font-serif font-black text-base tracking-tight text-paper">
                  {activeTeam.name} Overview
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-mist font-medium">Tactical Shape</span>
                  <span className="font-mono font-bold text-acid text-xs flex items-center space-x-1 font-lining">
                    <Lock className="w-3 h-3 text-acid" />
                    <span>{activeTeam.formation || '2-2-1'}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-mist font-medium">Team Manager</span>
                  <span className="text-paper font-bold">
                    {activeTeam.manager ? (
                      <span>👔 {activeTeam.manager}</span>
                    ) : (
                      <span className="text-fog italic font-normal">Not Assigned</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-mist font-medium">Icon Athlete</span>
                  <span>
                    {teamPlayers.find((p) => p.is_icon) ? (
                      <span className="text-acid font-bold">★ {teamPlayers.find((p) => p.is_icon)?.name}</span>
                    ) : (
                      <span className="text-fog italic">None Assigned</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-mist font-medium">Department</span>
                  <span className="text-paper font-bold">{activeTeam.department}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-mist font-medium">Starting Lineup</span>
                  <span className="font-bold text-paper font-mono font-lining">{starting6.length} / 6 Fielded</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-ink-900 border border-white/10 text-xs text-mist space-y-1">
                <p className="font-bold text-paper flex items-center space-x-1.5 font-mono text-[10px] tracking-wider uppercase text-acid">
                  <Info className="w-3.5 h-3.5 text-acid" />
                  <span>Tactical Pitch Tip</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  Click on any athlete disc on the turf pitch to view detailed formations, position coordinates, and player dossiers.
                </p>
              </div>
            </div>
          )}

          {/* Squad Roster & Reserves Rail */}
          <div className="bg-ink-800 border border-white/12 rounded-2xl p-5 space-y-4 shadow-subtle animate-slide-in-up animation-delay-150">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-black text-paper uppercase tracking-wider">6v6 Squad Roster</span>
              <span className="text-fog font-mono text-[11px] font-lining">
                {teamPlayers.length} Members ({starting6.length} Fielded)
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {teamPlayers.map((p, idx) => {
                const isSelected = selectedPlayer?.id === p.id
                const isStarter = idx < 6
                const isIcon = Boolean(p.is_icon)
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlayer(p)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all duration-150 text-left hover:translate-x-1 ${
                      isSelected
                        ? 'bg-acid text-acid-ink font-bold'
                        : isIcon
                        ? 'bg-ink-900 hover:bg-ink-900/80 text-cream border border-acid/40'
                        : 'bg-ink-900 hover:bg-ink-900/80 text-cream border border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span className={`font-mono text-xs w-6 ${isSelected ? 'text-acid-ink' : 'text-fog'}`}>
                        #{p.jersey_number}
                      </span>
                      <span className="truncate font-semibold">{p.name}</span>
                      {isIcon && <span className={`text-xs shrink-0 ${isSelected ? 'text-acid-ink' : 'text-acid'}`}>★</span>}
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className={`text-[10px] ${isSelected ? 'text-acid-ink/80' : 'text-fog'}`}>{p.role}</span>
                      {isIcon && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          isSelected ? 'bg-ink-900 text-acid' : 'bg-acid/15 text-acid border border-acid/30'
                        }`}>
                          ICON
                        </span>
                      )}
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          isStarter
                            ? isSelected
                              ? 'bg-ink-900 text-paper'
                              : 'bg-white/10 text-paper border border-white/15'
                            : isSelected
                            ? 'bg-ink-900/60 text-cream'
                            : 'bg-white/5 text-fog border border-white/10'
                        }`}
                      >
                        {isStarter ? 'START 6' : 'BENCH'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
