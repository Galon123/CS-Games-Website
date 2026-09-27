'use client'

import React, { useState } from 'react'

interface BlurredBackgroundProps {
  customImageUrl?: string
  opacity?: string
}

export default function ChessBlurredBackground({
  customImageUrl,
  opacity,
}: BlurredBackgroundProps) {
  const [imageFailed, setImageFailed] = useState(false)

  const defaultImage =
    'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=2400&auto=format&fit=crop&q=85'

  const activeImage = customImageUrl || defaultImage

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      <img
        src={imageFailed ? defaultImage : activeImage}
        alt="Chess Board Atmosphere"
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

      {/* Chess board geometry */}
      <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none flex items-center justify-center">
        <svg className="w-[800px] h-[800px] max-w-full max-h-full text-white opacity-40" viewBox="0 0 800 800" fill="currentColor">
          {Array.from({ length: 8 }).map((_, row) => 
            Array.from({ length: 8 }).map((_, col) => 
              (row + col) % 2 === 0 ? (
                <rect key={`${row}-${col}`} x={col * 100} y={row * 100} width="100" height="100" />
              ) : null
            )
          )}
          <rect x="0" y="0" width="800" height="800" fill="none" stroke="currentColor" strokeWidth="8" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-canvas/20 via-transparent to-canvas/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/30 via-transparent to-canvas/30 pointer-events-none" />
    </div>
  )
}
