'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Edit3,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Check,
  X,
  AlertCircle,
  Medal,
  Activity,
  Layers,
  HelpCircle,
  Eye,
  Lock,
  Shield,
} from 'lucide-react'
import {
  BadmintonCategory,
  BadmintonRoundKey,
  BadmintonDoublesMatch,
  INITIAL_BADMINTON_MATCHES,
  MENS_ROUNDS,
  WOMENS_ROUNDS,
  loadBadmintonMatches,
  saveBadmintonMatches,
  resetBadmintonMatchesToDefault,
  resolveBracketProgression,
} from '@/lib/badminton-doubles-data'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useTournament } from '@/context/TournamentContext'

export default function BadmintonBracketSection() {
  const { isAdmin } = useTournament()
  const [mounted, setMounted] = useState(false)
  const [matches, setMatches] = useState<BadmintonDoublesMatch[]>(() => resolveBracketProgression(INITIAL_BADMINTON_MATCHES))
  const [category, setCategory] = useState<BadmintonCategory>('mens')
  const [editingMatch, setEditingMatch] = useState<BadmintonDoublesMatch | null>(null)
  const [saveToast, setSaveToast] = useState<string | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [activeRoundTab, setActiveRoundTab] = useState<string>('')

  // Interactive path tracing state
  const [hoveredMatchId, setHoveredMatchId] = useState<string | null>(null)
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)

  // Active traced match id (clicked selection takes priority over hover)
  const activeFocusMatchId = selectedMatchId || hoveredMatchId

  // Modal edit form state
  const [editStatus, setEditStatus] = useState<'upcoming' | 'live' | 'completed'>('upcoming')
  const [editTeam1Score, setEditTeam1Score] = useState<number>(0)
  const [editTeam2Score, setEditTeam2Score] = useState<number>(0)
  const [editWinner, setEditWinner] = useState<1 | 2 | undefined>(undefined)
  const [editDate, setEditDate] = useState<string>('')
  const [editTime, setEditTime] = useState<string>('')
  const [editVenue, setEditVenue] = useState<string>('')
  const [editCourt, setEditCourt] = useState<string>('')
  const [editTeam1Name, setEditTeam1Name] = useState<string>('')
  const [editTeam2Name, setEditTeam2Name] = useState<string>('')

  const bracketScrollRef = useRef<HTMLDivElement>(null)

  // 1. Initial Load: Load from Supabase if configured, otherwise localStorage
  useEffect(() => {
    setMounted(true)
    let isMounted = true

    async function initData() {
      // Always load local storage first for instant zero-flicker render
      const localMatches = loadBadmintonMatches()
      if (isMounted) setMatches(localMatches)

      // If Supabase configured, attempt to fetch latest synced matches
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data, error } = await supabase
            .from('badminton_bracket_matches')
            .select('*')
            .order('display_order', { ascending: true })

          if (!error && data && data.length > 0 && isMounted) {
            const mappedMatches: BadmintonDoublesMatch[] = data.map((d: any) => ({
              id: d.id,
              matchCode: d.match_code,
              category: d.category,
              round: d.round,
              roundTitle: d.round_title,
              team1: {
                name: d.team1_name,
                isPlaceholder: d.team1_is_placeholder,
                sourceMatchId: d.team1_source_match_id,
                score: d.team1_score,
              },
              team2: {
                name: d.team2_name,
                isPlaceholder: d.team2_is_placeholder,
                sourceMatchId: d.team2_source_match_id,
                score: d.team2_score,
              },
              winnerTeam: d.winner_team,
              status: d.status,
              date: d.scheduled_date,
              time: d.scheduled_time,
              venue: d.venue,
              court: d.court,
              nextMatchId: d.next_match_id,
              nextMatchSlot: d.next_match_slot,
              notes: d.notes,
            }))

            const resolved = resolveBracketProgression(mappedMatches)
            setMatches(resolved)
            saveBadmintonMatches(resolved)
          }
        } catch (err) {
          console.warn('Could not load badminton matches from Supabase:', err)
        }
      }
    }

    initData()
    return () => {
      isMounted = false
    }
  }, [])

  // Auto-dismiss toast
  useEffect(() => {
    if (saveToast) {
      const timer = setTimeout(() => setSaveToast(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [saveToast])

  // Keyboard accessibility: Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingMatch) setEditingMatch(null)
        if (selectedMatchId) setSelectedMatchId(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingMatch, selectedMatchId])

  // Filter matches by current category (Men's or Women's)
  const categoryMatches = useMemo(() => {
    return matches.filter((m) => m.category === category)
  }, [matches, category])

  // Current rounds definition
  const currentRounds = category === 'mens' ? MENS_ROUNDS : WOMENS_ROUNDS

  // Matches grouped by round
  const matchesByRound = useMemo(() => {
    const map: Record<BadmintonRoundKey, BadmintonDoublesMatch[]> = {
      preliminary: [],
      round_of_16: [],
      quarter_finals: [],
      semi_finals: [],
      finals: [],
    }

    categoryMatches.forEach((m) => {
      if (map[m.round]) {
        map[m.round].push(m)
      }
    })

    return map
  }, [categoryMatches])

  // Compute all match IDs that lie on the path of activeFocusMatchId
  const activePathMatchIds = useMemo(() => {
    if (!activeFocusMatchId) return new Set<string>()

    const connected = new Set<string>()
    connected.add(activeFocusMatchId)

    // Trace ancestors (matches feeding into this one)
    function addAncestors(mId: string) {
      const m = matches.find((x) => x.id === mId)
      if (!m) return
      if (m.team1.sourceMatchId) {
        connected.add(m.team1.sourceMatchId)
        addAncestors(m.team1.sourceMatchId)
      }
      if (m.team2.sourceMatchId) {
        connected.add(m.team2.sourceMatchId)
        addAncestors(m.team2.sourceMatchId)
      }
    }

    // Trace descendants (path forward toward final)
    function addDescendants(mId: string) {
      const m = matches.find((x) => x.id === mId)
      if (!m) return
      if (m.nextMatchId) {
        connected.add(m.nextMatchId)
        addDescendants(m.nextMatchId)
      }
    }

    addAncestors(activeFocusMatchId)
    addDescendants(activeFocusMatchId)
    return connected
  }, [activeFocusMatchId, matches])

  // Ordered path breadcrumb list for the active focus
  const activePathBreadcrumb = useMemo(() => {
    if (!activeFocusMatchId) return []
    const roundOrder: Record<BadmintonRoundKey, number> = {
      preliminary: 1,
      round_of_16: 2,
      quarter_finals: 3,
      semi_finals: 4,
      finals: 5,
    }
    return matches
      .filter((m) => activePathMatchIds.has(m.id) && m.category === category)
      .sort((a, b) => roundOrder[a.round] - roundOrder[b.round])
  }, [activeFocusMatchId, activePathMatchIds, matches, category])

  // Find championship winner if final is completed
  const champion = useMemo(() => {
    const finalMatch = categoryMatches.find((m) => m.round === 'finals')
    if (finalMatch && finalMatch.winnerTeam && finalMatch.status === 'completed') {
      const winSlot = finalMatch.winnerTeam === 1 ? finalMatch.team1 : finalMatch.team2
      if (!winSlot.isPlaceholder && winSlot.name && !winSlot.name.startsWith('Winner ')) {
        return winSlot.name
      }
    }
    return null
  }, [categoryMatches])

  // Stats calculation
  const totalMatchesCount = categoryMatches.length
  const completedMatchesCount = categoryMatches.filter((m) => m.status === 'completed').length

  // Open Edit Modal (Admins only)
  const openEditModal = (match: BadmintonDoublesMatch) => {
    if (!isAdmin) {
      console.warn('Unauthorized: Only administrators can edit fixtures.')
      return
    }
    setEditingMatch(match)
    setEditStatus(match.status)
    setEditTeam1Score(match.team1.score ?? 0)
    setEditTeam2Score(match.team2.score ?? 0)
    setEditWinner(match.winnerTeam)
    setEditDate(match.date)
    setEditTime(match.time)
    setEditVenue(match.venue || 'Indoor Badminton Arena')
    setEditCourt(match.court || 'Court 1')
    setEditTeam1Name(match.team1.name)
    setEditTeam2Name(match.team2.name)
  }

  // Handle Score Change (Auto-suggest winner if score difference)
  const handleScoreChange = (team: 1 | 2, val: number) => {
    const cleanVal = Math.max(0, val)
    if (team === 1) {
      setEditTeam1Score(cleanVal)
      if (cleanVal >= 21 && cleanVal - editTeam2Score >= 2) {
        setEditWinner(1)
        setEditStatus('completed')
      }
    } else {
      setEditTeam2Score(cleanVal)
      if (cleanVal >= 21 && cleanVal - editTeam1Score >= 2) {
        setEditWinner(2)
        setEditStatus('completed')
      }
    }
  }

  // Save Modal Edits (Admins only)
  const handleSaveMatchEdits = async () => {
    if (!isAdmin) {
      console.warn('Unauthorized: Only administrators can save fixture updates.')
      return
    }
    if (!editingMatch) return

    const updatedMatches = matches.map((m) => {
      if (m.id === editingMatch.id) {
        return {
          ...m,
          status: editStatus,
          winnerTeam: editWinner,
          date: editDate,
          time: editTime,
          venue: editVenue,
          court: editCourt,
          team1: {
            ...m.team1,
            name: editTeam1Name.trim() || m.team1.name,
            score: editTeam1Score,
          },
          team2: {
            ...m.team2,
            name: editTeam2Name.trim() || m.team2.name,
            score: editTeam2Score,
          },
        }
      }
      return m
    })

    // Resolve cascading progression
    const resolved = resolveBracketProgression(updatedMatches)
    setMatches(resolved)
    saveBadmintonMatches(resolved)

    // Sync to Supabase if connected
    if (isSupabaseConfigured() && supabase) {
      try {
        const target = resolved.find((m) => m.id === editingMatch.id)
        if (target) {
          await supabase
            .from('badminton_bracket_matches')
            .update({
              status: target.status,
              winner_team: target.winnerTeam || null,
              team1_name: target.team1.name,
              team1_score: target.team1.score ?? 0,
              team2_name: target.team2.name,
              team2_score: target.team2.score ?? 0,
              scheduled_date: target.date,
              scheduled_time: target.time,
              venue: target.venue,
              court: target.court,
              updated_at: new Date().toISOString(),
            })
            .eq('id', target.id)
        }
      } catch (err) {
        console.warn('Failed to sync match update to Supabase:', err)
      }
    }

    const winnerName =
      editWinner === 1
        ? editTeam1Name || editingMatch.team1.name
        : editWinner === 2
        ? editTeam2Name || editingMatch.team2.name
        : null

    const advanceMsg =
      winnerName && editingMatch.nextMatchId
        ? ` • ${winnerName} advanced to next round!`
        : ''

    setSaveToast(`Match ${editingMatch.matchCode} updated successfully${advanceMsg}`)
    setEditingMatch(null)
  }

  // Quick Winner Selector directly from bracket card (Admins only)
  const handleQuickAdvance = (match: BadmintonDoublesMatch, winnerTeam: 1 | 2) => {
    if (!isAdmin) {
      console.warn('Unauthorized: Only administrators can advance bracket matches.')
      return
    }

    const newWinner = match.winnerTeam === winnerTeam ? undefined : winnerTeam
    const newStatus = newWinner ? 'completed' : 'upcoming'

    const updatedMatches = matches.map((m) => {
      if (m.id === match.id) {
        return {
          ...m,
          winnerTeam: newWinner,
          status: newStatus as any,
          team1: {
            ...m.team1,
            score: newWinner === 1 ? (m.team1.score ? m.team1.score : 21) : m.team1.score,
          },
          team2: {
            ...m.team2,
            score: newWinner === 2 ? (m.team2.score ? m.team2.score : 21) : m.team2.score,
          },
        }
      }
      return m
    })

    const resolved = resolveBracketProgression(updatedMatches)
    setMatches(resolved)
    saveBadmintonMatches(resolved)

    const winningName =
      newWinner === 1 ? match.team1.name : newWinner === 2 ? match.team2.name : null

    if (winningName && match.nextMatchId) {
      setSaveToast(`${winningName} won ${match.matchCode} and progressed to the next round!`)
    } else if (newWinner === undefined) {
      setSaveToast(`Match ${match.matchCode} result reset to pending.`)
    }
  }

  // Reset to initial PDF official draw (Admins only)
  const handleResetDraw = () => {
    if (!isAdmin) {
      console.warn('Unauthorized: Only administrators can reset the tournament bracket.')
      return
    }
    const fresh = resetBadmintonMatchesToDefault()
    setMatches(fresh)
    setShowResetConfirm(false)
    setSelectedMatchId(null)
    setHoveredMatchId(null)
    setSaveToast('Tournament bracket restored to official CS Games draw.')
  }

  // Smooth scroll bracket container to a round
  const scrollToRound = (roundKey: string) => {
    setActiveRoundTab(roundKey)
    if (bracketScrollRef.current) {
      const el = bracketScrollRef.current.querySelector(`[data-round="${roundKey}"]`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
      }
    }
  }

  // Toggle match selection for path pinning
  const toggleSelectMatch = (mId: string) => {
    setSelectedMatchId((prev) => (prev === mId ? null : mId))
  }

  // Helper to render an individual interactive match card
  const renderMatchCard = (match?: BadmintonDoublesMatch) => {
    if (!match) return null
    const isCompleted = match.status === 'completed'
    const isLive = match.status === 'live'
    const team1Won = match.winnerTeam === 1
    const team2Won = match.winnerTeam === 2
    const isInPath = activePathMatchIds.has(match.id)
    const isFocused = activeFocusMatchId === match.id
    const hasActivePath = activePathMatchIds.size > 0

    return (
      <div
        key={match.id}
        onMouseEnter={() => setHoveredMatchId(match.id)}
        onMouseLeave={() => setHoveredMatchId(null)}
        onClick={() => toggleSelectMatch(match.id)}
        className={`group relative rounded-xl border p-3.5 transition-all duration-300 bg-ink-800 cursor-pointer shadow-card h-[162px] flex flex-col justify-between ${
          isFocused
            ? 'border-acid ring-2 ring-acid shadow-[0_0_24px_rgba(215,242,43,0.35)] scale-[1.02] z-20'
            : isInPath
            ? 'border-acid/80 ring-1 ring-acid/40 shadow-[0_0_16px_rgba(215,242,43,0.2)] z-10'
            : hasActivePath
            ? 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
            : isLive
            ? 'border-emerald-500/50 shadow-[0_0_18px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
            : isCompleted
            ? 'border-white/15 hover:border-white/30'
            : 'border-white/10 hover:border-white/25'
        }`}
      >
        {/* Card Header: Match ID, Date/Time, Path Pin Badge & Edit Button */}
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10 text-[10px] font-mono shrink-0">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-0.5 rounded-md font-black border transition-colors ${
                isInPath
                  ? 'bg-acid text-acid-ink border-acid'
                  : 'bg-white/10 text-paper border-white/15'
              }`}
            >
              {match.matchCode}
            </span>

            {isLive ? (
              <span className="flex items-center space-x-1 text-emerald-400 font-bold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>LIVE</span>
              </span>
            ) : isCompleted ? (
              <span className="text-fog">FINAL</span>
            ) : (
              <span className="text-mist">{match.time}</span>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            {isInPath && (
              <span className="text-[9px] uppercase tracking-wider text-acid font-bold flex items-center space-x-1">
                <Eye className="w-2.5 h-2.5" />
                <span>Path</span>
              </span>
            )}

            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  openEditModal(match)
                }}
                className="opacity-70 group-hover:opacity-100 hover:text-acid text-mist transition-opacity p-1 flex items-center space-x-0.5"
                title="Edit Match / Scores"
              >
                <Edit3 className="w-3 h-3" />
                <span className="text-[9px] uppercase tracking-wider">Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Contenders / Teams Stack */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-center">
          {/* Team 1 Row */}
          <div
            onClick={(e) => {
              if (isAdmin) {
                e.stopPropagation()
                handleQuickAdvance(match, 1)
              }
            }}
            className={`flex items-center justify-between p-1.5 sm:p-2 rounded-lg transition-colors ${
              isAdmin ? 'cursor-pointer hover:bg-white/10' : 'cursor-default'
            } ${
              team1Won
                ? 'bg-acid/20 border border-acid/50 text-paper font-bold'
                : 'bg-ink-900/70 border border-white/5 text-mist'
            }`}
            title={isAdmin ? "Admin: Click to designate Team 1 as Winner (auto-advances)" : undefined}
          >
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <span
                className={`w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center shrink-0 ${
                  team1Won ? 'bg-acid text-acid-ink font-black' : 'bg-white/10 text-fog'
                }`}
              >
                {team1Won ? '✓' : '1'}
              </span>
              <span
                className={`text-xs truncate ${
                  match.team1.isPlaceholder
                    ? 'italic text-fog'
                    : team1Won
                    ? 'text-paper font-bold'
                    : 'text-cream'
                }`}
              >
                {match.team1.name}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0 font-mono">
              {typeof match.team1.score === 'number' && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                    team1Won ? 'bg-acid text-acid-ink font-black' : 'bg-white/5 text-fog'
                  }`}
                >
                  {match.team1.score}
                </span>
              )}
            </div>
          </div>

          {/* Team 2 Row */}
          <div
            onClick={(e) => {
              if (isAdmin) {
                e.stopPropagation()
                handleQuickAdvance(match, 2)
              }
            }}
            className={`flex items-center justify-between p-1.5 sm:p-2 rounded-lg transition-colors ${
              isAdmin ? 'cursor-pointer hover:bg-white/10' : 'cursor-default'
            } ${
              team2Won
                ? 'bg-acid/20 border border-acid/50 text-paper font-bold'
                : 'bg-ink-900/70 border border-white/5 text-mist'
            }`}
            title={isAdmin ? "Admin: Click to designate Team 2 as Winner (auto-advances)" : undefined}
          >
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <span
                className={`w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center shrink-0 ${
                  team2Won ? 'bg-acid text-acid-ink font-black' : 'bg-white/10 text-fog'
                }`}
              >
                {team2Won ? '✓' : '2'}
              </span>
              <span
                className={`text-xs truncate ${
                  match.team2.isPlaceholder
                    ? 'italic text-fog'
                    : team2Won
                    ? 'text-paper font-bold'
                    : 'text-cream'
                }`}
              >
                {match.team2.name}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0 font-mono">
              {typeof match.team2.score === 'number' && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                    team2Won ? 'bg-acid text-acid-ink font-black' : 'bg-white/5 text-fog'
                  }`}
                >
                  {match.team2.score}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer: Court Venue and Path Target Label */}
        <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono shrink-0">
          <span className="truncate max-w-[140px] text-fog">
            {match.date} • {match.court || 'Court 1'}
          </span>

          {match.nextMatchId ? (
            <span
              className={`flex items-center space-x-1 transition-colors ${
                isInPath ? 'text-acid font-bold' : 'text-fog group-hover:text-mist'
              }`}
            >
              <span>Adv to {match.nextMatchId.replace('M-', '').replace('W-', '')} ➔</span>
            </span>
          ) : (
            <span className="text-amber-400 font-bold flex items-center space-x-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>FINAL</span>
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div id="badminton-doubles-tournament" className="space-y-6 pt-2">
      {/* ─────────────────────────────────────────────────────────────
          1. SECTION HEADER & DESIGN ACCENT
          NOIR EDITORIAL Design System: Fraunces display font, full stop
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-ink-800/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-card">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-acid/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-acid/10 border border-acid/30 text-acid font-mono text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-acid" />
                <span>OFFICIAL TOURNAMENT DRAW</span>
              </span>

              <span className="text-[11px] font-mono text-fog">•</span>

              <span className="text-[11px] font-mono text-mist">
                CS Games 2026 Badminton Championship
              </span>
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-4xl text-paper tracking-tight">
              BADMINTON DOUBLES
            </h2>

            <p className="text-xs sm:text-sm text-mist leading-relaxed font-sans">
              Official tournament knockout draw and match progression across all championship rounds.
            </p>
          </div>

          {/* Quick Metrics & Reset Draw */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-ink-900/90 border border-white/10 px-4 py-2.5 rounded-xl flex items-center space-x-4 font-mono text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-fog block">Draw Status</span>
                <span className="font-bold text-paper font-lining">
                  {completedMatchesCount} / {totalMatchesCount} Won
                </span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-fog block">Finals</span>
                <span className="font-bold text-acid">25 Sept 2026</span>
              </div>
            </div>

            {isAdmin ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-mist hover:text-paper transition-all"
                title="Reset bracket back to original PDF draw"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Reset Draw</span>
              </button>
            ) : (
              <div
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-mist select-none"
                title="Fixtures and tournament draw are officially locked. Sign in as Admin to edit."
              >
                <Lock className="w-3.5 h-3.5 text-fog" />
                <span>Official Draw (Locked)</span>
              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. CATEGORY SWITCHER (FULL WIDTH)
            ───────────────────────────────────────────────────────────── */}
        <div className="mt-6 pt-6 border-t border-white/10 w-full">
          {/* Men's vs Women's Doubles Tab Switcher */}
          <div className="w-full grid grid-cols-2 gap-2 bg-ink-900/80 p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setCategory('mens')
                setSelectedMatchId(null)
                setHoveredMatchId(null)
              }}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all ${
                category === 'mens'
                  ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                  : 'text-mist hover:text-paper hover:bg-white/5'
              }`}
            >
              <span>Men&apos;s Doubles</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  category === 'mens' ? 'bg-black/20 text-acid-ink' : 'bg-white/10 text-fog'
                }`}
              >
                18 Matches
              </span>
            </button>

            <button
              onClick={() => {
                setCategory('womens')
                setSelectedMatchId(null)
                setHoveredMatchId(null)
              }}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all ${
                category === 'womens'
                  ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                  : 'text-mist hover:text-paper hover:bg-white/5'
              }`}
            >
              <span>Women&apos;s Doubles</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  category === 'womens' ? 'bg-black/20 text-acid-ink' : 'bg-white/10 text-fog'
                }`}
              >
                8 Matches
              </span>
            </button>
          </div>
        </div>

        {/* Champion Spotlight Banner if finals resolved */}
        {champion && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-acid/15 to-transparent border border-acid/30 flex items-center justify-between flex-wrap gap-3 animate-fade-in-up">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-acid text-acid-ink flex items-center justify-center font-black shadow-glow-sm">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-acid font-bold block">
                  {category === 'mens' ? "Men's" : "Women's"} Doubles Champion
                </span>
                <span className="font-serif font-black text-lg sm:text-xl text-paper">
                  {champion}
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/10 text-cream text-xs font-mono">
              Gold Medal Winner • CS Games 2026
            </span>
          </div>
        )}
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="p-3.5 rounded-xl bg-ink-800 border border-acid/40 text-xs font-mono text-paper flex items-center justify-between shadow-glow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-acid shrink-0" />
            <span>{saveToast}</span>
          </div>
          <button
            onClick={() => setSaveToast(null)}
            className="p-1 hover:text-acid text-mist transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. INTERACTIVE TOURNAMENT BRACKET TREE
          ───────────────────────────────────────────────────────────── */}
      <section className="bg-ink-800/80 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-card space-y-6">
          {/* Active Path Tracing & Legend Bar */}
          <div className="p-3 sm:p-4 rounded-xl bg-ink-900/80 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            {activeFocusMatchId ? (
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[10px] uppercase font-bold text-acid bg-acid/15 px-2 py-0.5 rounded border border-acid/30">
                  Active Path Route:
                </span>
                <div className="flex items-center space-x-1.5 flex-wrap">
                  {activePathBreadcrumb.map((step, idx) => (
                    <React.Fragment key={step.id}>
                      <span
                        onClick={() => toggleSelectMatch(step.id)}
                        className={`font-bold cursor-pointer hover:underline ${
                          step.id === activeFocusMatchId ? 'text-acid' : 'text-paper'
                        }`}
                      >
                        {step.matchCode}
                      </span>
                      {idx < activePathBreadcrumb.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-acid shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                  <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-amber-400 font-bold">FINAL 🏆</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-mist text-[11px]">
                <HelpCircle className="w-3.5 h-3.5 text-acid shrink-0" />
                <span>
                  Tip: <strong>Click or hover</strong> any match to light up its full path through the tournament brackets!
                </span>
              </div>
            )}

            <div className="flex items-center space-x-3 shrink-0 text-[10px] text-fog">
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-0.5 bg-acid rounded-full" />
                <span className="text-mist">Active Route</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-0.5 bg-white/20 rounded-full" />
                <span>Scheduled</span>
              </div>
              {selectedMatchId && (
                <button
                  onClick={() => setSelectedMatchId(null)}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-paper font-bold ml-2 transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {/* Quick Round Navigation Chips for Mobile */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] font-mono uppercase text-fog tracking-wider shrink-0 pr-1">
              Jump Round:
            </span>
            {currentRounds.map((r) => {
              const roundMatches = matchesByRound[r.key] || []
              if (roundMatches.length === 0) return null
              return (
                <button
                  key={r.key}
                  onClick={() => scrollToRound(r.key)}
                  className={`px-3 py-1 rounded-full text-xs font-mono shrink-0 transition-colors ${
                    activeRoundTab === r.key
                      ? 'bg-acid text-acid-ink font-bold'
                      : 'bg-ink-800 hover:bg-white/10 text-mist hover:text-paper border border-white/10'
                  }`}
                >
                  {r.label} ({roundMatches.length})
                </button>
              )
            })}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              INTERACTIVE CONNECTED TREE VIEW
              ───────────────────────────────────────────────────────────── */}
          <div
            ref={bracketScrollRef}
            className="overflow-x-auto no-scrollbar pb-6 pt-4 rounded-xl border border-white/10 bg-ink-900/50 px-2 sm:px-4"
          >
            {category === 'mens' ? (
              /* =========================================================
                 MEN'S DOUBLES CONNECTED TOURNAMENT TREE (5 ROUNDS)
                 ========================================================= */
              <div className="min-w-[1380px] flex items-stretch space-x-0 px-2 py-4">
                {/* 1. PRELIMINARY ROUND (P1, P2, P3 ALIGNED TO R16-1, R16-5, R16-8) */}
                <div data-round="preliminary" className="w-[300px] shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-acid" />
                      <h3 className="font-serif font-black text-sm text-paper tracking-wide">
                        Preliminary
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-fog px-2 py-0.5 rounded-full bg-white/5">
                      3 Matches
                    </span>
                  </div>

                  <div className="flex flex-col justify-around flex-grow space-y-4">
                    {/* Pair 1: P1 (feeds R16-1) */}
                    <div className="space-y-2 p-1.5 rounded-xl border border-transparent">
                      {renderMatchCard(matchesByRound.preliminary[0])}
                      <div className="h-[162px]" />
                    </div>

                    {/* Pair 2: Empty Spacer */}
                    <div className="space-y-2 p-1.5 rounded-xl border border-transparent">
                      <div className="h-[162px]" />
                      <div className="h-[162px]" />
                    </div>

                    {/* Pair 3: P2 (feeds R16-5) */}
                    <div className="space-y-2 p-1.5 rounded-xl border border-transparent">
                      {renderMatchCard(matchesByRound.preliminary[1])}
                      <div className="h-[162px]" />
                    </div>

                    {/* Pair 4: P3 (feeds R16-8) */}
                    <div className="space-y-2 p-1.5 rounded-xl border border-transparent">
                      <div className="h-[162px]" />
                      {renderMatchCard(matchesByRound.preliminary[2])}
                    </div>
                  </div>
                </div>

                {/* Connector between Prelim and Round of 16 (Straight horizontal feeders) */}
                <div className="w-10 shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 invisible border-b border-transparent flex items-center justify-between" aria-hidden="true">
                    <div className="h-5" />
                  </div>

                  <div className="flex flex-col justify-around flex-grow space-y-4 select-none pointer-events-none">
                    {/* Pair 1 Connector: P1 ──────► R16-1 (Top Slot) */}
                    <div className="space-y-2 p-1.5">
                      <div className="h-[162px] flex items-center justify-center">
                        {(() => {
                          const m = matchesByRound.preliminary[0]
                          const inPath = m ? activePathMatchIds.has(m.id) : false
                          const won = m?.winnerTeam !== undefined
                          return (
                            <svg className="w-full h-4 overflow-visible" viewBox="0 0 40 16">
                              <line
                                x1="0"
                                y1="8"
                                x2="34"
                                y2="8"
                                stroke={inPath ? '#D7F22B' : won ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                                strokeWidth={inPath ? 2.5 : 1.5}
                                strokeDasharray={won ? undefined : '3 3'}
                              />
                              <polygon
                                points="32,5 38,8 32,11"
                                fill={inPath ? '#D7F22B' : won ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.3)'}
                              />
                            </svg>
                          )
                        })()}
                      </div>
                      <div className="h-[162px]" />
                    </div>

                    {/* Pair 2 Connector: Empty (Both R16-3 & R16-4 are direct seeds) */}
                    <div className="space-y-2 p-1.5">
                      <div className="h-[162px]" />
                      <div className="h-[162px]" />
                    </div>

                    {/* Pair 3 Connector: P2 ──────► R16-5 (Top Slot) */}
                    <div className="space-y-2 p-1.5">
                      <div className="h-[162px] flex items-center justify-center">
                        {(() => {
                          const m = matchesByRound.preliminary[1]
                          const inPath = m ? activePathMatchIds.has(m.id) : false
                          const won = m?.winnerTeam !== undefined
                          return (
                            <svg className="w-full h-4 overflow-visible" viewBox="0 0 40 16">
                              <line
                                x1="0"
                                y1="8"
                                x2="34"
                                y2="8"
                                stroke={inPath ? '#D7F22B' : won ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                                strokeWidth={inPath ? 2.5 : 1.5}
                                strokeDasharray={won ? undefined : '3 3'}
                              />
                              <polygon
                                points="32,5 38,8 32,11"
                                fill={inPath ? '#D7F22B' : won ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.3)'}
                              />
                            </svg>
                          )
                        })()}
                      </div>
                      <div className="h-[162px]" />
                    </div>

                    {/* Pair 4 Connector: P3 ──────► R16-8 (Bottom Slot) */}
                    <div className="space-y-2 p-1.5">
                      <div className="h-[162px]" />
                      <div className="h-[162px] flex items-center justify-center">
                        {(() => {
                          const m = matchesByRound.preliminary[2]
                          const inPath = m ? activePathMatchIds.has(m.id) : false
                          const won = m?.winnerTeam !== undefined
                          return (
                            <svg className="w-full h-4 overflow-visible" viewBox="0 0 40 16">
                              <line
                                x1="0"
                                y1="8"
                                x2="34"
                                y2="8"
                                stroke={inPath ? '#D7F22B' : won ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                                strokeWidth={inPath ? 2.5 : 1.5}
                                strokeDasharray={won ? undefined : '3 3'}
                              />
                              <polygon
                                points="32,5 38,8 32,11"
                                fill={inPath ? '#D7F22B' : won ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.3)'}
                              />
                            </svg>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. ROUND OF 16 (8 MATCHES / 4 PAIRS) */}
                <div data-round="round_of_16" className="w-[300px] shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-acid" />
                      <h3 className="font-serif font-black text-sm text-paper tracking-wide">
                        Round of 16
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-fog px-2 py-0.5 rounded-full bg-white/5">
                      8 Matches
                    </span>
                  </div>

                  <div className="flex flex-col justify-around flex-grow space-y-4">
                    {/* Pair 1: R16-1 & R16-2 */}
                    <div className="space-y-2 p-1.5 rounded-xl bg-white/[0.015] border border-white/5">
                      {renderMatchCard(matchesByRound.round_of_16[0])}
                      {renderMatchCard(matchesByRound.round_of_16[1])}
                    </div>

                    {/* Pair 2: R16-3 & R16-4 */}
                    <div className="space-y-2 p-1.5 rounded-xl bg-white/[0.015] border border-white/5">
                      {renderMatchCard(matchesByRound.round_of_16[2])}
                      {renderMatchCard(matchesByRound.round_of_16[3])}
                    </div>

                    {/* Pair 3: R16-5 & R16-6 */}
                    <div className="space-y-2 p-1.5 rounded-xl bg-white/[0.015] border border-white/5">
                      {renderMatchCard(matchesByRound.round_of_16[4])}
                      {renderMatchCard(matchesByRound.round_of_16[5])}
                    </div>

                    {/* Pair 4: R16-7 & R16-8 */}
                    <div className="space-y-2 p-1.5 rounded-xl bg-white/[0.015] border border-white/5">
                      {renderMatchCard(matchesByRound.round_of_16[6])}
                      {renderMatchCard(matchesByRound.round_of_16[7])}
                    </div>
                  </div>
                </div>

                {/* Connector between R16 and Quarter Finals (4 Pairs) */}
                <div className="w-10 shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 invisible border-b border-transparent flex items-center justify-between" aria-hidden="true">
                    <div className="h-5" />
                  </div>
                  <div className="flex flex-col justify-around flex-grow space-y-4 select-none pointer-events-none">
                    {[0, 1, 2, 3].map((pairIdx) => {
                      const m1 = matchesByRound.round_of_16[pairIdx * 2]
                      const m2 = matchesByRound.round_of_16[pairIdx * 2 + 1]
                      const target = matchesByRound.quarter_finals[pairIdx]
                      const isM1InPath = m1 ? activePathMatchIds.has(m1.id) : false
                      const isM2InPath = m2 ? activePathMatchIds.has(m2.id) : false
                      const isTargetInPath = target ? activePathMatchIds.has(target.id) : false

                      const topWon = m1?.winnerTeam !== undefined
                      const btmWon = m2?.winnerTeam !== undefined

                      return (
                        <div key={pairIdx} className="space-y-2 p-1.5 flex items-center h-[335px]">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                            <path
                              d="M 0,25 H 20 V 50"
                              fill="none"
                              stroke={isM1InPath ? '#D7F22B' : topWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isM1InPath ? 2.5 : 1.5}
                            />
                            <path
                              d="M 0,75 H 20 V 50"
                              fill="none"
                              stroke={isM2InPath ? '#D7F22B' : btmWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isM2InPath ? 2.5 : 1.5}
                            />
                            <line
                              x1="20"
                              y1="50"
                              x2="38"
                              y2="50"
                              stroke={isTargetInPath ? '#D7F22B' : topWon || btmWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isTargetInPath ? 2.5 : 1.5}
                            />
                            <polygon
                              points="35,47 40,50 35,53"
                              fill={isTargetInPath ? '#D7F22B' : 'rgba(255,255,255,0.3)'}
                            />
                          </svg>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 3. QUARTER FINALS (4 MATCHES / 2 PAIRS) */}
                <div data-round="quarter_finals" className="w-[300px] shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-acid" />
                      <h3 className="font-serif font-black text-sm text-paper tracking-wide">
                        Quarter Finals
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-fog px-2 py-0.5 rounded-full bg-white/5">
                      4 Matches
                    </span>
                  </div>

                  <div className="flex flex-col justify-around flex-grow space-y-8">
                    {/* QF Pair A: QF-1 & QF-2 */}
                    <div className="space-y-16 p-2 rounded-xl bg-white/[0.015] border border-white/5">
                      {renderMatchCard(matchesByRound.quarter_finals[0])}
                      {renderMatchCard(matchesByRound.quarter_finals[1])}
                    </div>

                    {/* QF Pair B: QF-3 & QF-4 */}
                    <div className="space-y-16 p-2 rounded-xl bg-white/[0.015] border border-white/5">
                      {renderMatchCard(matchesByRound.quarter_finals[2])}
                      {renderMatchCard(matchesByRound.quarter_finals[3])}
                    </div>
                  </div>
                </div>

                {/* Connector between Quarter Finals and Semi-Finals (2 Pairs) */}
                <div className="w-10 shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 invisible border-b border-transparent flex items-center justify-between" aria-hidden="true">
                    <div className="h-5" />
                  </div>
                  <div className="flex flex-col justify-around flex-grow space-y-8 select-none pointer-events-none">
                    {[0, 1].map((pairIdx) => {
                      const qf1 = matchesByRound.quarter_finals[pairIdx * 2]
                      const qf2 = matchesByRound.quarter_finals[pairIdx * 2 + 1]
                      const sf = matchesByRound.semi_finals[pairIdx]
                      const isQf1InPath = qf1 ? activePathMatchIds.has(qf1.id) : false
                      const isQf2InPath = qf2 ? activePathMatchIds.has(qf2.id) : false
                      const isSfInPath = sf ? activePathMatchIds.has(sf.id) : false

                      const topWon = qf1?.winnerTeam !== undefined
                      const btmWon = qf2?.winnerTeam !== undefined

                      return (
                        <div key={pairIdx} className="h-[520px] flex items-center">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                            <path
                              d="M 0,25 H 20 V 50"
                              fill="none"
                              stroke={isQf1InPath ? '#D7F22B' : topWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isQf1InPath ? 2.5 : 1.5}
                            />
                            <path
                              d="M 0,75 H 20 V 50"
                              fill="none"
                              stroke={isQf2InPath ? '#D7F22B' : btmWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isQf2InPath ? 2.5 : 1.5}
                            />
                            <line
                              x1="20"
                              y1="50"
                              x2="38"
                              y2="50"
                              stroke={isSfInPath ? '#D7F22B' : topWon || btmWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isSfInPath ? 2.5 : 1.5}
                            />
                            <polygon
                              points="35,47 40,50 35,53"
                              fill={isSfInPath ? '#D7F22B' : 'rgba(255,255,255,0.3)'}
                            />
                          </svg>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 4. SEMI-FINALS (2 MATCHES / 1 PAIR) */}
                <div data-round="semi_finals" className="w-[300px] shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-acid" />
                      <h3 className="font-serif font-black text-sm text-paper tracking-wide">
                        Semi-Finals
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-fog px-2 py-0.5 rounded-full bg-white/5">
                      2 Matches
                    </span>
                  </div>

                  <div className="flex flex-col justify-around flex-grow space-y-16">
                    <div className="space-y-48 p-2 rounded-xl bg-white/[0.015] border border-white/5">
                      {renderMatchCard(matchesByRound.semi_finals[0])}
                      {renderMatchCard(matchesByRound.semi_finals[1])}
                    </div>
                  </div>
                </div>

                {/* Connector between Semi-Finals and Championship Final (1 Pair) */}
                <div className="w-10 shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 invisible border-b border-transparent flex items-center justify-between" aria-hidden="true">
                    <div className="h-5" />
                  </div>
                  <div className="flex flex-col justify-around flex-grow select-none pointer-events-none">
                    {(() => {
                      const sf1 = matchesByRound.semi_finals[0]
                      const sf2 = matchesByRound.semi_finals[1]
                      const finalMatch = matchesByRound.finals[0]
                      const isSf1InPath = sf1 ? activePathMatchIds.has(sf1.id) : false
                      const isSf2InPath = sf2 ? activePathMatchIds.has(sf2.id) : false
                      const isFinalInPath = finalMatch ? activePathMatchIds.has(finalMatch.id) : false

                      const topWon = sf1?.winnerTeam !== undefined
                      const btmWon = sf2?.winnerTeam !== undefined

                      return (
                        <div className="w-full h-[600px] flex items-center">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                            <path
                              d="M 0,25 H 20 V 50"
                              fill="none"
                              stroke={isSf1InPath ? '#D7F22B' : topWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isSf1InPath ? 2.5 : 1.5}
                            />
                            <path
                              d="M 0,75 H 20 V 50"
                              fill="none"
                              stroke={isSf2InPath ? '#D7F22B' : btmWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isSf2InPath ? 2.5 : 1.5}
                            />
                            <line
                              x1="20"
                              y1="50"
                              x2="38"
                              y2="50"
                              stroke={isFinalInPath ? '#D7F22B' : topWon || btmWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isFinalInPath ? 2.5 : 1.5}
                            />
                            <polygon
                              points="35,47 40,50 35,53"
                              fill={isFinalInPath ? '#D7F22B' : 'rgba(255,255,255,0.3)'}
                            />
                          </svg>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {/* 5. CHAMPIONSHIP FINAL & PODIUM */}
                <div data-round="finals" className="w-[320px] shrink-0 flex flex-col justify-center space-y-6">
                  <div className="mb-4 pb-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <h3 className="font-serif font-black text-sm text-paper tracking-wide">
                        Championship Final
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      Gold Medal
                    </span>
                  </div>

                  {renderMatchCard(matchesByRound.finals[0])}

                  {/* Gold Medal Champion Pedestal */}
                  <div className="p-5 rounded-2xl border border-amber-400/30 bg-gradient-to-b from-amber-500/15 via-ink-900 to-ink-900 text-center space-y-2.5 shadow-elevated">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 mx-auto flex items-center justify-center text-xl shadow-glow-sm">
                      🏆
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                        Men&apos;s Doubles Champion
                      </span>
                      <div className="font-serif font-black text-lg text-paper mt-1">
                        {champion || 'Championship In Play'}
                      </div>
                    </div>
                    <p className="text-[10px] font-mono text-mist">
                      Official Finals • 25th Sept 2026
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* =========================================================
                 WOMEN'S DOUBLES CONNECTED TOURNAMENT TREE (4 ROUNDS)
                 ========================================================= */
              <div className="min-w-[1100px] flex items-stretch space-x-0 px-2 py-4">
                {/* 1. PRELIMINARY ROUND (P1 ALIGNED DIRECTLY TO QF-2) */}
                <div data-round="preliminary" className="w-[300px] shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-acid" />
                      <h3 className="font-serif font-black text-sm text-paper tracking-wide">
                        Preliminary
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-fog px-2 py-0.5 rounded-full bg-white/5">
                      1 Match
                    </span>
                  </div>

                  <div className="flex flex-col justify-around flex-grow space-y-6">
                    {/* Pair 1: P1 (feeds QF-2 in bottom slot) */}
                    <div className="space-y-3 p-1.5 rounded-xl border border-transparent">
                      <div className="h-[162px]" />
                      {renderMatchCard(matchesByRound.preliminary[0])}
                    </div>

                    {/* Pair 2: Empty Spacer */}
                    <div className="space-y-3 p-1.5 rounded-xl border border-transparent">
                      <div className="h-[162px]" />
                      <div className="h-[162px]" />
                    </div>
                  </div>
                </div>

                {/* Connector from Women's Prelim to Quarter Finals (Straight horizontal feeder to QF-2) */}
                <div className="w-10 shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 invisible border-b border-transparent flex items-center justify-between" aria-hidden="true">
                    <div className="h-5" />
                  </div>

                  <div className="flex flex-col justify-around flex-grow space-y-6 select-none pointer-events-none">
                    {/* Pair 1: P1 ──────► QF-2 (Bottom Slot) */}
                    <div className="space-y-3 p-1.5">
                      <div className="h-[162px]" />
                      <div className="h-[162px] flex items-center justify-center">
                        {(() => {
                          const wp1 = matchesByRound.preliminary[0]
                          const inPath = wp1 ? activePathMatchIds.has(wp1.id) : false
                          const won = wp1?.winnerTeam !== undefined
                          return (
                            <svg className="w-full h-4 overflow-visible" viewBox="0 0 40 16">
                              <line
                                x1="0"
                                y1="8"
                                x2="34"
                                y2="8"
                                stroke={inPath ? '#D7F22B' : won ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                                strokeWidth={inPath ? 2.5 : 1.5}
                                strokeDasharray={won ? undefined : '3 3'}
                              />
                              <polygon
                                points="32,5 38,8 32,11"
                                fill={inPath ? '#D7F22B' : won ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.3)'}
                              />
                            </svg>
                          )
                        })()}
                      </div>
                    </div>

                    {/* Pair 2: Empty */}
                    <div className="space-y-3 p-1.5">
                      <div className="h-[162px]" />
                      <div className="h-[162px]" />
                    </div>
                  </div>
                </div>

                {/* 2. QUARTER FINALS (4 MATCHES / 2 PAIRS) */}
                <div data-round="quarter_finals" className="w-[300px] shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-acid" />
                      <h3 className="font-serif font-black text-sm text-paper tracking-wide">
                        Quarter Finals
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-fog px-2 py-0.5 rounded-full bg-white/5">
                      4 Matches
                    </span>
                  </div>

                  <div className="flex flex-col justify-around flex-grow space-y-6">
                    {/* QF Pair 1: QF-1 & QF-2 */}
                    <div className="space-y-3 p-1.5 rounded-xl bg-white/[0.015] border border-white/5">
                      {renderMatchCard(matchesByRound.quarter_finals[0])}
                      {renderMatchCard(matchesByRound.quarter_finals[1])}
                    </div>

                    {/* QF Pair 2: QF-3 & QF-4 */}
                    <div className="space-y-3 p-1.5 rounded-xl bg-white/[0.015] border border-white/5">
                      {renderMatchCard(matchesByRound.quarter_finals[2])}
                      {renderMatchCard(matchesByRound.quarter_finals[3])}
                    </div>
                  </div>
                </div>

                {/* Connector between Quarter Finals and Semi-Finals */}
                <div className="w-10 shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 invisible border-b border-transparent flex items-center justify-between" aria-hidden="true">
                    <div className="h-5" />
                  </div>
                  <div className="flex flex-col justify-around flex-grow space-y-6 select-none pointer-events-none">
                    {[0, 1].map((pairIdx) => {
                      const qf1 = matchesByRound.quarter_finals[pairIdx * 2]
                      const qf2 = matchesByRound.quarter_finals[pairIdx * 2 + 1]
                      const sf = matchesByRound.semi_finals[pairIdx]
                      const isQf1InPath = qf1 ? activePathMatchIds.has(qf1.id) : false
                      const isQf2InPath = qf2 ? activePathMatchIds.has(qf2.id) : false
                      const isSfInPath = sf ? activePathMatchIds.has(sf.id) : false

                      const topWon = qf1?.winnerTeam !== undefined
                      const btmWon = qf2?.winnerTeam !== undefined

                      return (
                        <div key={pairIdx} className="h-64 flex items-center">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                            <path
                              d="M 0,25 H 20 V 50"
                              fill="none"
                              stroke={isQf1InPath ? '#D7F22B' : topWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isQf1InPath ? 2.5 : 1.5}
                            />
                            <path
                              d="M 0,75 H 20 V 50"
                              fill="none"
                              stroke={isQf2InPath ? '#D7F22B' : btmWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isQf2InPath ? 2.5 : 1.5}
                            />
                            <line
                              x1="20"
                              y1="50"
                              x2="38"
                              y2="50"
                              stroke={isSfInPath ? '#D7F22B' : topWon || btmWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isSfInPath ? 2.5 : 1.5}
                            />
                            <polygon
                              points="35,47 40,50 35,53"
                              fill={isSfInPath ? '#D7F22B' : 'rgba(255,255,255,0.3)'}
                            />
                          </svg>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 3. SEMI-FINALS (2 MATCHES / 1 PAIR) */}
                <div data-round="semi_finals" className="w-[300px] shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-acid" />
                      <h3 className="font-serif font-black text-sm text-paper tracking-wide">
                        Semi-Finals
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-fog px-2 py-0.5 rounded-full bg-white/5">
                      2 Matches
                    </span>
                  </div>

                  <div className="flex flex-col justify-around flex-grow space-y-8">
                    <div className="space-y-16 p-2 rounded-xl bg-white/[0.015] border border-white/5">
                      {renderMatchCard(matchesByRound.semi_finals[0])}
                      {renderMatchCard(matchesByRound.semi_finals[1])}
                    </div>
                  </div>
                </div>

                {/* Connector between Semi-Finals and Championship Final */}
                <div className="w-10 shrink-0 flex flex-col">
                  <div className="mb-4 pb-2.5 invisible border-b border-transparent flex items-center justify-between" aria-hidden="true">
                    <div className="h-5" />
                  </div>
                  <div className="flex flex-col justify-around flex-grow select-none pointer-events-none">
                    {(() => {
                      const sf1 = matchesByRound.semi_finals[0]
                      const sf2 = matchesByRound.semi_finals[1]
                      const finalMatch = matchesByRound.finals[0]
                      const isSf1InPath = sf1 ? activePathMatchIds.has(sf1.id) : false
                      const isSf2InPath = sf2 ? activePathMatchIds.has(sf2.id) : false
                      const isFinalInPath = finalMatch ? activePathMatchIds.has(finalMatch.id) : false

                      const topWon = sf1?.winnerTeam !== undefined
                      const btmWon = sf2?.winnerTeam !== undefined

                      return (
                        <div className="w-full h-80 flex items-center">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
                            <path
                              d="M 0,25 H 20 V 50"
                              fill="none"
                              stroke={isSf1InPath ? '#D7F22B' : topWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isSf1InPath ? 2.5 : 1.5}
                            />
                            <path
                              d="M 0,75 H 20 V 50"
                              fill="none"
                              stroke={isSf2InPath ? '#D7F22B' : btmWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isSf2InPath ? 2.5 : 1.5}
                            />
                            <line
                              x1="20"
                              y1="50"
                              x2="38"
                              y2="50"
                              stroke={isFinalInPath ? '#D7F22B' : topWon || btmWon ? 'rgba(215,242,43,0.7)' : 'rgba(255,255,255,0.2)'}
                              strokeWidth={isFinalInPath ? 2.5 : 1.5}
                            />
                            <polygon
                              points="35,47 40,50 35,53"
                              fill={isFinalInPath ? '#D7F22B' : 'rgba(255,255,255,0.3)'}
                            />
                          </svg>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {/* 4. CHAMPIONSHIP FINAL & PODIUM */}
                <div data-round="finals" className="w-[320px] shrink-0 flex flex-col justify-center space-y-6">
                  <div className="mb-4 pb-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <h3 className="font-serif font-black text-sm text-paper tracking-wide">
                        Championship Final
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      Gold Medal
                    </span>
                  </div>

                  {renderMatchCard(matchesByRound.finals[0])}

                  {/* Gold Medal Champion Pedestal */}
                  <div className="p-5 rounded-2xl border border-amber-400/30 bg-gradient-to-b from-amber-500/15 via-ink-900 to-ink-900 text-center space-y-2.5 shadow-elevated">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 mx-auto flex items-center justify-center text-xl shadow-glow-sm">
                      🏆
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                        Women&apos;s Doubles Champion
                      </span>
                      <div className="font-serif font-black text-lg text-paper mt-1">
                        {champion || 'Championship In Play'}
                      </div>
                    </div>
                    <p className="text-[10px] font-mono text-mist">
                      Official Finals • 25th Sept 2026
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. MATCH EDIT & SCORE UPDATE MODAL (ACCESSIBLE & ESC-DISMISSIBLE)
          ───────────────────────────────────────────────────────────── */}
      {isAdmin && editingMatch && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-match-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setEditingMatch(null)}
        >
          <div
            className="relative w-full max-w-lg bg-ink-800 border border-white/15 rounded-2xl p-6 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-acid text-acid-ink uppercase">
                    {editingMatch.matchCode}
                  </span>
                  <span className="text-xs font-mono text-fog font-medium">
                    {editingMatch.roundTitle} • {category === 'mens' ? "Men's" : "Women's"} Doubles
                  </span>
                </div>
                <h3 id="modal-match-title" className="font-serif font-black text-xl text-paper">
                  Update Match Score &amp; Progression
                </h3>
              </div>

              <button
                onClick={() => setEditingMatch(null)}
                className="p-1.5 rounded-lg text-mist hover:text-paper hover:bg-white/10 transition-colors"
                aria-label="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Entry & Winner Selection */}
            <div className="space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-fog font-bold">
                Contenders &amp; Rally Scores
              </div>

              {/* Team 1 Score Box */}
              <div className="p-3.5 rounded-xl bg-ink-900 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-mono text-fog uppercase block">Team 1</span>
                    <input
                      type="text"
                      value={editTeam1Name}
                      onChange={(e) => setEditTeam1Name(e.target.value)}
                      className="bg-transparent font-bold text-sm text-paper focus:outline-none border-b border-white/15 focus:border-acid w-full"
                    />
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleScoreChange(1, editTeam1Score - 1)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-paper font-mono font-black"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={editTeam1Score}
                      onChange={(e) => handleScoreChange(1, parseInt(e.target.value, 10) || 0)}
                      className="w-14 text-center font-mono font-black text-xl bg-ink-800 border border-white/15 rounded-lg py-1 text-paper focus:outline-none focus:border-acid"
                    />
                    <button
                      onClick={() => handleScoreChange(1, editTeam1Score + 1)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-paper font-mono font-black"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditWinner(editWinner === 1 ? undefined : 1)}
                  className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    editWinner === 1
                      ? 'bg-acid text-acid-ink font-black shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 text-mist hover:text-paper'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editWinner === 1 ? 'Designated Winner (Advances)' : 'Mark as Winner'}</span>
                </button>
              </div>

              {/* Team 2 Score Box */}
              <div className="p-3.5 rounded-xl bg-ink-900 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-mono text-fog uppercase block">Team 2</span>
                    <input
                      type="text"
                      value={editTeam2Name}
                      onChange={(e) => setEditTeam2Name(e.target.value)}
                      className="bg-transparent font-bold text-sm text-paper focus:outline-none border-b border-white/15 focus:border-acid w-full"
                    />
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleScoreChange(2, editTeam2Score - 1)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-paper font-mono font-black"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={editTeam2Score}
                      onChange={(e) => handleScoreChange(2, parseInt(e.target.value, 10) || 0)}
                      className="w-14 text-center font-mono font-black text-xl bg-ink-800 border border-white/15 rounded-lg py-1 text-paper focus:outline-none focus:border-acid"
                    />
                    <button
                      onClick={() => handleScoreChange(2, editTeam2Score + 1)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-paper font-mono font-black"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditWinner(editWinner === 2 ? undefined : 2)}
                  className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    editWinner === 2
                      ? 'bg-acid text-acid-ink font-black shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 text-mist hover:text-paper'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editWinner === 2 ? 'Designated Winner (Advances)' : 'Mark as Winner'}</span>
                </button>
              </div>

              {/* Match Status Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-fog font-bold block">
                  Match Status
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {(['upcoming', 'live', 'completed'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`py-2 px-3 rounded-lg capitalize font-bold transition-colors ${
                        editStatus === st
                          ? 'bg-white/20 text-paper border border-white/30'
                          : 'bg-ink-900 text-mist hover:text-paper border border-white/5'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule and Court Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-fog block mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="text"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-paper focus:outline-none focus:border-acid"
                    placeholder="23 Sep 2026"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-fog block mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-paper focus:outline-none focus:border-acid"
                    placeholder="4:30 PM"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-fog block mb-1">
                    Court Location
                  </label>
                  <input
                    type="text"
                    value={editCourt}
                    onChange={(e) => setEditCourt(e.target.value)}
                    className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-paper focus:outline-none focus:border-acid"
                    placeholder="Court 1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-fog block mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={editVenue}
                    onChange={(e) => setEditVenue(e.target.value)}
                    className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-paper focus:outline-none focus:border-acid"
                    placeholder="Indoor Badminton Arena"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setEditWinner(undefined)
                  setEditTeam1Score(0)
                  setEditTeam2Score(0)
                  setEditStatus('upcoming')
                }}
                className="text-xs font-mono text-mist hover:text-rose-400 transition-colors"
              >
                Clear Scores &amp; Winner
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingMatch(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-mist hover:text-paper transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMatchEdits}
                  className="px-5 py-2 rounded-xl bg-acid hover:bg-acid-hot text-acid-ink text-xs font-mono font-black uppercase tracking-wider shadow-xs transition-all"
                >
                  Save &amp; Advance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. RESET DRAW CONFIRMATION MODAL
          ───────────────────────────────────────────────────────────── */}
      {isAdmin && showResetConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in"
        >
          <div className="bg-ink-800 border border-white/15 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-elevated">
            <div className="flex items-center space-x-3 text-amber-400">
              <AlertCircle className="w-6 h-6" />
              <h4 className="font-serif font-bold text-lg text-paper">Reset Tournament Draw?</h4>
            </div>
            <p className="text-xs text-mist leading-relaxed font-sans">
              This will restore all matches in the Men&apos;s and Women&apos;s doubles tournaments back to the official initial seed from the CS Games Badminton PDF. Any entered scores will be cleared.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-mist hover:text-paper"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDraw}
                className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-mono font-bold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
