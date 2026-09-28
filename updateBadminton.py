new_matches_str = """
export const INITIAL_BADMINTON_MATCHES: BadmintonDoublesMatch[] = [
  // =========================================================================
  // MEN'S DOUBLES
  // =========================================================================

  // --- PRELIMINARY ROUND ---
  {
    id: 'M-P1', matchCode: 'P1', category: 'mens', round: 'preliminary', roundTitle: 'Preliminary Round',
    team1: { name: 'Abhinav/Lazin', score: 5 }, team2: { name: 'Nabeel/Hathim', score: 11 },
    winnerTeam: 2, status: 'completed', date: '23 Sep 2026', time: '4:30 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'M-R16-8', nextMatchSlot: 'team1'
  },
  {
    id: 'M-P2', matchCode: 'P2', category: 'mens', round: 'preliminary', roundTitle: 'Preliminary Round',
    team1: { name: 'Shivas/Sahil', score: 11 }, team2: { name: 'Adhinan/Sabith', score: 6 },
    winnerTeam: 1, status: 'completed', date: '23 Sep 2026', time: '4:45 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'M-R16-4', nextMatchSlot: 'team1'
  },
  {
    id: 'M-P3', matchCode: 'P3', category: 'mens', round: 'preliminary', roundTitle: 'Preliminary Round',
    team1: { name: 'Anirudh/Francis', score: 11 }, team2: { name: 'Alan/Jerin', score: 10 },
    winnerTeam: 1, status: 'completed', date: '23 Sep 2026', time: '5:00 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'M-R16-5', nextMatchSlot: 'team2'
  },

  // --- ROUND OF 16 ---
  {
    id: 'M-R16-1', matchCode: 'R16-1', category: 'mens', round: 'round_of_16', roundTitle: 'Round of 16',
    team1: { name: 'Team Thanmai', score: 1 }, team2: { name: 'Fasil/Asif', score: 15 },
    winnerTeam: 2, status: 'completed', date: '23 Sep 2026', time: '5:30 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'M-QF-1', nextMatchSlot: 'team1'
  },
  {
    id: 'M-R16-2', matchCode: 'R16-2', category: 'mens', round: 'round_of_16', roundTitle: 'Round of 16',
    team1: { name: 'Krishnadas/Navaneeth', score: 10 }, team2: { name: 'Daniel/Ashwin', score: 15 },
    winnerTeam: 2, status: 'completed', date: '23 Sep 2026', time: '5:45 PM', venue: 'Indoor Arena', court: 'Court 2',
    nextMatchId: 'M-QF-1', nextMatchSlot: 'team2'
  },
  {
    id: 'M-R16-3', matchCode: 'R16-3', category: 'mens', round: 'round_of_16', roundTitle: 'Round of 16',
    team1: { name: 'Harshith/abhiram', score: 12 }, team2: { name: 'Prideson/Lee', score: 15 },
    winnerTeam: 2, status: 'completed', date: '23 Sep 2026', time: '6:00 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'M-QF-2', nextMatchSlot: 'team1'
  },
  {
    id: 'M-R16-4', matchCode: 'R16-4', category: 'mens', round: 'round_of_16', roundTitle: 'Round of 16',
    team1: { name: 'Winner P2', isPlaceholder: true, sourceMatchId: 'M-P2', score: 15 }, team2: { name: 'Team Govind/Kashi', score: 3 },
    winnerTeam: 1, status: 'completed', date: '23 Sep 2026', time: '6:15 PM', venue: 'Indoor Arena', court: 'Court 2',
    nextMatchId: 'M-QF-2', nextMatchSlot: 'team2'
  },
  {
    id: 'M-R16-5', matchCode: 'R16-5', category: 'mens', round: 'round_of_16', roundTitle: 'Round of 16',
    team1: { name: 'Ashit/Ayush', score: 8 }, team2: { name: 'Winner P3', isPlaceholder: true, sourceMatchId: 'M-P3', score: 15 },
    winnerTeam: 2, status: 'completed', date: '23 Sep 2026', time: '6:30 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'M-QF-3', nextMatchSlot: 'team1'
  },
  {
    id: 'M-R16-6', matchCode: 'R16-6', category: 'mens', round: 'round_of_16', roundTitle: 'Round of 16',
    team1: { name: 'Team Ayushraj' }, team2: { name: 'Team Sreedeep' },
    winnerTeam: 1, status: 'completed', notes: 'Win by forfeit', date: '23 Sep 2026', time: '6:45 PM', venue: 'Indoor Arena', court: 'Court 2',
    nextMatchId: 'M-QF-3', nextMatchSlot: 'team2'
  },
  {
    id: 'M-R16-7', matchCode: 'R16-7', category: 'mens', round: 'round_of_16', roundTitle: 'Round of 16',
    team1: { name: 'Abin Viswanth', score: 15 }, team2: { name: 'Harikrishnan/Niranjan', score: 6 },
    winnerTeam: 1, status: 'completed', date: '23 Sep 2026', time: '7:00 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'M-QF-4', nextMatchSlot: 'team1'
  },
  {
    id: 'M-R16-8', matchCode: 'R16-8', category: 'mens', round: 'round_of_16', roundTitle: 'Round of 16',
    team1: { name: 'Winner P1', isPlaceholder: true, sourceMatchId: 'M-P1' }, team2: { name: 'Team Neeraj' },
    status: 'upcoming', date: '23 Sep 2026', time: '7:15 PM', venue: 'Indoor Arena', court: 'Court 2',
    nextMatchId: 'M-QF-4', nextMatchSlot: 'team2'
  },

  // --- QUARTER FINALS ---
  {
    id: 'M-QF-1', matchCode: 'QF-1', category: 'mens', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Winner R16-1', isPlaceholder: true, sourceMatchId: 'M-R16-1', score: 19 }, team2: { name: 'Winner R16-2', isPlaceholder: true, sourceMatchId: 'M-R16-2', score: 17 },
    winnerTeam: 1, status: 'completed', date: '24 Sep 2026', time: '5:00 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'M-SF-1', nextMatchSlot: 'team1'
  },
  {
    id: 'M-QF-2', matchCode: 'QF-2', category: 'mens', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Winner R16-3', isPlaceholder: true, sourceMatchId: 'M-R16-3' }, team2: { name: 'Winner R16-4', isPlaceholder: true, sourceMatchId: 'M-R16-4' },
    status: 'upcoming', date: '24 Sep 2026', time: '5:30 PM', venue: 'Indoor Arena', court: 'Court 2',
    nextMatchId: 'M-SF-1', nextMatchSlot: 'team2'
  },
  {
    id: 'M-QF-3', matchCode: 'QF-3', category: 'mens', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Winner R16-5', isPlaceholder: true, sourceMatchId: 'M-R16-5' }, team2: { name: 'Winner R16-6', isPlaceholder: true, sourceMatchId: 'M-R16-6' },
    status: 'upcoming', date: '24 Sep 2026', time: '6:00 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'M-SF-2', nextMatchSlot: 'team1'
  },
  {
    id: 'M-QF-4', matchCode: 'QF-4', category: 'mens', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Winner R16-7', isPlaceholder: true, sourceMatchId: 'M-R16-7' }, team2: { name: 'Winner R16-8', isPlaceholder: true, sourceMatchId: 'M-R16-8' },
    status: 'upcoming', date: '24 Sep 2026', time: '6:30 PM', venue: 'Indoor Arena', court: 'Court 2',
    nextMatchId: 'M-SF-2', nextMatchSlot: 'team2'
  },

  // --- SEMI FINALS ---
  {
    id: 'M-SF-1', matchCode: 'SF-1', category: 'mens', round: 'semi_finals', roundTitle: 'Semi-Finals',
    team1: { name: 'Winner QF-1', isPlaceholder: true, sourceMatchId: 'M-QF-1' }, team2: { name: 'Winner QF-2', isPlaceholder: true, sourceMatchId: 'M-QF-2' },
    status: 'upcoming', date: '25 Sep 2026', time: '4:00 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'M-FINAL', nextMatchSlot: 'team1'
  },
  {
    id: 'M-SF-2', matchCode: 'SF-2', category: 'mens', round: 'semi_finals', roundTitle: 'Semi-Finals',
    team1: { name: 'Winner QF-3', isPlaceholder: true, sourceMatchId: 'M-QF-3' }, team2: { name: 'Winner QF-4', isPlaceholder: true, sourceMatchId: 'M-QF-4' },
    status: 'upcoming', date: '25 Sep 2026', time: '4:30 PM', venue: 'Indoor Arena', court: 'Court 2',
    nextMatchId: 'M-FINAL', nextMatchSlot: 'team2'
  },

  // --- FINALS ---
  {
    id: 'M-FINAL', matchCode: 'FINAL', category: 'mens', round: 'finals', roundTitle: 'Championship Final',
    team1: { name: 'Winner SF-1', isPlaceholder: true, sourceMatchId: 'M-SF-1' }, team2: { name: 'Winner SF-2', isPlaceholder: true, sourceMatchId: 'M-SF-2' },
    status: 'upcoming', date: '25 Sep 2026', time: '6:00 PM', venue: 'Indoor Arena', court: 'Centre Court'
  },


  // =========================================================================
  // WOMEN'S DOUBLES
  // =========================================================================

  // --- QUARTER FINALS ---
  {
    id: 'W-QF-1', matchCode: 'QF-1', category: 'womens', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Team Anagha', score: 6 }, team2: { name: 'Team Glenys', score: 11 },
    winnerTeam: 2, status: 'completed', date: '24 Sep 2026', time: '5:00 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'W-SF-1', nextMatchSlot: 'team1'
  },
  {
    id: 'W-QF-2', matchCode: 'QF-2', category: 'womens', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Team Devananda', score: 15 }, team2: { name: 'Team Shyma', score: 3 },
    winnerTeam: 1, status: 'completed', date: '24 Sep 2026', time: '5:30 PM', venue: 'Indoor Arena', court: 'Court 2',
    nextMatchId: 'W-SF-1', nextMatchSlot: 'team2'
  },
  {
    id: 'W-QF-3', matchCode: 'QF-3', category: 'womens', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Team Archana', score: 15 }, team2: { name: 'Team Rania', score: 11 },
    winnerTeam: 1, status: 'completed', date: '24 Sep 2026', time: '6:00 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'W-SF-2', nextMatchSlot: 'team1'
  },
  {
    id: 'W-QF-4', matchCode: 'QF-4', category: 'womens', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Team Rose', score: 5 }, team2: { name: 'Team Sushma', score: 15 },
    winnerTeam: 2, status: 'completed', date: '24 Sep 2026', time: '6:30 PM', venue: 'Indoor Arena', court: 'Court 2',
    nextMatchId: 'W-SF-2', nextMatchSlot: 'team2'
  },

  // --- SEMI FINALS ---
  {
    id: 'W-SF-1', matchCode: 'SF-1', category: 'womens', round: 'semi_finals', roundTitle: 'Semi-Finals',
    team1: { name: 'Winner QF-1', isPlaceholder: true, sourceMatchId: 'W-QF-1' }, team2: { name: 'Winner QF-2', isPlaceholder: true, sourceMatchId: 'W-QF-2' },
    status: 'upcoming', date: '25 Sep 2026', time: '4:00 PM', venue: 'Indoor Arena', court: 'Court 1',
    nextMatchId: 'W-FINAL', nextMatchSlot: 'team1'
  },
  {
    id: 'W-SF-2', matchCode: 'SF-2', category: 'womens', round: 'semi_finals', roundTitle: 'Semi-Finals',
    team1: { name: 'Winner QF-3', isPlaceholder: true, sourceMatchId: 'W-QF-3' }, team2: { name: 'Winner QF-4', isPlaceholder: true, sourceMatchId: 'W-QF-4' },
    status: 'upcoming', date: '25 Sep 2026', time: '4:30 PM', venue: 'Indoor Arena', court: 'Court 2',
    nextMatchId: 'W-FINAL', nextMatchSlot: 'team2'
  },

  // --- FINALS ---
  {
    id: 'W-FINAL', matchCode: 'FINAL', category: 'womens', round: 'finals', roundTitle: 'Championship Final',
    team1: { name: 'Winner SF-1', isPlaceholder: true, sourceMatchId: 'W-SF-1' }, team2: { name: 'Winner SF-2', isPlaceholder: true, sourceMatchId: 'W-SF-2' },
    status: 'upcoming', date: '25 Sep 2026', time: '6:00 PM', venue: 'Indoor Arena', court: 'Centre Court'
  },
]
"""

import re

with open('lib/badminton-doubles-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace INITIAL_BADMINTON_MATCHES
content = re.sub(
    r'export const INITIAL_BADMINTON_MATCHES: BadmintonDoublesMatch\[\] = \[.*?\]\n',
    new_matches_str,
    content,
    flags=re.DOTALL
)

# Bump version key
content = content.replace("export const BADMINTON_STORAGE_KEY = 'cs_badminton_doubles_bracket_v2'", "export const BADMINTON_STORAGE_KEY = 'cs_badminton_doubles_bracket_v3'")

with open('lib/badminton-doubles-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

