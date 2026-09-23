import { Sport, Team, Player, Match, LeaderboardEntry } from './types'

export const DEFAULT_BADMINTON_CAROUSEL_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=2000&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1626926938421-90124a4b83fa?w=2000&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1687597778602-624a9438fe0b?w=2000&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1724941407869-f8fb46a3cc38?w=2000&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=2000&auto=format&fit=crop&q=85',
]

export const DEFAULT_FOOTBALL_CAROUSEL_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=2000&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1518605368461-1eb767ac16ab?w=2000&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=2000&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1553775282-20af80779df7?w=2000&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1516422452136-168798e12467?w=2000&auto=format&fit=crop&q=85',
]

export const initialSports: Sport[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Football', type: 'team', venue: 'Main Outdoor Turf Stadium', image_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop' },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Badminton',
    type: 'duo',
    venue: 'Indoor Badminton Arena (Court 1)',
    image_url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop',
    carousel_images: DEFAULT_BADMINTON_CAROUSEL_IMAGES,
  },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Chess', type: 'solo', venue: 'Seminar Hall A', image_url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Carrom', type: 'quad', venue: 'Student Activity Center', image_url: 'https://images.unsplash.com/photo-1767619834318-63184920c4b1?w=800&auto=format&fit=crop' },
  { id: '31e7f54d-5b26-4c60-abdc-48928b28a661', name: 'E-Football', type: 'solo', venue: 'Esports Arena (Gaming Lab)', image_url: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1665460/5a730c921132b664412149cb3fa9da491fb01b0d/page_bg_raw.jpg?t=1788505213' },
  { id: '808bd237-178b-490a-ba8f-f11f391f2c07', name: 'Mini Miltia', type: 'free_for_all', venue: 'Student Activity Center', image_url: 'https://wallpaperaccess.com/full/2683336.png' },
]


export const initialTeams: Team[] = []
export const initialPlayers: Player[] = []
export const initialMatches: Match[] = []
export const initialLeaderboards: LeaderboardEntry[] = []

// Extended library of football tactical formations (Primary: 6v6 tournament presets)
export const FORMATION_PRESETS: Record<string, { role: string; x: number; y: number }[]> = {
  // --- 6v6 TOURNAMENT FORMATIONS (1 GK + 5 Outfield Players = 6 Total) ---
  '2-2-1': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Left Defender', x: 30, y: 74 },
    { role: 'Right Defender', x: 70, y: 74 },
    { role: 'Left Mid', x: 28, y: 46 },
    { role: 'Right Mid', x: 72, y: 46 },
    { role: 'Centre Forward', x: 50, y: 18 },
  ],
  '2-1-2': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Left Defender', x: 30, y: 74 },
    { role: 'Right Defender', x: 70, y: 74 },
    { role: 'Central Mid', x: 50, y: 48 },
    { role: 'Left Forward', x: 35, y: 20 },
    { role: 'Right Forward', x: 65, y: 20 },
  ],
  '3-1-1': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Left Defender', x: 22, y: 74 },
    { role: 'Central Defender', x: 50, y: 76 },
    { role: 'Right Defender', x: 78, y: 74 },
    { role: 'Central Mid', x: 50, y: 46 },
    { role: 'Centre Forward', x: 50, y: 18 },
  ],
  '1-3-1': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Sweeper / CB', x: 50, y: 74 },
    { role: 'Left Mid', x: 20, y: 46 },
    { role: 'Central Mid', x: 50, y: 48 },
    { role: 'Right Mid', x: 80, y: 46 },
    { role: 'Centre Forward', x: 50, y: 18 },
  ],
  '1-2-2': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Anchor / Defender', x: 50, y: 74 },
    { role: 'Left Mid', x: 30, y: 48 },
    { role: 'Right Mid', x: 70, y: 48 },
    { role: 'Left Forward', x: 35, y: 20 },
    { role: 'Right Forward', x: 65, y: 20 },
  ],
  '3-2-0': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Left Defender', x: 22, y: 74 },
    { role: 'Central Defender', x: 50, y: 76 },
    { role: 'Right Defender', x: 78, y: 74 },
    { role: 'Left Mid', x: 35, y: 44 },
    { role: 'Right Mid', x: 65, y: 44 },
  ],
  '2-3-0': [
    { role: 'Goalkeeper', x: 50, y: 90 },
    { role: 'Left Defender', x: 30, y: 74 },
    { role: 'Right Defender', x: 70, y: 74 },
    { role: 'Left Wing', x: 20, y: 42 },
    { role: 'Central Mid', x: 50, y: 44 },
    { role: 'Right Wing', x: 80, y: 42 },
  ],

  // --- 11v11 / Custom Shapes ---
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
}

export interface TacticalOptions {
  defensiveLine?: 'low' | 'mid' | 'high'
  pitchWidth?: 'narrow' | 'standard' | 'wide'
}

/**
 * Dynamically computes tactical pitch coordinates for ANY arbitrary formation string (e.g. 2-2-1, 2-1-2, 3-1-1, 1-3-1, 4-3-3)
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

  // Parse lines e.g. "2-2-1" -> [2, 2, 1]
  const parsedLines = cleanStr
    .split('-')
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0)

  // Default to 2-2-1 (6v6 football) if empty or unparseable
  const lines = parsedLines.length > 0 ? parsedLines : [2, 2, 1]

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
        if (count === 1) role = 'Sweeper / CB'
        else if (count === 2) role = i === 0 ? 'Left Defender' : 'Right Defender'
        else if (count === 3) role = i === 0 ? 'Left Defender' : i === 1 ? 'Central Defender' : 'Right Defender'
        else if (count >= 4 && i === 0) role = 'Left Back'
        else if (count >= 4 && i === count - 1) role = 'Right Back'
        else if (count === 5 && (i === 0 || i === count - 1)) role = i === 0 ? 'Left Wing-Back' : 'Right Wing-Back'
        else role = 'Centre-Back'
      } else if (isAttack) {
        if (count === 1) role = 'Centre Forward'
        else if (count === 2) role = i === 0 ? 'Left Forward' : 'Right Forward'
        else if (count === 3) role = i === 0 ? 'Left Winger' : i === 1 ? 'Centre Forward' : 'Right Winger'
        else role = `Forward ${i + 1}`
      } else {
        if (count === 1) role = 'Central Mid'
        else if (count === 2) role = i === 0 ? 'Left Mid' : 'Right Mid'
        else if (count === 3) role = i === 0 ? 'Left Wing' : i === 1 ? 'Central Mid' : 'Right Wing'
        else if (count >= 4 && i === 0) role = 'Left Mid'
        else if (count >= 4 && i === count - 1) role = 'Right Mid'
        else role = 'Centre Mid'
      }

      result.push({ role, x, y })
    }
  })

  return result
}

