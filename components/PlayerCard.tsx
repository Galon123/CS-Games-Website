'use client'

import React, { useState } from 'react'
import { Player, SportType } from '@/lib/types'
import { User, Edit2, Trash2, Star, ShieldAlert } from 'lucide-react'

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
 * Includes graceful image error fallback, initials/jersey rendering, and conditional Icon styling.
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
      className={`relative flex items-center justify-between p-3 rounded-xl transition-all ${
        isIcon
          ? 'bg-amber-50/70 border-2 border-[#D97706] shadow-editorial-amber'
          : 'bg-white border-2 border-[#1A1A1A] shadow-editorial-sm hover:-translate-y-0.5'
      } ${className}`}
    >
      <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
        {/* Avatar Container with Image Fallback */}
        <div
          className={`w-10 h-10 rounded-md overflow-hidden shrink-0 border-2 flex items-center justify-center font-mono font-black text-xs ${
            isIcon
              ? 'border-[#D97706] text-[#D97706] bg-[#1A1A1A] ring-2 ring-[#D97706]/30'
              : 'border-[#1A1A1A] text-[#1A1A1A] bg-slate-100'
          }`}
        >
          {hasValidPhoto ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={player.photo_url}
              alt={player.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : isSoloOrDuo ? (
            <span className="tracking-wider">{initials}</span>
          ) : player.jersey_number ? (
            <span>#{player.jersey_number}</span>
          ) : (
            <User className="w-4 h-4 text-slate-400" />
          )}
        </div>

        {/* Player Details */}
        <div className="min-w-0 flex-1 truncate">
          <div className="flex items-center space-x-1.5 truncate">
            <span className="font-bold text-xs sm:text-sm text-[#1A1A1A] truncate">
              {player.name}
            </span>
            {isIcon && (
              <span className="text-amber-500 text-xs shrink-0" title="Team Icon Athlete">
                ⭐
              </span>
            )}
            {!isSoloOrDuo && player.jersey_number !== undefined && player.jersey_number > 0 && (
              <span className="text-[11px] font-mono font-bold text-blue-600 shrink-0">
                #{player.jersey_number}
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
            <span className="truncate text-blue-600 font-medium">
              {player.role || (isSoloOrDuo ? 'Competitor' : 'Athlete')}
            </span>
            {(teamName || sportName) && (
              <span className="text-slate-400 truncate">
                • {teamName || 'Squad'} {sportName ? `(${sportName})` : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Badges and Actions */}
      <div className="flex items-center space-x-1.5 shrink-0">
        {/* Icon Badge for Team Sports */}
        {isIcon && (
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-medium flex items-center space-x-1 shadow-2xs">
            <span>⭐</span>
            <span className="hidden sm:inline">ICON</span>
          </span>
        )}

        {/* Admin Mode Controls */}
        {variant === 'admin' && (
          <div className="flex items-center space-x-1">
            {/* Make Icon Button (Only for non-icon athletes in team sports) */}
            {isTeamSport && !isIcon && onMakeIcon && (
              <button
                type="button"
                onClick={() => onMakeIcon(player)}
                className="px-2 py-1 rounded-md bg-white hover:bg-amber-50 text-slate-600 hover:text-amber-800 text-xs border border-slate-200 hover:border-amber-300 transition-colors flex items-center space-x-1 shadow-2xs"
                title="Designate as Icon Player"
              >
                <span>⭐</span>
                <span className="hidden md:inline">Make Icon</span>
              </button>
            )}

            {/* Edit Athlete Button */}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(player)}
                className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
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
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
