export type SportType = 'team' | 'solo' | 'duo' | 'free_for_all' | 'quad'

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
  logo_url?: string
  department: string
  sport_id: string
  formation?: string
  manager?: string
}

export interface Player {
  id: string
  team_id?: string | null
  sport_id?: string | null
  department?: string
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
  team_a_id?: string | null
  team_b_id?: string | null
  player_a_id?: string | null
  player_b_id?: string | null
  player_c_id?: string | null
  player_d_id?: string | null
  team_a_score?: number
  team_b_score?: number
  player_c_score?: number
  player_d_score?: number
  status: MatchStatus
  scheduled_at: string
  // Populated / joined properties
  team_a?: Team
  team_b?: Team
  player_a?: Player
  player_b?: Player
  player_c?: Player
  player_d?: Player
  sport?: Sport
  minute?: number
  venue?: string
  // Free For All & Quad properties
  is_free_for_all?: boolean
  is_quad?: boolean
  participants?: Team[]
}

export interface LeaderboardEntry {
  id: string
  sport_id: string
  team_id?: string | null
  player_id?: string | null
  played: number
  won: number
  drawn: number
  lost: number
  points: number
  team?: Team
  player?: Player
  rank?: number
  rankChange?: 'up' | 'down' | 'same'
  goalDifference?: number
}
