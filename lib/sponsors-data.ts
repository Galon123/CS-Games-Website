export interface Sponsor {
  id: string
  name: string
  tier: string
  tagline?: string
  logoUrl?: string
  websiteUrl?: string
  isFeatured?: boolean
}

export const SPONSORS_STORAGE_KEY = 'cs_games_sponsors_v2'

export const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'sponsor-1',
    name: 'TechCorp',
    tier: 'Title Partner',
    tagline: 'Empowering future engineers',
    logoUrl: 'https://cdn.simpleicons.org/github/white',
    websiteUrl: '#',
    isFeatured: true,
  },
  {
    id: 'sponsor-2',
    name: 'Energy Drink Co',
    tier: 'Energy Partner',
    tagline: 'Fueling your game',
    logoUrl: 'https://cdn.simpleicons.org/redbull/D7F22B',
    websiteUrl: '#',
    isFeatured: true,
  }
]
