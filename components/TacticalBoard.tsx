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
import { isCsCupFootball } from '@/lib/sports-theme'

export default function TacticalBoard() {
  const { sports, teams, players, updateTeamFormation, updatePlayerPosition, isAdmin } = useTournament()

  // Find genuine football / CS Cup sport dynamically (strictly excluding virtual e-football)
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
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-blue-50 border border-blue-200">
            <Crosshair className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
            CS Cup • Formations Studio
          </h1>
        </div>

        <div className="bg-white border border-[#E5E0D8] rounded-lg p-10 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto my-10">
          <div className="w-14 h-14 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-600">
            <Shield className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">No CS Cup (Football) Teams Registered</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm">
            There are currently no squads enrolled under 6v6 Football. Enroll teams and set their official formations in the Admin Console.
          </p>
          <Link
            href="/admin"
            className="mt-3 px-5 h-10 inline-flex items-center justify-center rounded-md bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition-colors"
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
      <div className="relative overflow-hidden bg-white p-5 rounded-xl border-2 border-[#1A1A1A] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-editorial-md animate-slide-in-down">
        {/* Subtle Formations Pitch Vector Watermark */}
        <svg
          className="absolute right-2 -bottom-6 w-48 h-48 text-slate-900 opacity-[0.035] pointer-events-none -rotate-12"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="20" y="20" width="160" height="160" rx="8" />
          <circle cx="100" cy="100" r="32" />
          <path d="M100 20 L100 180" strokeDasharray="4 4" />
          <path d="M60 20 L60 60 L140 60 L140 20" />
          <path d="M60 180 L60 140 L140 140 L140 180" />
          <path d="M40 90 L100 130 L160 90" strokeDasharray="2 2" />
        </svg>

        <div className="relative z-10">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-md bg-[#F59E0B] border-2 border-[#1A1A1A] shadow-2xs">
              <Crosshair className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
              CS Cup • Formations Studio
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            6v6 pitch layout, dynamic player coordinates, and live formation stances for the CS Cup football tournament.
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
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 hover:translate-y-[-1px] ${
                team.id === activeTeam?.id
                  ? 'bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
                  : 'bg-white text-slate-700 hover:text-[#1A1A1A] hover:bg-slate-50 border border-slate-300'
              }`}
            >
              <span>{team.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Formations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pitch Display (8 Cols) */}
        <div className="lg:col-span-8 space-y-4 animate-slide-in-left">
          {/* Pitch Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border-2 border-[#1A1A1A] shadow-editorial-sm">
            {/* Formation Display / Selectors */}
            {isAdmin ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#1E40AF] uppercase font-mono">Formation (Admin):</span>
                <div className="flex flex-wrap items-center gap-1">
                  {availableFormations.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleFormationChange(fmt)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                        activeTeam?.formation === fmt
                          ? 'bg-[#F59E0B] text-[#1A1A1A] border border-[#1A1A1A] shadow-2xs font-black'
                          : 'bg-slate-100 text-slate-700 hover:text-[#1A1A1A] hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-700 font-bold">Official Formation:</span>
                <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#F59E0B] text-[#1A1A1A] font-mono font-black text-xs border border-[#1A1A1A]">
                  <Lock className="w-3 h-3 text-[#1A1A1A]" />
                  <span>{activeTeam?.formation || '2-2-1'}</span>
                  <span className="text-[10px] text-black/60 ml-1">(Admin Locked)</span>
                </div>
              </div>
            )}

            {/* Display Mode Switcher */}
            <div className="flex items-center space-x-2 text-xs self-end sm:self-auto font-mono font-bold">
              <span className="text-slate-500 uppercase text-[11px]">View:</span>
              <button
                onClick={() => setTacticalViewMode('roles')}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  tacticalViewMode === 'roles' ? 'bg-[#1A1A1A] text-white font-black' : 'text-slate-600 hover:text-[#1A1A1A] hover:bg-slate-100'
                }`}
              >
                Roles
              </button>
              <button
                onClick={() => setTacticalViewMode('numbers')}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  tacticalViewMode === 'numbers' ? 'bg-[#1A1A1A] text-white font-black' : 'text-slate-600 hover:text-[#1A1A1A] hover:bg-slate-100'
                }`}
              >
                Jerseys
              </button>
              <button
                onClick={() => setTacticalViewMode('positions')}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  tacticalViewMode === 'positions' ? 'bg-[#1A1A1A] text-white font-black' : 'text-slate-600 hover:text-[#1A1A1A] hover:bg-slate-100'
                }`}
              >
                Coords
              </button>
            </div>
          </div>

          {/* 2D Tactical Football Pitch Container (Mobile-optimized aspect-[4/5] sm:aspect-[16/11]) */}
          <div
            onClick={handlePitchClick}
            className={`relative w-full aspect-[4/5] sm:aspect-[16/11] min-h-[440px] sm:min-h-0 rounded-xl overflow-hidden border-2 border-[#1A1A1A] shadow-editorial-lg tactical-pitch select-none transition-all ${
              isRepositioning ? 'cursor-crosshair ring-4 ring-[#F59E0B]' : 'cursor-default'
            }`}
          >
            {/* Pitch Markings Overlay */}
            <div className="absolute inset-3 sm:inset-4 border-2 border-white/25 rounded pointer-events-none">
              {/* Halfway Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/25 -translate-y-1/2" />
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 w-20 h-20 sm:w-28 sm:h-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/25 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>

              {/* Top Penalty Area (Opponent) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-14 sm:h-20 border-b-2 border-x-2 border-white/25">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-7 sm:h-10 border-b-2 border-x-2 border-white/25" />
                <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>

              {/* Bottom Penalty Area (Our Goal) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-14 sm:h-20 border-t-2 border-x-2 border-white/25">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-7 sm:h-10 border-t-2 border-x-2 border-white/25" />
                <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
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
                  {/* Floating Stats Tooltip Card on Hover */}
                  <div
                    className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-40 w-48 p-2.5 rounded-lg bg-white border border-[#E5E0D8] shadow-md text-slate-900 transition-all duration-150 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 ${
                      showTooltipBelow ? 'top-full mt-3' : 'bottom-full mb-3'
                    }`}
                  >
                    {/* Pointer Triangle */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-[#E5E0D8] rotate-45 ${
                        showTooltipBelow ? '-top-1 border-r-0 border-b-0 border-l border-t' : '-bottom-1'
                      }`}
                    />
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center font-mono font-bold text-xs">
                        {player.photo_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>#{player.jersey_number}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-[#1A1A1A] truncate flex items-center space-x-1">
                          <span className="truncate">{player.name}</span>
                          {isIcon && <span className="text-amber-500 text-[10px]">⭐</span>}
                        </div>
                        <div className="text-[10px] text-blue-600 font-medium truncate">
                          {player.role}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="truncate">{activeTeam?.name}</span>
                      <span className="font-mono font-bold text-slate-800 shrink-0">
                        {isGK ? 'GK' : `POS (${Math.round(player.position_x)}, ${Math.round(player.position_y)})`}
                      </span>
                    </div>
                  </div>

                  {/* Icon Player Gold Star Badge */}
                  {isIcon && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-md border border-amber-200 z-30">
                      ★
                    </div>
                  )}

                  {/* Player Dot / Jersey */}
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-full flex items-center justify-center font-mono font-black text-xs shadow-md transition-all ${
                      isSelected
                        ? 'bg-[#1E40AF] text-white ring-4 ring-white shadow-xl scale-110'
                        : isIcon
                        ? 'bg-[#1A1A1A] text-[#F59E0B] ring-2 ring-[#D97706] border-2 border-[#F59E0B] shadow-lg'
                        : isGK
                        ? 'bg-[#D97706] text-[#1A1A1A] ring-2 ring-white border border-[#1A1A1A] font-black'
                        : 'bg-[#1A1A1A] text-white ring-1 ring-white/70 border border-[#1A1A1A]'
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
                    className={`mt-1 px-1.5 py-0.5 rounded text-[10px] text-center whitespace-nowrap shadow-xs transition-colors flex items-center justify-center space-x-0.5 ${
                      isSelected
                        ? 'bg-[#1E40AF] text-white font-bold'
                        : isIcon
                        ? 'bg-[#1A1A1A] text-[#F59E0B] border border-[#D97706] font-black'
                        : 'bg-[#1A1A1A]/90 text-white border border-black/40 font-medium'
                    }`}
                  >
                    <span>{player.name.split(' ')[0]}</span>
                    {isIcon && <span className="text-[#F59E0B] text-[9px]">★</span>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pitch Legend & Instructions */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-700 px-1 gap-2 font-mono font-bold">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#1A1A1A] border border-white/60" />
                <span>Outfield</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#D97706] border border-[#1A1A1A]" />
                <span>Goalkeeper</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#1A1A1A] ring-2 ring-[#D97706] border border-[#F59E0B]" />
                <span className="text-[#D97706]">★ Icon Disc</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#1E40AF]" />
                <span>Selected</span>
              </span>
            </div>
            <span className="text-slate-500 font-sans font-medium">Click player to inspect details</span>
          </div>
        </div>

        {/* Formations Info & Player Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4 animate-slide-in-right">
          {/* Selected Player Card or Default Overview */}
          {selectedPlayer ? (
            <div key={selectedPlayer.id} className="bg-white rounded-xl p-5 space-y-4 border-2 border-[#1A1A1A] shadow-editorial-md animate-slide-in-up">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className={`w-4 h-4 ${selectedPlayer.is_icon ? 'text-[#D97706]' : 'text-[#1E40AF]'}`} />
                  <span className={`text-xs font-serif font-black uppercase tracking-wide ${selectedPlayer.is_icon ? 'text-[#D97706]' : 'text-[#1A1A1A]'}`}>
                    Player Dossier
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="text-xs text-slate-500 hover:text-black font-bold"
                >
                  Close
                </button>
              </div>

              {/* Icon Athlete Badge */}
              {selectedPlayer.is_icon && (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Team Icon Athlete ⭐</span>
                </div>
              )}

              {/* Player Identity */}
              <div className="flex items-center space-x-3.5">
                <div className={`w-12 h-12 rounded-md bg-slate-100 border overflow-hidden shrink-0 flex items-center justify-center font-mono font-bold text-sm shadow-2xs ${
                  selectedPlayer.is_icon ? 'border-amber-300 text-amber-800' : 'border-slate-200 text-slate-700'
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
                  <div className="text-base font-serif font-bold text-[#1A1A1A] leading-tight flex items-center space-x-1.5">
                    <span>{selectedPlayer.name}</span>
                    {selectedPlayer.is_icon && <span className="text-amber-600 text-sm">⭐</span>}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mt-0.5">
                    {selectedPlayer.role} • #{selectedPlayer.jersey_number}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {activeTeam.name}
                  </div>
                </div>
              </div>

              {/* Player Tactical Details */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase font-medium">Position</div>
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {selectedPlayer.role}
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200">
                  <div className="text-slate-500 text-[10px] uppercase font-medium">Squad Number</div>
                  <div className="text-sm font-bold font-mono text-slate-900">
                    #{selectedPlayer.jersey_number}
                  </div>
                </div>
              </div>

              {/* Reposition Action (Admin Only) */}
              <div className="pt-2">
                {isAdmin ? (
                  <button
                    onClick={() => setIsRepositioning(!isRepositioning)}
                    className={`w-full h-11 px-4 rounded-md text-xs font-medium transition-all flex items-center justify-center space-x-2 ${
                      isRepositioning
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>{isRepositioning ? 'Cancel Repositioning' : 'Reposition on Pitch (Admin)'}</span>
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-200 flex items-center justify-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Position set by Administrator</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div key="overview" className="bg-white border-2 border-[#1A1A1A] rounded-xl p-5 space-y-4 shadow-editorial-md animate-slide-in-up">
              <div className="flex items-center space-x-2 text-slate-900">
                <Shield className="w-4 h-4 text-[#1E40AF]" />
                <h3 className="font-serif font-black text-sm tracking-tight text-[#1A1A1A]">
                  {activeTeam.name} Overview
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Current Shape</span>
                  <span className="font-mono font-bold text-[#1A1A1A] text-xs flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-[#D97706]" />
                    <span>{activeTeam.formation || '2-2-1'}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Team Manager</span>
                  <span className="text-slate-900 font-bold">
                    {activeTeam.manager ? (
                      <span>👔 {activeTeam.manager}</span>
                    ) : (
                      <span className="text-slate-400 italic font-normal">Not Assigned</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Icon Athlete</span>
                  <span>
                    {teamPlayers.find((p) => p.is_icon) ? (
                      <span className="text-[#D97706] font-bold">⭐ {teamPlayers.find((p) => p.is_icon)?.name}</span>
                    ) : (
                      <span className="text-slate-400 italic">None Assigned</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Department</span>
                  <span className="text-slate-900 font-bold">{activeTeam.department}</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-500 font-medium">Starting Lineup</span>
                  <span className="font-bold text-slate-900 font-mono">{starting6.length} / 6 Fielded</span>
                </div>
              </div>

              <div className="p-3 rounded-md bg-[#FBF9F5] border border-slate-200 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-[#1A1A1A] flex items-center space-x-1.5 font-mono text-[11px] uppercase">
                  <Info className="w-3.5 h-3.5 text-[#1E40AF]" />
                  <span>Interactive Pitch Tip</span>
                </p>
                <p className="text-[11px]">Click on any athlete node on the turf pitch to view detailed formations &amp; player dossiers.</p>
              </div>
            </div>
          )}

          {/* Roster & Reserves */}
          <div className="bg-white border-2 border-[#1A1A1A] rounded-xl p-4 space-y-3 shadow-editorial-sm animate-slide-in-up animation-delay-150">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-black text-slate-900 uppercase tracking-wide">6v6 Squad Roster</span>
              <span className="text-slate-500 font-mono text-[11px]">{teamPlayers.length} Members ({starting6.length} Fielded)</span>
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
                    className={`w-full flex items-center justify-between p-2 rounded-md text-xs transition-all duration-150 text-left hover:translate-x-1 ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 border border-blue-300'
                        : isIcon
                        ? 'bg-amber-50/70 hover:bg-amber-50 text-amber-900 border border-amber-200'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-slate-500 font-mono text-xs w-5">#{p.jersey_number}</span>
                      <span className="truncate font-medium">{p.name}</span>
                      {isIcon && <span className="text-amber-600 text-xs shrink-0">⭐</span>}
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] text-slate-500">{p.role}</span>
                      {isIcon && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-800 border border-amber-300">
                          ICON
                        </span>
                      )}
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                          isStarter
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
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
