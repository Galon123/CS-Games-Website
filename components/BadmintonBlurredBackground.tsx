'use client'

import React, { useState } from 'react'
import { useTournament } from '@/context/TournamentContext'

interface BadmintonBlurredBackgroundProps {
  customImageUrl?: string
  opacity?: string
}

export default function BadmintonBlurredBackground({
  customImageUrl,
  opacity,
}: BadmintonBlurredBackgroundProps) {
  const { badmintonCarouselImages } = useTournament()
  const [imageFailed, setImageFailed] = useState(false)

  // Use custom URL, admin carousel image, or premier professional badminton arena photo
  const defaultBadmintonImage =
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=2400&auto=format&fit=crop&q=85'

  const fallbackBadmintonImage =
    'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=2400&auto=format&fit=crop&q=85'

  const activeImage =
    customImageUrl ||
    (badmintonCarouselImages && badmintonCarouselImages.length > 0
      ? badmintonCarouselImages[0]
      : defaultBadmintonImage)

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. PRIMARY HIGH-RESOLUTION BLURRED BADMINTON BACKGROUND IMAGE
          Smoothly blurred with scale overscan to prevent border bleed.
          Vivid sports arena presence with high clarity.
          ───────────────────────────────────────────────────────────── */}
      <img
        src={imageFailed ? fallbackBadmintonImage : activeImage}
        alt="Badminton Arena Court Atmosphere"
        loading="eager"
        decoding="async"
        onError={() => setImageFailed(true)}
        className={`w-full h-full object-cover object-center scale-105 filter blur-[10px] sm:blur-[12px] md:blur-[14px] transition-all duration-700 will-change-transform contrast-[120%] brightness-[85%] dark:brightness-[75%] ${
          opacity || 'opacity-70 dark:opacity-60'
        }`}
      />

      {/* ─────────────────────────────────────────────────────────────
          2. ATMOSPHERIC ARENA LIGHTING GLOWS
          Vibrant cyan, emerald, and electric court spotlight blooms
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[500px] rounded-full bg-cyan-400/25 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/3 -right-10 w-[600px] h-[550px] rounded-full bg-emerald-500/25 blur-[130px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[650px] h-[450px] rounded-full bg-acid/20 blur-[150px] mix-blend-screen pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────────
          3. REGULATION BWF BADMINTON COURT GEOMETRY WATERMARK
          Noticeable court lines accentuating the athletic tournament feel
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none flex items-center justify-center">
        <svg className="w-full h-full max-w-6xl max-h-[850px] text-white" viewBox="0 0 1200 800" fill="none" stroke="currentColor">
          <rect x="150" y="80" width="900" height="640" strokeWidth="2.5" />
          <line x1="210" y1="80" x2="210" y2="720" strokeWidth="1.5" />
          <line x1="990" y1="80" x2="990" y2="720" strokeWidth="1.5" />
          <line x1="600" y1="80" x2="600" y2="720" strokeWidth="3" />
          <line x1="470" y1="80" x2="470" y2="720" strokeWidth="2" />
          <line x1="730" y1="80" x2="730" y2="720" strokeWidth="2" />
          <line x1="150" y1="400" x2="470" y2="400" strokeWidth="2" />
          <line x1="730" y1="400" x2="1050" y2="400" strokeWidth="2" />
          <line x1="190" y1="80" x2="190" y2="720" strokeWidth="1.5" strokeDasharray="8 8" />
          <line x1="1010" y1="80" x2="1010" y2="720" strokeWidth="1.5" strokeDasharray="8 8" />
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. SUBTLE VIGNETTE GRADIENTS
          Preserves text readability without burying the blurred arena
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/20 via-transparent to-canvas/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/30 via-transparent to-canvas/30 pointer-events-none" />
    </div>
  )
}
