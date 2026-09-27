'use client'

import React, { useState } from 'react'
import { useTournament } from '@/context/TournamentContext'

interface BlurredBackgroundProps {
  customImageUrl?: string
  opacity?: string
}

export default function FootballBlurredBackground({
  customImageUrl,
  opacity,
}: BlurredBackgroundProps) {
  const { footballCarouselImages } = useTournament()
  const [imageFailed, setImageFailed] = useState(false)

  const defaultImage =
    'https://images.unsplash.com/photo-1518605368461-1ee7c532066d?w=2400&auto=format&fit=crop&q=85'

  const activeImage =
    customImageUrl ||
    (footballCarouselImages && footballCarouselImages.length > 0
      ? footballCarouselImages[0]
      : defaultImage)

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      <img
        src={imageFailed ? defaultImage : activeImage}
        alt="Football Pitch Atmosphere"
        loading="eager"
        decoding="async"
        onError={() => setImageFailed(true)}
        className={`w-full h-full object-cover object-center scale-105 filter blur-[10px] sm:blur-[12px] md:blur-[14px] transition-all duration-700 will-change-transform contrast-[120%] brightness-[85%] dark:brightness-[75%] ${
          opacity || 'opacity-70 dark:opacity-60'
        }`}
      />
      <div className="absolute top-10 left-1/4 w-[600px] h-[500px] rounded-full bg-cyan-400/25 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/3 -right-10 w-[600px] h-[550px] rounded-full bg-emerald-500/25 blur-[130px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[650px] h-[450px] rounded-full bg-acid/20 blur-[150px] mix-blend-screen pointer-events-none" />

      {/* Football pitch geometry */}
      <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none flex items-center justify-center">
        <svg className="w-full h-full max-w-6xl max-h-[850px] text-white" viewBox="0 0 1200 800" fill="none" stroke="currentColor">
          <rect x="100" y="50" width="1000" height="700" strokeWidth="3" />
          <line x1="600" y1="50" x2="600" y2="750" strokeWidth="3" />
          <circle cx="600" cy="400" r="100" strokeWidth="2.5" />
          <circle cx="600" cy="400" r="2" strokeWidth="3" />
          {/* Left Penalty Area */}
          <rect x="100" y="200" width="180" height="400" strokeWidth="2.5" />
          <rect x="100" y="300" width="60" height="200" strokeWidth="2.5" />
          <path d="M 280 320 A 80 80 0 0 1 280 480" strokeWidth="2.5" />
          {/* Right Penalty Area */}
          <rect x="920" y="200" width="180" height="400" strokeWidth="2.5" />
          <rect x="1040" y="300" width="60" height="200" strokeWidth="2.5" />
          <path d="M 920 320 A 80 80 0 0 0 920 480" strokeWidth="2.5" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-canvas/20 via-transparent to-canvas/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/30 via-transparent to-canvas/30 pointer-events-none" />
    </div>
  )
}
