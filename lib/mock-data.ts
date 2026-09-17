import { Sport, Team, Player, Match, LeaderboardEntry } from './types'

export const initialSports: Sport[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Football', type: 'team' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Badminton', type: 'duo' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Chess', type: 'solo' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Carrom', type: 'duo' },
]


export const initialTeams: Team[] = []
export const initialPlayers: Player[] = []
export const initialMatches: Match[] = []
export const initialLeaderboards: LeaderboardEntry[] = []

// Extended library of football tactical formations
export const FORMATION_PRESETS: Record<string, { role: string; x: number; y: number }[]> = {
  '4-3-3': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Left Back', x: 16, y: 72 },
    { role: 'Centre Back', x: 38, y: 75 },
    { role: 'Centre Back', x: 62, y: 75 },
    { role: 'Right Back', x: 84, y: 72 },
    { role: 'Defensive Mid', x: 50, y: 55 },
    { role: 'Centre Mid', x: 30, y: 45 },
    { role: 'Centre Mid', x: 70, y: 45 },
    { role: 'Left Winger', x: 20, y: 22 },
    { role: 'Centre Forward', x: 50, y: 15 },
    { role: 'Right Winger', x: 80, y: 22 },
  ],
  '4-2-3-1': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Left Back', x: 16, y: 74 },
    { role: 'Centre Back', x: 38, y: 76 },
    { role: 'Centre Back', x: 62, y: 76 },
    { role: 'Right Back', x: 84, y: 74 },
    { role: 'Defensive Mid', x: 35, y: 58 },
    { role: 'Defensive Mid', x: 65, y: 58 },
    { role: 'Attacking Mid L', x: 22, y: 38 },
    { role: 'Attacking Mid C', x: 50, y: 35 },
    { role: 'Attacking Mid R', x: 78, y: 38 },
    { role: 'Striker', x: 50, y: 16 },
  ],
  '3-5-2': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Centre Back L', x: 28, y: 75 },
    { role: 'Centre Back C', x: 50, y: 77 },
    { role: 'Centre Back R', x: 72, y: 75 },
    { role: 'Left Wing-Back', x: 14, y: 50 },
    { role: 'Central Mid', x: 35, y: 52 },
    { role: 'Attacking Mid', x: 50, y: 40 },
    { role: 'Central Mid', x: 65, y: 52 },
    { role: 'Right Wing-Back', x: 86, y: 50 },
    { role: 'Striker L', x: 38, y: 18 },
    { role: 'Striker R', x: 62, y: 18 },
  ],
  '4-4-2': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Left Back', x: 16, y: 74 },
    { role: 'Centre Back', x: 38, y: 76 },
    { role: 'Centre Back', x: 62, y: 76 },
    { role: 'Right Back', x: 84, y: 74 },
    { role: 'Left Mid', x: 18, y: 48 },
    { role: 'Central Mid', x: 40, y: 50 },
    { role: 'Central Mid', x: 60, y: 50 },
    { role: 'Right Mid', x: 82, y: 48 },
    { role: 'Striker L', x: 38, y: 20 },
    { role: 'Striker R', x: 62, y: 20 },
  ],
  '4-1-4-1': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Left Back', x: 16, y: 74 },
    { role: 'Centre Back', x: 38, y: 76 },
    { role: 'Centre Back', x: 62, y: 76 },
    { role: 'Right Back', x: 84, y: 74 },
    { role: 'Defensive Anchor', x: 50, y: 62 },
    { role: 'Left Mid', x: 20, y: 44 },
    { role: 'Central Mid', x: 40, y: 44 },
    { role: 'Central Mid', x: 60, y: 44 },
    { role: 'Right Mid', x: 80, y: 44 },
    { role: 'Target Striker', x: 50, y: 18 },
  ],
  '3-4-3': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Centre Back L', x: 28, y: 76 },
    { role: 'Centre Back C', x: 50, y: 78 },
    { role: 'Centre Back R', x: 72, y: 76 },
    { role: 'Left Wing-Back', x: 14, y: 50 },
    { role: 'Central Mid', x: 38, y: 52 },
    { role: 'Central Mid', x: 62, y: 52 },
    { role: 'Right Wing-Back', x: 86, y: 50 },
    { role: 'Left Winger', x: 22, y: 20 },
    { role: 'Centre Forward', x: 50, y: 16 },
    { role: 'Right Winger', x: 78, y: 20 },
  ],
  '5-3-2': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Left Wing-Back', x: 14, y: 68 },
    { role: 'Centre Back L', x: 32, y: 76 },
    { role: 'Sweeper / CB', x: 50, y: 78 },
    { role: 'Centre Back R', x: 68, y: 76 },
    { role: 'Right Wing-Back', x: 86, y: 68 },
    { role: 'Central Mid', x: 32, y: 48 },
    { role: 'Central Mid', x: 50, y: 46 },
    { role: 'Central Mid', x: 68, y: 48 },
    { role: 'Striker L', x: 38, y: 18 },
    { role: 'Striker R', x: 62, y: 18 },
  ],
  '4-1-2-1-2': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Left Back', x: 16, y: 74 },
    { role: 'Centre Back', x: 38, y: 76 },
    { role: 'Centre Back', x: 62, y: 76 },
    { role: 'Right Back', x: 84, y: 74 },
    { role: 'Holding Mid (DM)', x: 50, y: 62 },
    { role: 'Centre Mid L', x: 32, y: 48 },
    { role: 'Centre Mid R', x: 68, y: 48 },
    { role: 'Playmaker (CAM)', x: 50, y: 34 },
    { role: 'Striker L', x: 38, y: 18 },
    { role: 'Striker R', x: 62, y: 18 },
  ],
  '5-4-1': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Left Wing-Back', x: 14, y: 70 },
    { role: 'Centre Back L', x: 32, y: 77 },
    { role: 'Centre Back C', x: 50, y: 78 },
    { role: 'Centre Back R', x: 68, y: 77 },
    { role: 'Right Wing-Back', x: 86, y: 70 },
    { role: 'Left Mid', x: 20, y: 48 },
    { role: 'Central Mid', x: 40, y: 50 },
    { role: 'Central Mid', x: 60, y: 50 },
    { role: 'Right Mid', x: 80, y: 48 },
    { role: 'Lone Striker', x: 50, y: 18 },
  ],
  '3-4-2-1': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Centre Back L', x: 28, y: 76 },
    { role: 'Centre Back C', x: 50, y: 78 },
    { role: 'Centre Back R', x: 72, y: 76 },
    { role: 'Left Wing-Back', x: 14, y: 52 },
    { role: 'Central Mid', x: 38, y: 54 },
    { role: 'Central Mid', x: 62, y: 54 },
    { role: 'Right Wing-Back', x: 86, y: 52 },
    { role: 'Inside Forward L', x: 34, y: 32 },
    { role: 'Inside Forward R', x: 66, y: 32 },
    { role: 'Target Man', x: 50, y: 16 },
  ],
}

export interface TacticalOptions {
  defensiveLine?: 'low' | 'mid' | 'high'
  pitchWidth?: 'narrow' | 'standard' | 'wide'
}

/**
 * Dynamically computes tactical pitch coordinates for ANY arbitrary formation string (e.g. 4-3-3, 4-2-3-1, 3-2-4-1, 4-1-3-2)
 * Automatically distributes outfield players across depth tiers and horizontal width.
 */
export function generateTacticalCoordinates(
  formationStr: string,
  options?: TacticalOptions
): { role: string; x: number; y: number }[] {
  const cleanStr = formationStr.trim()

  // Use handcrafted coordinates if standard and no custom modifiers
  if (FORMATION_PRESETS[cleanStr] && !options?.defensiveLine && !options?.pitchWidth) {
    return FORMATION_PRESETS[cleanStr]
  }

  // Parse lines e.g. "4-2-3-1" -> [4, 2, 3, 1]
  const parsedLines = cleanStr
    .split('-')
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0)

  // Default to 4-3-3 if empty or unparseable
  const lines = parsedLines.length > 0 ? parsedLines : [4, 3, 3]

  // Player 0 is always the Goalkeeper
  const result: { role: string; x: number; y: number }[] = [
    { role: 'Goalkeeper', x: 50, y: 90 },
  ]

  const numLines = lines.length

  // Width boundaries
  const minX = options?.pitchWidth === 'narrow' ? 22 : options?.pitchWidth === 'wide' ? 12 : 16
  const maxX = options?.pitchWidth === 'narrow' ? 78 : options?.pitchWidth === 'wide' ? 88 : 84

  // Depth boundaries based on defensive line choice
  const baseDefY = options?.defensiveLine === 'high' ? 68 : options?.defensiveLine === 'low' ? 80 : 75
  const baseAttY = 16

  // Calculate vertical depth for each line
  const yPositions = lines.map((_, idx) => {
    if (numLines === 1) return 50
    const ratio = idx / (numLines - 1)
    return Math.round(baseDefY - ratio * (baseDefY - baseAttY))
  })

  // Distribute players per line
  lines.forEach((count, lineIdx) => {
    const y = yPositions[lineIdx]
    const isDefense = lineIdx === 0
    const isAttack = lineIdx === numLines - 1

    for (let i = 0; i < count; i++) {
      let x = 50
      if (count > 1) {
        const step = (maxX - minX) / (count - 1)
        x = Math.round(minX + i * step)
      }

      // Assign descriptive role
      let role = 'Outfield'
      if (isDefense) {
        if (count >= 4 && i === 0) role = 'Left Back'
        else if (count >= 4 && i === count - 1) role = 'Right Back'
        else if (count === 3 && i === 0) role = 'Left Centre-Back'
        else if (count === 3 && i === count - 1) role = 'Right Centre-Back'
        else if (count === 5 && (i === 0 || i === count - 1)) role = i === 0 ? 'Left Wing-Back' : 'Right Wing-Back'
        else role = 'Centre-Back'
      } else if (isAttack) {
        if (count === 1) role = 'Centre Forward'
        else if (count === 2) role = i === 0 ? 'Left Striker' : 'Right Striker'
        else if (count === 3) role = i === 0 ? 'Left Winger' : i === 1 ? 'Centre Forward' : 'Right Winger'
        else role = `Forward ${i + 1}`
      } else {
        if (count === 1) role = 'Central Mid (Pivote)'
        else if (count === 2) role = i === 0 ? 'Left Mid' : 'Right Mid'
        else if (count >= 3 && i === 0) role = 'Left Mid'
        else if (count >= 3 && i === count - 1) role = 'Right Mid'
        else role = 'Centre Mid'
      }

      result.push({ role, x, y })
    }
  })

  return result
}

