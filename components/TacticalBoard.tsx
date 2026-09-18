'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTournament } from '@/context/TournamentContext'
import { Player, Team } from '@/lib/types'
import {
  Crosshair,
  Shield,
  Zap,
  Info,
  Users,
  RotateCcw,
  Sliders,
  ChevronRight,
  Sparkles,
  Trophy,
  Lock,
} from 'lucide-react'

export default function TacticalBoard() {
  const { sports, teams, players, updateTeamFormation, updatePlayerPosition, isAdmin } = useTournament()

  // Find football sport dynamically
  const footballSport = sports.find((s) => s.name.toLowerCase() === 'football') || sports[0]
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
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Crosshair className="w-5 h-5 text-blue-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Football Tactical Formation Board
          </h1>
        </div>

        <div className="bg-card border border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-sm max-w-xl mx-auto my-10">
          <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
            <Shield className="w-7 h-7 text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold text-white">No 6v6 Football Teams Registered</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
            There are currently no squads enrolled under 6v6 Football. Enroll teams and set their official formations in the Admin Console.
          </p>
          <Link
            href="/admin"
            className="mt-3 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 transition-all shadow-sm"
          >
            Go to Admin Console
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Team Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Crosshair className="w-5 h-5 text-blue-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Football Tactical Formation Board
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            6v6 pitch layout, tactical coordinates, and team positioning.
          </p>
        </div>

        {/* Team Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {footballTeams.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                setSelectedTeamId(team.id)
                setSelectedPlayer(null)
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                team.id === activeTeam?.id
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/80'
              }`}
            >
              <span>{team.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Tactical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pitch Display (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Pitch Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            {/* Formation Display / Selectors */}
            {isAdmin ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-blue-400">Formation (Admin):</span>
                <div className="flex flex-wrap items-center gap-1">
                  {availableFormations.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleFormationChange(fmt)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                        activeTeam?.formation === fmt
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Official Formation:</span>
                <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 font-mono text-xs border border-slate-700">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>{activeTeam?.formation || '2-2-1'}</span>
                  <span className="text-[10px] text-slate-400 ml-1">(Admin Fixed)</span>
                </div>
              </div>
            )}

            {/* Display Mode Switcher */}
            <div className="flex items-center space-x-2 text-xs self-end sm:self-auto">
              <span className="text-slate-400">View:</span>
              <button
                onClick={() => setTacticalViewMode('roles')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  tacticalViewMode === 'roles' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Roles
              </button>
              <button
                onClick={() => setTacticalViewMode('numbers')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  tacticalViewMode === 'numbers' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Jerseys
              </button>
              <button
                onClick={() => setTacticalViewMode('positions')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  tacticalViewMode === 'positions' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Coords
              </button>
            </div>
          </div>

          {/* 2D Tactical Football Pitch Container (Mobile-optimized aspect-[4/5] sm:aspect-[16/11]) */}
          <div
            onClick={handlePitchClick}
            className={`relative w-full aspect-[4/5] sm:aspect-[16/11] min-h-[440px] sm:min-h-0 rounded-2xl overflow-hidden border border-slate-800 shadow-md tactical-pitch select-none transition-all ${
              isRepositioning ? 'cursor-crosshair ring-2 ring-blue-500' : 'cursor-default'
            }`}
          >
            {/* Pitch Markings Overlay */}
            <div className="absolute inset-3 sm:inset-4 border border-white/20 rounded pointer-events-none">
              {/* Halfway Line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2" />
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 w-20 h-20 sm:w-28 sm:h-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>

              {/* Top Penalty Area (Opponent) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-14 sm:h-20 border-b border-x border-white/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-7 sm:h-10 border-b border-x border-white/20" />
                <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>

              {/* Bottom Penalty Area (Our Goal) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-14 sm:h-20 border-t border-x border-white/20">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-7 sm:h-10 border-t border-x border-white/20" />
                <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>

              {/* Corner Arcs */}
              <div className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-b border-r border-white/20 rounded-br-full" />
              <div className="absolute top-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-b border-l border-white/20 rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-t border-r border-white/20 rounded-tr-full" />
              <div className="absolute bottom-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-t border-l border-white/20 rounded-tl-full" />
            </div>

            {/* Pitch Orientation Labels */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] uppercase text-white/30 font-medium tracking-widest pointer-events-none">
              Opposition Half (Attack)
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] uppercase text-white/30 font-medium tracking-widest pointer-events-none">
              Defensive Half (Goal)
            </div>

            {/* Repositioning Active Banner */}
            {isRepositioning && selectedPlayer && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md z-30 animate-pulse whitespace-nowrap">
                Click anywhere on pitch to place {selectedPlayer.name}
              </div>
            )}

            {/* Player Nodes on the Pitch (Starting 6) */}
            {starting6.map((player) => {
              const isSelected = selectedPlayer?.id === player.id
              const isGK = player.role.toLowerCase().includes('goalkeeper')
              const isIcon = Boolean(player.is_icon)

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
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform duration-200 z-20 ${
                    isSelected ? 'scale-115 z-30' : 'hover:scale-105'
                  }`}
                >
                  {/* Icon Player Gold Star Badge */}
                  {isIcon && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-md border border-amber-200 z-30">
                      ★
                    </div>
                  )}

                  {/* Player Dot / Jersey */}
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-sm transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white ring-2 ring-white shadow-md'
                        : isIcon
                        ? 'bg-slate-950 text-amber-300 border-2 border-amber-400 ring-2 ring-amber-400/30'
                        : isGK
                        ? 'bg-amber-600 text-white font-bold border border-amber-400/80'
                        : 'bg-slate-900 text-white border border-slate-700'
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

                  {/* Clean First Name Pill */}
                  <div
                    className={`mt-0.5 px-1.5 py-0.2 rounded text-[10px] text-center whitespace-nowrap shadow transition-colors flex items-center justify-center space-x-0.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white font-medium'
                        : isIcon
                        ? 'bg-slate-950/95 text-amber-300 border border-amber-400/40 font-medium'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span>{player.name.split(' ')[0]}</span>
                    {isIcon && <span className="text-amber-400 text-[9px]">★</span>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pitch Legend & Instructions */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-1 gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                <span>Outfield</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-400" />
                <span>Goalkeeper</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-amber-400" />
                <span className="text-amber-300 font-medium">★ Icon</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Selected</span>
              </span>
            </div>
            <span>Click player to inspect details</span>
          </div>
        </div>

        {/* Tactical Info & Player Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Player Card or Default Overview */}
          {selectedPlayer ? (
            <div className={`bg-card rounded-xl p-5 space-y-4 border shadow-sm ${
              selectedPlayer.is_icon
                ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-transparent'
                : 'border-slate-800'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className={`w-4 h-4 ${selectedPlayer.is_icon ? 'text-amber-400' : 'text-blue-400'}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wide ${selectedPlayer.is_icon ? 'text-amber-400' : 'text-slate-200'}`}>
                    Player Dossier
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              {/* Icon Athlete Badge */}
              {selectedPlayer.is_icon && (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Team Icon Athlete ⭐</span>
                </div>
              )}

              {/* Player Identity */}
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-xl bg-slate-800 border overflow-hidden shrink-0 ${
                  selectedPlayer.is_icon ? 'border-amber-400' : 'border-slate-700'
                }`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPlayer.photo_url}
                    alt={selectedPlayer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-base font-bold text-white leading-tight flex items-center space-x-1.5">
                    <span>{selectedPlayer.name}</span>
                    {selectedPlayer.is_icon && <span className="text-amber-400 text-sm">⭐</span>}
                  </div>
                  <div className="text-xs text-blue-400 font-medium mt-0.5">
                    {selectedPlayer.role} • #{selectedPlayer.jersey_number}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {activeTeam.name}
                  </div>
                </div>
              </div>

              {/* Player Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-slate-400 text-[10px] uppercase font-medium">Goals / Points</div>
                  <div className="text-lg font-bold font-mono text-white">
                    {selectedPlayer.stats?.goalsOrPoints ?? 0}
                  </div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-slate-400 text-[10px] uppercase font-medium">Rating</div>
                  <div className="text-lg font-bold font-mono text-white">
                    {selectedPlayer.stats?.rating ?? 8.5} / 10
                  </div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-slate-400 text-[10px] uppercase font-medium">Pitch X (Width)</div>
                  <div className="text-sm font-semibold font-mono text-slate-200">
                    {Math.round(selectedPlayer.position_x)}%
                  </div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-slate-400 text-[10px] uppercase font-medium">Pitch Y (Depth)</div>
                  <div className="text-sm font-semibold font-mono text-slate-200">
                    {Math.round(selectedPlayer.position_y)}%
                  </div>
                </div>
              </div>

              {/* Reposition Action (Admin Only) */}
              <div className="pt-2">
                {isAdmin ? (
                  <button
                    onClick={() => setIsRepositioning(!isRepositioning)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-2 ${
                      isRepositioning
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>{isRepositioning ? 'Cancel Repositioning' : 'Reposition on Pitch (Admin)'}</span>
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800 flex items-center justify-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Position set by Administrator</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 text-white">
                <Shield className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-sm tracking-tight">
                  {activeTeam.name} Overview
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Current Shape</span>
                  <span className="font-mono font-semibold text-slate-200 text-xs flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>{activeTeam.formation || '2-2-1'}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Team Manager</span>
                  <span className="text-slate-200 font-medium">
                    {activeTeam.manager ? (
                      <span>👔 {activeTeam.manager}</span>
                    ) : (
                      <span className="text-slate-500 italic">Not Assigned</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Icon Player</span>
                  <span>
                    {teamPlayers.find((p) => p.is_icon) ? (
                      <span className="text-amber-400 font-medium">⭐ {teamPlayers.find((p) => p.is_icon)?.name}</span>
                    ) : (
                      <span className="text-slate-500 italic">None Assigned</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Department</span>
                  <span className="text-slate-200">{activeTeam.department}</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400">Starting Lineup</span>
                  <span className="font-medium text-white">{starting6.length} / 6 Fielded</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="font-medium text-slate-300 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>Interactive Tip</span>
                </p>
                <p>Click on any athlete node on the pitch to view detailed metrics.</p>
              </div>
            </div>
          )}

          {/* Roster & Reserves */}
          <div className="bg-card border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 uppercase tracking-wide">6v6 Squad Roster</span>
              <span className="text-slate-400">{teamPlayers.length} Members ({starting6.length} Fielded)</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {teamPlayers.map((p, idx) => {
                const isSelected = selectedPlayer?.id === p.id
                const isStarter = idx < 6
                const isIcon = Boolean(p.is_icon)
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlayer(p)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all text-left ${
                      isSelected
                        ? 'bg-blue-600/10 text-white border border-blue-500/40'
                        : isIcon
                        ? 'bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-900/40 hover:bg-slate-800/80 text-slate-200 border border-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-slate-400 font-mono text-xs w-5">#{p.jersey_number}</span>
                      <span className="truncate font-medium">{p.name}</span>
                      {isIcon && <span className="text-amber-400 text-xs shrink-0">⭐</span>}
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] text-slate-400">{p.role}</span>
                      {isIcon && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          ICON
                        </span>
                      )}
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                          isStarter
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-400'
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
