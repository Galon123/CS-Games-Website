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
      {/* Top Banner: Hero Headline + Featured Match Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline & Action Buttons (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Annual Department Championship</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Athletic Excellence & Championship Spirit
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
            Follow Computer Science student squads and competitors across {sports.length} tournament divisions including {sports.slice(0, 4).map((s) => s.name).join(', ')}{sports.length > 4 ? ' and more' : ''}. Track realtime standings, team rosters, and tactical formations.
          </p>

          {/* Clean Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/tactics"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-all shadow-sm"
            >
              <Crosshair className="w-4 h-4" />
              <span>Football Tactical Pitch</span>
            </Link>

            <Link
              href="/leaderboards"
              className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 px-5 py-2.5 rounded-xl text-xs font-medium transition-all"
            >
              <Trophy className="w-4 h-4 text-slate-400" />
              <span>Tournament Standings</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Featured Match Card (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-card border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className={`w-2 h-2 rounded-full ${footballFeatured?.status === 'live' ? 'bg-red-500 animate-ping' : 'bg-blue-500'}`} />
                <span className="font-semibold text-slate-200 uppercase text-[11px] tracking-wider">
                  {footballFeatured ? 'Featured Fixture' : 'Tournament Arena'}
                </span>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {footballFeatured?.sport?.name || 'All Events'}
              </span>
            </div>

            {/* Scoreboard Box */}
            {footballFeatured ? (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
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
                  <span className="font-semibold text-xs text-slate-200 truncate max-w-[110px]">
                    {footballFeatured.team_a?.name || 'Team A'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">{footballFeatured.team_a?.department || 'Department'}</span>
                </div>

                {/* Score Display */}
                <div className="flex flex-col items-center justify-center w-2/12">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
                    {footballFeatured.team_a_score} : {footballFeatured.team_b_score}
                  </div>
                  <span className="text-[10px] font-medium text-red-400 uppercase mt-1">
                    {footballFeatured.minute ? `${footballFeatured.minute}' LIVE` : footballFeatured.status}
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
                  <span className="font-semibold text-xs text-slate-200 truncate max-w-[110px]">
                    {footballFeatured.team_b?.name || 'Team B'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">{footballFeatured.team_b?.department || 'Department'}</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2">
                <Flame className="w-6 h-6 text-slate-500" />
                <span className="text-xs font-medium text-slate-300">No live matches scheduled</span>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Fixtures will appear here once scheduled by administrators in the Admin Console.
                </p>
                <Link
                  href="/admin"
                  className="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 text-xs font-medium transition-all"
                >
                  Schedule in Admin Console →
                </Link>
              </div>
            )}

            {/* Quick Link into Tactics */}
            <Link
              href="/tactics"
              className="w-full py-2 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium flex items-center justify-center space-x-2 transition-all"
            >
              <Crosshair className="w-3.5 h-3.5 text-blue-400" />
              <span>Interactive Formation & Pitch</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tournament Sport Divisions — Responsive Grid */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
            Tournament Divisions ({sports.length})
          </h2>
          <span className="text-xs text-slate-400">Select a division to view details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sports.map((sport) => {
            const meta = getSportMeta(sport)
            const Icon = meta.icon

            return (
              <Link
                key={sport.id}
                href={meta.link}
                className="bg-card hover:bg-card-hover border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all group flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${meta.bgBadgeClass}`}
                    >
                      {meta.badgeText}
                    </span>
                    <Icon className={`w-4 h-4 ${meta.colorClass}`} />
                  </div>
                  <h3 className="font-semibold text-base text-white group-hover:text-blue-400 transition-colors">
                    {sport.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {meta.description}
                  </p>
                </div>

                <div className="mt-4 text-xs font-medium text-slate-400 group-hover:text-blue-400 flex items-center space-x-1 transition-colors pt-2 border-t border-slate-800/60">
                  <span>{meta.actionLabel}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
