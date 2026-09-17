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

  const starting11 = teamPlayers.slice(0, 11)
  const benchPlayers = teamPlayers.slice(11)

  const availableFormations = ['4-3-3', '4-2-3-1', '3-5-2', '4-4-2']

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
          <div className="p-1.5 rounded-lg bg-neon-lime/10 border border-neon-lime/30">
            <Crosshair className="w-5 h-5 text-neon-lime" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ice-white tracking-tight">
            INTERACTIVE TACTICAL FORMATION BOARD
          </h1>
        </div>

        <div className="bg-card border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl max-w-2xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
            <Shield className="w-8 h-8 text-neon-lime" />
          </div>
          <h2 className="text-xl font-bold font-mono text-ice-white">NO FOOTBALL TEAMS REGISTERED</h2>
          <p className="text-sm text-muted-gray max-w-md">
            There are currently no squads enrolled under Football. Enroll new teams and assign their tactical formations in the Administration Console.
          </p>
          <Link
            href="/admin"
            className="mt-4 px-6 py-2.5 rounded-xl bg-neon-lime text-slate-950 font-mono font-bold text-xs shadow-neon-lime hover:bg-neon-lime-dark transition-all"
          >
            GO TO ADMIN CONSOLE
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
            <div className="p-1.5 rounded-lg bg-neon-lime/10 border border-neon-lime/30">
              <Crosshair className="w-5 h-5 text-neon-lime" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-ice-white tracking-tight">
              INTERACTIVE TACTICAL FORMATION BOARD
            </h1>
          </div>
          <p className="text-sm text-muted-gray mt-1">
            Visual field matrix, tactical coordinates, and player positional analysis.
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
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                team.id === activeTeam?.id
                  ? 'bg-neon-lime text-slate-950 shadow-neon-lime'
                  : 'bg-slate-800 text-ice-white hover:bg-slate-700 border border-slate-700'
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
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            {/* Formation Display / Selectors */}
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-neon-lime font-bold">EDIT FORMATION (ADMIN):</span>
                <div className="flex items-center space-x-1">
                  {availableFormations.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleFormationChange(fmt)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                        activeTeam?.formation === fmt
                          ? 'bg-neon-lime text-slate-950 font-black shadow-neon-lime'
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
                <span className="text-xs font-mono text-muted-gray">OFFICIAL FORMATION:</span>
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800 text-neon-lime font-mono font-bold text-xs border border-neon-lime/30">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>{activeTeam?.formation || '4-3-3'}</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-1">(Admin Fixed)</span>
                </div>
              </div>
            )}

            {/* Display Mode Switcher */}
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-muted-gray">VIEW:</span>
              <button
                onClick={() => setTacticalViewMode('roles')}
                className={`px-2 py-1 rounded ${
                  tacticalViewMode === 'roles' ? 'bg-cyber-cyan text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Roles
              </button>
              <button
                onClick={() => setTacticalViewMode('numbers')}
                className={`px-2 py-1 rounded ${
                  tacticalViewMode === 'numbers' ? 'bg-cyber-cyan text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Jerseys
              </button>
              <button
                onClick={() => setTacticalViewMode('positions')}
                className={`px-2 py-1 rounded ${
                  tacticalViewMode === 'positions' ? 'bg-cyber-cyan text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Coordinates
              </button>
            </div>
          </div>

          {/* 2D Tactical Football Pitch Container */}
          <div
            onClick={handlePitchClick}
            className={`relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl tactical-pitch select-none transition-all ${
              isRepositioning ? 'cursor-crosshair ring-2 ring-cyber-cyan' : 'cursor-default'
            }`}
          >
            {/* Pitch Markings Overlay */}
            <div className="absolute inset-4 border-2 border-emerald-400/30 rounded pointer-events-none">
              {/* Halfway Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400/30 -translate-y-1/2" />
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400/40" />
              </div>

              {/* Top Penalty Area (Opponent) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 border-b-2 border-x-2 border-emerald-400/30">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-10 border-b-2 border-x-2 border-emerald-400/30" />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400/40" />
              </div>

              {/* Bottom Penalty Area (Our Goal) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 border-t-2 border-x-2 border-emerald-400/30">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-10 border-t-2 border-x-2 border-emerald-400/30" />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400/40" />
              </div>

              {/* Corner Arcs */}
              <div className="absolute top-0 left-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400/30 rounded-br-full" />
              <div className="absolute top-0 right-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400/30 rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400/30 rounded-tr-full" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400/30 rounded-tl-full" />
            </div>

            {/* Pitch Orientation Labels */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase text-emerald-300/40 font-bold tracking-widest pointer-events-none">
              OPPOSITION HALF (ATTACK)
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase text-emerald-300/40 font-bold tracking-widest pointer-events-none">
              DEFENSIVE HALF (GOAL)
            </div>

            {/* Repositioning Active Banner */}
            {isRepositioning && selectedPlayer && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-cyber-cyan text-slate-950 text-xs font-mono font-bold px-3 py-1 rounded-full shadow-lg z-30 animate-pulse">
                Click anywhere on pitch to place {selectedPlayer.name}
              </div>
            )}

            {/* Player Nodes on the Pitch */}
            {starting11.map((player) => {
              const isSelected = selectedPlayer?.id === player.id
              const isGK = player.role.toLowerCase().includes('goalkeeper')

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
                  {/* Player Dot / Jersey */}
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-md transition-all ${
                      isSelected
                        ? 'bg-neon-lime text-slate-950 ring-2 ring-white shadow-neon-lime'
                        : isGK
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-ice-white border border-cyber-cyan/60'
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
                    className={`mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono text-center whitespace-nowrap shadow transition-colors ${
                      isSelected
                        ? 'bg-neon-lime text-slate-950 font-bold'
                        : 'bg-slate-900/90 text-slate-200'
                    }`}
                  >
                    {player.name.split(' ')[0]}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pitch Legend & Instructions */}
          <div className="flex flex-wrap items-center justify-between text-xs text-muted-gray font-mono px-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-900 border border-cyber-cyan" />
                <span>Outfield Node</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300" />
                <span>Goalkeeper</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-neon-lime" />
                <span>Selected</span>
              </span>
            </div>
            <span>Click player to inspect or adjust tactics</span>
          </div>
        </div>

        {/* Tactical Info & Player Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Player Card or Default Overview */}
          {selectedPlayer ? (
            <div className="bg-card border-2 border-cyber-cyan/50 rounded-2xl p-5 shadow-cyber-cyan space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-neon-lime" />
                  <span className="text-xs font-mono font-bold text-neon-lime uppercase">
                    TACTICAL DOSSIER
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="text-xs text-muted-gray hover:text-white"
                >
                  Close
                </button>
              </div>

              {/* Player Identity */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-neon-lime/40 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPlayer.photo_url}
                    alt={selectedPlayer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-lg font-bold text-ice-white leading-tight">
                    {selectedPlayer.name}
                  </div>
                  <div className="text-xs text-cyber-cyan font-mono font-semibold">
                    {selectedPlayer.role} • #{selectedPlayer.jersey_number}
                  </div>
                  <div className="text-xs text-muted-gray mt-0.5">
                    {activeTeam.name}
                  </div>
                </div>
              </div>

              {/* Player Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-muted-gray text-[10px]">GOALS / PTS</div>
                  <div className="text-lg font-bold text-neon-lime">
                    {selectedPlayer.stats?.goalsOrPoints ?? 0}
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-muted-gray text-[10px]">ASSISTS / RATING</div>
                  <div className="text-lg font-bold text-cyber-cyan">
                    {selectedPlayer.stats?.rating ?? 8.5} / 10
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-muted-gray text-[10px]">POS X (WIDTH)</div>
                  <div className="text-sm font-bold text-ice-white">
                    {Math.round(selectedPlayer.position_x)}%
                  </div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-muted-gray text-[10px]">POS Y (DEPTH)</div>
                  <div className="text-sm font-bold text-ice-white">
                    {Math.round(selectedPlayer.position_y)}%
                  </div>
                </div>
              </div>

              {/* Reposition Action (Admin Only) */}
              <div className="pt-2">
                {isAdmin ? (
                  <button
                    onClick={() => setIsRepositioning(!isRepositioning)}
                    className={`w-full py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      isRepositioning
                        ? 'bg-cyber-cyan text-slate-950 shadow-cyber-cyan'
                        : 'bg-slate-800 hover:bg-slate-700 text-ice-white border border-slate-700'
                    }`}
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>{isRepositioning ? 'CANCEL REPOSITIONING' : 'REPOSITION ON PITCH (ADMIN)'}</span>
                  </button>
                ) : (
                  <div className="text-center text-[11px] font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Position coordinates set by Admin</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center space-x-2 text-ice-white">
                <Shield className="w-5 h-5 text-neon-lime" />
                <h3 className="font-bold text-sm tracking-wide uppercase font-mono">
                  {activeTeam.name} MATRIX
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-muted-gray">Current Shape</span>
                  <span className="font-mono font-bold text-neon-lime text-xs flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>{activeTeam.formation || '4-3-3'} (Official)</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-muted-gray">Department</span>
                  <span className="font-mono text-ice-white">{activeTeam.department}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-muted-gray">Tactical Width</span>
                  <span className="font-mono text-cyber-cyan">Aggressive / High Line</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-gray">Starting Lineup</span>
                  <span className="font-mono text-ice-white font-bold">{starting11.length} Players</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-muted-gray space-y-1">
                <p className="font-semibold text-ice-white flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Interactive Pitch Tip</span>
                </p>
                <p>Click on any jersey node on the turf to view detailed stats or adjust their tactical spot.</p>
              </div>
            </div>
          )}

          {/* Roster & Reserves */}
          <div className="bg-card border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-ice-white uppercase">LINEUP ROSTER</span>
              <span className="text-muted-gray">{teamPlayers.length} Members</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {teamPlayers.map((p) => {
                const isSelected = selectedPlayer?.id === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlayer(p)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-all text-left ${
                      isSelected
                        ? 'bg-neon-lime/20 text-neon-lime border border-neon-lime/40'
                        : 'bg-slate-900/60 hover:bg-slate-800 text-ice-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-slate-400 font-bold w-5">#{p.jersey_number}</span>
                      <span className="truncate">{p.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-gray uppercase shrink-0">{p.role}</span>
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
