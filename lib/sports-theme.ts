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

// Deterministic color palette cycle for dynamic/custom sports
const DYNAMIC_PALETTES = [
  {
    colorClass: 'text-neon-lime',
    bgBadgeClass: 'bg-neon-lime/10 text-neon-lime border-neon-lime/30',
    borderHoverClass: 'hover:border-neon-lime/50',
    icon: Trophy,
  },
  {
    colorClass: 'text-cyber-cyan',
    bgBadgeClass: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30',
    borderHoverClass: 'hover:border-cyber-cyan/50',
    icon: Activity,
  },
  {
    colorClass: 'text-amber-400',
    bgBadgeClass: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
    borderHoverClass: 'hover:border-amber-400/50',
    icon: Target,
  },
  {
    colorClass: 'text-purple-400',
    bgBadgeClass: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
    borderHoverClass: 'hover:border-purple-400/50',
    icon: Zap,
  },
  {
    colorClass: 'text-rose-400',
    bgBadgeClass: 'bg-rose-400/10 text-rose-400 border-rose-400/30',
    borderHoverClass: 'hover:border-rose-400/50',
    icon: CircleDot,
  },
  {
    colorClass: 'text-emerald-400',
    bgBadgeClass: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
    borderHoverClass: 'hover:border-emerald-400/50',
    icon: Dices,
  },
  {
    colorClass: 'text-indigo-400',
    bgBadgeClass: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/30',
    borderHoverClass: 'hover:border-indigo-400/50',
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
      badgeText: '11 v 11',
      colorClass: 'text-neon-lime',
      bgBadgeClass: 'bg-neon-lime/10 text-neon-lime border-neon-lime/30',
      borderHoverClass: 'hover:border-neon-lime/50',
      description: 'Main outdoor championship with interactive 2D squad formation board.',
      link: '/tactics',
      actionLabel: 'Open Pitch Board',
    }
  }

  if (normalized === 'badminton') {
    return {
      name,
      type,
      icon: Swords,
      badgeText: 'DOUBLES',
      colorClass: 'text-cyber-cyan',
      bgBadgeClass: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30',
      borderHoverClass: 'hover:border-cyber-cyan/50',
      description: 'Fast-paced indoor doubles rally. 21-point knockout format.',
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
      bgBadgeClass: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
      borderHoverClass: 'hover:border-amber-400/50',
      description: 'Grandmaster showdown. 2400+ ELO rated departmental prodigies.',
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
      colorClass: 'text-purple-400',
      bgBadgeClass: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
      borderHoverClass: 'hover:border-purple-400/50',
      description: 'Precision strikes, queen covers, and bank shots on tournament boards.',
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
      bgBadgeClass: 'bg-rose-400/10 text-rose-400 border-rose-400/30',
      borderHoverClass: 'hover:border-rose-400/50',
      description: 'High-velocity paddle reflexes, table spins, and tactical rallies.',
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
      bgBadgeClass: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/30',
      borderHoverClass: 'hover:border-indigo-400/50',
      description: 'Competitive esports arena matches featuring departmental cyber squads.',
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
      colorClass: 'text-emerald-400',
      bgBadgeClass: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
      borderHoverClass: 'hover:border-emerald-400/50',
      description: `High-octane departmental ${name} championship tournament.`,
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
    description: `Official CS department championship division for ${name}. Track points, fixtures, and standings.`,
    link: `/leaderboards?sport=${encodeURIComponent(name)}`,
    actionLabel: 'View Standings',
  }
}
