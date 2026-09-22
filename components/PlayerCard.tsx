'use client'

import React, { useState } from 'react'
import { Player, SportType } from '@/lib/types'
import { User, Edit2, Trash2 } from 'lucide-react'

export interface PlayerCardProps {
  player: Player
  teamName?: string
  sportName?: string
  sportType?: SportType
  variant?: 'public' | 'compact' | 'admin'
  onEdit?: (player: Player) => void
  onRemove?: (player: Player) => void
  onMakeIcon?: (player: Player) => void
  className?: string
}

/**
 * Reusable Player Card component for Public Rosters, Detail Modals, and Admin Management.
 * Implements the Noir Editorial dark surface aesthetics with graceful fallbacks.
 */
export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  teamName,
  sportName,
  sportType = 'team',
  variant = 'public',
  onEdit,
  onRemove,
  onMakeIcon,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false)

  const isSoloOrDuo = sportType === 'solo' || sportType === 'duo' || sportName?.toLowerCase() === 'chess'
  const isTeamSport = !isSoloOrDuo
  const isIcon = isTeamSport && Boolean(player.is_icon)

  // Compute player initials (up to 2 characters)
  const initials = (player.name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('') || 'AT'

  const hasValidPhoto = Boolean(player.photo_url) && !imageError

  return (
    <div
      className={`relative flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 ${
        isIcon
          ? 'bg-ink-800 border border-acid/40 shadow-[0_0_16px_rgba(215,242,43,0.1)]'
          : 'bg-ink-800 border border-white/10 hover:border-white/25 hover:-translate-y-0.5'
      } ${className}`}
    >
      <div className="flex items-center space-x-3.5 min-w-0 flex-1 mr-2">
        {/* Avatar Container with Image Fallback */}
        <div
          className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 border flex items-center justify-center font-mono font-bold text-xs ${
            isIcon
              ? 'border-acid/60 text-acid bg-ink-900 shadow-[0_0_8px_rgba(215,242,43,0.2)]'
              : 'border-white/15 text-paper bg-ink-900'
          }`}
        >
          {hasValidPhoto ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={player.photo_url}
              alt={player.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover grayscale-[20%] contrast-[110%]"
            />
          ) : isSoloOrDuo ? (
            <span className="tracking-wider">{initials}</span>
          ) : player.jersey_number ? (
            <span className="font-serif font-bold text-sm font-lining">#{player.jersey_number}</span>
          ) : (
            <User className="w-4 h-4 text-fog" />
          )}
        </div>

        {/* Player Details */}
        <div className="min-w-0 flex-1 truncate">
          <div className="flex items-center space-x-2 truncate">
            <span className="font-bold text-xs sm:text-sm text-paper truncate">
              {player.name}
            </span>
            {isIcon && (
              <span className="text-acid text-xs shrink-0" title="Team Icon Athlete">
                ★
              </span>
            )}
            {!isSoloOrDuo && player.jersey_number !== undefined && player.jersey_number > 0 && (
              <span className="text-xs font-serif font-black text-mist shrink-0 font-lining">
                #{player.jersey_number}
              </span>
            )}
          </div>

          <div className="text-[11px] text-mist truncate flex items-center gap-1.5 mt-0.5">
            <span className="truncate text-acid font-medium">
              {player.role || (isSoloOrDuo ? 'Competitor' : 'Athlete')}
            </span>
            {(teamName || sportName) && (
              <span className="text-fog truncate">
                • {teamName || 'Squad'} {sportName ? `(${sportName})` : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Badges and Actions */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* Icon Badge for Team Sports */}
        {isIcon && (
          <span className="px-2.5 py-0.5 rounded-full bg-acid/15 text-acid border border-acid/30 text-[10px] font-bold flex items-center space-x-1">
            <span>★</span>
            <span className="hidden sm:inline">ICON</span>
          </span>
        )}

        {/* Admin Mode Controls */}
        {variant === 'admin' && (
          <div className="flex items-center space-x-1">
            {/* Make Icon Button */}
            {isTeamSport && !isIcon && onMakeIcon && (
              <button
                type="button"
                onClick={() => onMakeIcon(player)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-acid/15 text-mist hover:text-acid text-xs border border-white/10 hover:border-acid/30 transition-colors flex items-center space-x-1"
                title="Designate as Icon Player"
              >
                <span>★</span>
                <span className="hidden md:inline text-[10px] font-bold">Make Icon</span>
              </button>
            )}

            {/* Edit Athlete Button */}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(player)}
                className="p-1.5 rounded-lg text-fog hover:text-acid hover:bg-white/5 transition-colors"
                title="Edit Athlete Profile & Photo"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Remove Athlete Button */}
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(player)}
                className="p-1.5 rounded-lg text-fog hover:text-rose-400 hover:bg-white/5 transition-colors"
                title="Remove Athlete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerCard
