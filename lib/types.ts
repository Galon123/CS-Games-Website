export type SportType = 'team' | 'solo' | 'duo'

export interface Sport {
  id: string
  name: string
  type: SportType
  icon?: string
  image_url?: string
  venue?: string
}

export interface Team {
  id: string
  name: string
  logo_url: string
  department: string
  sport_id: string
  formation?: string
  manager?: string
}

export interface Player {
  id: string
  team_id: string
  name: string
  photo_url: string
  role: string
  jersey_number: number
  position_x: number
  position_y: number
  is_icon?: boolean
  stats?: {
    matchesPlayed?: number
    goalsOrPoints?: number
    assistsOrWins?: number
    rating?: number
    elo?: number
  }
}

export type MatchStatus = 'upcoming' | 'live' | 'completed'

export interface Match {
  id: string
  sport_id: string
  team_a_id: string
  team_b_id: string
  team_a_score: number
  team_b_score: number
  status: MatchStatus
  scheduled_at: string
  // Populated / joined properties
  team_a?: Team
  team_b?: Team
  sport?: Sport
  minute?: number
  venue?: string
}

export interface LeaderboardEntry {
  id: string
  sport_id: string
  team_id: string
  played: number
  won: number
  drawn: number
  lost: number
  points: number
  team?: Team
  rank?: number
  rankChange?: 'up' | 'down' | 'same'
  goalDifference?: number
}
