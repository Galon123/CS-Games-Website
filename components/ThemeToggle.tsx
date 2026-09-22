'use client'

import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  variant?: 'icon' | 'pill' | 'row'
  className?: string
}

export default function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme()

  // Default to dark during SSR to avoid layout shift while rendering complete button immediately
  const currentTheme = mounted ? theme : 'dark'
  const isDark = currentTheme === 'dark'

  if (variant === 'row') {
    return (
      <div
        className={`flex items-center justify-between px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 ${className}`}
      >
        <div className="flex items-center space-x-2.5">
          {isDark ? (
            <div className="w-6 h-6 rounded-lg bg-amber-400/15 flex items-center justify-center border border-amber-400/30">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center border border-indigo-500/30">
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
            </div>
          )}
          <div>
            <div className="text-xs font-semibold text-paper leading-tight">
              {isDark ? 'Dark Theme' : 'Light Theme'}
            </div>
            <div className="text-[10px] font-mono text-fog">
              {isDark ? 'Noir Editorial' : 'Ivory Editorial'}
            </div>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-paper border border-white/15 transition-all shadow-xs active:scale-95"
        >
          <span>Switch to {isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    )
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
        title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
        className={`group flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 border select-none ${
          isDark
            ? 'bg-white/5 hover:bg-white/10 text-cream hover:text-paper border-white/15 hover:border-amber-300/40 shadow-xs'
            : 'bg-black/5 hover:bg-black/10 text-cream hover:text-paper border-black/10 hover:border-indigo-400/40 shadow-xs'
        } ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform duration-300 group-hover:rotate-45" />
            <span>Light</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
            <span>Dark</span>
          </>
        )}
      </button>
    )
  }

  // Default: Sleek icon circle button
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
      title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 border select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-acid ${
        isDark
          ? 'bg-white/5 hover:bg-white/10 text-mist hover:text-amber-300 border-white/15 hover:border-amber-300/40 hover:shadow-[0_0_14px_rgba(252,211,77,0.25)]'
          : 'bg-black/5 hover:bg-black/10 text-mist hover:text-indigo-600 border-black/10 hover:border-indigo-500/30 hover:shadow-subtle'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300 transition-all duration-300 hover:rotate-45 hover:scale-110" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 transition-all duration-300 hover:-rotate-12 hover:scale-110" />
      )}
    </button>
  )
}
