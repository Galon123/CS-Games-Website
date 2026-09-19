'use client'

import React, { useMemo } from 'react'
import { useTournament } from '@/context/TournamentContext'
import Link from 'next/link'

export default function MarqueeTicker() {
  const { matches, sports, leaderboards, teams } = useTournament()

  // Generate dynamic announcements derived strictly from database events
  const announcements = useMemo(() => {
    const items: Array<{
      id: string
      type: 'live' | 'upcoming' | 'result' | 'leader' | 'venue' | 'division'
      icon: string
      badgeText: string
      text: string
      link: string
      isLive?: boolean
    }> = []

    // 1. Live Matches (highest priority)
    const liveMatches = matches.filter((m) => m.status === 'live')
    liveMatches.forEach((m) => {
      const sportName = m.sport?.name || 'Tournament'
      const teamAName = m.team_a?.name || 'Team A'
      const teamBName = m.team_b?.name || 'Team B'
      const minText = m.minute ? `• ${m.minute}'` : ''
      items.push({
        id: `live-${m.id}`,
        type: 'live',
        icon: '⚽',
        badgeText: 'LIVE MATCH',
        text: `${teamAName} ${m.team_a_score} - ${m.team_b_score} ${teamBName} (${sportName} ${minText})`,
        link: '/leaderboards',
        isLive: true,
      })
    })

    // 2. Upcoming Scheduled Matches
    const upcomingMatches = matches.filter((m) => m.status === 'upcoming')
    upcomingMatches.slice(0, 4).forEach((m) => {
      const sportName = m.sport?.name || 'Event'
      const teamAName = m.team_a?.name || 'Team A'
      const teamBName = m.team_b?.name || 'Team B'
      let timeStr = ''
      if (m.scheduled_at) {
        try {
          timeStr = `at ${new Date(m.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        } catch {
          // ignore parsing error
        }
      }
      items.push({
        id: `upcoming-${m.id}`,
        type: 'upcoming',
        icon: '⏰',
        badgeText: 'UPCOMING',
        text: `${teamAName} vs ${teamBName} • ${sportName} ${timeStr}`.trim(),
        link: '/leaderboards',
      })
    })

    // 3. Recent Results
    const completedMatches = matches.filter((m) => m.status === 'completed')
    completedMatches.slice(0, 3).forEach((m) => {
      const sportName = m.sport?.name || 'Event'
      const teamAName = m.team_a?.name || 'Team A'
      const teamBName = m.team_b?.name || 'Team B'
      items.push({
        id: `result-${m.id}`,
        type: 'result',
        icon: '🏁',
        badgeText: 'FINAL',
        text: `${teamAName} ${m.team_a_score} - ${m.team_b_score} ${teamBName} (${sportName})`,
        link: '/leaderboards',
      })
    })

    // 4. Division #1 Standings Leaders
    sports.forEach((sport) => {
      const sportEntries = leaderboards
        .filter((lb) => lb.sport_id === sport.id)
        .sort((a, b) => b.points - a.points)

      if (sportEntries.length > 0) {
        const leader = sportEntries[0]
        const teamTitle = leader.team?.name || 'Contender'
        items.push({
          id: `leader-${sport.id}`,
          type: 'leader',
          icon: '👑',
          badgeText: `${sport.name.toUpperCase()} #1`,
          text: `${teamTitle} leading with ${leader.points} pts (${leader.won}W - ${leader.lost}L)`,
          link: `/leaderboards?sport=${encodeURIComponent(sport.name)}`,
        })
      }
    })

    // 5. Official Venues from active sports
    sports.filter((s) => Boolean(s.venue)).forEach((sport) => {
      items.push({
        id: `venue-${sport.id}`,
        type: 'venue',
        icon: '🏟️',
        badgeText: 'VENUE',
        text: `${sport.name} Championship arena: ${sport.venue}`,
        link: `/leaderboards?sport=${encodeURIComponent(sport.name)}`,
      })
    })

    // 6. Fallback if few items: Enrolled Divisions
    if (items.length < 3) {
      sports.forEach((sport) => {
        const teamCount = teams.filter((t) => t.sport_id === sport.id).length
        items.push({
          id: `division-${sport.id}`,
          type: 'division',
          icon: '🏅',
          badgeText: sport.name.toUpperCase(),
          text: `${teamCount} student squads registered in ${sport.type} bracket`,
          link: `/roster`,
        })
      })
    }

    return items
  }, [matches, sports, leaderboards, teams])

  if (announcements.length === 0) {
    return null
  }

  // Duplicate list to achieve continuous, seamless infinite loop
  const loopItems = [...announcements, ...announcements]

  return (
    <div
      aria-label="Live Department Tournament Marquee"
      className="relative w-full overflow-hidden bg-white border-y border-[#E5E0D8] py-2 select-none group"
    >

      {/* Scrolling Content Track */}
      <div className="flex w-max animate-marquee pause-on-hover hover:cursor-pointer items-center">
        {loopItems.map((item, index) => (
          <Link
            key={`${item.id}-${index}`}
            href={item.link}
            className={`inline-flex items-center space-x-2.5 mx-3 px-3.5 py-1 rounded-full text-xs transition-all border shrink-0 ${
              item.isLive
                ? 'bg-red-50/80 border-red-200 text-red-950 hover:bg-red-100 hover:border-red-300'
                : 'bg-slate-50 border-[#E5E0D8] text-slate-800 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            {/* Live radar ping icon or standard icon */}
            {item.isLive ? (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
              </span>
            ) : (
              <span className="text-xs shrink-0">{item.icon}</span>
            )}

            {/* Category / Status Badge */}
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded font-mono ${
                item.isLive
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {item.badgeText}
            </span>

            {/* Dynamic Event Text */}
            <span className="font-medium text-slate-900 tracking-tight text-xs whitespace-nowrap">
              {item.text}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
