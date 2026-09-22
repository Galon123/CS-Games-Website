import React from 'react'
import {
  Flame,
  Swords,
  ShieldCheck,
  Layers,
  Trophy,
  Gamepad2,
  CircleDot,
  Activity,
  Target,
  Dices,
  Zap,
  LucideIcon,
} from 'lucide-react'
import { Sport, SportType } from './types'

export interface SportMeta {
  name: string
  type: SportType
  icon: LucideIcon
  imageUrl?: string // Only defined for Football, Badminton, Chess, and Carroms
  badgeText: string
  colorClass: string
  bgBadgeClass: string
  borderHoverClass: string
  description: string
  link: string
  actionLabel: string
}

// Curated sport-specific display images
export const SPORT_SPECIFIC_IMAGES: Record<string, string> = {
  football: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop',
  soccer: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop',
  badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop',
  chess: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop',
  carrom: 'https://images.unsplash.com/photo-1767619834318-63184920c4b1?w=800&auto=format&fit=crop',
  carroms: 'https://images.unsplash.com/photo-1767619834318-63184920c4b1?w=800&auto=format&fit=crop',
  'e-football': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1665460/5a730c921132b664412149cb3fa9da491fb01b0d/page_bg_raw.jpg?t=1788505213',
  efootball: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1665460/5a730c921132b664412149cb3fa9da491fb01b0d/page_bg_raw.jpg?t=1788505213',
  'mini-militia': 'https://wallpaperaccess.com/full/2683336.png',
  'mini-miltia': 'https://wallpaperaccess.com/full/2683336.png',
  'mini militia': 'https://wallpaperaccess.com/full/2683336.png',
  'mini miltia': 'https://wallpaperaccess.com/full/2683336.png',
}

/**
 * Checks if a sport is the real-world Football tournament (The CS Cup).
 * Strictly excludes virtual E-Football / gaming events.
 */
export function isCsCupFootball(sportOrName?: Sport | string | null): boolean {
  if (!sportOrName) return false
  const name = typeof sportOrName === 'string' ? sportOrName : sportOrName.name
  if (!name) return false
  const norm = name.trim().toLowerCase()

  // STRICTLY EXCLUDE E-FOOTBALL / ESPORTS / VIRTUAL GAMES
  if (
    norm.includes('e-football') ||
    norm.includes('efootball') ||
    norm.includes('e football') ||
    norm.includes('esports') ||
    norm.includes('gaming') ||
    norm.includes('fifa') ||
    norm.includes('pes')
  ) {
    return false
  }

  // Matches genuine physical Football / CS Cup
  return (
    norm === 'football' ||
    norm === 'soccer' ||
    norm === 'cs cup' ||
    norm === 'the cs cup' ||
    norm.includes('cs cup') ||
    (norm.includes('football') && !norm.startsWith('e'))
  )
}

/**
 * Checks if a sport is one of the designated sports that have images:
 * Football, Badminton, Chess, Carrom, E-Football, or Mini Militia.
 */
export function isSportWithImage(sportOrName: Sport | string): boolean {
  const name = typeof sportOrName === 'string' ? sportOrName : sportOrName.name
  const normalized = name.trim().toLowerCase()

  if (isCsCupFootball(name)) {
    return true
  }

  // E-Football gaming division
  if (normalized.includes('e-football') || normalized.includes('efootball') || normalized.includes('e football')) {
    return true
  }

  // Mini Militia gaming division
  if (
    normalized.includes('mini militia') ||
    normalized.includes('mini miltia') ||
    normalized.includes('mini-militia') ||
    normalized.includes('mini-miltia')
  ) {
    return true
  }

  return (
    normalized === 'badminton' ||
    normalized.includes('badminton') ||
    normalized === 'chess' ||
    normalized.includes('chess') ||
    normalized === 'carrom' ||
    normalized === 'carroms' ||
    normalized.includes('carrom')
  )
}

/**
 * Resolves a sport-related display image.
 */
export function getSportDisplayImage(sportOrName: Sport | string, sportType?: SportType): string | undefined {
  const name = typeof sportOrName === 'string' ? sportOrName : sportOrName.name
  const normalized = name.trim().toLowerCase()

  if (isCsCupFootball(name)) {
    return SPORT_SPECIFIC_IMAGES.football
  }

  if (normalized.includes('e-football') || normalized.includes('efootball') || normalized.includes('e football')) {
    return SPORT_SPECIFIC_IMAGES['e-football']
  }

  if (
    normalized.includes('mini militia') ||
    normalized.includes('mini miltia') ||
    normalized.includes('mini-militia') ||
    normalized.includes('mini-miltia')
  ) {
    return SPORT_SPECIFIC_IMAGES['mini-militia']
  }

  if (normalized === 'badminton' || normalized.includes('badminton')) {
    return SPORT_SPECIFIC_IMAGES.badminton
  }
  if (normalized === 'chess' || normalized.includes('chess')) {
    return SPORT_SPECIFIC_IMAGES.chess
  }
  if (normalized === 'carrom' || normalized === 'carroms' || normalized.includes('carrom')) {
    return SPORT_SPECIFIC_IMAGES.carrom
  }

  // Any other sport gets NO image
  return undefined
}

// Professional subtle palette cycle for dynamic/custom sports
const DYNAMIC_PALETTES = [
  {
    colorClass: 'text-blue-700',
    bgBadgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    borderHoverClass: 'hover:border-blue-300',
    icon: Trophy,
  },
  {
    colorClass: 'text-sky-700',
    bgBadgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    borderHoverClass: 'hover:border-sky-300',
    icon: Activity,
  },
  {
    colorClass: 'text-amber-800',
    bgBadgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    borderHoverClass: 'hover:border-amber-300',
    icon: Target,
  },
  {
    colorClass: 'text-violet-700',
    bgBadgeClass: 'bg-violet-50 text-violet-700 border-violet-200',
    borderHoverClass: 'hover:border-violet-300',
    icon: Zap,
  },
  {
    colorClass: 'text-rose-700',
    bgBadgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    borderHoverClass: 'hover:border-rose-300',
    icon: CircleDot,
  },
  {
    colorClass: 'text-emerald-700',
    bgBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderHoverClass: 'hover:border-emerald-300',
    icon: Dices,
  },
  {
    colorClass: 'text-indigo-700',
    bgBadgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    borderHoverClass: 'hover:border-indigo-300',
    icon: Gamepad2,
  },
]

/**
 * Generates a clean, URL-friendly slug for a sport.
 */
export function getSportSlug(sportOrName: Sport | string): string {
  const name = typeof sportOrName === 'string' ? sportOrName : sportOrName.name
  if (!name) return ''
  const norm = name.trim().toLowerCase()

  if (isCsCupFootball(name)) {
    return 'football'
  }
  if (norm === 'badminton' || norm.includes('badminton')) {
    return 'badminton'
  }
  if (norm === 'chess' || norm.includes('chess')) {
    return 'chess'
  }
  if (norm === 'carrom' || norm === 'carroms' || norm.includes('carrom')) {
    return 'carrom'
  }

  const slugified = norm
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slugified || (typeof sportOrName === 'object' && sportOrName.id ? sportOrName.id : 'game')
}

/**
 * Resolves a sport from an array of sports using a slug or ID.
 */
export function findSportBySlugOrId(sports: Sport[], slugOrId: string): Sport | undefined {
  if (!slugOrId || !sports || sports.length === 0) return undefined
  const norm = decodeURIComponent(slugOrId).trim().toLowerCase()

  // 1. Direct ID match
  const byId = sports.find((s) => s.id.toLowerCase() === norm)
  if (byId) return byId

  // 2. Football / CS Cup match
  if (norm === 'football' || norm === 'cs-cup' || norm === 'the-cs-cup' || norm === 'soccer') {
    const csCup = sports.find((s) => isCsCupFootball(s.name))
    if (csCup) return csCup
  }

  // 3. Known sport slugs
  if (norm === 'badminton') {
    const s = sports.find((sp) => sp.name.toLowerCase().includes('badminton'))
    if (s) return s
  }
  if (norm === 'chess') {
    const s = sports.find((sp) => sp.name.toLowerCase().includes('chess'))
    if (s) return s
  }
  if (norm === 'carrom' || norm === 'carroms') {
    const s = sports.find((sp) => sp.name.toLowerCase().includes('carrom'))
    if (s) return s
  }

  // 4. Slugified match
  const bySlug = sports.find((s) => getSportSlug(s) === norm)
  if (bySlug) return bySlug

  // 5. Name match
  const byName = sports.find(
    (s) =>
      s.name.toLowerCase() === norm ||
      s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === norm
  )
  if (byName) return byName

  return undefined
}

export function getSportMeta(sportOrName: Sport | string, sportType?: SportType): SportMeta {
  const name = typeof sportOrName === 'string' ? sportOrName : sportOrName.name
  const type = typeof sportOrName === 'object' && sportOrName.type ? sportOrName.type : sportType || 'team'
  const normalized = name.trim().toLowerCase()
  const slug = getSportSlug(sportOrName)

  const isAllowed = isSportWithImage(name)
  const defaultImg = getSportDisplayImage(name, type)

  let customImg = typeof sportOrName === 'object' && sportOrName.image_url ? sportOrName.image_url : undefined
  if (customImg && (customImg.includes('1508098682722') || customImg.trim() === '')) {
    customImg = undefined
  }

  const imageUrl = isAllowed ? (customImg || defaultImg) : undefined

  // Format badge based on sport or type
  let badgeText =
    type === 'free_for_all'
      ? 'FREE FOR ALL'
      : type === 'quad'
      ? '1v1v1v1'
      : type === 'duo'
      ? 'DOUBLES'
      : type === 'solo'
      ? 'SOLO 1v1'
      : 'TEAM'

  // Pre-configured flagship sports: The CS Cup (Strictly physical 6v6 Football)
  if (isCsCupFootball(name)) {
    return {
      name: name.toLowerCase().includes('cs cup') ? name : 'CS Cup (Football)',
      type,
      icon: Flame,
      imageUrl,
      badgeText: 'CS CUP',
      colorClass: 'text-blue-600',
      bgBadgeClass: 'bg-[#1F3A2B] text-white font-mono font-bold',
      borderHoverClass: 'hover:border-blue-600',
      description: 'The marquee 6v6 football championship of CS Games 2026 with interactive tactical pitch tracking.',
      link: '/games/football',
      actionLabel: 'Enter Game Hub',
    }
  }

  // Pre-configured Mini Militia / Mini Miltia (Multiplayer Action Shooter)
  if (
    normalized.includes('mini militia') ||
    normalized.includes('mini miltia') ||
    normalized.includes('mini-militia') ||
    normalized.includes('mini-miltia')
  ) {
    const militiaImg = customImg || SPORT_SPECIFIC_IMAGES['mini-militia']
    return {
      name,
      type: type || 'free_for_all',
      icon: Swords,
      imageUrl: militiaImg,
      badgeText: 'FREE FOR ALL',
      colorClass: 'text-amber-800',
      bgBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-mono font-bold',
      borderHoverClass: 'hover:border-amber-400',
      description: 'Departmental combat operations and multiplayer action shooter championship.',
      link: `/games/${slug}`,
      actionLabel: 'Enter Game Hub',
    }
  }

  // Free For All category events (Mass / All-Play showdowns)
  if (type === 'free_for_all') {
    return {
      name,
      type,
      icon: Swords,
      imageUrl,
      badgeText: 'FREE FOR ALL',
      colorClass: 'text-amber-800',
      bgBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-mono font-bold',
      borderHoverClass: 'hover:border-amber-400',
      description: `Open-field mass championship for ${name}. All registered participants compete simultaneously in the event match.`,
      link: `/games/${slug}`,
      actionLabel: 'Enter Game Hub',
    }
  }

  // Quad 1v1v1v1 Category events (4-player simultaneous board games)
  if (type === 'quad') {
    return {
      name,
      type,
      icon: Layers,
      imageUrl,
      badgeText: '1v1v1v1',
      colorClass: 'text-violet-700',
      bgBadgeClass: 'bg-violet-100 text-violet-900 border-violet-300 font-mono font-bold',
      borderHoverClass: 'hover:border-violet-400',
      description: `4-Player 1v1v1v1 board championship for ${name}. Four solo contenders face off on a single board simultaneously.`,
      link: `/games/${slug}`,
      actionLabel: 'Enter Game Hub',
    }
  }

  // Pre-configured E-Football / Virtual Gaming (Strictly separate from real CS Cup Football)
  if (
    normalized.includes('e-football') ||
    normalized.includes('efootball') ||
    normalized.includes('e football') ||
    normalized.includes('fifa') ||
    normalized.includes('pes')
  ) {
    return {
      name,
      type: type || 'solo',
      icon: Gamepad2,
      imageUrl: imageUrl || SPORT_SPECIFIC_IMAGES['e-football'],
      badgeText: type === 'duo' ? 'ESPORTS 2v2' : 'ESPORTS 1v1',
      colorClass: 'text-indigo-600',
      bgBadgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      borderHoverClass: 'hover:border-indigo-400',
      description: 'Department esports console tournament. Virtual stadium 1v1 and 2v2 showdowns.',
      link: `/games/${slug}`,
      actionLabel: 'Enter Game Hub',
    }
  }

  if (normalized === 'badminton') {
    return {
      name,
      type,
      icon: Swords,
      imageUrl,
      badgeText: 'DOUBLES',
      colorClass: 'text-sky-700',
      bgBadgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      borderHoverClass: 'hover:border-sky-300',
      description: 'Indoor doubles rally. 21-point knockout tournament.',
      link: '/games/badminton',
      actionLabel: 'Enter Game Hub',
    }
  }

  if (normalized === 'chess') {
    return {
      name,
      type,
      icon: ShieldCheck,
      imageUrl,
      badgeText: 'SOLO 1v1',
      colorClass: 'text-amber-800',
      bgBadgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      borderHoverClass: 'hover:border-amber-300',
      description: 'Departmental strategic chess championship.',
      link: '/games/chess',
      actionLabel: 'Enter Game Hub',
    }
  }

  if (normalized === 'carrom' || normalized === 'carroms' || normalized.includes('carrom')) {
    const isCarromDuo = type === 'duo'
    return {
      name,
      type: type || 'quad',
      icon: Layers,
      imageUrl,
      badgeText: isCarromDuo ? 'DOUBLES' : '1v1v1v1',
      colorClass: 'text-violet-700',
      bgBadgeClass: isCarromDuo ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-violet-100 text-violet-900 border-violet-300 font-mono font-bold',
      borderHoverClass: 'hover:border-violet-300',
      description: isCarromDuo ? 'Doubles tournament board play and points standings.' : '4-Player 1v1v1v1 Carrom showdown: solo contenders face off on a single board simultaneously.',
      link: '/games/carrom',
      actionLabel: 'Enter Game Hub',
    }
  }

  if (normalized.includes('tennis') || normalized.includes('ping pong')) {
    return {
      name,
      type,
      icon: CircleDot,
      badgeText: type === 'duo' ? 'DOUBLES' : 'SOLO 1v1',
      colorClass: 'text-rose-700',
      bgBadgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      borderHoverClass: 'hover:border-rose-300',
      description: 'Paddle table tennis tournament fixtures and standings.',
      link: `/games/${slug}`,
      actionLabel: 'Enter Game Hub',
    }
  }

  if (
    normalized.includes('esports') ||
    normalized.includes('gaming') ||
    normalized.includes('valorant') ||
    normalized.includes('fifa') ||
    normalized.includes('cs:go') ||
    normalized.includes('counter')
  ) {
    return {
      name,
      type,
      icon: Gamepad2,
      badgeText: type === 'team' ? '5 v 5 SQUAD' : badgeText,
      colorClass: 'text-indigo-700',
      bgBadgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      borderHoverClass: 'hover:border-indigo-300',
      description: 'Competitive esports division featuring departmental gaming squads.',
      link: `/games/${slug}`,
      actionLabel: 'Enter Game Hub',
    }
  }

  if (normalized.includes('basketball') || normalized.includes('cricket') || normalized.includes('volleyball')) {
    return {
      name,
      type,
      icon: Target,
      badgeText: 'TEAM SQUAD',
      colorClass: 'text-teal-700',
      bgBadgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
      borderHoverClass: 'hover:border-teal-300',
      description: `Departmental ${name} championship division.`,
      link: `/games/${slug}`,
      actionLabel: 'Enter Game Hub',
    }
  }

  // Fallback for any arbitrary newly added sport (strictly NO image):
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) & 0xffffffff
  }
  const palette = DYNAMIC_PALETTES[Math.abs(hash) % DYNAMIC_PALETTES.length]

  return {
    name,
    type,
    icon: palette.icon,
    badgeText,
    colorClass: palette.colorClass,
    bgBadgeClass: palette.bgBadgeClass,
    borderHoverClass: palette.borderHoverClass,
    description: `Department championship division for ${name}. Fixtures, points, and standings.`,
    link: `/games/${slug}`,
    actionLabel: 'Enter Game Hub',
  }
}
