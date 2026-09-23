'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { Sport, Team, Player, Match, LeaderboardEntry, MatchStatus } from '@/lib/types'
import {
  initialSports,
  initialTeams,
  initialPlayers,
  initialMatches,
  initialLeaderboards,
  FORMATION_PRESETS,
  generateTacticalCoordinates,
  TacticalOptions,
  DEFAULT_BADMINTON_CAROUSEL_IMAGES,
  DEFAULT_FOOTBALL_CAROUSEL_IMAGES,
} from '@/lib/mock-data'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface TournamentContextType {
  sports: Sport[]
  teams: Team[]
  players: Player[]
  matches: (Match & { team_a?: Team; team_b?: Team; sport?: Sport })[]
  leaderboards: (LeaderboardEntry & { team?: Team })[]
  selectedSportId: string
  setSelectedSportId: (id: string) => void
  isAdmin: boolean
  setIsAdmin: (val: boolean) => void
  isSupabaseLive: boolean
  supabaseConnected: boolean
  supabaseError: string | null
  badmintonCarouselImages: string[]
  updateBadmintonCarouselImages: (images: string[]) => Promise<void>
  resetBadmintonCarouselImages: () => Promise<void>
  footballCarouselImages: string[]
  updateFootballCarouselImages: (images: string[]) => Promise<void>
  resetFootballCarouselImages: () => Promise<void>
  refreshSupabaseData: () => Promise<void>
  updateMatchScore: (
    matchId: string,
    teamAScore: number,
    teamBScore: number,
    status?: MatchStatus,
    playerCScore?: number,
    playerDScore?: number
  ) => Promise<void>
  updateMatchSchedule: (matchId: string, scheduled_at: string, venue?: string) => Promise<void>
  updateLeaderboard: (leaderboardId: string, updates: Partial<LeaderboardEntry>) => Promise<void>
  updateTeamFormation: (teamId: string, formation: string, options?: TacticalOptions) => Promise<void>
  updatePlayerPosition: (playerId: string, position_x: number, position_y: number) => Promise<void>
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>
  updateSport: (sportId: string, updates: Partial<Sport>) => Promise<void>
  updatePlayer: (playerId: string, updates: Partial<Player>) => Promise<void>
  setIconPlayer: (teamId: string, playerId: string) => Promise<void>
  addPlayer: (playerData: Omit<Player, 'id'>) => Promise<void>
  removePlayer: (playerId: string) => Promise<void>
  addTeam: (teamData: Omit<Team, 'id'>) => Promise<Team | null>
  removeTeam: (teamId: string) => Promise<void>
  addMatch: (matchData: Omit<Match, 'id'>) => Promise<Match | null>
  removeMatch: (matchId: string) => Promise<void>
  addSport: (sportData: Omit<Sport, 'id'>) => Promise<Sport | null>
  removeSport: (sportId: string) => Promise<void>
  resetToDefaultData: () => void
  clearTemporaryData: () => void
  getSportById: (id: string) => Sport | undefined
  getTeamById: (id: string) => Team | undefined
  getPlayersByTeam: (teamId: string) => Player[]
  getPlayersBySport: (sportId: string) => Player[]
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = 'cs_sports_gaming_clean_v2'
const BADMINTON_CAROUSEL_STORAGE_KEY = 'cs_badminton_carousel_images_v1'
const FOOTBALL_CAROUSEL_STORAGE_KEY = 'cs_football_carousel_images_v1'
const ADMIN_AUTH_STORAGE_KEY = 'cs_sports_is_admin_v1'

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sports, setSports] = useState<Sport[]>(initialSports)
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [matches, setMatches] = useState<Match[]>(initialMatches)
  const [leaderboards, setLeaderboards] = useState<LeaderboardEntry[]>(initialLeaderboards)
  const [selectedSportId, setSelectedSportId] = useState<string>(initialSports[0].id)

  const [isAdmin, setIsAdminState] = useState<boolean>(false)

  // Hydration-safe initial admin state sync from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true') {
        setIsAdminState(true)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const setIsAdmin = useCallback((val: boolean) => {
    setIsAdminState(val)
    if (typeof window !== 'undefined') {
      try {
        if (val) {
          localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true')
        } else {
          localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY)
        }
      } catch (e) {
        // ignore
      }
    }
  }, [])

  const [badmintonCarouselImages, setBadmintonCarouselImages] = useState<string[]>(() => {
    const found = initialSports.find((s) => s.name.toLowerCase().includes('badminton'))
    return found?.carousel_images && found.carousel_images.length > 0
      ? found.carousel_images
      : DEFAULT_BADMINTON_CAROUSEL_IMAGES
  })

  const [footballCarouselImages, setFootballCarouselImages] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(FOOTBALL_CAROUSEL_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) return parsed
        }
      } catch (e) {
        // ignore
      }
    }
    const found = initialSports.find((s) => s.name.toLowerCase().includes('football'))
    return found?.carousel_images && found.carousel_images.length > 0
      ? found.carousel_images
      : DEFAULT_FOOTBALL_CAROUSEL_IMAGES
  })
  // Hydration-safe initial badminton carousel images sync from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(BADMINTON_CAROUSEL_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBadmintonCarouselImages(parsed)
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false)
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)

  // Fetch initial data from Supabase
  const fetchSupabaseData = useCallback(async () => {
    const isConfigured = isSupabaseConfigured()
    if (!isConfigured || !supabase) {
      setIsSupabaseLive(false)
      setSupabaseConnected(false)
      return
    }

    try {
      const [sportsRes, teamsRes, playersRes, matchesRes, leaderboardsRes] = await Promise.all([
        supabase.from('sports').select('*'),
        supabase.from('teams').select('*'),
        supabase.from('players').select('*'),
        supabase.from('matches').select('*'),
        supabase.from('leaderboards').select('*'),
      ])

      const anyError = sportsRes.error || teamsRes.error || playersRes.error || matchesRes.error || leaderboardsRes.error

      if (anyError) {
        console.warn('⚠️ Supabase returned an error during fetch:', anyError)
        if (anyError.code === '42501') {
          setSupabaseError('Permission denied (Postgres 42501). Grant permissions by running supabase/fix-permissions.sql in your Supabase SQL Editor.')
        } else {
          setSupabaseError(anyError.message)
        }
        setSupabaseConnected(false)
        setIsSupabaseLive(false)
        return
      }

      let loadedCount = 0
      if (sportsRes.data && sportsRes.data.length > 0) {
        setSports(
          sportsRes.data.map((s: any) => ({
            ...s,
            venue: s.venue || s.location || '',
          }))
        )
        loadedCount++
      }
      if (teamsRes.data) {
        setTeams(
          teamsRes.data.map((t: any) => ({
            ...t,
            manager: t.manager || t.manager_name || '',
          }))
        )
        loadedCount++
      }
      if (playersRes.data) {
        setPlayers(
          playersRes.data.map((p: any) => ({
            ...p,
            is_icon: Boolean(p.is_icon),
          }))
        )
        loadedCount++
      }
      if (matchesRes.data) { setMatches(matchesRes.data); loadedCount++ }
      if (leaderboardsRes.data) { setLeaderboards(leaderboardsRes.data); loadedCount++ }

      setSupabaseConnected(true)
      setIsSupabaseLive(true)
      setSupabaseError(null)
      console.log(`✅ Loaded live data from Supabase (${loadedCount} tables synced)`)
    } catch (err: any) {
      console.warn('Could not fetch from Supabase:', err)
      setSupabaseError(err?.message || 'Failed connecting to Supabase')
      setSupabaseConnected(false)
      setIsSupabaseLive(false)
    }
  }, [])

  // 1. Initial Load & Realtime Subscriptions
  useEffect(() => {
    const isConfigured = isSupabaseConfigured()
    const client = supabase

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('cs_sports_gaming_state_v1')
      } catch (e) {
        // ignore
      }
    }

    if (isConfigured && client) {
      fetchSupabaseData()

      // Realtime Subscriptions
      const matchChannel = client
        .channel('realtime:matches')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'matches' },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const updatedMatch = payload.new as Match
              setMatches((prev) => {
                const idx = prev.findIndex((m) => m.id === updatedMatch.id)
                if (idx >= 0) {
                  const copy = [...prev]
                  copy[idx] = { ...copy[idx], ...updatedMatch }
                  return copy
                }
                return [updatedMatch, ...prev]
              })
            } else if (payload.eventType === 'DELETE') {
              setMatches((prev) => prev.filter((m) => m.id !== (payload.old as { id: string }).id))
            }
          }
        )
        .subscribe()

      const lbChannel = client
        .channel('realtime:leaderboards')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'leaderboards' },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const updatedEntry = payload.new as LeaderboardEntry
              setLeaderboards((prev) => {
                const idx = prev.findIndex((l) => l.id === updatedEntry.id)
                if (idx >= 0) {
                  const copy = [...prev]
                  copy[idx] = { ...copy[idx], ...updatedEntry }
                  return copy
                }
                return [...prev, updatedEntry]
              })
            } else if (payload.eventType === 'DELETE') {
              const deletedId = (payload.old as { id: string }).id
              setLeaderboards((prev) => prev.filter((l) => l.id !== deletedId))
            }
          }
        )
        .subscribe()

      const teamChannel = client
        .channel('realtime:teams')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'teams' },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const rawTeam = payload.new as any
              const updatedTeam: Team = {
                ...rawTeam,
                manager: rawTeam.manager || rawTeam.manager_name || '',
              }
              setTeams((prev) => {
                const idx = prev.findIndex((t) => t.id === updatedTeam.id)
                if (idx >= 0) {
                  const copy = [...prev]
                  copy[idx] = { ...copy[idx], ...updatedTeam }
                  return copy
                }
                return [...prev, updatedTeam]
              })
            } else if (payload.eventType === 'DELETE') {
              const deletedId = (payload.old as { id: string }).id
              setTeams((prev) => prev.filter((t) => t.id !== deletedId))
              setPlayers((prev) => prev.filter((p) => p.team_id !== deletedId))
              setMatches((prev) => prev.filter((m) => m.team_a_id !== deletedId && m.team_b_id !== deletedId))
              setLeaderboards((prev) => prev.filter((l) => l.team_id !== deletedId))
            }
          }
        )
        .subscribe()

      const sportChannel = client
        .channel('realtime:sports')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sports' },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const rawSport = payload.new as any
              const updatedSport: Sport = {
                ...rawSport,
                venue: rawSport.venue || rawSport.location || '',
              }
              setSports((prev) => {
                const idx = prev.findIndex((s) => s.id === updatedSport.id)
                if (idx >= 0) {
                  const copy = [...prev]
                  copy[idx] = { ...copy[idx], ...updatedSport }
                  return copy
                }
                return [...prev, updatedSport]
              })
            } else if (payload.eventType === 'DELETE') {
              const deletedId = (payload.old as { id: string }).id
              setSports((prev) => prev.filter((s) => s.id !== deletedId))
              setTeams((prev) => prev.filter((t) => t.sport_id !== deletedId))
              setMatches((prev) => prev.filter((m) => m.sport_id !== deletedId))
              setLeaderboards((prev) => prev.filter((l) => l.sport_id !== deletedId))
            }
          }
        )
        .subscribe()

      const playerChannel = client
        .channel('realtime:players')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'players' },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const rawPlayer = payload.new as any
              const updatedPlayer: Player = {
                ...rawPlayer,
                is_icon: Boolean(rawPlayer.is_icon),
              }
              setPlayers((prev) => {
                const idx = prev.findIndex((p) => p.id === updatedPlayer.id)
                if (idx >= 0) {
                  const copy = [...prev]
                  copy[idx] = { ...copy[idx], ...updatedPlayer }
                  return copy
                }
                return [...prev, updatedPlayer]
              })
            } else if (payload.eventType === 'DELETE') {
              setPlayers((prev) => prev.filter((p) => p.id !== (payload.old as { id: string }).id))
            }
          }
        )
        .subscribe()

      return () => {
        client.removeChannel(matchChannel)
        client.removeChannel(lbChannel)
        client.removeChannel(teamChannel)
        client.removeChannel(playerChannel)
        client.removeChannel(sportChannel)
      }
    } else {
      // Fallback: Check localStorage to remember user's local edits
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.sports) setSports(parsed.sports)
          if (parsed.teams) setTeams(parsed.teams)
          if (parsed.players) setPlayers(parsed.players)
          if (parsed.matches) setMatches(parsed.matches)
          if (parsed.leaderboards) setLeaderboards(parsed.leaderboards)
        }
      } catch (e) {
        console.warn('LocalStorage unavailable:', e)
      }
    }
  }, [fetchSupabaseData])

  // Save to localStorage when state updates (fallback mode)
  useEffect(() => {
    if (!isSupabaseConfigured() && typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ sports, teams, players, matches, leaderboards })
        )
      } catch (e) {
        console.warn('Failed saving state to localStorage', e)
      }
    }
  }, [sports, teams, players, matches, leaderboards])

  // Helper getters
  const getSportById = useCallback((id: string) => sports.find((s) => s.id === id), [sports])
  const getTeamById = useCallback((id: string) => teams.find((t) => t.id === id), [teams])
  const getPlayersByTeam = useCallback((teamId: string) => players.filter((p) => p.team_id === teamId), [players])
  const getPlayersBySport = useCallback(
    (sportId: string) => {
      const sportTeamIds = new Set(teams.filter((t) => t.sport_id === sportId).map((t) => t.id))
      return players.filter((p) => p.sport_id === sportId || (p.team_id && sportTeamIds.has(p.team_id)))
    },
    [players, teams]
  )

  // Realtime & Local mutations
  const updateMatchScore = useCallback(
    async (
      matchId: string,
      teamAScore: number,
      teamBScore: number,
      status?: MatchStatus,
      playerCScore?: number,
      playerDScore?: number
    ) => {
      if (!isAdmin) {
        console.warn('Unauthorized: Match scores can only be modified by an Admin.')
        return
      }

      // 1. Optimistic local state update
      setMatches((prev) =>
        prev.map((m) => {
          if (m.id === matchId) {
            return {
              ...m,
              team_a_score: teamAScore,
              team_b_score: teamBScore,
              player_c_score: playerCScore !== undefined ? playerCScore : m.player_c_score,
              player_d_score: playerDScore !== undefined ? playerDScore : m.player_d_score,
              status: status ?? m.status,
            }
          }
          return m
        })
      )

      // 2. Persist to Supabase
      if (isSupabaseConfigured() && supabase) {
        const payload: Record<string, unknown> = {
          team_a_score: teamAScore,
          team_b_score: teamBScore,
        }
        if (playerCScore !== undefined) payload.player_c_score = playerCScore
        if (playerDScore !== undefined) payload.player_d_score = playerDScore
        if (status) payload.status = status

        let { error } = await supabase.from('matches').update(payload).eq('id', matchId)
        if (error && (error.code === 'PGRST204' || error.message?.includes('column'))) {
          console.warn('⚠️ Supabase schema missing player_c_score/player_d_score, retrying without extended columns')
          const fallbackPayload: Record<string, unknown> = {
            team_a_score: teamAScore,
            team_b_score: teamBScore,
          }
          if (status) fallbackPayload.status = status
          const retry = await supabase.from('matches').update(fallbackPayload).eq('id', matchId)
          error = retry.error
        }
        if (error) {
          console.error('❌ Supabase updateMatchScore failed:', error)
          setSupabaseError(`Failed updating match: ${error.message} (${error.code})`)
        } else {
          console.log('✅ Supabase updateMatchScore succeeded for match:', matchId)
          setSupabaseError(null)
        }
      }
    },
    [isAdmin]
  )

  const updateMatchSchedule = useCallback(
    async (matchId: string, scheduled_at: string, venue?: string) => {
      if (!isAdmin) {
        console.warn('Unauthorized: Match schedules can only be modified by an Admin.')
        return
      }

      // 1. Optimistic local state update
      setMatches((prev) =>
        prev.map((m) => {
          if (m.id === matchId) {
            return {
              ...m,
              scheduled_at,
              venue: venue !== undefined ? venue : m.venue,
            }
          }
          return m
        })
      )

      // 2. Persist to Supabase
      if (isSupabaseConfigured() && supabase) {
        const payload: Record<string, unknown> = { scheduled_at }
        if (venue !== undefined) payload.venue = venue

        let { error } = await supabase.from('matches').update(payload).eq('id', matchId)
        if (error && error.code === 'PGRST204' && payload.venue !== undefined) {
          const { venue: _v, ...rest } = payload
          const retry = await supabase.from('matches').update(rest).eq('id', matchId)
          error = retry.error
        }

        if (error) {
          console.error('❌ Supabase updateMatchSchedule failed:', error)
          setSupabaseError(`Failed updating match schedule: ${error.message} (${error.code})`)
        } else {
          console.log('✅ Supabase updateMatchSchedule succeeded for match:', matchId)
          setSupabaseError(null)
        }
      }
    },
    [isAdmin]
  )

  const updateLeaderboard = useCallback(
    async (leaderboardId: string, updates: Partial<LeaderboardEntry>) => {
      // 1. Optimistic local state update
      setLeaderboards((prev) =>
        prev.map((entry) => {
          if (entry.id === leaderboardId) {
            return { ...entry, ...updates }
          }
          return entry
        })
      )

      // 2. Persist to Supabase
      if (isSupabaseConfigured() && supabase) {
        const { team, rank, rankChange, goalDifference, ...cleanUpdates } = updates as any
        const { error } = await supabase.from('leaderboards').update(cleanUpdates).eq('id', leaderboardId)
        if (error) {
          console.error('❌ Supabase updateLeaderboard failed:', error)
          setSupabaseError(`Failed updating leaderboard: ${error.message} (${error.code})`)
        } else {
          console.log('✅ Supabase updateLeaderboard succeeded for leaderboard:', leaderboardId)
          setSupabaseError(null)
        }
      }
    },
    []
  )

  const updateTeamFormation = useCallback(
    async (teamId: string, formation: string, options?: TacticalOptions) => {
      if (!isAdmin) {
        console.warn('Unauthorized: Team formations are absolute and can only be modified by an Admin.')
        return
      }

      // Update team formation in local state
      setTeams((prev) =>
        prev.map((t) => (t.id === teamId ? { ...t, formation } : t))
      )

      // Dynamically calculate pitch coordinates for any formation or preset
      const coords = generateTacticalCoordinates(formation, options)
      let updatedTeamPlayers: Player[] = []

      if (coords && coords.length > 0) {
        setPlayers((prev) => {
          const teamPlayers = prev.filter((p) => p.team_id === teamId)
          const otherPlayers = prev.filter((p) => p.team_id !== teamId)

          updatedTeamPlayers = teamPlayers.map((player, index) => {
            if (index < coords.length) {
              return {
                ...player,
                role: coords[index].role,
                position_x: coords[index].x,
                position_y: coords[index].y,
              }
            }
            return player
          })

          return [...otherPlayers, ...updatedTeamPlayers]
        })
      }

      // Persist formation & player positions to Supabase
      if (isSupabaseConfigured() && supabase) {
        const { error: teamErr } = await supabase.from('teams').update({ formation }).eq('id', teamId)
        if (teamErr) {
          console.error('❌ Supabase updateTeamFormation failed:', teamErr)
          setSupabaseError(`Failed updating team formation: ${teamErr.message} (${teamErr.code})`)
        } else {
          console.log('✅ Supabase updateTeamFormation succeeded for team:', teamId)
          setSupabaseError(null)
        }

        // Persist newly computed coordinates for all players of this team
        if (updatedTeamPlayers.length > 0) {
          for (const p of updatedTeamPlayers) {
            await supabase.from('players').update({
              role: p.role,
              position_x: p.position_x,
              position_y: p.position_y,
            }).eq('id', p.id)
          }
          console.log('✅ Supabase updated player coordinates for formation', formation)
        }
      }
    },
    [isAdmin]
  )

  const updatePlayerPosition = useCallback(
    async (playerId: string, position_x: number, position_y: number) => {
      if (!isAdmin) {
        console.warn('Unauthorized: Player positions are absolute and can only be modified by an Admin.')
        return
      }

      setPlayers((prev) =>
        prev.map((p) =>
          p.id === playerId ? { ...p, position_x, position_y } : p
        )
      )

      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('players')
          .update({ position_x, position_y })
          .eq('id', playerId)
        if (error) {
          console.error('❌ Supabase updatePlayerPosition failed:', error)
          setSupabaseError(`Failed updating player position: ${error.message}`)
        } else {
          setSupabaseError(null)
        }
      }
    },
    [isAdmin]
  )

  const updateTeam = useCallback(
    async (teamId: string, updates: Partial<Team>) => {
      setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, ...updates } : t)))

      if (isSupabaseConfigured() && supabase) {
        let { error } = await supabase.from('teams').update(updates).eq('id', teamId)
        if (error && error.code === 'PGRST204' && (updates as any).manager !== undefined) {
          console.warn('⚠️ Supabase missing manager column on teams update, retrying without manager')
          const { manager, ...rest } = updates as any
          if (Object.keys(rest).length > 0) {
            const retry = await supabase.from('teams').update(rest).eq('id', teamId)
            error = retry.error
          } else {
            error = null
          }
        }
        if (error) {
          console.error('❌ Supabase updateTeam failed:', error)
          setSupabaseError(`Failed updating team: ${error.message} (${error.code})`)
        } else {
          console.log('✅ Supabase updateTeam succeeded for id:', teamId)
          setSupabaseError(null)
        }
      }
    },
    []
  )

  const updateSport = useCallback(
    async (sportId: string, updates: Partial<Sport>) => {
      setSports((prev) => prev.map((s) => (s.id === sportId ? { ...s, ...updates } : s)))

      if (updates.carousel_images && updates.name?.toLowerCase().includes('badminton')) {
        setBadmintonCarouselImages(updates.carousel_images)
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(BADMINTON_CAROUSEL_STORAGE_KEY, JSON.stringify(updates.carousel_images))
          } catch (e) {
            // ignore
          }
        }
      }

      if (isSupabaseConfigured() && supabase) {
        const { icon, carousel_images, ...cleanUpdates } = updates as any
        let { error } = await supabase.from('sports').update(cleanUpdates).eq('id', sportId)
        if (error && error.code === 'PGRST204' && cleanUpdates.venue !== undefined) {
          console.warn('⚠️ Supabase missing venue column on sports update, retrying without venue')
          const { venue, ...rest } = cleanUpdates
          if (Object.keys(rest).length > 0) {
            const retry = await supabase.from('sports').update(rest).eq('id', sportId)
            error = retry.error
          } else {
            error = null
          }
        }
        if (error) {
          console.error('❌ Supabase updateSport failed:', error)
          setSupabaseError(`Failed updating sport: ${error.message} (${error.code})`)
        } else {
          console.log('✅ Supabase updateSport succeeded for id:', sportId)
          setSupabaseError(null)
        }

        // Try syncing carousel_images if provided (won't throw fatal error if column missing)
        if (carousel_images) {
          try {
            await supabase.from('sports').update({ carousel_images } as any).eq('id', sportId)
          } catch (e) {
            // column might not exist, silently ignore
          }
        }
      }
    },
    []
  )

  const updateBadmintonCarouselImages = useCallback(
    async (images: string[]) => {
      setBadmintonCarouselImages(images)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(BADMINTON_CAROUSEL_STORAGE_KEY, JSON.stringify(images))
        } catch (e) {
          console.warn('Failed saving badminton carousel images to localStorage', e)
        }
      }

      setSports((prev) =>
        prev.map((s) =>
          s.name.toLowerCase().includes('badminton') ? { ...s, carousel_images: images } : s
        )
      )

      if (isSupabaseConfigured() && supabase) {
        try {
          const badmintonSport = sports.find((s) => s.name.toLowerCase().includes('badminton'))
          if (badmintonSport) {
            await supabase
              .from('sports')
              .update({ carousel_images: images } as any)
              .eq('id', badmintonSport.id)
          }
        } catch (e) {
          // Ignore if column doesn't exist
        }
      }
    },
    [sports]
  )

  const resetBadmintonCarouselImages = useCallback(async () => {
    await updateBadmintonCarouselImages(DEFAULT_BADMINTON_CAROUSEL_IMAGES)
  }, [updateBadmintonCarouselImages])

  const updateFootballCarouselImages = useCallback(
    async (images: string[]) => {
      setFootballCarouselImages(images)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(FOOTBALL_CAROUSEL_STORAGE_KEY, JSON.stringify(images))
        } catch (e) {
          console.warn('Failed saving football carousel images to localStorage', e)
        }
      }

      setSports((prev) =>
        prev.map((s) =>
          s.name.toLowerCase().includes('football') ? { ...s, carousel_images: images } : s
        )
      )

      if (isSupabaseConfigured() && supabase) {
        try {
          const footballSport = sports.find((s) => s.name.toLowerCase().includes('football'))
          if (footballSport) {
            await supabase
              .from('sports')
              .update({ carousel_images: images } as any)
              .eq('id', footballSport.id)
          }
        } catch (e) {
          // Ignore if column doesn't exist
        }
      }
    },
    [sports]
  )

  const resetFootballCarouselImages = useCallback(async () => {
    await updateFootballCarouselImages(DEFAULT_FOOTBALL_CAROUSEL_IMAGES)
  }, [updateFootballCarouselImages])

  const updatePlayer = useCallback(
    async (playerId: string, updates: Partial<Player>) => {
      setPlayers((prev) => prev.map((p) => (p.id === playerId ? { ...p, ...updates } : p)))

      if (isSupabaseConfigured() && supabase) {
        const { stats, ...cleanUpdates } = updates as any
        let { error } = await supabase.from('players').update(cleanUpdates).eq('id', playerId)
        if (error && error.code === 'PGRST204' && cleanUpdates.is_icon !== undefined) {
          console.warn('⚠️ Supabase missing is_icon column on players update, retrying without is_icon')
          const { is_icon, ...rest } = cleanUpdates
          if (Object.keys(rest).length > 0) {
            const retry = await supabase.from('players').update(rest).eq('id', playerId)
            error = retry.error
          } else {
            error = null
          }
        }
        if (error) {
          console.error('❌ Supabase updatePlayer failed:', error)
          setSupabaseError(`Failed updating player: ${error.message} (${error.code})`)
        } else {
          console.log('✅ Supabase updatePlayer succeeded for id:', playerId)
          setSupabaseError(null)
        }
      }
    },
    []
  )

  const setIconPlayer = useCallback(
    async (teamId: string, playerId: string) => {
      // Exactly ONE icon player per team
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.team_id === teamId) {
            return {
              ...p,
              is_icon: p.id === playerId,
            }
          }
          return p
        })
      )

      if (isSupabaseConfigured() && supabase) {
        try {
          // Unset any previous icon players in this team
          const clearRes = await supabase.from('players').update({ is_icon: false }).eq('team_id', teamId)
          if (clearRes.error && clearRes.error.code === 'PGRST204') {
            console.warn('⚠️ is_icon column missing in Supabase schema cache, skipping Supabase persistence for is_icon')
            return
          }
          // Set the designated icon player
          const setRes = await supabase.from('players').update({ is_icon: true }).eq('id', playerId)
          if (setRes.error && setRes.error.code !== 'PGRST204') {
            console.error('❌ Supabase setIconPlayer failed:', setRes.error)
            setSupabaseError(`Failed updating icon player: ${setRes.error.message}`)
          } else {
            console.log(`✅ Supabase setIconPlayer succeeded for player ${playerId} on team ${teamId}`)
            setSupabaseError(null)
          }
        } catch (err: any) {
          console.warn('setIconPlayer error:', err)
        }
      }
    },
    []
  )

  const addPlayer = useCallback(
    async (playerData: Omit<Player, 'id'>) => {
      const tempId = 'p_' + Math.random().toString(36).substring(2, 9)
      const newPlayer: Player = {
        ...playerData,
        id: tempId,
      }

      setPlayers((prev) => [...prev, newPlayer])

      // If player has no team but belongs to a sport, create initial leaderboard entry
      if (!playerData.team_id && playerData.sport_id) {
        const tempLbId = 'lb_' + Math.random().toString(36).substring(2, 9)
        const initialLbEntry: LeaderboardEntry = {
          id: tempLbId,
          sport_id: playerData.sport_id,
          player_id: tempId,
          team_id: null,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          points: 0,
          rank: 1,
          rankChange: 'same',
        }
        setLeaderboards((prev) => [...prev, initialLbEntry])
      }

      if (isSupabaseConfigured() && supabase) {
        // Explicitly remove stats (and non-table columns) from player payload during insert
        const { stats, ...playerInsertData } = playerData as any
        let { data, error } = await supabase.from('players').insert([playerInsertData]).select()

        // Fallback retry if columns like sport_id, department, or is_icon aren't in schema yet
        if (error && (error.code === 'PGRST204' || error.message?.includes('column'))) {
          console.warn('⚠️ Supabase schema missing extended columns on players, retrying with compatible payload')
          const { sport_id: _s, department: _d, is_icon: _i, ...fallbackData } = playerInsertData
          const retry = await supabase.from('players').insert([fallbackData]).select()
          data = retry.data
          error = retry.error
        }

        if (error) {
          console.error('❌ Supabase addPlayer failed:', error)
          setSupabaseError(`Failed adding player: ${error.message} (${error.code})`)
        } else if (data && data[0]) {
          const inserted = data[0] as Player
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === tempId
                ? {
                    ...inserted,
                    sport_id: playerData.sport_id,
                    department: playerData.department,
                    is_icon: Boolean(playerData.is_icon),
                  }
                : p
            )
          )

          // Also insert leaderboard entry for teamless player if needed
          if (!playerData.team_id && playerData.sport_id) {
            try {
              await supabase.from('leaderboards').insert([
                {
                  sport_id: playerData.sport_id,
                  player_id: inserted.id,
                  played: 0,
                  won: 0,
                  drawn: 0,
                  lost: 0,
                  points: 0,
                },
              ])
            } catch (lbErr) {
              console.warn('Leaderboard entry insert skipped for player:', lbErr)
            }
          }

          console.log('✅ Supabase addPlayer succeeded with id:', inserted.id)
          setSupabaseError(null)
        }
      }
    },
    []
  )

  const removePlayer = useCallback(
    async (playerId: string) => {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId))
      setLeaderboards((prev) => prev.filter((l) => l.player_id !== playerId))
      setMatches((prev) => prev.filter((m) => m.player_a_id !== playerId && m.player_b_id !== playerId))

      if (isSupabaseConfigured() && supabase) {
        await Promise.allSettled([
          supabase.from('matches').delete().or(`player_a_id.eq.${playerId},player_b_id.eq.${playerId}`),
          supabase.from('leaderboards').delete().eq('player_id', playerId),
        ])

        const { error } = await supabase.from('players').delete().eq('id', playerId)
        if (error) {
          console.error('❌ Supabase removePlayer failed:', error)
          setSupabaseError(`Failed removing player: ${error.message} (${error.code})`)
        } else {
          console.log('✅ Supabase removePlayer succeeded for id:', playerId)
          setSupabaseError(null)
        }
      }
    },
    []
  )

  const addSport = useCallback(
    async (sportData: Omit<Sport, 'id'>): Promise<Sport | null> => {
      const tempId = 's_' + Math.random().toString(36).substring(2, 9)
      const newSport: Sport = {
        ...sportData,
        id: tempId,
      }

      setSports((prev) => [...prev, newSport])

      if (isSupabaseConfigured() && supabase) {
        const { icon, ...sportInsertData } = sportData as any
        let { data, error } = await supabase.from('sports').insert([sportInsertData]).select()
        if (error && error.code === 'PGRST204' && (sportInsertData.venue !== undefined || sportInsertData.image_url !== undefined)) {
          console.warn('⚠️ Supabase schema missing venue/image_url, retrying insert')
          const { venue, image_url, ...fallbackData } = sportInsertData
          const retry = await supabase.from('sports').insert([fallbackData]).select()
          data = retry.data
          error = retry.error
        }

        if (error) {
          console.error('❌ Supabase addSport failed:', error)
          setSupabaseError(`Failed adding sport: ${error.message} (${error.code})`)
          return newSport
        } else if (data && data[0]) {
          const inserted = data[0] as Sport
          setSports((prev) => prev.map((s) => (s.id === tempId ? { ...inserted, venue: sportData.venue || '' } : s)))
          console.log('✅ Supabase addSport succeeded with id:', inserted.id)
          setSupabaseError(null)
          return inserted
        }
      }
      return newSport
    },
    []
  )

  const removeSport = useCallback(
    async (sportId: string) => {
      setSports((prev) => prev.filter((s) => s.id !== sportId))
      setTeams((prev) => prev.filter((t) => t.sport_id !== sportId))
      setMatches((prev) => prev.filter((m) => m.sport_id !== sportId))
      setLeaderboards((prev) => prev.filter((l) => l.sport_id !== sportId))

      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.from('sports').delete().eq('id', sportId)
        if (error) {
          console.error('❌ Supabase removeSport failed:', error)
          setSupabaseError(`Failed removing sport: ${error.message} (${error.code})`)
        } else {
          console.log('✅ Supabase removeSport succeeded for id:', sportId)
          setSupabaseError(null)
        }
      }
    },
    []
  )

  const addTeam = useCallback(
    async (teamData: Omit<Team, 'id'>): Promise<Team | null> => {
      const tempTeamId = 't_' + Math.random().toString(36).substring(2, 9)
      const tempLbId = 'lb_' + Math.random().toString(36).substring(2, 9)

      const newTeam: Team = {
        ...teamData,
        id: tempTeamId,
      }

      const initialLbEntry: LeaderboardEntry = {
        id: tempLbId,
        sport_id: teamData.sport_id,
        team_id: tempTeamId,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        points: 0,
        rank: 1,
        rankChange: 'same',
      }

      setTeams((prev) => [...prev, newTeam])
      setLeaderboards((prev) => [...prev, initialLbEntry])

      if (isSupabaseConfigured() && supabase) {
        let { data: teamResData, error: teamErr } = await supabase
          .from('teams')
          .insert([teamData])
          .select()

        if (teamErr && teamErr.code === 'PGRST204' && (teamData as any).manager !== undefined) {
          console.warn('⚠️ Supabase schema missing manager column, retrying insert without manager')
          const { manager, ...fallbackData } = teamData as any
          const retry = await supabase.from('teams').insert([fallbackData]).select()
          teamResData = retry.data
          teamErr = retry.error
        }

        if (teamErr) {
          console.error('❌ Supabase addTeam failed:', teamErr)
          setSupabaseError(`Failed adding team: ${teamErr.message} (${teamErr.code})`)
          return newTeam
        }

        if (teamResData && teamResData[0]) {
          const insertedTeam = teamResData[0] as Team
          setTeams((prev) => prev.map((t) => (t.id === tempTeamId ? { ...insertedTeam, manager: teamData.manager || '' } : t)))

          // Create initial leaderboard entry for this team in Supabase
          const { data: lbData, error: lbErr } = await supabase
            .from('leaderboards')
            .insert([
              {
                sport_id: teamData.sport_id,
                team_id: insertedTeam.id,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                points: 0,
              },
            ])
            .select()

          if (!lbErr && lbData && lbData[0]) {
            const insertedLb = lbData[0] as LeaderboardEntry
            setLeaderboards((prev) =>
              prev.map((l) => (l.id === tempLbId ? { ...insertedLb, rank: 1, rankChange: 'same' } : l))
            )
          } else {
            setLeaderboards((prev) =>
              prev.map((l) => (l.id === tempLbId ? { ...l, team_id: insertedTeam.id } : l))
            )
          }

          console.log('✅ Supabase addTeam succeeded with id:', insertedTeam.id)
          setSupabaseError(null)
          return insertedTeam
        }
      }

      return newTeam
    },
    []
  )

  const removeTeam = useCallback(
    async (teamId: string) => {
      setTeams((prev) => prev.filter((t) => t.id !== teamId))
      setPlayers((prev) => prev.filter((p) => p.team_id !== teamId))
      setMatches((prev) => prev.filter((m) => m.team_a_id !== teamId && m.team_b_id !== teamId))
      setLeaderboards((prev) => prev.filter((l) => l.team_id !== teamId))

      if (isSupabaseConfigured() && supabase) {
        await Promise.allSettled([
          supabase.from('matches').delete().or(`team_a_id.eq.${teamId},team_b_id.eq.${teamId}`),
          supabase.from('players').delete().eq('team_id', teamId),
          supabase.from('leaderboards').delete().eq('team_id', teamId),
        ])

        const { error } = await supabase.from('teams').delete().eq('id', teamId)
        if (error) {
          console.error('❌ Supabase removeTeam failed:', error)
          setSupabaseError(`Failed removing team: ${error.message} (${error.code})`)
        } else {
          console.log('✅ Supabase removeTeam succeeded for id:', teamId)
          setSupabaseError(null)
        }
      }
    },
    []
  )

  const addMatch = useCallback(
    async (matchData: Omit<Match, 'id'>): Promise<Match | null> => {
      if (!isAdmin) {
        console.warn('Unauthorized: Match fixtures can only be added by an Admin.')
        return null
      }

      const tempId = 'm_' + Math.random().toString(36).substring(2, 9)
      const newMatch: Match = {
        ...matchData,
        id: tempId,
      }

      setMatches((prev) => [newMatch, ...prev])

      if (isSupabaseConfigured() && supabase) {
        // Strip client-only or joined fields before Supabase insert
        const { team_a, team_b, player_a, player_b, player_c, player_d, sport, minute, participants, ...matchInsertData } = matchData as any
        let { data, error } = await supabase.from('matches').insert([matchInsertData]).select()
        if (error && (error.code === 'PGRST204' || error.message?.includes('column'))) {
          console.warn('⚠️ Supabase missing extended columns on matches, retrying with fallback')
          const { venue: _v, is_free_for_all: _ffa, is_quad: _iq, player_a_id: _pa, player_b_id: _pb, player_c_id: _pc, player_d_id: _pd, player_c_score: _pcs, player_d_score: _pds, ...rest } = matchInsertData
          const retry = await supabase.from('matches').insert([rest]).select()
          data = retry.data
          error = retry.error
        }
        if (error) {
          console.error('❌ Supabase addMatch failed:', error)
          setSupabaseError(`Failed adding match: ${error.message} (${error.code})`)
          return newMatch
        } else if (data && data[0]) {
          const inserted = data[0] as Match
          setMatches((prev) =>
            prev.map((m) =>
              m.id === tempId
                ? {
                    ...inserted,
                    minute: matchData.minute,
                    venue: matchData.venue,
                    is_free_for_all: matchData.is_free_for_all,
                    is_quad: matchData.is_quad,
                    player_a_id: matchData.player_a_id,
                    player_b_id: matchData.player_b_id,
                    player_c_id: matchData.player_c_id,
                    player_d_id: matchData.player_d_id,
                    team_a_score: matchData.team_a_score,
                    team_b_score: matchData.team_b_score,
                    player_c_score: matchData.player_c_score,
                    player_d_score: matchData.player_d_score,
                    player_a: matchData.player_a,
                    player_b: matchData.player_b,
                    player_c: matchData.player_c,
                    player_d: matchData.player_d,
                    team_a: matchData.team_a,
                    team_b: matchData.team_b,
                    sport: matchData.sport,
                  }
                : m
            )
          )
          console.log('✅ Supabase addMatch succeeded with id:', inserted.id)
          setSupabaseError(null)
          return inserted
        }
      }
      return newMatch
    },
    [isAdmin]
  )

  const removeMatch = useCallback(
    async (matchId: string) => {
      if (!isAdmin) {
        console.warn('Unauthorized: Match fixtures can only be removed by an Admin.')
        return
      }

      setMatches((prev) => prev.filter((m) => m.id !== matchId))

      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.from('matches').delete().eq('id', matchId)
        if (error) {
          console.error('❌ Supabase removeMatch failed:', error)
          setSupabaseError(`Failed removing match: ${error.message} (${error.code})`)
        } else {
          console.log('✅ Supabase removeMatch succeeded for id:', matchId)
          setSupabaseError(null)
        }
      }
    },
    [isAdmin]
  )

  const resetToDefaultData = useCallback(() => {
    setSports(initialSports)
    setTeams(initialTeams)
    setPlayers(initialPlayers)
    setMatches(initialMatches)
    setLeaderboards(initialLeaderboards)
    setSupabaseError(null)
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        sessionStorage.clear()
      } catch (e) {
        // ignore
      }
    }
  }, [])

  const clearTemporaryData = useCallback(() => {
    resetToDefaultData()
    if (isSupabaseConfigured()) {
      fetchSupabaseData()
    }
  }, [resetToDefaultData, fetchSupabaseData])

  // Enriched matches with team/player objects and Free-For-All / Quad participant list
  const enrichedMatches = useMemo(() => {
    return matches.map((m) => {
      const sport = sports.find((s) => s.id === m.sport_id)
      const sportTeams = teams.filter((t) => t.sport_id === m.sport_id)
      const isCarrom = sport?.name?.toLowerCase().includes('carrom')
      const isQuad = Boolean(m.is_quad) || sport?.type === 'quad' || (isCarrom && Boolean(m.player_c_id || m.player_d_id || (sport?.type !== 'duo' && sport?.type !== 'team')))
      const isFfa = (sport?.type === 'free_for_all' || Boolean(m.is_free_for_all)) && !isQuad

      const sportTeamIds = new Set(sportTeams.map((t) => t.id))
      const sportPlayers = players.filter(
        (p) => p.sport_id === m.sport_id || (p.team_id && sportTeamIds.has(p.team_id))
      )

      const playerA = m.player_a_id ? players.find((p) => p.id === m.player_a_id) : undefined
      const playerB = m.player_b_id ? players.find((p) => p.id === m.player_b_id) : undefined
      const playerC = m.player_c_id ? players.find((p) => p.id === m.player_c_id) : undefined
      const playerD = m.player_d_id ? players.find((p) => p.id === m.player_d_id) : undefined

      let teamA = teams.find((t) => t.id === m.team_a_id)
      let teamB = teams.find((t) => t.id === m.team_b_id)

      // If teamA doesn't exist but playerA does, synthesize teamA so components render cleanly
      if (!teamA && playerA) {
        teamA = {
          id: playerA.id,
          name: playerA.name,
          department: playerA.department || 'Computer Science & Engineering',
          sport_id: m.sport_id,
          logo_url: playerA.photo_url,
        }
      }

      // If teamB doesn't exist but playerB does, synthesize teamB
      if (!teamB && playerB) {
        teamB = {
          id: playerB.id,
          name: playerB.name,
          department: playerB.department || 'Computer Science & Engineering',
          sport_id: m.sport_id,
          logo_url: playerB.photo_url,
        }
      }

      // Participants for Free For All or Quad
      let participants: Team[] | undefined = undefined
      if (isFfa) {
        if (sportPlayers.length > 0) {
          participants = sportPlayers.map((p) => ({
            id: p.id,
            name: p.name,
            department: p.department || 'Computer Science & Engineering',
            sport_id: m.sport_id,
            logo_url: p.photo_url,
          }))
        } else {
          participants = sportTeams
        }
      }

      return {
        ...m,
        is_free_for_all: isFfa,
        is_quad: isQuad,
        player_a_id: m.player_a_id,
        player_b_id: m.player_b_id,
        player_c_id: m.player_c_id,
        player_d_id: m.player_d_id,
        player_a: playerA,
        player_b: playerB,
        player_c: playerC,
        player_d: playerD,
        team_a: teamA,
        team_b: teamB,
        participants,
        sport,
      }
    })
  }, [matches, teams, players, sports])

  // Enriched and sorted leaderboards with rank calculation
  const enrichedLeaderboards = useMemo(() => {
    return leaderboards
      .map((entry) => {
        // Resolve team
        let team = entry.team_id ? teams.find((t) => t.id === entry.team_id) : undefined

        // Resolve player — prefer explicit player_id link
        const player = entry.player_id
          ? players.find((p) => p.id === entry.player_id)
          : undefined

        // Synthesize a virtual "team" object from player data for solo/FFA entries
        if (!team && player) {
          team = {
            id: player.id,
            name: player.name,
            department: player.department || 'Computer Science & Engineering',
            sport_id: entry.sport_id,
            logo_url: player.photo_url,
          }
        }

        return {
          ...entry,
          team,
          player,
        }
      })
      // Drop orphaned entries where neither a team nor a player could be resolved
      .filter((entry) => Boolean(entry.team))
      .sort((a, b) => b.points - a.points || b.won - a.won)
  }, [leaderboards, teams, players])

  const value = {
    sports,
    teams,
    players,
    matches: enrichedMatches,
    leaderboards: enrichedLeaderboards,
    selectedSportId,
    setSelectedSportId,
    isAdmin,
    setIsAdmin,
    isSupabaseLive,
    supabaseConnected,
    supabaseError,
    badmintonCarouselImages,
    updateBadmintonCarouselImages,
    resetBadmintonCarouselImages,
    footballCarouselImages,
    updateFootballCarouselImages,
    resetFootballCarouselImages,
    refreshSupabaseData: fetchSupabaseData,
    updateMatchScore,
    updateMatchSchedule,
    updateLeaderboard,
    updateTeamFormation,
    updatePlayerPosition,
    updateTeam,
    updateSport,
    updatePlayer,
    setIconPlayer,
    addPlayer,
    removePlayer,
    addTeam,
    removeTeam,
    addMatch,
    removeMatch,
    addSport,
    removeSport,
    resetToDefaultData,
    clearTemporaryData,
    getSportById,
    getTeamById,
    getPlayersByTeam,
    getPlayersBySport,
  }

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>
}

export const useTournament = () => {
  const context = useContext(TournamentContext)
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider')
  }
  return context
}
