'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useTournament } from '@/context/TournamentContext'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Match, MatchStatus, LeaderboardEntry, Team, Sport, SportType } from '@/lib/types'
import { generateTacticalCoordinates, FORMATION_PRESETS, TacticalOptions } from '@/lib/mock-data'
import { getSportMeta } from '@/lib/sports-theme'
import {
  Shield,
  Lock,
  Unlock,
  Radio,
  Trophy,
  Users,
  Crosshair,
  Database,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Copy,
  AlertTriangle,
  RefreshCw,
  LogOut,
  ExternalLink,
  Sliders,
  Check,
  Sparkles,
  Layers,
  MapPin,
  Edit2,
  UserCheck,
} from 'lucide-react'

export default function AdminPanel() {
  const {
    sports,
    teams,
    players,
    matches,
    leaderboards,
    isAdmin,
    setIsAdmin,
    isSupabaseLive,
    supabaseConnected,
    supabaseError,
    refreshSupabaseData,
    updateMatchScore,
    updateLeaderboard,
    updateTeamFormation,
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
  } = useTournament()

  // Admin Auth Form State (Clean empty initial credentials)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'matches' | 'teams' | 'players' | 'leaderboards' | 'tactics' | 'sports' | 'supabase'>('teams')

  // Notification / Feedback state
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [sqlCopied, setSqlCopied] = useState(false)
  const [fixSqlCopied, setFixSqlCopied] = useState(false)

  // Scalable Football Formation Studio State (Dynamic sport lookup)
  const footballSport = sports.find((s) => s.name.toLowerCase() === 'football') || sports[0]
  const footballTeams = teams.filter((t) => t.sport_id === footballSport?.id)
  const [formationTeamId, setFormationTeamId] = useState<string>(footballTeams[0]?.id || '')
  const [selectedFormationString, setSelectedFormationString] = useState<string>('2-2-1')
  const [defensiveLineHeight, setDefensiveLineHeight] = useState<'low' | 'mid' | 'high'>('mid')
  const [pitchWidthSetting, setPitchWidthSetting] = useState<'narrow' | 'standard' | 'wide'>('standard')
  const [customFormationInput, setCustomFormationInput] = useState<string>('2-2-1')

  // New Sport Form State
  const [newSportName, setNewSportName] = useState('')
  const [newSportType, setNewSportType] = useState<SportType>('team')
  const [newSportVenue, setNewSportVenue] = useState('')
  const [editingVenueSportId, setEditingVenueSportId] = useState<string | null>(null)
  const [tempVenueName, setTempVenueName] = useState('')
  const [isSubmittingSport, setIsSubmittingSport] = useState(false)

  // New Team Form State
  const [newTeamSportId, setNewTeamSportId] = useState<string>(sports[0]?.id || '')
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDept, setNewTeamDept] = useState('')
  const [newTeamManager, setNewTeamManager] = useState('')
  const [editingManagerTeamId, setEditingManagerTeamId] = useState<string | null>(null)
  const [tempManagerName, setTempManagerName] = useState('')
  const [newTeamLogo, setNewTeamLogo] = useState('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=128&h=128&fit=crop')
  const [newTeamFormation, setNewTeamFormation] = useState('2-2-1')
  const [teamFilterSportId, setTeamFilterSportId] = useState<string>('all')
  const [isSubmittingTeam, setIsSubmittingTeam] = useState(false)

  // Player Enrollment State (Cascading Event -> Team selection)
  const [playerEnrollSportId, setPlayerEnrollSportId] = useState<string>(sports[0]?.id || '')
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerTeamId, setNewPlayerTeamId] = useState('')
  const [newPlayerRole, setNewPlayerRole] = useState('Forward')
  const [newPlayerNumber, setNewPlayerNumber] = useState(0)
  const [newPlayerIsIcon, setNewPlayerIsIcon] = useState(false)
  const [newPlayerPhoto, setNewPlayerPhoto] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop')
  const [playerRosterSportFilter, setPlayerRosterSportFilter] = useState<string>('all')
  const [playerRosterTeamFilter, setPlayerRosterTeamFilter] = useState<string>('all')

  // Match Scheduling State
  const [newMatchSportId, setNewMatchSportId] = useState<string>(sports[0]?.id || '')
  const [newMatchTeamAId, setNewMatchTeamAId] = useState('')
  const [newMatchTeamBId, setNewMatchTeamBId] = useState('')
  const [newMatchStatus, setNewMatchStatus] = useState<MatchStatus>('live')
  const [newMatchVenue, setNewMatchVenue] = useState('')
  const [newMatchTeamAScore, setNewMatchTeamAScore] = useState(0)
  const [newMatchTeamBScore, setNewMatchTeamBScore] = useState(0)
  const [isSubmittingMatch, setIsSubmittingMatch] = useState(false)

  // Preview coordinates calculated dynamically on the fly
  const previewCoords = useMemo(() => {
    return generateTacticalCoordinates(selectedFormationString, {
      defensiveLine: defensiveLineHeight,
      pitchWidth: pitchWidthSetting,
    })
  }, [selectedFormationString, defensiveLineHeight, pitchWidthSetting])

  const outfieldCount = useMemo(() => {
    const parts = selectedFormationString.split('-').map(Number).filter((n) => !isNaN(n) && n > 0)
    return parts.reduce((acc, curr) => acc + curr, 0)
  }, [selectedFormationString])

  // Sync default sports across form selectors
  React.useEffect(() => {
    if (sports.length > 0) {
      if (!newTeamSportId || !sports.some((s) => s.id === newTeamSportId)) {
        setNewTeamSportId(sports[0].id)
      }
      if (!playerEnrollSportId || !sports.some((s) => s.id === playerEnrollSportId)) {
        setPlayerEnrollSportId(sports[0].id)
      }
      if (!newMatchSportId || !sports.some((s) => s.id === newMatchSportId)) {
        setNewMatchSportId(sports[0].id)
      }
    }
  }, [sports, newTeamSportId, playerEnrollSportId, newMatchSportId])

  // Sync available teams for cascading athlete enrollment
  const teamsInEnrollSport = useMemo(() => {
    return teams.filter((t) => t.sport_id === playerEnrollSportId)
  }, [teams, playerEnrollSportId])

  React.useEffect(() => {
    if (teamsInEnrollSport.length > 0) {
      if (!newPlayerTeamId || !teamsInEnrollSport.some((t) => t.id === newPlayerTeamId)) {
        setNewPlayerTeamId(teamsInEnrollSport[0].id)
      }
    } else {
      setNewPlayerTeamId('')
    }
  }, [teamsInEnrollSport, newPlayerTeamId])

  // Sync available teams for match scheduling
  const teamsInMatchSport = useMemo(() => {
    return teams.filter((t) => t.sport_id === newMatchSportId)
  }, [teams, newMatchSportId])

  React.useEffect(() => {
    if (teamsInMatchSport.length >= 2) {
      if (!newMatchTeamAId || !teamsInMatchSport.some((t) => t.id === newMatchTeamAId)) {
        setNewMatchTeamAId(teamsInMatchSport[0].id)
      }
      if (
        !newMatchTeamBId ||
        !teamsInMatchSport.some((t) => t.id === newMatchTeamBId) ||
        newMatchTeamBId === teamsInMatchSport[0]?.id
      ) {
        setNewMatchTeamBId(teamsInMatchSport[1].id)
      }
    } else if (teamsInMatchSport.length === 1) {
      setNewMatchTeamAId(teamsInMatchSport[0].id)
      setNewMatchTeamBId('')
    } else {
      setNewMatchTeamAId('')
      setNewMatchTeamBId('')
    }
  }, [teamsInMatchSport, newMatchTeamAId, newMatchTeamBId])

  // Sync formation studio selected team
  React.useEffect(() => {
    if (footballTeams.length > 0) {
      if (!formationTeamId || !footballTeams.some((t) => t.id === formationTeamId)) {
        setFormationTeamId(footballTeams[0].id)
        setSelectedFormationString(footballTeams[0].formation || '2-2-1')
        setCustomFormationInput(footballTeams[0].formation || '2-2-1')
      }
    } else {
      setFormationTeamId('')
    }
  }, [footballTeams, formationTeamId])

  // Sync match venue with selected sport's venue
  React.useEffect(() => {
    const currentSport = sports.find((s) => s.id === newMatchSportId)
    if (currentSport?.venue) {
      setNewMatchVenue(currentSport.venue)
    }
  }, [newMatchSportId, sports])

  const notify = (msg: string) => {
    setStatusMessage(msg)
    setTimeout(() => setStatusMessage(null), 3500)
  }

  // Handle Team Creation
  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanName = newTeamName.trim()
    const cleanDept = newTeamDept.trim()
    const cleanManager = newTeamManager.trim()
    if (!cleanName) {
      notify('Please enter a team name.')
      return
    }
    const targetSport = sports.find((s) => s.id === newTeamSportId) || sports[0]
    if (!targetSport) {
      notify('Please select an event / division.')
      return
    }

    setIsSubmittingTeam(true)
    try {
      await addTeam({
        name: cleanName,
        department: cleanDept || 'Computer Science Lab',
        logo_url: newTeamLogo || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=128&h=128&fit=crop',
        sport_id: targetSport.id,
        formation: targetSport.name.toLowerCase() === 'football' ? newTeamFormation : (targetSport.type === 'duo' ? 'Standard Duo' : 'Standard'),
        manager: cleanManager || undefined,
      })
      notify(`Team "${cleanName}" enrolled in ${targetSport.name}!`)
      setNewTeamName('')
      setNewTeamDept('')
      setNewTeamManager('')
    } catch (err: any) {
      notify(`Failed creating team: ${err?.message || 'Error'}`)
    } finally {
      setIsSubmittingTeam(false)
    }
  }

  // Handle Team Removal
  const handleRemoveTeam = async (teamId: string, teamName: string) => {
    if (
      confirm(
        `Are you sure you want to remove team "${teamName}"?\n\nThis will remove its enrolled players, scheduled matches, and leaderboard standings.`
      )
    ) {
      await removeTeam(teamId)
      notify(`Team "${teamName}" removed.`)
    }
  }

  // Handle Match Scheduling
  const handleScheduleMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMatchTeamAId || !newMatchTeamBId) {
      notify('Please select both Team A and Team B.')
      return
    }
    if (newMatchTeamAId === newMatchTeamBId) {
      notify('Team A and Team B must be different teams.')
      return
    }
    const targetSport = sports.find((s) => s.id === newMatchSportId) || sports[0]
    if (!targetSport) {
      notify('Please select an event / division.')
      return
    }

    setIsSubmittingMatch(true)
    try {
      await addMatch({
        sport_id: targetSport.id,
        team_a_id: newMatchTeamAId,
        team_b_id: newMatchTeamBId,
        team_a_score: Number(newMatchTeamAScore) || 0,
        team_b_score: Number(newMatchTeamBScore) || 0,
        status: newMatchStatus,
        scheduled_at: new Date().toISOString(),
        minute: newMatchStatus === 'live' ? 1 : undefined,
        venue: newMatchVenue.trim() || targetSport.venue || undefined,
      })
      notify(`Match scheduled between teams in ${targetSport.name}!`)
      setNewMatchTeamAScore(0)
      setNewMatchTeamBScore(0)
    } catch (err: any) {
      notify(`Failed scheduling match: ${err?.message || 'Error'}`)
    } finally {
      setIsSubmittingMatch(false)
    }
  }

  // Handle Match Removal
  const handleRemoveMatch = async (matchId: string) => {
    if (confirm('Delete this match fixture?')) {
      await removeMatch(matchId)
      notify('Match removed.')
    }
  }

  // Handle Dynamic Sport Creation
  const handleAddSport = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newSportName.trim()
    const trimmedVenue = newSportVenue.trim()
    if (!trimmed) {
      notify('Please enter a valid division/sport name.')
      return
    }

    // Check if sport already exists
    if (sports.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      notify(`Division "${trimmed}" is already registered.`)
      return
    }

    setIsSubmittingSport(true)
    try {
      await addSport({
        name: trimmed,
        type: newSportType,
        venue: trimmedVenue || undefined,
      })
      notify(`Division "${trimmed}" successfully registered with venue and synced!`)
      setNewSportName('')
      setNewSportVenue('')
    } catch (err: any) {
      notify(`Failed adding division: ${err?.message || 'Unknown error'}`)
    } finally {
      setIsSubmittingSport(false)
    }
  }

  // Handle Dynamic Sport Removal
  const handleRemoveSport = async (sportId: string, sportName: string) => {
    if (
      confirm(
        `Are you sure you want to delete the "${sportName}" division?\n\nThis will remove the division along with its associated teams, matches, and leaderboard entries.`
      )
    ) {
      await removeSport(sportId)
      notify(`Division "${sportName}" removed.`)
    }
  }

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticating(true)
    setAuthError(null)

    const cleanEmail = email.trim()
    if (!cleanEmail || !password) {
      setAuthError('Please enter both your admin email and password.')
      setIsAuthenticating(false)
      return
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })
        if (error) {
          setAuthError(error.message || 'Authentication failed. Please verify your admin credentials.')
        } else if (data?.user || data?.session) {
          setIsAdmin(true)
          notify('Authenticated successfully via Supabase Auth!')
          refreshSupabaseData()
        } else {
          setAuthError('Authentication failed. No active session returned.')
        }
      } catch (err: any) {
        setAuthError(err?.message || 'Failed connecting to auth service.')
      }
    } else {
      // Local development / standalone fallback mode (when no Supabase backend is configured)
      if (cleanEmail.includes('@') && password.length >= 6) {
        setIsAdmin(true)
        notify('Admin access granted (Local Standalone Mode).')
      } else {
        setAuthError('Please enter a valid email format and a password of at least 6 characters.')
      }
    }

    setIsAuthenticating(false)
  }

  // Quick Copy Fix Permissions SQL
  const handleCopyFixSql = () => {
    const fixSql = `-- ==============================================================================
-- CS NEXUS ARENA: QUICK FIX FOR SUPABASE PERMISSIONS & RLS POLICIES
-- Run this in your Supabase SQL Editor to grant table access to anon and enable
-- full read/write capabilities for the Next.js frontend and admin panel.
-- ==============================================================================

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

ALTER TABLE IF EXISTS sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS players ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leaderboards ENABLE ROW LEVEL SECURITY;

-- Ensure latest columns exist for venue, manager, and icon athlete
ALTER TABLE IF EXISTS sports ADD COLUMN IF NOT EXISTS venue TEXT;
ALTER TABLE IF EXISTS sports ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE IF EXISTS teams ADD COLUMN IF NOT EXISTS manager TEXT;
ALTER TABLE IF EXISTS players ADD COLUMN IF NOT EXISTS is_icon BOOLEAN DEFAULT FALSE;

DROP POLICY IF EXISTS "Public Read Access on sports" ON sports;
DROP POLICY IF EXISTS "Public Read Access on teams" ON teams;
DROP POLICY IF EXISTS "Public Read Access on players" ON players;
DROP POLICY IF EXISTS "Public Read Access on matches" ON matches;
DROP POLICY IF EXISTS "Public Read Access on leaderboards" ON leaderboards;

DROP POLICY IF EXISTS "Authenticated Insert on sports" ON sports;
DROP POLICY IF EXISTS "Authenticated Update on sports" ON sports;
DROP POLICY IF EXISTS "Authenticated Delete on sports" ON sports;
DROP POLICY IF EXISTS "Authenticated Insert on teams" ON teams;
DROP POLICY IF EXISTS "Authenticated Update on teams" ON teams;
DROP POLICY IF EXISTS "Authenticated Delete on teams" ON teams;
DROP POLICY IF EXISTS "Authenticated Insert on players" ON players;
DROP POLICY IF EXISTS "Authenticated Update on players" ON players;
DROP POLICY IF EXISTS "Authenticated Delete on players" ON players;
DROP POLICY IF EXISTS "Authenticated Insert on matches" ON matches;
DROP POLICY IF EXISTS "Authenticated Update on matches" ON matches;
DROP POLICY IF EXISTS "Authenticated Delete on matches" ON matches;
DROP POLICY IF EXISTS "Authenticated Insert on leaderboards" ON leaderboards;
DROP POLICY IF EXISTS "Authenticated Update on leaderboards" ON leaderboards;
DROP POLICY IF EXISTS "Authenticated Delete on leaderboards" ON leaderboards;

CREATE POLICY "Allow All Access on sports" ON sports FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on teams" ON teams FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on players" ON players FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on matches" ON matches FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on leaderboards" ON leaderboards FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'matches') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE matches;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'leaderboards') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE leaderboards;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'players') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE players;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'teams') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE teams;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'sports') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sports;
  END IF;
END $$;`

    navigator.clipboard.writeText(fixSql)
    setFixSqlCopied(true)
    notify('Quick-fix SQL copied to clipboard! Paste into Supabase SQL Editor.')
    setTimeout(() => setFixSqlCopied(false), 3000)
  }

  // Quick Copy Complete Schema SQL
  const handleCopySql = () => {
    fetch('/supabase-schema.txt')
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text)
        setSqlCopied(true)
        notify('Full SQL schema copied to clipboard!')
        setTimeout(() => setSqlCopied(false), 3000)
      })
      .catch(() => {
        handleCopyFixSql()
      })
  }

  // Handle Add Player
  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanName = newPlayerName.trim()
    if (!cleanName) {
      notify('Please enter an athlete name.')
      return
    }
    if (!newPlayerTeamId) {
      notify('Please select a team. Enroll a team in this event first if none exist.')
      return
    }

    await addPlayer({
      team_id: newPlayerTeamId,
      name: cleanName,
      photo_url: newPlayerPhoto,
      role: newPlayerRole,
      jersey_number: Number(newPlayerNumber),
      position_x: 50.0,
      position_y: 50.0,
      is_icon: newPlayerIsIcon,
    })

    if (newPlayerIsIcon) {
      const targetTeamPlayers = players.filter((p) => p.team_id === newPlayerTeamId)
      const matching = targetTeamPlayers.find((p) => p.name === cleanName)
      if (matching) {
        await setIconPlayer(newPlayerTeamId, matching.id)
      }
    }

    setNewPlayerName('')
    setNewPlayerIsIcon(false)
    notify(`Athlete ${cleanName} enrolled in squad!${newPlayerIsIcon ? ' (Designated Icon ⭐)' : ''}`)
  }

  // If Not Authenticated, show Login Screen
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12">
        <div className="bg-card border-2 border-slate-800 hover:border-neon-lime/40 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-neon-lime/10 border border-neon-lime/40 flex items-center justify-center shadow-neon-lime">
              <Lock className="w-7 h-7 text-neon-lime" />
            </div>
            <h1 className="text-2xl font-black text-ice-white font-mono tracking-tight">
              ADMIN CONTROL ACCESS
            </h1>
            <p className="text-xs text-muted-gray">
              Authorize to update live scores, adjust points, edit formations, and manage players.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-400 text-xs flex items-center space-x-2 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted-gray uppercase mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.edu"
                required
                className="w-full bg-slate-900 border border-slate-700 focus:border-neon-lime rounded-xl px-4 py-2.5 text-sm text-ice-white font-mono focus:outline-none placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-gray uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-slate-900 border border-slate-700 focus:border-neon-lime rounded-xl px-4 py-2.5 text-sm text-ice-white font-mono focus:outline-none placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-xl bg-neon-lime hover:bg-neon-lime-dark text-slate-950 font-bold font-mono text-sm tracking-wide shadow-neon-lime transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              <span>{isAuthenticating ? 'AUTHENTICATING...' : 'ENTER ADMIN CONSOLE'}</span>
            </button>
          </form>

          {/* Secure Admin Access Notice */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
            <span className="text-cyber-cyan font-mono font-bold flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Protected Tournament Administration</span>
            </span>
            <p className="text-muted-gray text-[11px]">
              Sign in with your administrator credentials to modify live match scorelines, calibrate division standings, assign formations, and enroll squad athletes.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated Admin Dashboard
  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-neon-lime text-slate-950 flex items-center justify-center shadow-neon-lime">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-ice-white font-mono tracking-tight">
                ADMINISTRATION CONSOLE
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neon-lime/20 text-neon-lime border border-neon-lime/40">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-muted-gray mt-0.5">
              Live tournament orchestration hub • Mode:{' '}
              {isSupabaseLive ? 'Supabase Realtime Cloud' : 'Reactive Local State'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (confirm('Clean temporary cache and reset tournament data?')) {
                clearTemporaryData()
                notify('Temporary data cleaned and state refreshed.')
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 flex items-center space-x-1.5 transition-all"
            title="Clean temporary cache and reset to fresh data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clean Data</span>
          </button>

          <button
            onClick={() => setIsAdmin(false)}
            className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-xs font-mono font-bold text-rose-400 border border-rose-800/50 flex items-center space-x-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Realtime Notification Banner */}
      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-neon-lime/20 border border-neon-lime/50 text-neon-lime text-xs font-mono font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('teams')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
            activeTab === 'teams'
              ? 'bg-neon-lime text-slate-950 shadow-neon-lime'
              : 'bg-slate-900 text-muted-gray hover:text-white border border-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Teams & Squads ({teams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('players')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
            activeTab === 'players'
              ? 'bg-neon-lime text-slate-950 shadow-neon-lime'
              : 'bg-slate-900 text-muted-gray hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Player Roster ({players.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matches')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
            activeTab === 'matches'
              ? 'bg-neon-lime text-slate-950 shadow-neon-lime'
              : 'bg-slate-900 text-muted-gray hover:text-white border border-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Live Matches & Scores ({matches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboards')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
            activeTab === 'leaderboards'
              ? 'bg-neon-lime text-slate-950 shadow-neon-lime'
              : 'bg-slate-900 text-muted-gray hover:text-white border border-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Leaderboard Points</span>
        </button>

        <button
          onClick={() => setActiveTab('tactics')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
            activeTab === 'tactics'
              ? 'bg-neon-lime text-slate-950 shadow-neon-lime'
              : 'bg-slate-900 text-muted-gray hover:text-white border border-slate-800'
          }`}
        >
          <Crosshair className="w-4 h-4" />
          <span>Team Formations</span>
        </button>

        <button
          onClick={() => setActiveTab('sports')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
            activeTab === 'sports'
              ? 'bg-neon-lime text-slate-950 shadow-neon-lime'
              : 'bg-slate-900 text-muted-gray hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Divisions & Games ({sports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
            activeTab === 'supabase'
              ? 'bg-cyber-cyan text-slate-950 shadow-cyber-cyan'
              : 'bg-slate-900 text-muted-gray hover:text-white border border-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase SQL & Config</span>
        </button>
      </div>

      {/* Real-time Supabase Sync Status Alert */}
      {supabaseError ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start justify-between space-x-3">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider text-amber-300">
                Supabase Database Sync Warning
              </p>
              <p className="mt-1 text-slate-300">{supabaseError}</p>
              <button
                onClick={() => setActiveTab('supabase')}
                className="mt-2 inline-flex items-center space-x-1.5 text-cyber-cyan hover:text-white font-bold underline cursor-pointer"
              >
                <span>View & Copy 1-Click Permissions Fix in Supabase Tab &rarr;</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => refreshSupabaseData()}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0"
            title="Retry connecting to Supabase"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      ) : supabaseConnected ? (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-lime animate-pulse" />
            <span className="font-bold">SUPABASE REALTIME SYNC ACTIVE</span>
            <span className="text-slate-400">• Changes immediately persist to database & broadcast live</span>
          </div>
          <button
            onClick={() => refreshSupabaseData()}
            className="flex items-center space-x-1 text-slate-400 hover:text-white text-[11px]"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Re-fetch</span>
          </button>
        </div>
      ) : null}

      {/* TAB: LIVE MATCHES CONTROLLER */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          {/* Schedule Match Card */}
          <div className="bg-card border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ice-white font-mono text-sm uppercase flex items-center space-x-2">
                <Plus className="w-4 h-4 text-neon-lime" />
                <span>SCHEDULE NEW TOURNAMENT MATCH</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-lime/10 text-neon-lime border border-neon-lime/30 font-bold uppercase">
                Match Scheduler
              </span>
            </div>

            {teamsInMatchSport.length < 2 ? (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs font-mono space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    Need at least 2 teams in{' '}
                    {sports.find((s) => s.id === newMatchSportId)?.name || 'this event'} to schedule a match.
                  </span>
                </div>
                <p className="text-muted-gray text-[11px]">
                  There are currently {teamsInMatchSport.length} team(s) enrolled in this division.
                </p>
                <div className="flex items-center space-x-3 pt-1">
                  <select
                    value={newMatchSportId}
                    onChange={(e) => setNewMatchSportId(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neon-lime font-mono"
                  >
                    {sports.map((s) => (
                      <option key={s.id} value={s.id}>
                        Switch to: {s.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setActiveTab('teams')}
                    className="px-3 py-1.5 rounded-lg bg-neon-lime hover:bg-neon-lime-dark text-slate-950 font-bold text-xs transition-all"
                  >
                    Go to Teams & Squads Tab →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleScheduleMatch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                    Event / Sport
                  </label>
                  <select
                    value={newMatchSportId}
                    onChange={(e) => setNewMatchSportId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime font-mono"
                  >
                    {sports.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                    Team A (Home)
                  </label>
                  <select
                    value={newMatchTeamAId}
                    onChange={(e) => setNewMatchTeamAId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime"
                  >
                    {teamsInMatchSport.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                    Team B (Away)
                  </label>
                  <select
                    value={newMatchTeamBId}
                    onChange={(e) => setNewMatchTeamBId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime"
                  >
                    {teamsInMatchSport
                      .filter((t) => t.id !== newMatchTeamAId)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                    Match Venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Main Turf Stadium"
                    value={newMatchVenue}
                    onChange={(e) => setNewMatchVenue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                    Match Status
                  </label>
                  <select
                    value={newMatchStatus}
                    onChange={(e) => setNewMatchStatus(e.target.value as MatchStatus)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime font-mono"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isSubmittingMatch}
                    className="w-full py-2 px-4 rounded-xl bg-neon-lime hover:bg-neon-lime-dark text-slate-950 text-xs font-mono font-bold tracking-wider shadow-neon-lime transition-all disabled:opacity-50"
                  >
                    {isSubmittingMatch ? 'SCHEDULING...' : '+ SCHEDULE MATCH'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Matches List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-gray font-mono">
              <span>SCHEDULED FIXTURES & LIVE CLASHES ({matches.length})</span>
              <span>Changes sync instantly across all clients</span>
            </div>

            {matches.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-card border border-dashed border-slate-800 space-y-2">
                <Radio className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="font-mono text-xs font-bold text-slate-300">
                  No matches currently scheduled.
                </div>
                <p className="text-[11px] text-muted-gray font-mono">
                  Use the scheduler above to create matches between enrolled teams.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-card border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
                  >
                    {/* Match Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-neon-lime uppercase px-2 py-0.5 rounded bg-neon-lime/10">
                        {match.sport?.name || 'SPORT'}
                      </span>
                      <div className="flex items-center space-x-2">
                        {/* Status Dropdown */}
                        <select
                          value={match.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as MatchStatus
                            updateMatchScore(match.id, match.team_a_score, match.team_b_score, newStatus)
                            notify(`Match status changed to ${newStatus.toUpperCase()}`)
                          }}
                          className={`text-xs font-mono font-bold px-2 py-1 rounded border focus:outline-none ${
                            match.status === 'live'
                              ? 'bg-red-950/80 border-red-500/50 text-red-400'
                              : match.status === 'completed'
                              ? 'bg-slate-800 border-slate-700 text-slate-300'
                              : 'bg-cyan-950/80 border-cyber-cyan/40 text-cyber-cyan'
                          }`}
                        >
                          <option value="upcoming">UPCOMING</option>
                          <option value="live">LIVE</option>
                          <option value="completed">COMPLETED</option>
                        </select>

                        <button
                          onClick={() => handleRemoveMatch(match.id)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-rose-400 hover:bg-rose-950/60 hover:border-rose-600/50 transition-colors"
                          title="Delete Match Fixture"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Score Controls */}
                    <div className="grid grid-cols-7 items-center gap-2 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                      {/* Team A */}
                      <div className="col-span-3 text-center">
                        <div className="font-bold text-sm text-ice-white truncate">
                          {match.team_a?.name || 'Team A'}
                        </div>
                        <div className="flex items-center justify-center space-x-2 mt-2">
                          <button
                            onClick={() =>
                              updateMatchScore(
                                match.id,
                                Math.max(0, match.team_a_score - 1),
                                match.team_b_score
                              )
                            }
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-ice-white font-bold"
                          >
                            -
                          </button>
                          <span className="text-2xl font-black font-mono text-neon-lime min-w-[32px]">
                            {match.team_a_score}
                          </span>
                          <button
                            onClick={() =>
                              updateMatchScore(
                                match.id,
                                match.team_a_score + 1,
                                match.team_b_score
                              )
                            }
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-neon-lime font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* VS Divider */}
                      <div className="col-span-1 text-center font-mono text-xs text-muted-gray">
                        VS
                      </div>

                      {/* Team B */}
                      <div className="col-span-3 text-center">
                        <div className="font-bold text-sm text-ice-white truncate">
                          {match.team_b?.name || 'Team B'}
                        </div>
                        <div className="flex items-center justify-center space-x-2 mt-2">
                          <button
                            onClick={() =>
                              updateMatchScore(
                                match.id,
                                match.team_a_score,
                                Math.max(0, match.team_b_score - 1)
                              )
                            }
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-ice-white font-bold"
                          >
                            -
                          </button>
                          <span className="text-2xl font-black font-mono text-cyber-cyan min-w-[32px]">
                            {match.team_b_score}
                          </span>
                          <button
                            onClick={() =>
                              updateMatchScore(
                                match.id,
                                match.team_a_score,
                                match.team_b_score + 1
                              )
                            }
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyber-cyan font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-muted-gray font-mono flex items-center justify-between">
                      <span>Venue: {match.venue || 'Arena Court'}</span>
                      <span className="text-neon-lime">Auto-persisted</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: TEAMS & SQUADS MANAGEMENT */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          {/* Enroll Team Form Card */}
          <div className="bg-card border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ice-white font-mono text-sm uppercase flex items-center space-x-2">
                <Plus className="w-4 h-4 text-neon-lime" />
                <span>ENROLL NEW TEAM IN AN EVENT</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-lime/10 text-neon-lime border border-neon-lime/30 font-bold uppercase">
                Self-Service Team Enrollment
              </span>
            </div>

            <form onSubmit={handleAddTeam} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                  Event / Sport
                </label>
                <select
                  value={newTeamSportId}
                  onChange={(e) => setNewTeamSportId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime font-mono"
                >
                  {sports.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                  Team / Squad Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Neural Nets FC"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                  Department / Lab
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS AI & Robotics Lab"
                  value={newTeamDept}
                  onChange={(e) => setNewTeamDept(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                  Team Manager / Coach
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prof. Alan Turing"
                  value={newTeamManager}
                  onChange={(e) => setNewTeamManager(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                  Initial Formation
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2-2-1 or Duo"
                  value={newTeamFormation}
                  onChange={(e) => setNewTeamFormation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime font-mono"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSubmittingTeam}
                  className="w-full py-2 px-4 rounded-xl bg-neon-lime hover:bg-neon-lime-dark text-slate-950 text-xs font-mono font-bold tracking-wider shadow-neon-lime transition-all disabled:opacity-50"
                >
                  {isSubmittingTeam ? 'ENROLLING...' : '+ ENROLL TEAM'}
                </button>
              </div>
            </form>
          </div>

          {/* Registered Teams List with Event Filtering */}
          <div className="bg-card border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-ice-white font-mono text-sm uppercase">
                  REGISTERED TEAMS & LABS ({teams.length})
                </h3>
                <p className="text-xs text-muted-gray font-mono">
                  Manage active squads and their associated rosters across all tournament divisions.
                </p>
              </div>

              {/* Event Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setTeamFilterSportId('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    teamFilterSportId === 'all'
                      ? 'bg-slate-800 text-neon-lime border border-neon-lime/40'
                      : 'bg-slate-900/80 text-muted-gray hover:text-white border border-slate-800'
                  }`}
                >
                  All ({teams.length})
                </button>
                {sports.map((sport) => {
                  const count = teams.filter((t) => t.sport_id === sport.id).length
                  return (
                    <button
                      key={sport.id}
                      onClick={() => setTeamFilterSportId(sport.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all shrink-0 ${
                        teamFilterSportId === sport.id
                          ? 'bg-slate-800 text-neon-lime border border-neon-lime/40'
                          : 'bg-slate-900/80 text-muted-gray hover:text-white border border-slate-800'
                      }`}
                    >
                      {sport.name} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Teams Grid */}
            {(() => {
              const displayTeams = teams.filter((t) =>
                teamFilterSportId === 'all' ? true : t.sport_id === teamFilterSportId
              )

              if (displayTeams.length === 0) {
                return (
                  <div className="py-12 text-center rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 space-y-2">
                    <Shield className="w-8 h-8 text-slate-600 mx-auto" />
                    <div className="font-mono text-xs font-bold text-slate-300">
                      No teams registered in this division yet.
                    </div>
                    <p className="text-[11px] text-muted-gray font-mono">
                      Use the form above to enroll a squad into {sports.find((s) => s.id === teamFilterSportId)?.name || 'the tournament'}.
                    </p>
                  </div>
                )
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayTeams.map((team) => {
                    const sport = sports.find((s) => s.id === team.sport_id)
                    const roster = players.filter((p) => p.team_id === team.id)
                    return (
                      <div
                        key={team.id}
                        className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between hover:border-slate-700 transition-all gap-2"
                      >
                        <div className="flex items-start space-x-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 mt-0.5">
                            <img
                              src={team.logo_url}
                              alt={team.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-ice-white truncate">
                              {team.name}
                            </div>
                            <div className="text-[10px] text-muted-gray truncate font-mono">
                              {team.department}
                            </div>

                            {/* Manager Inline Management */}
                            <div className="text-[10px] font-mono text-slate-300 mt-1">
                              {editingManagerTeamId === team.id ? (
                                <div className="flex items-center space-x-1 pt-0.5">
                                  <input
                                    type="text"
                                    value={tempManagerName}
                                    onChange={(e) => setTempManagerName(e.target.value)}
                                    placeholder="Manager Name"
                                    className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none focus:border-neon-lime w-28"
                                  />
                                  <button
                                    onClick={async () => {
                                      await updateTeam(team.id, { manager: tempManagerName.trim() })
                                      setEditingManagerTeamId(null)
                                      notify(`Updated manager for ${team.name}`)
                                    }}
                                    className="px-1.5 py-0.5 rounded bg-neon-lime text-slate-950 font-bold text-[9px]"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingManagerTeamId(null)}
                                    className="text-slate-400 hover:text-white text-[9px]"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1.5">
                                  <span className="text-muted-gray">👔 Mgr:</span>
                                  <span className="text-ice-white font-semibold truncate max-w-[110px]">
                                    {team.manager || <span className="text-slate-500 italic">None</span>}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setEditingManagerTeamId(team.id)
                                      setTempManagerName(team.manager || '')
                                    }}
                                    className="text-cyber-cyan hover:underline text-[9px] ml-1"
                                  >
                                    Edit
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 mt-1.5">
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-neon-lime border border-slate-700">
                                {sport?.name || 'Sport'}
                              </span>
                              <span className="text-[9px] font-mono text-muted-gray">
                                {roster.length} Athletes
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveTeam(team.id, team.name)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 transition-colors shrink-0"
                          title="Remove Team"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* TAB 2: LEADERBOARDS ADJUSTER */}
      {activeTab === 'leaderboards' && (
        <div className="bg-card border border-slate-800 rounded-2xl overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ice-white font-mono text-sm uppercase">
              STANDINGS POINTS & STATS CONTROLLER
            </h3>
            <span className="text-xs text-muted-gray font-mono">
              Direct modifications apply instantly to the public standings page.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-muted-gray uppercase">
                  <th className="py-3 px-3">Team / Lab</th>
                  <th className="py-3 px-2 text-center">Played</th>
                  <th className="py-3 px-2 text-center">Won</th>
                  <th className="py-3 px-2 text-center">Drawn</th>
                  <th className="py-3 px-2 text-center">Lost</th>
                  <th className="py-3 px-2 text-center text-neon-lime">Points</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboards.length > 0 ? (
                  leaderboards.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-bold text-ice-white">
                        {entry.team?.name || 'Team'}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={entry.played}
                          onChange={(e) =>
                            updateLeaderboard(entry.id, { played: Number(e.target.value) })
                          }
                          className="w-12 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center text-ice-white"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={entry.won}
                          onChange={(e) =>
                            updateLeaderboard(entry.id, { won: Number(e.target.value) })
                          }
                          className="w-12 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center text-emerald-400 font-bold"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={entry.drawn}
                          onChange={(e) =>
                            updateLeaderboard(entry.id, { drawn: Number(e.target.value) })
                          }
                          className="w-12 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center text-slate-300"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={entry.lost}
                          onChange={(e) =>
                            updateLeaderboard(entry.id, { lost: Number(e.target.value) })
                          }
                          className="w-12 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center text-rose-400 font-bold"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={entry.points}
                          onChange={(e) =>
                            updateLeaderboard(entry.id, { points: Number(e.target.value) })
                          }
                          className="w-14 bg-slate-900 border border-neon-lime/40 rounded px-1.5 py-1 text-center text-neon-lime font-black text-sm"
                        />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => notify(`Updated stats for ${entry.team?.name}`)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-neon-lime hover:text-slate-950 text-slate-300 text-[11px] font-bold transition-all"
                        >
                          Saved
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-gray font-mono">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Trophy className="w-8 h-8 text-slate-700 mx-auto" />
                        <span className="text-slate-400 font-bold">
                          No standings recorded yet across tournament divisions.
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Enrolling teams under &apos;Teams &amp; Squads&apos; automatically initializes them on the leaderboard.
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('teams')}
                          className="mt-2 px-3.5 py-1.5 rounded-lg bg-neon-lime hover:bg-neon-lime-dark text-slate-950 font-bold text-xs"
                        >
                          Enroll a Team Now →
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SCALABLE TACTICAL FORMATION STUDIO */}
      {activeTab === 'tactics' && (
        <div className="bg-card border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-ice-white font-mono text-base uppercase flex items-center space-x-2">
                <Crosshair className="w-5 h-5 text-neon-lime" />
                <span>SCALABLE TACTICAL FORMATION STUDIO</span>
              </h3>
              <p className="text-xs text-muted-gray mt-0.5">
                Design, preview, and publish dynamic formations. Supports standard presets, custom line tiers, and tactical modifiers.
              </p>
            </div>
            <span className="text-xs font-mono text-neon-lime bg-neon-lime/10 px-3 py-1 rounded-full border border-neon-lime/30 font-bold self-start">
              AUTHORITATIVE ADMIN ENGINE
            </span>
          </div>

          {footballTeams.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
              <Crosshair className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="font-mono text-sm font-bold text-slate-200">
                NO FOOTBALL TEAMS REGISTERED YET
              </div>
              <p className="text-xs text-muted-gray max-w-sm mx-auto font-mono">
                Enroll a team under the Football division in the Teams &amp; Squads tab to calibrate tactical coordinates, formations, and pitch depth.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('teams')}
                className="px-4 py-2 rounded-xl bg-neon-lime hover:bg-neon-lime-dark text-slate-950 font-bold text-xs font-mono transition-all"
              >
                Go to Teams &amp; Squads Tab →
              </button>
            </div>
          ) : (
            <>
              {/* 1. Target Team Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-muted-gray">
                  1. Select Team to Configure
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {footballTeams.map((team) => {
                    const isSelected = team.id === formationTeamId
                    return (
                      <button
                        key={team.id}
                        onClick={() => {
                          setFormationTeamId(team.id)
                          setSelectedFormationString(team.formation || '2-2-1')
                          setCustomFormationInput(team.formation || '2-2-1')
                        }}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-slate-800 border-neon-lime shadow-neon-lime'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs text-ice-white truncate">{team.name}</div>
                        <div className="text-[11px] font-mono text-neon-lime mt-1 flex items-center space-x-1">
                          <span>Current: {team.formation || '2-2-1'}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Main Studio Grid: Controls (Left 7) vs Live Pitch Preview (Right 5) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                {/* Left Controls (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Preset Formation Library */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-muted-gray">
                        2. 6v6 Tactical Presets Library (1 GK + 5 Outfielders)
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {/* 2 at the back */}
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">2 Defenders</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {['2-2-1', '2-1-2', '2-3-0'].map((fmt) => (
                            <button
                              key={fmt}
                              onClick={() => {
                                setSelectedFormationString(fmt)
                                setCustomFormationInput(fmt)
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                selectedFormationString === fmt
                                  ? 'bg-neon-lime text-slate-950 shadow-neon-lime font-black'
                                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                              }`}
                            >
                              {fmt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3 at the back */}
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">3 Defenders</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {['3-1-1', '3-2-0'].map((fmt) => (
                            <button
                              key={fmt}
                              onClick={() => {
                                setSelectedFormationString(fmt)
                                setCustomFormationInput(fmt)
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                selectedFormationString === fmt
                                  ? 'bg-neon-lime text-slate-950 shadow-neon-lime font-black'
                                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                              }`}
                            >
                              {fmt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 1 at the back */}
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">1 Defender (Sweeper / Anchor)</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {['1-3-1', '1-2-2'].map((fmt) => (
                            <button
                              key={fmt}
                              onClick={() => {
                                setSelectedFormationString(fmt)
                                setCustomFormationInput(fmt)
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                selectedFormationString === fmt
                                  ? 'bg-neon-lime text-slate-950 shadow-neon-lime font-black'
                                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                              }`}
                            >
                              {fmt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Arbitrary Formation Input */}
                  <div className="space-y-2 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <span className="text-xs font-mono uppercase text-cyber-cyan font-bold flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
                      <span>3. Custom Formation Builder (Any Shape)</span>
                    </span>
                    <p className="text-[11px] text-muted-gray">
                      Type any custom tier breakdown (e.g. <code className="text-neon-lime">2-2-1</code>, <code className="text-neon-lime">2-1-2</code>, <code className="text-neon-lime">1-3-1</code>, <code className="text-neon-lime">3-1-1</code>). Coordinates are dynamically generated!
                    </p>

                    <div className="flex items-center space-x-3 pt-1">
                      <input
                        type="text"
                        value={customFormationInput}
                        onChange={(e) => {
                          setCustomFormationInput(e.target.value)
                          if (e.target.value.includes('-')) {
                            setSelectedFormationString(e.target.value.trim())
                          }
                        }}
                        placeholder="e.g. 2-2-1"
                        className="w-36 bg-slate-950 border border-slate-700 focus:border-cyber-cyan rounded-xl px-3 py-2 text-sm text-ice-white font-mono font-bold focus:outline-none"
                      />

                      <button
                        onClick={() => {
                          if (customFormationInput.trim()) {
                            setSelectedFormationString(customFormationInput.trim())
                            notify(`Tactical shape updated to ${customFormationInput.trim()}`)
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold"
                      >
                        Apply Shape
                      </button>
                    </div>
                  </div>

                  {/* Tactical Sliders / Modifiers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                    {/* Defensive Line Height */}
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-muted-gray uppercase block">
                        Defensive Line Depth
                      </span>
                      <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        {(['low', 'mid', 'high'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => setDefensiveLineHeight(level)}
                            className={`py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition-all ${
                              defensiveLineHeight === level
                                ? 'bg-slate-800 text-neon-lime border border-neon-lime/40'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pitch Width */}
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-muted-gray uppercase block">
                        Team Width Stance
                      </span>
                      <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        {(['narrow', 'standard', 'wide'] as const).map((width) => (
                          <button
                            key={width}
                            onClick={() => setPitchWidthSetting(width)}
                            className={`py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition-all ${
                              pitchWidthSetting === width
                                ? 'bg-slate-800 text-cyber-cyan border border-cyber-cyan/40'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {width}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Save Formation Button */}
                  <button
                    onClick={async () => {
                      if (!formationTeamId) {
                        notify('Please select a team.')
                        return
                      }
                      await updateTeamFormation(formationTeamId, selectedFormationString, {
                        defensiveLine: defensiveLineHeight,
                        pitchWidth: pitchWidthSetting,
                      })
                      const team = footballTeams.find((t) => t.id === formationTeamId)
                      notify(`✅ Updated ${team?.name} formation to ${selectedFormationString} & recalculated pitch matrix!`)
                    }}
                    className="w-full py-3.5 rounded-2xl bg-neon-lime hover:bg-neon-lime-dark text-slate-950 font-mono font-black text-sm tracking-wider shadow-neon-lime transition-all flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>PUBLISH FORMATION & SYNC MATRIX</span>
                  </button>
                </div>

                {/* Right Pitch Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-muted-gray">
                      Live Field Matrix Preview
                    </span>
                    <span className="text-[11px] font-mono text-neon-lime font-bold">
                      {selectedFormationString} ({outfieldCount + 1} players)
                    </span>
                  </div>

                  <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl tactical-pitch">
                    {/* Tactical Markings */}
                    <div className="absolute inset-3 border border-emerald-400/30 rounded pointer-events-none">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400/30 -translate-y-1/2" />
                      <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/30" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-12 border-b border-x border-emerald-400/30 rounded-b" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-12 border-t border-x border-emerald-400/30 rounded-t" />
                    </div>

                    {/* Dynamic Players on Preview Pitch */}
                    {previewCoords.map((node, idx) => {
                      const isGK = idx === 0
                      return (
                        <div
                          key={idx}
                          style={{ left: `${node.x}%`, top: `${node.y}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-500 ease-out"
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shadow-md border ${
                              isGK
                                ? 'bg-amber-500 text-slate-950 border-amber-300'
                                : 'bg-slate-900 text-neon-lime border-neon-lime/70'
                            }`}
                          >
                            {isGK ? 'GK' : idx}
                          </div>
                          <span className="text-[8px] font-mono text-slate-200 mt-0.5 truncate max-w-[60px] text-center leading-none">
                            {node.role.split(' ')[0]}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-muted-gray font-mono">
                    <span className="text-ice-white font-bold block mb-1">Scalable Dynamic Coordinates:</span>
                    Preview updates instantly as you switch presets, customize line tiers, or toggle defensive depth. Hitting publish updates public team formations immediately.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB: PLAYER ROSTER MANAGEMENT */}
      {activeTab === 'players' && (
        <div className="space-y-6">
          {/* Add New Player Form with Cascading Event -> Team Selector */}
          <div className="bg-card border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ice-white font-mono text-sm uppercase flex items-center space-x-2">
                <Plus className="w-4 h-4 text-neon-lime" />
                <span>ENROLL NEW ATHLETE TO SQUAD</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-lime/10 text-neon-lime border border-neon-lime/30 font-bold uppercase">
                Cascading Team Assignment
              </span>
            </div>

            {/* Step 1: Event Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs font-mono font-bold text-ice-white shrink-0 uppercase flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Select Event / Division:</span>
              </span>
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
                {sports.map((sport) => {
                  const isSelected = sport.id === playerEnrollSportId
                  const teamCount = teams.filter((t) => t.sport_id === sport.id).length
                  return (
                    <button
                      type="button"
                      key={sport.id}
                      onClick={() => setPlayerEnrollSportId(sport.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all shrink-0 ${
                        isSelected
                          ? 'bg-neon-lime text-slate-950 shadow-neon-lime'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {sport.name} ({teamCount} teams)
                    </button>
                  )
                })}
              </div>
            </div>

            {teamsInEnrollSport.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 text-xs font-mono space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    No teams currently registered under{' '}
                    {sports.find((s) => s.id === playerEnrollSportId)?.name || 'this event'}.
                  </span>
                </div>
                <p className="text-muted-gray text-[11px]">
                  Athletes must be assigned to an enrolled squad. Please enroll a team first in the Teams & Squads tab.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('teams')}
                  className="px-3.5 py-1.5 rounded-lg bg-neon-lime hover:bg-neon-lime-dark text-slate-950 font-bold text-xs font-mono transition-all"
                >
                  Go to Teams & Squads Tab →
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddPlayer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                    Assign to Team
                  </label>
                  <select
                    value={newPlayerTeamId}
                    onChange={(e) => setNewPlayerTeamId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime font-mono"
                  >
                    {teamsInEnrollSport.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                    Athlete Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ada Lovelace"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Centre Forward / Anchor"
                    value={newPlayerRole}
                    onChange={(e) => setNewPlayerRole(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                    Jersey Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={newPlayerNumber}
                    onChange={(e) => setNewPlayerNumber(Number(e.target.value))}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime font-mono"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="adminNewPlayerIsIcon"
                    checked={newPlayerIsIcon}
                    onChange={(e) => setNewPlayerIsIcon(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-neon-lime focus:ring-neon-lime w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor="adminNewPlayerIsIcon"
                    className="text-xs font-mono text-amber-300 flex items-center space-x-1.5 cursor-pointer select-none"
                  >
                    <span>⭐ Designate as Team Icon Athlete (1 Icon athlete per squad)</span>
                  </label>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-xl bg-neon-lime hover:bg-neon-lime-dark text-slate-950 text-xs font-mono font-bold tracking-wider shadow-neon-lime transition-all"
                  >
                    + ENROLL ATHLETE
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Registered Players List with Filter Bar */}
          <div className="bg-card border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-ice-white font-mono text-sm uppercase">
                  REGISTERED SQUAD MEMBERS ({players.length})
                </h3>
                <p className="text-xs text-muted-gray font-mono">
                  Athletes registered across departmental squads and divisions.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={playerRosterSportFilter}
                  onChange={(e) => {
                    setPlayerRosterSportFilter(e.target.value)
                    setPlayerRosterTeamFilter('all')
                  }}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-neon-lime"
                >
                  <option value="all">All Events</option>
                  {sports.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <select
                  value={playerRosterTeamFilter}
                  onChange={(e) => setPlayerRosterTeamFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-neon-lime"
                >
                  <option value="all">All Teams</option>
                  {teams
                    .filter((t) =>
                      playerRosterSportFilter === 'all' ? true : t.sport_id === playerRosterSportFilter
                    )
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {(() => {
              const filteredPlayers = players.filter((p) => {
                const team = teams.find((t) => t.id === p.team_id)
                if (playerRosterSportFilter !== 'all' && team?.sport_id !== playerRosterSportFilter) {
                  return false
                }
                if (playerRosterTeamFilter !== 'all' && p.team_id !== playerRosterTeamFilter) {
                  return false
                }
                return true
              })

              if (filteredPlayers.length === 0) {
                return (
                  <div className="py-12 text-center rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 space-y-2">
                    <Users className="w-8 h-8 text-slate-600 mx-auto" />
                    <div className="font-mono text-xs font-bold text-slate-300">
                      No athletes match the current filter selection.
                    </div>
                    <p className="text-[11px] text-muted-gray font-mono">
                      Enroll athletes using the form above.
                    </p>
                  </div>
                )
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                  {filteredPlayers.map((p) => {
                    const team = teams.find((t) => t.id === p.team_id)
                    const sport = sports.find((s) => s.id === team?.sport_id)
                    const isIcon = Boolean(p.is_icon)
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                          isIcon
                            ? 'bg-slate-900/90 border border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.1)]'
                            : 'bg-slate-900/80 border border-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <div className={`w-9 h-9 rounded-lg bg-slate-800 overflow-hidden shrink-0 border ${
                            isIcon ? 'border-amber-400' : 'border-slate-700'
                          }`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="truncate">
                            <div className="font-bold text-xs text-ice-white truncate flex items-center space-x-1">
                              <span>{p.name}</span>
                              {isIcon && <span className="text-amber-400 text-xs">⭐</span>}
                              <span className="text-neon-lime ml-1">#{p.jersey_number}</span>
                            </div>
                            <div className="text-[10px] text-muted-gray truncate">
                              {p.role} • {team?.name || 'No Team'} ({sport?.name || 'Sport'})
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 ml-2">
                          {isIcon ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-mono font-bold flex items-center space-x-1">
                              <span>⭐</span>
                              <span>ICON</span>
                            </span>
                          ) : (
                            <button
                              onClick={async () => {
                                await setIconPlayer(p.team_id, p.id)
                                notify(`⭐ ${p.name} designated as team icon athlete!`)
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-400/20 text-slate-400 hover:text-amber-300 text-[10px] font-mono border border-slate-700 hover:border-amber-400/40 transition-all"
                              title="Designate as Icon Player for this squad"
                            >
                              ⭐ Make Icon
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Remove ${p.name} from squad?`)) {
                                removePlayer(p.id)
                                notify(`Removed ${p.name}`)
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 hover:text-rose-300 transition-colors shrink-0"
                            title="Remove Player"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* TAB 5: DIVISIONS & SPORTS ORCHESTRATION */}
      {activeTab === 'sports' && (
        <div className="space-y-6">
          {/* Create Sport Card */}
          <div className="bg-card border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-ice-white font-mono text-sm uppercase flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-neon-lime" />
                  <span>ENROLL NEW TOURNAMENT DIVISION</span>
                </h3>
                <p className="text-xs text-muted-gray mt-0.5 font-mono">
                  Instantly scales the tournament. New sports immediately appear across hero highlights, leaderboards, and rosters.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-lime/10 text-neon-lime border border-neon-lime/30 font-bold uppercase">
                Dynamic Scaling
              </span>
            </div>

            <form onSubmit={handleAddSport} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                  Sport / Game Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Table Tennis, Valorant, Basketball"
                  value={newSportName}
                  onChange={(e) => setNewSportName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                  Division Format
                </label>
                <select
                  value={newSportType}
                  onChange={(e) => setNewSportType(e.target.value as SportType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime"
                >
                  <option value="team">Team Squad (Multi-player, e.g. Football, Basketball)</option>
                  <option value="duo">Doubles / Pairs (2v2, e.g. Badminton, Carrom)</option>
                  <option value="solo">Solo (1v1 Single player, e.g. Chess, Table Tennis)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-muted-gray uppercase mb-1">
                  Official Venue / Arena
                </label>
                <input
                  type="text"
                  placeholder="e.g. Main Turf Stadium, Seminar Hall A"
                  value={newSportVenue}
                  onChange={(e) => setNewSportVenue(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-lime"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSubmittingSport}
                  className="w-full py-2 px-4 rounded-xl bg-neon-lime hover:bg-neon-lime-dark text-slate-950 text-xs font-mono font-bold tracking-wider shadow-neon-lime transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isSubmittingSport ? 'REGISTERING...' : '+ REGISTER DIVISION'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Sports & Divisions Grid */}
          <div className="bg-card border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ice-white font-mono text-sm uppercase flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-cyber-cyan" />
                <span>ACTIVE REGISTERED DIVISIONS ({sports.length})</span>
              </h3>
              <span className="text-xs text-muted-gray font-mono">
                Realtime database-backed divisions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sports.map((sport) => {
                const meta = getSportMeta(sport)
                const Icon = meta.icon
                const sportTeams = teams.filter((t) => t.sport_id === sport.id)
                const sportMatches = matches.filter((m) => m.sport_id === sport.id)

                return (
                  <div
                    key={sport.id}
                    className={`bg-slate-900/90 border border-slate-800 ${meta.borderHoverClass} rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3 group`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${meta.bgBadgeClass}`}
                        >
                          {meta.badgeText}
                        </span>
                        <Icon className={`w-4 h-4 ${meta.colorClass}`} />
                      </div>

                      <h4 className="font-bold text-base text-ice-white font-mono flex items-center space-x-2">
                        <span>{sport.name}</span>
                      </h4>
                      <p className="text-[11px] text-muted-gray mt-1 leading-relaxed">
                        {meta.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                      {/* Venue Management Slot */}
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-muted-gray">
                          <span className="flex items-center space-x-1.5 text-slate-300 font-bold">
                            <MapPin className="w-3.5 h-3.5 text-neon-lime" />
                            <span>EVENT VENUE</span>
                          </span>
                          {editingVenueSportId !== sport.id ? (
                            <button
                              onClick={() => {
                                setEditingVenueSportId(sport.id)
                                setTempVenueName(sport.venue || '')
                              }}
                              className="text-cyber-cyan hover:text-cyan-300 hover:underline flex items-center space-x-1 text-[10px]"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                              <span>Change Venue</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingVenueSportId(null)}
                              className="text-slate-400 hover:text-white text-[10px]"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        {editingVenueSportId === sport.id ? (
                          <div className="flex items-center space-x-1.5 pt-0.5">
                            <input
                              type="text"
                              value={tempVenueName}
                              onChange={(e) => setTempVenueName(e.target.value)}
                              placeholder="e.g. Student Activity Turf"
                              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-ice-white font-mono focus:outline-none focus:border-neon-lime"
                            />
                            <button
                              onClick={async () => {
                                await updateSport(sport.id, { venue: tempVenueName.trim() })
                                setEditingVenueSportId(null)
                                notify(`✅ Updated venue for ${sport.name} to "${tempVenueName.trim()}"`)
                              }}
                              className="px-2.5 py-1 rounded-lg bg-neon-lime text-slate-950 font-mono font-bold text-xs shadow-neon-lime hover:bg-neon-lime-dark"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs font-mono text-ice-white truncate flex items-center space-x-1.5">
                            <span className="text-muted-gray">Slot:</span>
                            <span className="font-semibold text-neon-lime truncate">
                              {sport.venue || <span className="text-slate-500 italic font-normal">No Venue Assigned</span>}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                        <div className="bg-slate-800/60 p-1.5 rounded-lg">
                          <span className="text-muted-gray block text-[10px] uppercase">Teams</span>
                          <span className="font-bold text-neon-lime">{sportTeams.length}</span>
                        </div>
                        <div className="bg-slate-800/60 p-1.5 rounded-lg">
                          <span className="text-muted-gray block text-[10px] uppercase">Matches</span>
                          <span className="font-bold text-cyber-cyan">{sportMatches.length}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <Link
                          href={`/leaderboards?sport=${encodeURIComponent(sport.name)}`}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono text-center transition-colors flex items-center justify-center space-x-1"
                        >
                          <span>Standings</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>

                        <button
                          onClick={() => handleRemoveSport(sport.id, sport.name)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 hover:text-rose-300 transition-colors shrink-0"
                          title={`Delete ${sport.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SUPABASE SQL & CONFIGURATION */}
      {activeTab === 'supabase' && (
        <div className="bg-card border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-ice-white font-mono text-base uppercase flex items-center space-x-2">
              <Database className="w-5 h-5 text-cyber-cyan" />
              <span>SUPABASE BACKEND INTEGRATION & PERMISSIONS SETUP</span>
            </h3>
            <p className="text-xs text-muted-gray mt-1">
              Configure your Supabase database. If you already created tables, run the 1-Click Permissions Fix below to enable write access.
            </p>
          </div>

          {/* Connection Telemetry Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-mono text-muted-gray uppercase">Connection & Sync Status</span>
              <div className="mt-1 flex items-center space-x-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    supabaseConnected
                      ? 'bg-neon-lime animate-pulse'
                      : isSupabaseLive
                      ? 'bg-amber-400'
                      : 'bg-red-400'
                  }`}
                />
                <span className="font-bold font-mono text-sm text-ice-white">
                  {supabaseConnected
                    ? 'SUPABASE SYNC LIVE & WRITABLE'
                    : isSupabaseLive
                    ? 'CREDENTIALS VALID • PERMISSIONS NEEDED'
                    : 'REACTIVE DEMO MODE (STANDALONE)'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-mono text-muted-gray uppercase">Actions</span>
              <div className="mt-1 flex items-center space-x-3">
                <button
                  onClick={() => refreshSupabaseData()}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono rounded text-slate-200 flex items-center space-x-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Test Connection</span>
                </button>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-cyber-cyan hover:underline flex items-center space-x-1"
                >
                  <span>Open Supabase Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 1-CLICK PERMISSIONS FIX CARD */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-neon-lime/10 via-slate-900 to-slate-900 border border-neon-lime/30 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-neon-lime" />
                <span className="text-sm font-mono font-bold text-ice-white">
                  RECOMMENDED: 1-Click Permissions & RLS Write Access Fix
                </span>
              </div>
              <button
                onClick={handleCopyFixSql}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neon-lime hover:bg-neon-lime-dark text-slate-950 text-xs font-mono font-bold shadow-neon-lime transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>{fixSqlCopied ? 'COPIED TO CLIPBOARD!' : 'COPY 1-CLICK FIX SQL'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Paste and run this script in your <strong>Supabase SQL Editor</strong>. It grants table access to PostgreSQL roles and enables full read/write capabilities so your score modifications, formations, and player updates persist directly to Supabase without wiping your existing tables.
            </p>
          </div>

          {/* FULL SCHEMA SCRIPT */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-ice-white font-bold">
                Complete Clean Schema Script (`supabase/schema.sql`)
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyber-cyan hover:bg-cyber-cyan-dark text-slate-950 text-xs font-mono font-bold shadow-cyber-cyan transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>{sqlCopied ? 'COPIED FULL SCHEMA!' : 'COPY FULL SCHEMA SQL'}</span>
              </button>
            </div>
            <p className="text-xs text-muted-gray">
              Use this if you want to reset and recreate all 5 tables (`sports`, `teams`, `players`, `matches`, `leaderboards`) with default CS department seed data.
            </p>
          </div>

          {/* Quick SQL Snippet Preview Box */}
          <div className="relative">
            <pre className="bg-[#0B1120] border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-56">
{`-- Quick Fix Permissions, New Columns & RLS
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER TABLE IF EXISTS sports ADD COLUMN IF NOT EXISTS venue TEXT;
ALTER TABLE IF EXISTS sports ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE IF EXISTS teams ADD COLUMN IF NOT EXISTS manager TEXT;
ALTER TABLE IF EXISTS players ADD COLUMN IF NOT EXISTS is_icon BOOLEAN DEFAULT FALSE;

ALTER TABLE IF EXISTS sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS players ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leaderboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow All Access on sports" ON sports FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on matches" ON matches FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on leaderboards" ON leaderboards FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on teams" ON teams FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on players" ON players FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);`}
            </pre>
          </div>

          {/* Environment Variables Guide */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <span className="font-bold text-ice-white font-mono">
              3-Step Supabase Activation Guide:
            </span>
            <ol className="list-decimal list-inside text-muted-gray space-y-1">
              <li>Create a free project at <span className="text-cyber-cyan">supabase.com</span>.</li>
              <li>Open the <span className="text-neon-lime">SQL Editor</span> in your Supabase dashboard and run the copied script above.</li>
              <li>Add your project URL & anon public key into <code className="bg-black/50 px-1 py-0.5 rounded text-neon-lime">.env.local</code>:
                <div className="mt-1 font-mono text-[11px] text-slate-300 bg-black/60 p-2 rounded">
                  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
                </div>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
