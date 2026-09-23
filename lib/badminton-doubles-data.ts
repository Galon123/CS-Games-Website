export type BadmintonCategory = 'mens' | 'womens'

export type BadmintonRoundKey =
  | 'preliminary'
  | 'round_of_16'
  | 'quarter_finals'
  | 'semi_finals'
  | 'finals'

export interface BadmintonTeamSlot {
  name: string
  score?: number
  isPlaceholder?: boolean
  sourceMatchId?: string
}

export interface BadmintonDoublesMatch {
  id: string
  matchCode: string
  category: BadmintonCategory
  round: BadmintonRoundKey
  roundTitle: string
  team1: BadmintonTeamSlot
  team2: BadmintonTeamSlot
  winnerTeam?: 1 | 2
  status: 'upcoming' | 'live' | 'completed'
  date: string
  time: string
  venue: string
  nextMatchId?: string
  nextMatchSlot?: 'team1' | 'team2'
  notes?: string
  court?: string
}

export const INITIAL_BADMINTON_MATCHES: BadmintonDoublesMatch[] = [
  // =========================================================================
  // MEN'S DOUBLES (PDF: CS GAMES : BADMINTON DOUBLES - MEN DOUBLES)
  // =========================================================================

  // --- PRELIMINARY ROUND ---
  {
    id: 'M-P1',
    matchCode: 'P1',
    category: 'mens',
    round: 'preliminary',
    roundTitle: 'Preliminary Round',
    team1: { name: 'Sabith' },
    team2: { name: 'Shivas Seagal' },
    status: 'upcoming',
    date: '23 Sep 2026',
    time: '4:30 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'M-R16-1',
    nextMatchSlot: 'team1',
    notes: 'Start match at 4:30 PM',
  },
  {
    id: 'M-P2',
    matchCode: 'P2',
    category: 'mens',
    round: 'preliminary',
    roundTitle: 'Preliminary Round',
    team1: { name: 'R Abhinav' },
    team2: { name: 'Nabeel K P' },
    status: 'upcoming',
    date: '23 Sep 2026',
    time: '4:55 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'M-R16-5',
    nextMatchSlot: 'team2',
  },
  {
    id: 'M-P3',
    matchCode: 'P3',
    category: 'mens',
    round: 'preliminary',
    roundTitle: 'Preliminary Round',
    team1: { name: 'Anirudh Shekhar' },
    team2: { name: 'Alan Ali' },
    status: 'upcoming',
    date: '23 Sep 2026',
    time: '5:20 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'M-R16-8',
    nextMatchSlot: 'team2',
  },

  // --- ROUND OF 16 ---
  {
    id: 'M-R16-1',
    matchCode: 'R16-1',
    category: 'mens',
    round: 'round_of_16',
    roundTitle: 'Round of 16',
    team1: { name: 'Winner P1', isPlaceholder: true, sourceMatchId: 'M-P1' },
    team2: { name: 'Neeraj U' },
    status: 'upcoming',
    date: '23 Sep 2026',
    time: '5:45 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'M-QF-1',
    nextMatchSlot: 'team1',
  },
  {
    id: 'M-R16-2',
    matchCode: 'R16-2',
    category: 'mens',
    round: 'round_of_16',
    roundTitle: 'Round of 16',
    team1: { name: 'Sreejith S' },
    team2: { name: 'Ayush Raj' },
    status: 'upcoming',
    date: '23 Sep 2026',
    time: '6:10 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'M-QF-1',
    nextMatchSlot: 'team2',
  },
  {
    id: 'M-R16-3',
    matchCode: 'R16-3',
    category: 'mens',
    round: 'round_of_16',
    roundTitle: 'Round of 16',
    team1: { name: 'Thanmai K' },
    team2: { name: 'Fasil Firose' },
    status: 'upcoming',
    date: '23 Sep 2026',
    time: '6:35 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 2',
    nextMatchId: 'M-QF-2',
    nextMatchSlot: 'team1',
  },
  {
    id: 'M-R16-4',
    matchCode: 'R16-4',
    category: 'mens',
    round: 'round_of_16',
    roundTitle: 'Round of 16',
    team1: { name: 'Krishnadas' },
    team2: { name: 'Ashwin D Sreenivas' },
    status: 'upcoming',
    date: '23 Sep 2026',
    time: '7:00 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 2',
    nextMatchId: 'M-QF-2',
    nextMatchSlot: 'team2',
  },
  {
    id: 'M-R16-5',
    matchCode: 'R16-5',
    category: 'mens',
    round: 'round_of_16',
    roundTitle: 'Round of 16',
    team1: { name: 'Govind Menon' },
    team2: { name: 'Winner P2', isPlaceholder: true, sourceMatchId: 'M-P2' },
    status: 'upcoming',
    date: '23 Sep 2026',
    time: '7:25 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'M-QF-3',
    nextMatchSlot: 'team1',
  },
  {
    id: 'M-R16-6',
    matchCode: 'R16-6',
    category: 'mens',
    round: 'round_of_16',
    roundTitle: 'Round of 16',
    team1: { name: 'Prideson Petson' },
    team2: { name: 'Abhiram H' },
    status: 'upcoming',
    date: '23 Sep 2026',
    time: '7:50 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'M-QF-3',
    nextMatchSlot: 'team2',
  },
  {
    id: 'M-R16-7',
    matchCode: 'R16-7',
    category: 'mens',
    round: 'round_of_16',
    roundTitle: 'Round of 16',
    team1: { name: 'Abin' },
    team2: { name: 'Harikrishnan R' },
    status: 'upcoming',
    date: '23 Sep 2026',
    time: '8:15 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 2',
    nextMatchId: 'M-QF-4',
    nextMatchSlot: 'team1',
  },
  {
    id: 'M-R16-8',
    matchCode: 'R16-8',
    category: 'mens',
    round: 'round_of_16',
    roundTitle: 'Round of 16',
    team1: { name: 'Ashit Debnath' },
    team2: { name: 'Winner P3', isPlaceholder: true, sourceMatchId: 'M-P3' },
    status: 'upcoming',
    date: '23 Sep 2026',
    time: '8:40 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 2',
    nextMatchId: 'M-QF-4',
    nextMatchSlot: 'team2',
  },

  // --- QUARTER FINALS ---
  {
    id: 'M-QF-1',
    matchCode: 'QF-1',
    category: 'mens',
    round: 'quarter_finals',
    roundTitle: 'Quarter Finals',
    team1: { name: 'Winner R16-1', isPlaceholder: true, sourceMatchId: 'M-R16-1' },
    team2: { name: 'Winner R16-2', isPlaceholder: true, sourceMatchId: 'M-R16-2' },
    status: 'upcoming',
    date: '24 Sep 2026',
    time: '4:00 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'M-SF-1',
    nextMatchSlot: 'team1',
  },
  {
    id: 'M-QF-2',
    matchCode: 'QF-2',
    category: 'mens',
    round: 'quarter_finals',
    roundTitle: 'Quarter Finals',
    team1: { name: 'Winner R16-3', isPlaceholder: true, sourceMatchId: 'M-R16-3' },
    team2: { name: 'Winner R16-4', isPlaceholder: true, sourceMatchId: 'M-R16-4' },
    status: 'upcoming',
    date: '24 Sep 2026',
    time: '4:35 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'M-SF-1',
    nextMatchSlot: 'team2',
  },
  {
    id: 'M-QF-3',
    matchCode: 'QF-3',
    category: 'mens',
    round: 'quarter_finals',
    roundTitle: 'Quarter Finals',
    team1: { name: 'Winner R16-5', isPlaceholder: true, sourceMatchId: 'M-R16-5' },
    team2: { name: 'Winner R16-6', isPlaceholder: true, sourceMatchId: 'M-R16-6' },
    status: 'upcoming',
    date: '24 Sep 2026',
    time: '5:10 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 2',
    nextMatchId: 'M-SF-2',
    nextMatchSlot: 'team1',
  },
  {
    id: 'M-QF-4',
    matchCode: 'QF-4',
    category: 'mens',
    round: 'quarter_finals',
    roundTitle: 'Quarter Finals',
    team1: { name: 'Winner R16-7', isPlaceholder: true, sourceMatchId: 'M-R16-7' },
    team2: { name: 'Winner R16-8', isPlaceholder: true, sourceMatchId: 'M-R16-8' },
    status: 'upcoming',
    date: '24 Sep 2026',
    time: '5:45 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 2',
    nextMatchId: 'M-SF-2',
    nextMatchSlot: 'team2',
  },

  // --- SEMI-FINALS ---
  {
    id: 'M-SF-1',
    matchCode: 'SF-1',
    category: 'mens',
    round: 'semi_finals',
    roundTitle: 'Semi-Finals',
    team1: { name: 'Winner QF-1', isPlaceholder: true, sourceMatchId: 'M-QF-1' },
    team2: { name: 'Winner QF-2', isPlaceholder: true, sourceMatchId: 'M-QF-2' },
    status: 'upcoming',
    date: '25 Sep 2026',
    time: '3:00 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'M-FINAL',
    nextMatchSlot: 'team1',
  },
  {
    id: 'M-SF-2',
    matchCode: 'SF-2',
    category: 'mens',
    round: 'semi_finals',
    roundTitle: 'Semi-Finals',
    team1: { name: 'Winner QF-3', isPlaceholder: true, sourceMatchId: 'M-QF-3' },
    team2: { name: 'Winner QF-4', isPlaceholder: true, sourceMatchId: 'M-QF-4' },
    status: 'upcoming',
    date: '25 Sep 2026',
    time: '3:45 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'M-FINAL',
    nextMatchSlot: 'team2',
  },

  // --- FINALS ---
  {
    id: 'M-FINAL',
    matchCode: 'FINAL',
    category: 'mens',
    round: 'finals',
    roundTitle: 'Championship Final',
    team1: { name: 'Winner SF-1', isPlaceholder: true, sourceMatchId: 'M-SF-1' },
    team2: { name: 'Winner SF-2', isPlaceholder: true, sourceMatchId: 'M-SF-2' },
    status: 'upcoming',
    date: '25 Sep 2026',
    time: '5:30 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Centre Court',
    notes: 'Official Men Doubles Championship Gold Medal Match on 25th Sept 2026',
  },

  // =========================================================================
  // WOMEN'S DOUBLES (PDF: WOMEN’S DOUBLES)
  // =========================================================================

  // --- PRELIMINARY ROUND ---
  {
    id: 'W-P1',
    matchCode: 'P1',
    category: 'womens',
    round: 'preliminary',
    roundTitle: 'Preliminary Round',
    team1: { name: 'Anagha B Kumar' },
    team2: { name: 'Glenys Gladson' },
    status: 'upcoming',
    date: '23 Sep 2026',
    time: '5:00 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 2',
    nextMatchId: 'W-QF-2',
    nextMatchSlot: 'team1',
  },

  // --- QUARTER FINAL ---
  {
    id: 'W-QF-1',
    matchCode: 'QF-1',
    category: 'womens',
    round: 'quarter_finals',
    roundTitle: 'Quarter Finals',
    team1: { name: 'Swetha Satheesh' },
    team2: { name: 'Devananda Jigeesh' },
    status: 'upcoming',
    date: '24 Sep 2026',
    time: '6:00 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'W-SF-1',
    nextMatchSlot: 'team1',
  },
  {
    id: 'W-QF-2',
    matchCode: 'QF-2',
    category: 'womens',
    round: 'quarter_finals',
    roundTitle: 'Quarter Finals',
    team1: { name: 'Winner P1', isPlaceholder: true, sourceMatchId: 'W-P1' },
    team2: { name: 'Rose Mary KS' },
    status: 'upcoming',
    date: '24 Sep 2026',
    time: '6:30 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 1',
    nextMatchId: 'W-SF-1',
    nextMatchSlot: 'team2',
  },
  {
    id: 'W-QF-3',
    matchCode: 'QF-3',
    category: 'womens',
    round: 'quarter_finals',
    roundTitle: 'Quarter Finals',
    team1: { name: 'Parvathy Ajith' },
    team2: { name: 'Archana K' },
    status: 'upcoming',
    date: '24 Sep 2026',
    time: '7:00 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 2',
    nextMatchId: 'W-SF-2',
    nextMatchSlot: 'team1',
  },
  {
    id: 'W-QF-4',
    matchCode: 'QF-4',
    category: 'womens',
    round: 'quarter_finals',
    roundTitle: 'Quarter Finals',
    team1: { name: 'Avany Chandra' },
    team2: { name: 'Sushma Thapa' },
    status: 'upcoming',
    date: '24 Sep 2026',
    time: '7:30 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 2',
    nextMatchId: 'W-SF-2',
    nextMatchSlot: 'team2',
  },

  // --- SEMI-FINALS ---
  {
    id: 'W-SF-1',
    matchCode: 'SF-1',
    category: 'womens',
    round: 'semi_finals',
    roundTitle: 'Semi-Finals',
    team1: { name: 'Winner QF-1', isPlaceholder: true, sourceMatchId: 'W-QF-1' },
    team2: { name: 'Winner QF-2', isPlaceholder: true, sourceMatchId: 'W-QF-2' },
    status: 'upcoming',
    date: '25 Sep 2026',
    time: '4:15 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 2',
    nextMatchId: 'W-FINAL',
    nextMatchSlot: 'team1',
  },
  {
    id: 'W-SF-2',
    matchCode: 'SF-2',
    category: 'womens',
    round: 'semi_finals',
    roundTitle: 'Semi-Finals',
    team1: { name: 'Winner QF-3', isPlaceholder: true, sourceMatchId: 'W-QF-3' },
    team2: { name: 'Winner QF-4', isPlaceholder: true, sourceMatchId: 'W-QF-4' },
    status: 'upcoming',
    date: '25 Sep 2026',
    time: '4:45 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Court 2',
    nextMatchId: 'W-FINAL',
    nextMatchSlot: 'team2',
  },

  // --- FINALS ---
  {
    id: 'W-FINAL',
    matchCode: 'FINAL',
    category: 'womens',
    round: 'finals',
    roundTitle: 'Championship Final',
    team1: { name: 'Winner SF-1', isPlaceholder: true, sourceMatchId: 'W-SF-1' },
    team2: { name: 'Winner SF-2', isPlaceholder: true, sourceMatchId: 'W-SF-2' },
    status: 'upcoming',
    date: '25 Sep 2026',
    time: '6:15 PM',
    venue: 'Indoor Badminton Arena',
    court: 'Centre Court',
    notes: 'Official Women Doubles Championship Gold Medal Match on 25th Sept 2026',
  },
]

export const BADMINTON_STORAGE_KEY = 'cs_badminton_doubles_bracket_v2'

/**
 * Rounds order for display & bracket organization
 */
export const MENS_ROUNDS: { key: BadmintonRoundKey; label: string; short: string }[] = [
  { key: 'preliminary', label: 'Preliminary Round', short: 'Prelim' },
  { key: 'round_of_16', label: 'Round of 16', short: 'R16' },
  { key: 'quarter_finals', label: 'Quarter Finals', short: 'QF' },
  { key: 'semi_finals', label: 'Semi-Finals', short: 'SF' },
  { key: 'finals', label: 'Championship Final', short: 'Final' },
]

export const WOMENS_ROUNDS: { key: BadmintonRoundKey; label: string; short: string }[] = [
  { key: 'preliminary', label: 'Preliminary Round', short: 'Prelim' },
  { key: 'quarter_finals', label: 'Quarter Finals', short: 'QF' },
  { key: 'semi_finals', label: 'Semi-Finals', short: 'SF' },
  { key: 'finals', label: 'Championship Final', short: 'Final' },
]

/**
 * Resolves tournament progression recursively.
 * Whenever a match has a winner (or score leads to winner), this function propagates
 * the winning player/team to the next designated match and slot.
 */
export function resolveBracketProgression(
  rawMatches: BadmintonDoublesMatch[]
): BadmintonDoublesMatch[] {
  // Deep clone to avoid mutating input
  const matchMap = new Map<string, BadmintonDoublesMatch>()
  rawMatches.forEach((m) => {
    matchMap.set(m.id, {
      ...m,
      team1: { ...m.team1 },
      team2: { ...m.team2 },
    })
  })

  // Topological / multi-pass forward propagation
  // Since preliminary -> r16 -> qf -> sf -> final is acyclic, 5 passes guarantee full propagation
  for (let pass = 0; pass < 5; pass++) {
    matchMap.forEach((match) => {
      if (!match.nextMatchId || !match.nextMatchSlot) return

      const nextMatch = matchMap.get(match.nextMatchId)
      if (!nextMatch) return

      const slotKey = match.nextMatchSlot
      const defaultPlaceholder = `Winner ${match.matchCode}`

      if (match.winnerTeam) {
        const winningTeam = match.winnerTeam === 1 ? match.team1 : match.team2
        const winnerName = winningTeam.name

        // Only advance if winner name is a real name (not an unassigned placeholder)
        if (winnerName && !winningTeam.isPlaceholder && !winnerName.startsWith('Winner ')) {
          nextMatch[slotKey] = {
            ...nextMatch[slotKey],
            name: winnerName,
            isPlaceholder: false,
            sourceMatchId: match.id,
          }
        } else {
          nextMatch[slotKey] = {
            ...nextMatch[slotKey],
            name: defaultPlaceholder,
            isPlaceholder: true,
            sourceMatchId: match.id,
          }
        }
      } else {
        // No winner yet: ensure it stays as placeholder if previously advanced
        if (nextMatch[slotKey]?.sourceMatchId === match.id) {
          nextMatch[slotKey] = {
            ...nextMatch[slotKey],
            name: defaultPlaceholder,
            isPlaceholder: true,
            sourceMatchId: match.id,
          }
        }
      }
    })
  }

  return Array.from(matchMap.values())
}

/**
 * Loads badminton matches from local storage or returns initial seed.
 */
export function loadBadmintonMatches(): BadmintonDoublesMatch[] {
  if (typeof window === 'undefined') {
    return resolveBracketProgression(INITIAL_BADMINTON_MATCHES)
  }

  try {
    const saved = localStorage.getItem(BADMINTON_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with initial seed to ensure all expected matches exist
        const idSet = new Set(parsed.map((m: any) => m.id))
        const missing = INITIAL_BADMINTON_MATCHES.filter((m) => !idSet.has(m.id))
        return resolveBracketProgression([...parsed, ...missing])
      }
    }
  } catch (err) {
    console.warn('Failed loading badminton matches from localStorage:', err)
  }

  return resolveBracketProgression(INITIAL_BADMINTON_MATCHES)
}

/**
 * Saves badminton matches to local storage.
 */
export function saveBadmintonMatches(matches: BadmintonDoublesMatch[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(BADMINTON_STORAGE_KEY, JSON.stringify(matches))
  } catch (err) {
    console.warn('Failed saving badminton matches to localStorage:', err)
  }
}

/**
 * Clears local storage and resets to initial PDF tournament draw.
 */
export function resetBadmintonMatchesToDefault(): BadmintonDoublesMatch[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(BADMINTON_STORAGE_KEY)
    } catch (err) {
      // ignore
    }
  }
  return resolveBracketProgression(INITIAL_BADMINTON_MATCHES)
}
