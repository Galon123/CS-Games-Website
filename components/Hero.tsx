'use client'

import React from 'react'
import Link from 'next/link'
import { useTournament } from '@/context/TournamentContext'
import {
  Flame,
  Trophy,
  ArrowRight,
  Crosshair,
} from 'lucide-react'
import { getSportMeta } from '@/lib/sports-theme'

export default function Hero() {
  const { sports, matches } = useTournament()

  // Find football live match or featured match
  const footballFeatured = matches.find(
    (m) => m.sport?.name?.toLowerCase() === 'football' && (m.status === 'live' || m.status === 'upcoming')
  ) || matches[0]

  return (
    <section className="space-y-12 py-4">
      {/* Top Banner: Hero Headline + Featured Derby Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline & Action Buttons (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-neon-lime">
            <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse" />
            <span>ANNUAL CS DEPARTMENT CHAMPIONSHIP</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-ice-white leading-[1.15]">
            ENGINEERING <span className="text-neon-lime">GLORY</span> ON THE TURF & BOARD
          </h1>

          <p className="text-base text-muted-gray max-w-xl leading-relaxed">
            Where compiled algorithms meet raw athletic passion. Follow CS student squads and grandmasters competing across {sports.length} tournament divisions including {sports.slice(0, 4).map((s) => s.name).join(', ')}{sports.length > 4 ? ' and more' : ''}.
          </p>

          {/* Clean Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/tactics"
              className="flex items-center space-x-2 bg-neon-lime hover:bg-neon-lime-dark text-slate-950 px-5 py-3 rounded-xl font-bold font-mono text-xs tracking-wider transition-all"
            >
              <Crosshair className="w-4 h-4" />
              <span>FOOTBALL TACTICAL BOARD</span>
            </Link>

            <Link
              href="/leaderboards"
              className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700 text-ice-white border border-slate-700 hover:border-cyber-cyan px-5 py-3 rounded-xl font-mono text-xs font-semibold transition-all"
            >
              <Trophy className="w-4 h-4 text-cyber-cyan" />
              <span>FULL LEADERBOARDS</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Featured Derby Card (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-card border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className={`w-2 h-2 rounded-full ${footballFeatured ? 'bg-red-500 animate-ping' : 'bg-slate-600'}`} />
                <span className="font-bold text-ice-white uppercase">{footballFeatured ? 'FLAGSHIP DERBY' : 'TOURNAMENT ARENA'}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-neon-lime font-bold uppercase">
                {footballFeatured?.sport?.name || 'ALL DIVISIONS'}
              </span>
            </div>

            {/* Scoreboard Box or Clean Empty State */}
            {footballFeatured ? (
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
                {/* Team A */}
                <div className="flex flex-col items-center text-center w-5/12">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 mb-2 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={footballFeatured.team_a?.logo_url || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=128&h=128&fit=crop'}
                      alt={footballFeatured.team_a?.name || 'Team A'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-bold text-xs text-ice-white truncate max-w-[110px]">
                    {footballFeatured.team_a?.name || 'Team A'}
                  </span>
                  <span className="text-[10px] text-muted-gray truncate">{footballFeatured.team_a?.department || 'Department'}</span>
                </div>

                {/* Score Display */}
                <div className="flex flex-col items-center justify-center w-2/12">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-neon-lime">
                    {footballFeatured.team_a_score} : {footballFeatured.team_b_score}
                  </div>
                  <span className="text-[9px] font-mono text-red-400 font-bold uppercase mt-1">
                    {footballFeatured.minute ? `${footballFeatured.minute}' LIVE` : footballFeatured.status.toUpperCase()}
                  </span>
                </div>

                {/* Team B */}
                <div className="flex flex-col items-center text-center w-5/12">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 mb-2 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={footballFeatured.team_b?.logo_url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=128&h=128&fit=crop'}
                      alt={footballFeatured.team_b?.name || 'Team B'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-bold text-xs text-ice-white truncate max-w-[110px]">
                    {footballFeatured.team_b?.name || 'Team B'}
                  </span>
                  <span className="text-[10px] text-muted-gray truncate">{footballFeatured.team_b?.department || 'Department'}</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                  <Flame className="w-5 h-5 text-slate-500" />
                </div>
                <span className="font-mono text-xs font-bold text-slate-300">NO LIVE MATCHES SCHEDULED</span>
                <p className="text-[11px] text-muted-gray max-w-xs">
                  Tournament fixtures will appear here once scheduled by administrators in the Admin Console.
                </p>
                <Link
                  href="/admin"
                  className="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-neon-lime text-[11px] font-mono font-bold transition-all"
                >
                  Schedule in Admin Console →
                </Link>
              </div>
            )}

            {/* Quick Link into Tactics */}
            <Link
              href="/tactics"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-neon-lime border border-slate-800 hover:border-neon-lime/40 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>View Interactive Tactics & Formation</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tournament Sport Divisions — Responsive Auto-Fit Grid */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider">
            Tournament Divisions ({sports.length})
          </h2>
          <span className="text-xs text-muted-gray font-mono">Select a sport to view standings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sports.map((sport) => {
            const meta = getSportMeta(sport)
            const Icon = meta.icon

            return (
              <Link
                key={sport.id}
                href={meta.link}
                className={`bg-card hover:bg-card-hover border border-slate-800 ${meta.borderHoverClass} rounded-2xl p-5 transition-all group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${meta.bgBadgeClass}`}
                    >
                      {meta.badgeText}
                    </span>
                    <Icon className={`w-4 h-4 ${meta.colorClass}`} />
                  </div>
                  <h3
                    className={`font-bold text-base text-ice-white group-hover:${meta.colorClass} transition-colors`}
                  >
                    {sport.name}
                  </h3>
                  <p className="text-xs text-muted-gray mt-1 leading-relaxed">
                    {meta.description}
                  </p>
                </div>

                <div
                  className={`mt-4 text-xs font-mono ${meta.colorClass} flex items-center space-x-1 group-hover:translate-x-1 transition-transform pt-2`}
                >
                  <span>{meta.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
