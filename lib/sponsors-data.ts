export interface Sponsor {
  id: string
  name: string
  tier: string
  tagline?: string
  logoUrl?: string
  websiteUrl?: string
  isFeatured?: boolean
}

export const SPONSORS_STORAGE_KEY = 'cs_games_sponsors_v1'

export const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'sponsor-github',
    name: 'GitHub Education',
    tier: 'Title Partner',
    tagline: 'Developer Workflows & Cloud Compute',
    logoUrl: 'https://cdn.simpleicons.org/github/white',
    websiteUrl: 'https://education.github.com',
    isFeatured: true,
  },
  {
    id: 'sponsor-redbull',
    name: 'Red Bull',
    tier: 'Energy Partner',
    tagline: 'Peak Stamina for Athletic & Gaming Arenas',
    logoUrl: 'https://cdn.simpleicons.org/redbull/D7F22B',
    websiteUrl: 'https://redbull.com',
    isFeatured: true,
  },
  {
    id: 'sponsor-jetbrains',
    name: 'JetBrains',
    tier: 'Dev Tools',
    tagline: 'Professional IDE Suite Licenses',
    logoUrl: 'https://cdn.simpleicons.org/jetbrains/white',
    websiteUrl: 'https://www.jetbrains.com',
    isFeatured: false,
  },
  {
    id: 'sponsor-logitech',
    name: 'Logitech G',
    tier: 'Esports Gear',
    tagline: 'Tournament Peripherals',
    logoUrl: 'https://cdn.simpleicons.org/logitechg/white',
    websiteUrl: 'https://www.logitechg.com',
    isFeatured: false,
  },
  {
    id: 'sponsor-intel',
    name: 'Intel',
    tier: 'Compute',
    tagline: 'High-FPS Tournament Rigs',
    logoUrl: 'https://cdn.simpleicons.org/intel/white',
    websiteUrl: 'https://www.intel.com',
    isFeatured: false,
  },
  {
    id: 'sponsor-alumni',
    name: 'CS Alumni Fund',
    tier: 'Endowment',
    tagline: 'Student Athletics & Prize Fund',
    logoUrl: 'https://cdn.simpleicons.org/acm/white',
    websiteUrl: '#',
    isFeatured: false,
  },
]
