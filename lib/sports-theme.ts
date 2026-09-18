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
  badgeText: string
  colorClass: string
  bgBadgeClass: string
  borderHoverClass: string
  description: string
  link: string
  actionLabel: string
}

// Professional subtle palette cycle for dynamic/custom sports
const DYNAMIC_PALETTES = [
  {
    colorClass: 'text-blue-400',
    bgBadgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    borderHoverClass: 'hover:border-blue-500/40',
    icon: Trophy,
  },
  {
    colorClass: 'text-sky-400',
    bgBadgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    borderHoverClass: 'hover:border-sky-500/40',
    icon: Activity,
  },
  {
    colorClass: 'text-amber-400',
    bgBadgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    borderHoverClass: 'hover:border-amber-500/40',
    icon: Target,
  },
  {
    colorClass: 'text-violet-400',
    bgBadgeClass: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    borderHoverClass: 'hover:border-violet-500/40',
    icon: Zap,
  },
  {
    colorClass: 'text-rose-400',
    bgBadgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    borderHoverClass: 'hover:border-rose-500/40',
    icon: CircleDot,
  },
  {
    colorClass: 'text-emerald-400',
    bgBadgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    borderHoverClass: 'hover:border-emerald-500/40',
    icon: Dices,
  },
  {
    colorClass: 'text-indigo-400',
    bgBadgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    borderHoverClass: 'hover:border-indigo-500/40',
    icon: Gamepad2,
  },
]

export function getSportMeta(sportOrName: Sport | string, sportType?: SportType): SportMeta {
  const name = typeof sportOrName === 'string' ? sportOrName : sportOrName.name
  const type = typeof sportOrName === 'object' && sportOrName.type ? sportOrName.type : sportType || 'team'
  const normalized = name.trim().toLowerCase()

  // Format badge based on sport or type
  let badgeText = type === 'duo' ? 'DOUBLES' : type === 'solo' ? 'SOLO 1v1' : 'TEAM'

  // Pre-configured flagship sports
  if (normalized === 'football' || normalized === 'soccer') {
    return {
      name,
      type,
      icon: Flame,
      badgeText: '6 v 6',
      colorClass: 'text-emerald-400',
      bgBadgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      borderHoverClass: 'hover:border-emerald-500/40',
      description: '6v6 football championship with interactive squad formation board.',
      link: '/tactics',
      actionLabel: 'Tactical Board',
    }
  }

  if (normalized === 'badminton') {
    return {
      name,
      type,
      icon: Swords,
      badgeText: 'DOUBLES',
      colorClass: 'text-sky-400',
      bgBadgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      borderHoverClass: 'hover:border-sky-500/40',
      description: 'Indoor doubles rally. 21-point knockout tournament.',
      link: `/leaderboards?sport=${encodeURIComponent(name)}`,
      actionLabel: 'View Standings',
    }
  }

  if (normalized === 'chess') {
    return {
      name,
      type,
      icon: ShieldCheck,
      badgeText: 'SOLO 1v1',
      colorClass: 'text-amber-400',
      bgBadgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      borderHoverClass: 'hover:border-amber-500/40',
      description: 'Departmental strategic chess championship.',
      link: `/leaderboards?sport=${encodeURIComponent(name)}`,
      actionLabel: 'View Standings',
    }
  }

  if (normalized === 'carrom' || normalized === 'carroms') {
    return {
      name,
      type,
      icon: Layers,
      badgeText: 'DOUBLES',
      colorClass: 'text-violet-400',
      bgBadgeClass: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      borderHoverClass: 'hover:border-violet-500/40',
      description: 'Doubles tournament board play and points standings.',
      link: `/leaderboards?sport=${encodeURIComponent(name)}`,
      actionLabel: 'View Standings',
    }
  }

  if (normalized.includes('tennis') || normalized.includes('ping pong')) {
    return {
      name,
      type,
      icon: CircleDot,
      badgeText: type === 'duo' ? 'DOUBLES' : 'SOLO 1v1',
      colorClass: 'text-rose-400',
      bgBadgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      borderHoverClass: 'hover:border-rose-500/40',
      description: 'Paddle table tennis tournament fixtures and standings.',
      link: `/leaderboards?sport=${encodeURIComponent(name)}`,
      actionLabel: 'View Standings',
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
      colorClass: 'text-indigo-400',
      bgBadgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      borderHoverClass: 'hover:border-indigo-500/40',
      description: 'Competitive esports division featuring departmental gaming squads.',
      link: `/leaderboards?sport=${encodeURIComponent(name)}`,
      actionLabel: 'View Standings',
    }
  }

  if (normalized.includes('basketball') || normalized.includes('cricket') || normalized.includes('volleyball')) {
    return {
      name,
      type,
      icon: Target,
      badgeText: 'TEAM SQUAD',
      colorClass: 'text-teal-400',
      bgBadgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      borderHoverClass: 'hover:border-teal-500/40',
      description: `Departmental ${name} championship division.`,
      link: `/leaderboards?sport=${encodeURIComponent(name)}`,
      actionLabel: 'View Standings',
    }
  }

  // Fallback for any arbitrary newly added sport:
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
    link: `/leaderboards?sport=${encodeURIComponent(name)}`,
    actionLabel: 'View Standings',
  }
}
