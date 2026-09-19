'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useTournament } from '@/context/TournamentContext'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Match, MatchStatus, LeaderboardEntry, Team, Player, Sport, SportType } from '@/lib/types'
import { generateTacticalCoordinates, FORMATION_PRESETS, TacticalOptions } from '@/lib/mock-data'
import { getSportMeta, getSportDisplayImage, isSportWithImage, SPORT_SPECIFIC_IMAGES, isCsCupFootball } from '@/lib/sports-theme'
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
  Image as ImageIcon,
  X,
  Calendar,
  Clock,
} from 'lucide-react'
import { AdminPlayerForm } from './AdminPlayerForm'
import { PlayerCard } from './PlayerCard'

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
    updateMatchSchedule,
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
  const [newSportImage, setNewSportImage] = useState('')
  const [editingVenueSportId, setEditingVenueSportId] = useState<string | null>(null)
  const [tempVenueName, setTempVenueName] = useState('')
  const [editingImageSportId, setEditingImageSportId] = useState<string | null>(null)
  const [tempImageName, setTempImageName] = useState('')
  const [isSubmittingSport, setIsSubmittingSport] = useState(false)

  // New Team Form State
  const [newTeamSportId, setNewTeamSportId] = useState<string>(sports[0]?.id || '')
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDept, setNewTeamDept] = useState('')
  const [newTeamManager, setNewTeamManager] = useState('')
  const [newTeamRating, setNewTeamRating] = useState('')
  const [editingManagerTeamId, setEditingManagerTeamId] = useState<string | null>(null)
  const [tempManagerName, setTempManagerName] = useState('')
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
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)

  // Match Scheduling State
  const [newMatchSportId, setNewMatchSportId] = useState<string>(sports[0]?.id || '')
  const [newMatchTeamAId, setNewMatchTeamAId] = useState('')
  const [newMatchTeamBId, setNewMatchTeamBId] = useState('')
  const [newMatchStatus, setNewMatchStatus] = useState<MatchStatus>('upcoming')
  const [newMatchVenue, setNewMatchVenue] = useState('')
  const [newMatchDate, setNewMatchDate] = useState<string>(() => {
    const now = new Date()
    return now.toISOString().split('T')[0] // 'YYYY-MM-DD'
  })
  const [newMatchTime, setNewMatchTime] = useState<string>(() => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, '0')
    return `${hours}:${minutes}` // 'HH:MM'
  })
  const [newMatchTeamAScore, setNewMatchTeamAScore] = useState(0)
  const [newMatchTeamBScore, setNewMatchTeamBScore] = useState(0)
  const [isSubmittingMatch, setIsSubmittingMatch] = useState(false)

  // Fixture schedule editing state
  const [editingScheduleMatchId, setEditingScheduleMatchId] = useState<string | null>(null)
  const [editMatchDate, setEditMatchDate] = useState<string>('')
  const [editMatchTime, setEditMatchTime] = useState<string>('')
  const [editMatchVenue, setEditMatchVenue] = useState<string>('')
  const [isUpdatingSchedule, setIsUpdatingSchedule] = useState(false)

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

  // Handle Team / Competitor Creation
  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanName = newTeamName.trim()
    const cleanDept = newTeamDept.trim()
    const cleanManager = newTeamManager.trim()
    const cleanRating = newTeamRating.trim()
    if (!cleanName) {
      notify('Please enter a valid name.')
      return
    }
    const targetSport = sports.find((s) => s.id === newTeamSportId) || sports[0]
    if (!targetSport) {
      notify('Please select an event / division.')
      return
    }

    const isSolo = targetSport.type === 'solo' || targetSport.name.toLowerCase() === 'chess'
    const isDuo = targetSport.type === 'duo'
    const isFootball = targetSport.name.toLowerCase() === 'football'

    let formation = 'Standard'
    if (isFootball) {
      formation = newTeamFormation || '2-2-1'
    } else if (isDuo) {
      formation = 'Duo'
    } else if (isSolo) {
      formation = 'Solo'
    }

    const managerOrTitle = isSolo
      ? (cleanRating || undefined)
      : isDuo
      ? (cleanRating || undefined)
      : (cleanManager || undefined)

    setIsSubmittingTeam(true)
    try {
      const created = await addTeam({
        name: cleanName,
        department: cleanDept || 'Computer Science Lab',
        logo_url: '',
        sport_id: targetSport.id,
        formation,
        manager: managerOrTitle,
      })

      // If solo competitor, also create corresponding athlete profile so they appear in rosters
      if (isSolo && created) {
        await addPlayer({
          team_id: created.id,
          name: cleanName,
          photo_url: '',
          role: 'Solo Competitor',
          jersey_number: 1,
          position_x: 50,
          position_y: 50,
          is_icon: false,
        })
      }

      notify(`${isSolo ? 'Competitor' : isDuo ? 'Pair' : 'Team'} "${cleanName}" enrolled in ${targetSport.name}!`)
      setNewTeamName('')
      setNewTeamDept('')
      setNewTeamManager('')
      setNewTeamRating('')
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
        `Are you sure you want to remove "${teamName}"?\n\nThis will remove its enrolled players, scheduled matches, and leaderboard standings.`
      )
    ) {
      await removeTeam(teamId)
      notify(`"${teamName}" removed.`)
    }
  }

  // Handle Match Scheduling
  const handleScheduleMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMatchTeamAId || !newMatchTeamBId) {
      notify('Please select both participants.')
      return
    }
    if (newMatchTeamAId === newMatchTeamBId) {
      notify('Selected participants must be different.')
      return
    }
    const targetSport = sports.find((s) => s.id === newMatchSportId) || sports[0]
    if (!targetSport) {
      notify('Please select an event / division.')
      return
    }

    const isSolo = targetSport.type === 'solo' || targetSport.name.toLowerCase() === 'chess'

    // Compute scheduled_at timestamp from admin date & time inputs
    let scheduledAt = new Date().toISOString()
    if (newMatchDate) {
      const timePart = newMatchTime || '12:00'
      const parsed = new Date(`${newMatchDate}T${timePart}`)
      if (!isNaN(parsed.getTime())) {
        scheduledAt = parsed.toISOString()
      }
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
        scheduled_at: scheduledAt,
        minute: newMatchStatus === 'live' ? 1 : undefined,
        venue: newMatchVenue.trim() || targetSport.venue || undefined,
      })

      const partA = teams.find((t) => t.id === newMatchTeamAId)?.name || 'Participant 1'
      const partB = teams.find((t) => t.id === newMatchTeamBId)?.name || 'Participant 2'
      notify(`${isSolo ? 'Solo Match' : 'Match'} scheduled: ${partA} vs ${partB} in ${targetSport.name}!`)
      setNewMatchTeamAScore(0)
      setNewMatchTeamBScore(0)
    } catch (err: any) {
      notify(`Failed scheduling match: ${err?.message || 'Error'}`)
    } finally {
      setIsSubmittingMatch(false)
    }
  }

  // Handle Match Schedule Updating
  const handleSaveMatchSchedule = async (matchId: string) => {
    if (!editMatchDate) {
      notify('Please select a valid date.')
      return
    }
    const timePart = editMatchTime || '12:00'
    const parsed = new Date(`${editMatchDate}T${timePart}`)
    if (isNaN(parsed.getTime())) {
      notify('Invalid date or time.')
      return
    }
    setIsUpdatingSchedule(true)
    try {
      await updateMatchSchedule(matchId, parsed.toISOString(), editMatchVenue.trim() || undefined)
      notify('Match schedule updated successfully!')
      setEditingScheduleMatchId(null)
    } catch (err: any) {
      notify(`Failed updating schedule: ${err?.message || 'Error'}`)
    } finally {
      setIsUpdatingSchedule(false)
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
    const trimmedImage = newSportImage.trim()
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
      // Strictly provide images ONLY for Football, Badminton, Chess, or Carroms.
      // Any other sport has no image.
      const resolvedImage = isSportWithImage(trimmed)
        ? (trimmedImage || getSportDisplayImage(trimmed, newSportType))
        : undefined

      await addSport({
        name: trimmed,
        type: newSportType,
        venue: trimmedVenue || undefined,
        image_url: resolvedImage,
      })
      notify(`Division "${trimmed}" registered successfully!`)
      setNewSportName('')
      setNewSportVenue('')
      setNewSportImage('')
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
ALTER TABLE IF EXISTS players ALTER COLUMN jersey_number DROP NOT NULL;

-- Remove icon player tag from all solo and duo events
UPDATE players
SET is_icon = FALSE
WHERE team_id IN (
  SELECT t.id FROM teams t
  JOIN sports s ON t.sport_id = s.id
  WHERE s.type IN ('solo', 'duo') OR LOWER(s.name) = 'chess'
);

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

-- Storage bucket for player profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('player-photos', 'player-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow Public Photo Read" ON storage.objects;
CREATE POLICY "Allow Public Photo Read" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'player-photos');

DROP POLICY IF EXISTS "Allow Photo Uploads" ON storage.objects;
CREATE POLICY "Allow Photo Uploads" ON storage.objects
FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'player-photos');

DROP POLICY IF EXISTS "Allow Photo Updates" ON storage.objects;
CREATE POLICY "Allow Photo Updates" ON storage.objects
FOR UPDATE TO anon, authenticated USING (bucket_id = 'player-photos');

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
      notify('Please select an entry. Enroll in this event first if none exist.')
      return
    }

    const assignedTeam = teams.find((t) => t.id === newPlayerTeamId)
    const assignedSport = sports.find((s) => s.id === assignedTeam?.sport_id)
    const isSoloOrDuo = assignedSport?.type === 'solo' || assignedSport?.type === 'duo' || assignedSport?.name?.toLowerCase() === 'chess'

    const shouldBeIcon = !isSoloOrDuo && newPlayerIsIcon
    const roleToSave = newPlayerRole.trim() || (isSoloOrDuo ? 'Competitor' : 'Athlete')
    const jerseyToSave = isSoloOrDuo ? 1 : (Number(newPlayerNumber) || 1)

    await addPlayer({
      team_id: newPlayerTeamId,
      name: cleanName,
      photo_url: newPlayerPhoto,
      role: roleToSave,
      jersey_number: jerseyToSave,
      position_x: 50.0,
      position_y: 50.0,
      is_icon: shouldBeIcon,
    })

    if (shouldBeIcon) {
      const targetTeamPlayers = players.filter((p) => p.team_id === newPlayerTeamId)
      const matching = targetTeamPlayers.find((p) => p.name === cleanName)
      if (matching) {
        await setIconPlayer(newPlayerTeamId, matching.id)
      }
    }

    setNewPlayerName('')
    setNewPlayerRole('')
    setNewPlayerIsIcon(false)
    notify(`Athlete ${cleanName} enrolled!${shouldBeIcon ? ' (Designated Icon ⭐)' : ''}`)
  }

  // If Not Authenticated, show Login Screen
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12">
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-serif font-black text-[#1A1A1A] tracking-tight">
              Admin Console Access
            </h1>
            <p className="text-xs text-slate-600">
              Sign in to manage live fixtures, standings, team formations, and rosters.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.edu"
                required
                className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-none placeholder:text-slate-400 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-none placeholder:text-slate-400 shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full h-11 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs tracking-wide shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              <span>{isAuthenticating ? 'Authenticating...' : 'Sign In to Admin Console'}</span>
            </button>
          </form>

          {/* Admin Access Notice */}
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="text-slate-800 font-semibold flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Protected Tournament Administration</span>
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Authorized credentials allow updating live scores, calibrated points, official 6v6 squad formations, and athlete enrollments.
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E5E0D8] p-5 rounded-lg">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-md bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-2xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-serif font-black text-[#1A1A1A] tracking-tight">
                Administration Console
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Session
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Tournament orchestration • {isSupabaseLive ? 'Supabase Realtime Sync' : 'Local State Mode'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              if (confirm('Clean temporary cache and reset tournament data?')) {
                clearTemporaryData()
                notify('Temporary data cleaned and state refreshed.')
              }
            }}
            className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 border border-slate-200 flex items-center space-x-1.5 transition-all shadow-2xs"
            title="Clean temporary cache and reset to fresh data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Cache</span>
          </button>

          <button
            onClick={() => setIsAdmin(false)}
            className="px-3 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-xs font-medium text-rose-700 border border-rose-200 flex items-center space-x-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Realtime Notification Banner */}
      {statusMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar border-b-2 border-[#1A1A1A] pb-3">
        <button
          onClick={() => setActiveTab('teams')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 ${
            activeTab === 'teams'
              ? 'bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
              : 'bg-white text-slate-700 hover:text-[#1A1A1A] hover:bg-slate-50 border border-slate-300'
          }`}
        >
          <Shield className={`w-3.5 h-3.5 ${activeTab === 'teams' ? 'text-white' : 'text-slate-400'}`} />
          <span>Teams & Squads ({teams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('players')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 ${
            activeTab === 'players'
              ? 'bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
              : 'bg-white text-slate-700 hover:text-[#1A1A1A] hover:bg-slate-50 border border-slate-300'
          }`}
        >
          <Users className={`w-3.5 h-3.5 ${activeTab === 'players' ? 'text-white' : 'text-slate-400'}`} />
          <span>Player Roster ({players.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matches')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 ${
            activeTab === 'matches'
              ? 'bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
              : 'bg-white text-slate-700 hover:text-[#1A1A1A] hover:bg-slate-50 border border-slate-300'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${activeTab === 'matches' ? 'text-white' : 'text-slate-400'}`} />
          <span>Matches & Scores ({matches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboards')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 ${
            activeTab === 'leaderboards'
              ? 'bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
              : 'bg-white text-slate-700 hover:text-[#1A1A1A] hover:bg-slate-50 border border-slate-300'
          }`}
        >
          <Trophy className={`w-3.5 h-3.5 ${activeTab === 'leaderboards' ? 'text-[#F59E0B]' : 'text-slate-400'}`} />
          <span>Leaderboard Points</span>
        </button>

        <button
          onClick={() => setActiveTab('tactics')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 ${
            activeTab === 'tactics'
              ? 'bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
              : 'bg-white text-slate-700 hover:text-[#1A1A1A] hover:bg-slate-50 border border-slate-300'
          }`}
        >
          <Crosshair className={`w-3.5 h-3.5 ${activeTab === 'tactics' ? 'text-white' : 'text-slate-400'}`} />
          <span>Formation Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('sports')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 ${
            activeTab === 'sports'
              ? 'bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
              : 'bg-white text-slate-700 hover:text-[#1A1A1A] hover:bg-slate-50 border border-slate-300'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'sports' ? 'text-[#F59E0B]' : 'text-slate-400'}`} />
          <span>Divisions & Venues ({sports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 ${
            activeTab === 'supabase'
              ? 'bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
              : 'bg-white text-slate-700 hover:text-[#1A1A1A] hover:bg-slate-50 border border-slate-300'
          }`}
        >
          <Database className={`w-3.5 h-3.5 ${activeTab === 'supabase' ? 'text-white' : 'text-slate-400'}`} />
          <span>Database & Migrations</span>
        </button>
      </div>

      {/* Real-time Supabase Sync Status Alert */}
      {supabaseError ? (
        <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono flex items-start justify-between space-x-3">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider text-amber-900">
                Supabase Database Sync Warning
              </p>
              <p className="mt-1 text-slate-700">{supabaseError}</p>
              <button
                onClick={() => setActiveTab('supabase')}
                className="mt-2 inline-flex items-center space-x-1.5 text-blue-600 hover:text-blue-700 font-medium underline cursor-pointer"
              >
                <span>View & Copy 1-Click Permissions Fix in Supabase Tab &rarr;</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => refreshSupabaseData()}
            className="p-2 rounded-md bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 shrink-0 shadow-2xs"
            title="Retry connecting to Supabase"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      ) : supabaseConnected ? (
        <div className="px-4 py-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 rounded-full h-2 bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900">Supabase Realtime Sync Active</span>
            <span className="text-slate-600">• Changes persist directly to database</span>
          </div>
          <button
            onClick={() => refreshSupabaseData()}
            className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 text-[11px]"
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
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-5 space-y-4">
            {(() => {
              const currentMatchSport = sports.find((s) => s.id === newMatchSportId) || sports[0]
              const isSolo = currentMatchSport?.type === 'solo' || currentMatchSport?.name?.toLowerCase() === 'chess'
              const isDuo = currentMatchSport?.type === 'duo'

              return (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-serif font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center space-x-2">
                        <Plus className="w-4 h-4 text-blue-600" />
                        <span>
                          {isSolo
                            ? `Schedule Solo Match (1v1 - ${currentMatchSport?.name || 'Chess'})`
                            : isDuo
                            ? `Schedule Doubles Match (2v2 - ${currentMatchSport?.name || 'Doubles'})`
                            : `Schedule Team Fixture (${currentMatchSport?.name || 'Football'})`}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {isSolo
                          ? `Assign two competing players and official match venue for ${currentMatchSport?.name}.`
                          : isDuo
                          ? `Assign two competing doubles pairs and official arena court venue.`
                          : `Assign two competing team squads and stadium pitch venue.`}
                      </p>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium uppercase self-start">
                      {isSolo ? 'Solo 1v1 Scheduler' : isDuo ? 'Doubles 2v2 Scheduler' : 'Squad Match Scheduler'}
                    </span>
                  </div>

                  {teamsInMatchSport.length < 2 ? (
                    <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-xs space-y-2">
                      <div className="flex items-center space-x-2 text-amber-800 font-medium">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>
                          Need at least 2 {isSolo ? 'players / competitors' : isDuo ? 'pairs' : 'teams'} in{' '}
                          {currentMatchSport?.name || 'this event'} to schedule a match.
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        There are currently {teamsInMatchSport.length} {isSolo ? 'competitor(s)' : 'team(s)'} enrolled in this division.
                      </p>
                      <div className="flex items-center space-x-3 pt-1">
                        <select
                          value={newMatchSportId}
                          onChange={(e) => setNewMatchSportId(e.target.value)}
                          className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                        >
                          {sports.map((s) => (
                            <option key={s.id} value={s.id}>
                              Switch to: {s.name} ({s.type})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setActiveTab('teams')}
                          className="px-3.5 h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-all shadow-sm flex items-center"
                        >
                          {isSolo ? 'Enroll Players Now →' : isDuo ? 'Enroll Pairs Now →' : 'Enroll Teams Now →'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleScheduleMatch} className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                            Event / Sport
                          </label>
                          <select
                            value={newMatchSportId}
                            onChange={(e) => setNewMatchSportId(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                          >
                            {sports.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.type === 'solo' ? '1v1 Solo' : s.type === 'duo' ? '2v2 Duo' : 'Team'})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                            {isSolo ? 'Player 1 (White / Home)' : isDuo ? 'Pair 1 / Team 1' : 'Team A (Home)'}
                          </label>
                          <select
                            value={newMatchTeamAId}
                            onChange={(e) => setNewMatchTeamAId(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                          >
                            {teamsInMatchSport.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.department})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                            {isSolo ? 'Player 2 (Black / Away)' : isDuo ? 'Pair 2 / Team 2' : 'Team B (Away)'}
                          </label>
                          <select
                            value={newMatchTeamBId}
                            onChange={(e) => setNewMatchTeamBId(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                          >
                            {teamsInMatchSport.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.department})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1 flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-[#D97706]" />
                            <span>Event Date</span>
                          </label>
                          <input
                            type="date"
                            value={newMatchDate}
                            onChange={(e) => setNewMatchDate(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span>Event Time</span>
                          </label>
                          <input
                            type="time"
                            value={newMatchTime}
                            onChange={(e) => setNewMatchTime(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                            Official Venue
                          </label>
                          <input
                            type="text"
                            placeholder={isSolo ? 'e.g. Seminar Hall A' : isDuo ? 'e.g. Badminton Court 1' : 'e.g. Main Turf Stadium'}
                            value={newMatchVenue}
                            onChange={(e) => setNewMatchVenue(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                        <div className="flex items-center space-x-2">
                          <label className="text-[11px] font-semibold text-slate-600 uppercase">
                            Initial Status:
                          </label>
                          <select
                            value={newMatchStatus}
                            onChange={(e) => setNewMatchStatus(e.target.value as MatchStatus)}
                            className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="live">Live</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingMatch}
                          className="h-10 px-5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wide shadow-sm transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>
                            {isSubmittingMatch
                              ? 'Scheduling...'
                              : isSolo
                              ? 'Schedule Solo Match'
                              : isDuo
                              ? 'Schedule Doubles'
                              : 'Schedule Match Fixture'}
                          </span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )
            })()}
          </div>

          {/* Matches List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-serif font-bold uppercase tracking-wide text-slate-900">Scheduled Fixtures & Live Matches ({matches.length})</span>
              <span>Changes sync instantly across all clients</span>
            </div>

            {matches.length === 0 ? (
              <div className="py-12 text-center rounded-lg bg-white border border-dashed border-[#E5E0D8] space-y-2">
                <Radio className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-medium text-slate-700">
                  No matches currently scheduled.
                </div>
                <p className="text-[11px] text-slate-500">
                  Use the scheduler above to create matches between enrolled participants.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((match) => {
                  const isSoloCard = match.sport?.type === 'solo' || match.sport?.name?.toLowerCase() === 'chess'
                  const isDuoCard = match.sport?.type === 'duo'

                  return (
                    <div
                      key={match.id}
                      className="bg-white border border-[#E5E0D8] rounded-lg p-5 space-y-4"
                    >
                      {/* Match Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-blue-700 uppercase px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                            {match.sport?.name || 'Sport'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {isSoloCard ? '👤 1v1 Solo Match' : isDuoCard ? '👥 2v2 Doubles' : '🛡️ Team Match'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Status Dropdown */}
                          <select
                            value={match.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as MatchStatus
                              updateMatchScore(match.id, match.team_a_score, match.team_b_score, newStatus)
                              notify(`Match status changed to ${newStatus.toUpperCase()}`)
                            }}
                            className={`text-xs font-medium px-2 py-1 rounded-md border focus:outline-none ${
                              match.status === 'live'
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : match.status === 'completed'
                                ? 'bg-slate-100 border-slate-200 text-slate-700'
                                : 'bg-blue-50 border-blue-200 text-blue-700'
                            }`}
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="live">Live</option>
                            <option value="completed">Completed</option>
                          </select>

                          <button
                            onClick={() => handleRemoveMatch(match.id)}
                            className="p-1.5 rounded-md bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 shadow-2xs hover:border-rose-300 transition-colors"
                            title="Delete Match Fixture"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Score Controls */}
                      <div className="grid grid-cols-7 items-center gap-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        {/* Participant A */}
                        <div className="col-span-3 text-center">
                          <div className="font-semibold text-sm text-slate-900 truncate flex items-center justify-center space-x-1">
                            {isSoloCard ? <span className="text-xs text-blue-600">👤</span> : null}
                            <span className="truncate">{match.team_a?.name || (isSoloCard ? 'Player 1' : 'Team A')}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {match.team_a?.department || 'Department'}
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
                              className="w-8 h-8 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs font-bold font-mono"
                            >
                              -
                            </button>
                            <span className="text-2xl font-bold font-mono text-slate-900 min-w-[32px]">
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
                              className="w-8 h-8 rounded-md bg-white hover:bg-slate-100 text-blue-600 border border-slate-200 shadow-2xs font-bold font-mono"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* VS Divider */}
                        <div className="col-span-1 text-center text-xs text-slate-400 font-medium">
                          VS
                        </div>

                        {/* Participant B */}
                        <div className="col-span-3 text-center">
                          <div className="font-semibold text-sm text-slate-900 truncate flex items-center justify-center space-x-1">
                            {isSoloCard ? <span className="text-xs text-blue-600">👤</span> : null}
                            <span className="truncate">{match.team_b?.name || (isSoloCard ? 'Player 2' : 'Team B')}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {match.team_b?.department || 'Department'}
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
                              className="w-8 h-8 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs font-bold font-mono"
                            >
                              -
                            </button>
                            <span className="text-2xl font-bold font-mono text-slate-900 min-w-[32px]">
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
                              className="w-8 h-8 rounded-md bg-white hover:bg-slate-100 text-blue-600 border border-slate-200 shadow-2xs font-bold font-mono"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Scheduled Date & Time and Venue Info */}
                      <div className="pt-2.5 border-t border-slate-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 text-slate-700 font-mono text-[11px]">
                            <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                            <span className="font-bold">
                              {new Date(match.scheduled_at).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span className="text-slate-300">•</span>
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>
                              {new Date(match.scheduled_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (editingScheduleMatchId === match.id) {
                                setEditingScheduleMatchId(null)
                              } else {
                                setEditingScheduleMatchId(match.id)
                                const d = new Date(match.scheduled_at)
                                setEditMatchDate(!isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '')
                                const h = String(d.getHours()).padStart(2, '0')
                                const m = String(d.getMinutes()).padStart(2, '0')
                                setEditMatchTime(!isNaN(d.getTime()) ? `${h}:${m}` : '')
                                setEditMatchVenue(match.venue || '')
                              }
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
                          >
                            {editingScheduleMatchId === match.id ? 'Cancel' : 'Edit Schedule'}
                          </button>
                        </div>

                        {editingScheduleMatchId === match.id && (
                          <div className="bg-slate-50 p-3 rounded-md border border-slate-300 space-y-2 mt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Date</label>
                                <input
                                  type="date"
                                  value={editMatchDate}
                                  onChange={(e) => setEditMatchDate(e.target.value)}
                                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Time</label>
                                <input
                                  type="time"
                                  value={editMatchTime}
                                  onChange={(e) => setEditMatchTime(e.target.value)}
                                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Venue</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Main Turf Stadium"
                                  value={editMatchVenue}
                                  onChange={(e) => setEditMatchVenue(e.target.value)}
                                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                disabled={isUpdatingSchedule}
                                onClick={() => handleSaveMatchSchedule(match.id)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-2xs transition-colors"
                              >
                                {isUpdatingSchedule ? 'Saving...' : 'Save Schedule'}
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                          <span className="flex items-center space-x-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">Venue: {match.venue || match.sport?.venue || 'Arena Court'}</span>
                          </span>
                          <span className="text-emerald-700 text-[10px] shrink-0 font-medium">● Realtime Sync</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: TEAMS & SQUADS MANAGEMENT */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          {/* Enroll Team / Competitor Form Card */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-5 space-y-4">
            {(() => {
              const enrollSport = sports.find((s) => s.id === newTeamSportId) || sports[0]
              const isSoloEnroll = enrollSport?.type === 'solo' || enrollSport?.name?.toLowerCase() === 'chess'
              const isDuoEnroll = enrollSport?.type === 'duo'
              const isFootballEnroll = enrollSport?.name?.toLowerCase() === 'football'

              return (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-serif font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center space-x-2">
                        <Plus className="w-4 h-4 text-blue-600" />
                        <span>
                          {isSoloEnroll
                            ? `Enroll Competitor / Player (${enrollSport?.name || 'Solo'})`
                            : isDuoEnroll
                            ? `Enroll Doubles Pair (${enrollSport?.name || 'Doubles'})`
                            : isFootballEnroll
                            ? `Enroll Football Squad (6v6)`
                            : `Enroll Team Squad (${enrollSport?.name || 'Team'})`}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {isSoloEnroll
                          ? `Register an individual competitor for the ${enrollSport?.name || 'solo'} division.`
                          : isDuoEnroll
                          ? `Register a doubles pair for ${enrollSport?.name || 'doubles'} division.`
                          : isFootballEnroll
                          ? `Register a 6v6 football squad with tactical formation & manager.`
                          : `Register a departmental squad for ${enrollSport?.name || 'tournament'}.`}
                      </p>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium uppercase self-start">
                      {isSoloEnroll ? 'Player Enrollment' : isDuoEnroll ? 'Pair Enrollment' : 'Squad Enrollment'}
                    </span>
                  </div>

                  <form onSubmit={handleAddTeam} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Event / Sport
                      </label>
                      <select
                        value={newTeamSportId}
                        onChange={(e) => setNewTeamSportId(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                      >
                        {sports.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.type === 'solo' ? '1v1 Solo' : s.type === 'duo' ? '2v2 Duo' : 'Team'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        {isSoloEnroll ? 'Player / Competitor Name' : isDuoEnroll ? 'Pair Name / Members' : 'Team / Squad Name'}
                      </label>
                      <input
                        type="text"
                        placeholder={
                          isSoloEnroll
                            ? 'e.g. Magnus Carlsen or Ada Lovelace'
                            : isDuoEnroll
                            ? 'e.g. Alan & Grace or Systems Pair'
                            : isFootballEnroll
                            ? 'e.g. Neural Nets FC'
                            : 'e.g. Cyber Strikers'
                        }
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        required
                        className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Department / Lab
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CS AI & Robotics Lab"
                        value={newTeamDept}
                        onChange={(e) => setNewTeamDept(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                      />
                    </div>

                    {isSoloEnroll ? (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                          Title / Designation (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Candidate Master / Captain"
                          value={newTeamRating}
                          onChange={(e) => setNewTeamRating(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                        />
                      </div>
                    ) : isDuoEnroll ? (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                          Pair Seed / Tier (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Seed #1 or Tier A"
                          value={newTeamRating}
                          onChange={(e) => setNewTeamRating(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                          Team Manager / Coach
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Prof. Alan Turing"
                          value={newTeamManager}
                          onChange={(e) => setNewTeamManager(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                        />
                      </div>
                    )}

                    {isFootballEnroll && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                          6v6 Formation Preset
                        </label>
                        <select
                          value={newTeamFormation}
                          onChange={(e) => setNewTeamFormation(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs font-mono"
                        >
                          <option value="2-2-1">2-2-1 (Balanced)</option>
                          <option value="2-1-2">2-1-2 (Attacking)</option>
                          <option value="3-1-1">3-1-1 (Defensive)</option>
                          <option value="1-3-1">1-3-1 (Midfield)</option>
                          <option value="1-2-2">1-2-2 (Counter)</option>
                        </select>
                      </div>
                    )}

                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={isSubmittingTeam}
                        className="w-full h-11 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium tracking-wide shadow-sm transition-all disabled:opacity-50 flex items-center justify-center"
                      >
                        {isSubmittingTeam
                          ? 'Enrolling...'
                          : isSoloEnroll
                          ? '+ Enroll Competitor'
                          : isDuoEnroll
                          ? '+ Enroll Pair'
                          : '+ Enroll Team'}
                      </button>
                    </div>
                  </form>
                </div>
              )
            })()}
          </div>

          {/* Registered Teams & Competitors List with Event Filtering */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-sm uppercase tracking-wide">
                  Registered Participants &amp; Squads ({teams.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Manage active competitors, squads, and rosters across all tournament divisions.
                </p>
              </div>

              {/* Event Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setTeamFilterSportId('all')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    teamFilterSportId === 'all'
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
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
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${
                        teamFilterSportId === sport.id
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {sport.name} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Teams & Competitors Grid */}
            {(() => {
              const displayTeams = teams.filter((t) =>
                teamFilterSportId === 'all' ? true : t.sport_id === teamFilterSportId
              )

              if (displayTeams.length === 0) {
                return (
                  <div className="py-12 text-center rounded-lg bg-slate-50 border border-dashed border-slate-300 space-y-2">
                    <Shield className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="text-xs font-medium text-slate-700">
                      No participants registered in this division yet.
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Use the form above to enroll a competitor or squad into {sports.find((s) => s.id === teamFilterSportId)?.name || 'the tournament'}.
                    </p>
                  </div>
                )
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayTeams.map((team) => {
                    const sport = sports.find((s) => s.id === team.sport_id)
                    const roster = players.filter((p) => p.team_id === team.id)
                    const iconPlayer = roster.find((p) => p.is_icon)
                    const isSolo = sport?.type === 'solo' || team.formation === 'Solo' || sport?.name?.toLowerCase() === 'chess'
                    const isDuo = sport?.type === 'duo' || team.formation === 'Duo'
                    const isFootball = sport?.name?.toLowerCase() === 'football'

                    return (
                      <div
                        key={team.id}
                        className="p-4 rounded-lg bg-white border border-[#E5E0D8] flex items-start justify-between hover:border-slate-300 transition-all gap-2"
                      >
                        <div className="flex items-start space-x-3 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center font-bold font-mono text-xs text-slate-700 shrink-0 mt-0.5">
                            {(team.name || 'T').substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-xs text-[#1A1A1A] truncate flex items-center space-x-1">
                              <span>{team.name}</span>
                              {isSolo && <span className="text-blue-600 text-[10px]">👤</span>}
                              {isDuo && <span className="text-blue-600 text-[10px]">👥</span>}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {team.department}
                            </div>

                            {/* Manager / Title / Rating Display */}
                            <div className="text-[10px] text-slate-600 mt-1">
                              {editingManagerTeamId === team.id ? (
                                <div className="flex items-center space-x-1 pt-0.5">
                                  <input
                                    type="text"
                                    value={tempManagerName}
                                    onChange={(e) => setTempManagerName(e.target.value)}
                                    placeholder={isSolo ? 'Title / Designation' : isDuo ? 'Seed / Tier' : 'Manager Name'}
                                    className="bg-white border border-slate-300 rounded-md px-1.5 py-0.5 text-[10px] text-slate-900 focus:outline-none focus:border-blue-600 w-28"
                                  />
                                  <button
                                    onClick={async () => {
                                      await updateTeam(team.id, { manager: tempManagerName.trim() })
                                      setEditingManagerTeamId(null)
                                      notify(`Updated for ${team.name}`)
                                    }}
                                    className="px-2 py-0.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-[9px]"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingManagerTeamId(null)}
                                    className="text-slate-400 hover:text-slate-700 text-[9px]"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1.5">
                                  <span className="text-slate-500">
                                    {isSolo ? 'Title:' : isDuo ? 'Seed:' : 'Mgr:'}
                                  </span>
                                  <span className="text-slate-900 font-medium truncate max-w-[110px]">
                                    {team.manager || <span className="text-slate-400 italic">None</span>}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setEditingManagerTeamId(team.id)
                                      setTempManagerName(team.manager || '')
                                    }}
                                    className="text-blue-600 hover:underline text-[9px] ml-1"
                                  >
                                    Edit
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                                {sport?.name || 'Sport'}
                              </span>
                              {isFootball && team.formation && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                                  Shape: {team.formation}
                                </span>
                              )}
                              {isFootball && iconPlayer && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                                  ⭐ {iconPlayer.name.split(' ')[0]}
                                </span>
                              )}
                              {!isSolo && (
                                <span className="text-[9px] text-slate-500">
                                  {roster.length} Athletes
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveTeam(team.id, team.name)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                          title={`Remove ${team.name}`}
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
        <div className="bg-white border border-[#E5E0D8] rounded-lg overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-sm">
                Standings Points &amp; Stats Controller
              </h3>
              <p className="text-xs text-slate-500">
                Direct modifications apply instantly to the public standings page.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {leaderboards.length} entries recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 tracking-wider uppercase">
                  <th className="py-3 px-3">Team / Lab</th>
                  <th className="py-3 px-2 text-center">Played</th>
                  <th className="py-3 px-2 text-center">Won</th>
                  <th className="py-3 px-2 text-center">Drawn</th>
                  <th className="py-3 px-2 text-center">Lost</th>
                  <th className="py-3 px-2 text-center text-blue-600">Points</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboards.length > 0 ? (
                  leaderboards.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-900">
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
                          className="w-12 bg-white border border-slate-300 rounded-md px-1.5 py-1 text-center text-slate-900 font-mono focus:outline-none focus:border-blue-600"
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
                          className="w-12 bg-white border border-slate-300 rounded-md px-1.5 py-1 text-center text-emerald-700 font-medium font-mono focus:outline-none focus:border-blue-600"
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
                          className="w-12 bg-white border border-slate-300 rounded-md px-1.5 py-1 text-center text-slate-700 font-mono focus:outline-none focus:border-blue-600"
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
                          className="w-12 bg-white border border-slate-300 rounded-md px-1.5 py-1 text-center text-rose-700 font-medium font-mono focus:outline-none focus:border-blue-600"
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
                          className="w-14 bg-white border border-blue-400 rounded-md px-1.5 py-1 text-center text-blue-700 font-bold font-mono text-sm focus:outline-none focus:border-blue-600"
                        />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => notify(`Updated stats for ${entry.team?.name}`)}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-medium transition-colors border border-slate-200"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Trophy className="w-8 h-8 text-slate-400 mx-auto" />
                        <span className="text-slate-700 font-medium text-sm">
                          No standings recorded yet across tournament divisions.
                        </span>
                        <span className="text-xs text-slate-500">
                          Enrolling teams under &apos;Teams &amp; Squads&apos; automatically initializes them on the leaderboard.
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('teams')}
                          className="mt-2 px-3.5 h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors flex items-center"
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
        <div className="bg-white border border-[#E5E0D8] rounded-lg shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif tracking-tight font-black text-[#1A1A1A] text-lg flex items-center space-x-2">
                <Crosshair className="w-5 h-5 text-blue-600" />
                <span>Tactical Formation Studio</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Design, preview, and publish dynamic formations. Supports standard presets, custom line tiers, and tactical modifiers.
              </p>
            </div>
            <span className="text-xs font-mono text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200 font-medium self-start">
              Admin Engine
            </span>
          </div>

          {footballTeams.length === 0 ? (
            <div className="py-16 text-center rounded-lg bg-white border border-dashed border-[#E5E0D8] space-y-3">
              <Crosshair className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-900">
                No football teams registered yet
              </div>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Enroll a team under the Football division in the Teams &amp; Squads tab to calibrate tactical coordinates, formations, and pitch depth.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('teams')}
                className="h-11 px-5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
              >
                Go to Teams &amp; Squads Tab →
              </button>
            </div>
          ) : (
            <>
              {/* 1. Target Team Selector */}
              <div className="space-y-2">
                <label className="block text-xs uppercase text-slate-600 font-semibold">
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
                        className={`p-3 rounded-md text-left border transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-semibold text-xs text-slate-900 truncate">{team.name}</div>
                        <div className="text-[11px] font-mono text-blue-600 mt-1 flex items-center space-x-1">
                          <span>Shape: {team.formation || '2-2-1'}</span>
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
                      <span className="text-xs uppercase text-slate-600 font-semibold">
                        2. 6v6 Tactical Presets Library (1 GK + 5 Outfielders)
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {/* 2 at the back */}
                      <div>
                        <span className="text-[11px] text-slate-500 font-medium uppercase">2 Defenders</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {['2-2-1', '2-1-2', '2-3-0'].map((fmt) => (
                            <button
                              key={fmt}
                              onClick={() => {
                                setSelectedFormationString(fmt)
                                setCustomFormationInput(fmt)
                              }}
                              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                                selectedFormationString === fmt
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {fmt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3 at the back */}
                      <div>
                        <span className="text-[11px] text-slate-500 font-medium uppercase">3 Defenders</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {['3-1-1', '3-2-0'].map((fmt) => (
                            <button
                              key={fmt}
                              onClick={() => {
                                setSelectedFormationString(fmt)
                                setCustomFormationInput(fmt)
                              }}
                              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                                selectedFormationString === fmt
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {fmt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 1 at the back */}
                      <div>
                        <span className="text-[11px] text-slate-500 font-medium uppercase">1 Defender (Sweeper / Anchor)</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {['1-3-1', '1-2-2'].map((fmt) => (
                            <button
                              key={fmt}
                              onClick={() => {
                                setSelectedFormationString(fmt)
                                setCustomFormationInput(fmt)
                              }}
                              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                                selectedFormationString === fmt
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
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
                  <div className="space-y-2 p-4 rounded-lg bg-slate-50 border border-[#E5E0D8]">
                    <span className="text-xs uppercase text-blue-600 font-semibold flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>3. Custom Formation Builder (Any Shape)</span>
                    </span>
                    <p className="text-xs text-slate-600">
                      Type any custom tier breakdown (e.g. <code className="text-blue-600 font-mono">2-2-1</code>, <code className="text-blue-600 font-mono">2-1-2</code>, <code className="text-blue-600 font-mono">1-3-1</code>, <code className="text-blue-600 font-mono">3-1-1</code>). Coordinates are dynamically generated!
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
                        className="w-36 bg-white border border-slate-300 focus:border-blue-600 rounded-md px-3 py-2 text-xs text-slate-900 font-mono font-semibold focus:outline-none"
                      />

                      <button
                        onClick={() => {
                          if (customFormationInput.trim()) {
                            setSelectedFormationString(customFormationInput.trim())
                            notify(`Tactical shape updated to ${customFormationInput.trim()}`)
                          }
                        }}
                        className="h-10 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-2xs"
                      >
                        Apply Shape
                      </button>
                    </div>
                  </div>

                  {/* Tactical Sliders / Modifiers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-[#E5E0D8]">
                    {/* Defensive Line Height */}
                    <div className="space-y-2">
                      <span className="text-xs text-slate-600 font-medium uppercase block">
                        Defensive Line Depth
                      </span>
                      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-md border border-slate-200">
                        {(['low', 'mid', 'high'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => setDefensiveLineHeight(level)}
                            className={`py-1.5 rounded-md text-xs uppercase font-medium transition-all ${
                              defensiveLineHeight === level
                                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pitch Width */}
                    <div className="space-y-2">
                      <span className="text-xs text-slate-600 font-medium uppercase block">
                        Team Width Stance
                      </span>
                      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-md border border-slate-200">
                        {(['narrow', 'standard', 'wide'] as const).map((width) => (
                          <button
                            key={width}
                            onClick={() => setPitchWidthSetting(width)}
                            className={`py-1.5 rounded-md text-xs uppercase font-medium transition-all ${
                              pitchWidthSetting === width
                                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
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
                    className="w-full h-11 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Publish Formation &amp; Sync Matrix</span>
                  </button>
                </div>

                {/* Right Pitch Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase text-slate-600 font-semibold">
                      Live Field Matrix Preview
                    </span>
                    <span className="text-xs font-mono text-blue-600 font-semibold">
                      {selectedFormationString} ({outfieldCount + 1} players)
                    </span>
                  </div>

                  <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-[#1F3A2B] shadow-sm tactical-pitch">
                    {/* Tactical Regulation Markings */}
                    <div className="absolute inset-3 border border-white/20 rounded pointer-events-none">
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2" />
                      <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-10 border-b border-x border-white/20 rounded-b" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-10 border-t border-x border-white/20 rounded-t" />
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
                                ? 'bg-amber-600 text-white border-amber-400'
                                : 'bg-blue-600 text-white border-blue-400'
                            }`}
                          >
                            {isGK ? 'GK' : idx}
                          </div>
                          <span className="text-[9px] text-white/90 mt-0.5 truncate max-w-[60px] text-center leading-none font-medium">
                            {node.role.split(' ')[0]}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-[#E5E0D8] text-xs text-slate-600">
                    <span className="text-slate-900 font-semibold block mb-0.5">Scalable Dynamic Coordinates:</span>
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
          <div className="bg-white border border-[#E5E0D8] rounded-lg shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif tracking-tight font-black text-[#1A1A1A] text-lg flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span>Enroll New Athlete to Squad</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Assign athletes to registered teams within tournament divisions.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium self-start">
                Squad Enrollment
              </span>
            </div>

            {/* Step 1: Event Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-md bg-slate-50 border border-[#E5E0D8]">
              <span className="text-xs font-semibold text-slate-600 shrink-0 uppercase flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Division:</span>
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
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {sport.name} ({teamCount} teams)
                    </button>
                  )
                })}
              </div>
            </div>

            {teamsInEnrollSport.length === 0 ? (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center space-x-2 text-amber-800 font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    No teams currently registered under{' '}
                    {sports.find((s) => s.id === playerEnrollSportId)?.name || 'this event'}.
                  </span>
                </div>
                <p className="text-slate-600 text-xs">
                  Athletes must be assigned to an enrolled squad. Please enroll a team first in the Teams & Squads tab.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('teams')}
                  className="h-11 px-5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
                >
                  Go to Teams &amp; Squads Tab →
                </button>
              </div>
            ) : (
              <AdminPlayerForm
                teams={teamsInEnrollSport}
                sports={sports}
                activeSportId={playerEnrollSportId}
                addPlayer={addPlayer}
                updatePlayer={updatePlayer}
                setIconPlayer={setIconPlayer}
                notify={notify}
              />
            )}
          </div>

          {/* Registered Players List with Filter Bar */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif tracking-tight font-black text-[#1A1A1A] text-lg">
                  Registered Squad Members ({players.length})
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
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
                  className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs font-medium"
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
                  className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs font-medium"
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
                  <div className="py-12 text-center rounded-lg bg-white border border-dashed border-[#E5E0D8] space-y-2">
                    <Users className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="text-xs font-semibold text-slate-900">
                      No athletes match the current filter selection.
                    </div>
                    <p className="text-xs text-slate-600">
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
                    return (
                      <PlayerCard
                        key={p.id}
                        player={p}
                        teamName={team?.name}
                        sportName={sport?.name}
                        sportType={sport?.type}
                        variant="admin"
                        onEdit={(player) => setEditingPlayer(player)}
                        onMakeIcon={async (player) => {
                          await setIconPlayer(player.team_id, player.id)
                          notify(`⭐ ${player.name} designated as team icon athlete!`)
                        }}
                        onRemove={(player) => {
                          if (confirm(`Remove ${player.name} from squad?`)) {
                            removePlayer(player.id)
                            notify(`Removed ${player.name}`)
                          }
                        }}
                      />
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
          <div className="bg-white border border-[#E5E0D8] rounded-lg shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif tracking-tight font-black text-[#1A1A1A] text-lg flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>Enroll New Tournament Division</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Scales the tournament instantly. New sports immediately appear across hero highlights, leaderboards, and rosters.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium self-start">
                Dynamic Scaling
              </span>
            </div>

            <form onSubmit={handleAddSport} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
              <div>
                <label className="block text-xs uppercase text-slate-600 font-semibold mb-1">
                  Sport / Game Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Table Tennis, Valorant, Basketball"
                  value={newSportName}
                  onChange={(e) => setNewSportName(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-600 font-semibold mb-1">
                  Division Format
                </label>
                <select
                  value={newSportType}
                  onChange={(e) => setNewSportType(e.target.value as SportType)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs font-medium"
                >
                  <option value="team">Team Squad (Multi-player, e.g. Football)</option>
                  <option value="duo">Doubles / Pairs (2v2, e.g. Badminton, Carrom)</option>
                  <option value="solo">Solo (1v1 Single player, e.g. Chess)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-600 font-semibold mb-1">
                  Official Venue / Arena
                </label>
                <input
                  type="text"
                  placeholder="e.g. Main Turf Stadium, Seminar Hall A"
                  value={newSportVenue}
                  onChange={(e) => setNewSportVenue(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-600 font-semibold mb-1">
                  Sport Image Policy
                </label>
                <div className="w-full bg-slate-50 border border-[#E5E0D8] rounded-md px-3 py-2 text-xs text-slate-600 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  <span className="truncate">Visuals provided for Football, Badminton, Chess &amp; Carroms</span>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSubmittingSport}
                  className="w-full h-11 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-2xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmittingSport ? 'Registering...' : '+ Register Division'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Sports & Divisions Grid */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif tracking-tight font-black text-[#1A1A1A] text-lg flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  <span>Active Registered Divisions ({sports.length})</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Realtime database-backed tournament categories with dedicated display imagery.
                </p>
              </div>
              <span className="text-xs text-slate-600 font-mono">
                {sports.length} Active
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
                    className="bg-white border border-[#E5E0D8] hover:border-slate-300 rounded-lg overflow-hidden transition-all flex flex-col justify-between shadow-2xs"
                  >
                    {/* Sport Display Image Cover - Strictly for 4 supported sports */}
                    {meta.imageUrl ? (
                      <div className="relative h-32 w-full overflow-hidden bg-slate-100 border-b border-[#E5E0D8]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={meta.imageUrl}
                          alt={sport.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (isCsCupFootball(sport.name)) {
                              if (e.currentTarget.src !== SPORT_SPECIFIC_IMAGES.football) {
                                e.currentTarget.src = SPORT_SPECIFIC_IMAGES.football
                              }
                            }
                          }}
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-0.5" />
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${meta.bgBadgeClass}`}
                          >
                            {meta.badgeText}
                          </span>
                          <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                            <Icon className={`w-3.5 h-3.5 ${meta.colorClass}`} />
                          </div>
                        </div>

                        <div className="absolute bottom-2 right-2">
                          <button
                            onClick={() => {
                              setEditingImageSportId(editingImageSportId === sport.id ? null : sport.id)
                              setTempImageName(sport.image_url || meta.imageUrl || '')
                            }}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 flex items-center space-x-1 transition-colors shadow-xs"
                            title="Change display image"
                          >
                            <ImageIcon className="w-2.5 h-2.5 text-blue-600" />
                            <span>Image</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 pb-0 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${meta.bgBadgeClass}`}
                        >
                          {meta.badgeText}
                        </span>
                        <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center">
                          <Icon className={`w-4 h-4 ${meta.colorClass}`} />
                        </div>
                      </div>
                    )}

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#1A1A1A] flex items-center space-x-2">
                          <span>{sport.name}</span>
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                          {meta.description}
                        </p>
                      </div>

                      <div className="space-y-2.5 pt-2 border-t border-slate-100">
                        {/* Image Editor Slot */}
                        {editingImageSportId === sport.id && meta.imageUrl && (
                          <div className="p-2.5 rounded-md bg-slate-50 border border-blue-200 space-y-1.5 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span className="text-blue-600 font-medium text-[11px] flex items-center space-x-1">
                                <ImageIcon className="w-3 h-3" />
                                <span>CUSTOM COVER IMAGE</span>
                              </span>
                              <button
                                onClick={() => setEditingImageSportId(null)}
                                className="text-slate-400 hover:text-slate-700 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                            <input
                              type="url"
                              value={tempImageName}
                              onChange={(e) => setTempImageName(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                            />
                            <div className="flex items-center justify-between pt-1">
                              <button
                                onClick={async () => {
                                  const fallback = getSportDisplayImage(sport.name, sport.type)
                                  await updateSport(sport.id, { image_url: fallback })
                                  setEditingImageSportId(null)
                                  notify(`Reset image for ${sport.name}`)
                                }}
                                className="text-[10px] text-slate-500 hover:text-slate-800 underline"
                              >
                                Auto-Assign
                              </button>
                              <button
                                onClick={async () => {
                                  await updateSport(sport.id, { image_url: tempImageName.trim() })
                                  setEditingImageSportId(null)
                                  notify(`✅ Updated display image for ${sport.name}`)
                                }}
                                className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
                              >
                                Save Image
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Venue Management Slot */}
                        <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span className="flex items-center space-x-1.5 text-slate-700 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-blue-600" />
                              <span>EVENT VENUE</span>
                            </span>
                            {editingVenueSportId !== sport.id ? (
                              <button
                                onClick={() => {
                                  setEditingVenueSportId(sport.id)
                                  setTempVenueName(sport.venue || '')
                                }}
                                className="text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1 text-xs"
                              >
                                <Edit2 className="w-2.5 h-2.5" />
                                <span>Change Venue</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setEditingVenueSportId(null)}
                                className="text-slate-400 hover:text-slate-700 text-xs"
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
                                className="flex-1 bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                              />
                              <button
                                onClick={async () => {
                                  await updateSport(sport.id, { venue: tempVenueName.trim() })
                                  setEditingVenueSportId(null)
                                  notify(`✅ Updated venue for ${sport.name} to "${tempVenueName.trim()}"`)
                                }}
                                className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-800 truncate flex items-center space-x-1.5">
                              <span className="text-slate-500">Slot:</span>
                              <span className="font-medium text-blue-600 truncate">
                                {sport.venue || <span className="text-slate-400 italic font-normal">No Venue Assigned</span>}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="bg-slate-100/70 p-1.5 rounded-md border border-slate-200">
                            <span className="text-slate-500 block text-[10px] uppercase font-medium">Teams</span>
                            <span className="font-semibold text-slate-900 font-mono">{sportTeams.length}</span>
                          </div>
                          <div className="bg-slate-100/70 p-1.5 rounded-md border border-slate-200">
                            <span className="text-slate-500 block text-[10px] uppercase font-medium">Matches</span>
                            <span className="font-semibold text-slate-900 font-mono">{sportMatches.length}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-1">
                          <Link
                            href={`/leaderboards?sport=${encodeURIComponent(sport.name)}`}
                            className="flex-1 h-10 px-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs text-center transition-colors flex items-center justify-center space-x-1 font-medium border border-slate-200"
                          >
                            <span>Standings</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleRemoveSport(sport.id, sport.name)}
                            className="h-10 w-10 flex items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0 border border-transparent hover:border-rose-200"
                            title={`Delete ${sport.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
        <div className="bg-white border border-[#E5E0D8] rounded-lg shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-serif tracking-tight font-black text-[#1A1A1A] text-lg flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>Supabase Backend Integration &amp; Permissions</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Configure your Supabase database. If you already created tables, run the 1-Click Permissions Fix below to enable write access.
            </p>
          </div>

          {/* Connection Telemetry Card */}
          <div className="p-4 rounded-lg bg-slate-50 border border-[#E5E0D8] grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs uppercase text-slate-600 font-semibold">Connection &amp; Sync Status</span>
              <div className="mt-1.5 flex items-center space-x-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    supabaseConnected
                      ? 'bg-emerald-500 animate-pulse'
                      : isSupabaseLive
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
                <span className="font-semibold text-xs text-slate-900">
                  {supabaseConnected
                    ? 'SUPABASE SYNC LIVE & WRITABLE'
                    : isSupabaseLive
                    ? 'CREDENTIALS VALID • PERMISSIONS NEEDED'
                    : 'REACTIVE DEMO MODE (STANDALONE)'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase text-slate-600 font-semibold">Actions</span>
              <div className="mt-1 flex items-center space-x-3">
                <button
                  onClick={() => refreshSupabaseData()}
                  className="h-10 px-3.5 bg-slate-900 hover:bg-slate-800 text-xs rounded-md text-white flex items-center space-x-1.5 transition-colors font-medium shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Test Connection</span>
                </button>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center space-x-1 font-medium"
                >
                  <span>Open Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 1-CLICK PERMISSIONS FIX CARD */}
          <div className="p-5 rounded-lg bg-blue-50 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-slate-900">
                  Recommended: 1-Click Permissions &amp; RLS Write Access Fix
                </span>
              </div>
              <button
                onClick={handleCopyFixSql}
                className="flex items-center space-x-1.5 h-11 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-2xs transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>{fixSqlCopied ? 'Copied to Clipboard!' : 'Copy 1-Click Fix SQL'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paste and run this script in your <strong>Supabase SQL Editor</strong>. It grants table access to PostgreSQL roles and enables full read/write capabilities so your score modifications, formations, and player updates persist directly to Supabase without wiping your existing tables.
            </p>
          </div>

          {/* FULL SCHEMA SCRIPT */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-900 font-medium">
                Complete Clean Schema Script (<code className="text-blue-600 font-mono">supabase/schema.sql</code>)
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center space-x-1.5 h-10 px-3.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{sqlCopied ? 'Copied Full Schema!' : 'Copy Full Schema SQL'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Use this if you want to reset and recreate all 5 tables (<code className="text-slate-800 font-mono">sports</code>, <code className="text-slate-800 font-mono">teams</code>, <code className="text-slate-800 font-mono">players</code>, <code className="text-slate-800 font-mono">matches</code>, <code className="text-slate-800 font-mono">leaderboards</code>) with default CS department seed data.
            </p>
          </div>

          {/* Quick SQL Snippet Preview Box */}
          <div className="relative">
            <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-800 overflow-x-auto max-h-56">
{`-- Quick Fix Permissions, New Columns & RLS
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER TABLE IF EXISTS sports ADD COLUMN IF NOT EXISTS venue TEXT;
ALTER TABLE IF EXISTS sports ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE IF EXISTS teams ADD COLUMN IF NOT EXISTS manager TEXT;
ALTER TABLE IF EXISTS players ADD COLUMN IF NOT EXISTS is_icon BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS players ALTER COLUMN jersey_number DROP NOT NULL;

-- Clean up icon status for solo / duo sports
UPDATE players SET is_icon = FALSE WHERE team_id IN (
  SELECT t.id FROM teams t
  JOIN sports s ON t.sport_id = s.id
  WHERE s.type IN ('solo', 'duo') OR LOWER(s.name) = 'chess'
);

ALTER TABLE IF EXISTS sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS players ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leaderboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow All Access on sports" ON sports FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on matches" ON matches FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on leaderboards" ON leaderboards FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on teams" ON teams FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on players" ON players FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Storage bucket for player profile photos
INSERT INTO storage.buckets (id, name, public) VALUES ('player-photos', 'player-photos', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Allow Public Photo Read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'player-photos');
CREATE POLICY "Allow Photo Uploads" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'player-photos');
CREATE POLICY "Allow Photo Updates" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'player-photos');`}
            </pre>
          </div>

          {/* Environment Variables Guide */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-semibold text-slate-900">
              3-Step Supabase Activation Guide:
            </span>
            <ol className="list-decimal list-inside text-slate-600 space-y-1">
              <li>Create a free project at <span className="text-blue-600 font-medium">supabase.com</span>.</li>
              <li>Open the <span className="text-blue-600 font-medium">SQL Editor</span> in your Supabase dashboard and run the copied script above.</li>
              <li>Add your project URL &amp; anon public key into <code className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-blue-600 font-mono">.env.local</code>:
                <div className="mt-1.5 font-mono text-[11px] text-slate-800 bg-white p-2.5 rounded-md border border-slate-200">
                  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
                </div>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Edit Athlete Modal */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-6 max-w-xl w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-serif font-black text-[#1A1A1A] flex items-center space-x-2">
                  <span>Edit Athlete Profile</span>
                  {editingPlayer.is_icon && <span className="text-amber-600 text-xs font-semibold font-sans">⭐ Icon</span>}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Update athlete attributes, team assignment, and profile photo in Supabase.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlayer(null)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <AdminPlayerForm
              initialPlayer={editingPlayer}
              teams={teams}
              sports={sports}
              addPlayer={addPlayer}
              updatePlayer={updatePlayer}
              setIconPlayer={setIconPlayer}
              notify={notify}
              onSubmitSuccess={() => setEditingPlayer(null)}
              onCancel={() => setEditingPlayer(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
