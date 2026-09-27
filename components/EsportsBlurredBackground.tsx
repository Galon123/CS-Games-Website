'use client'

import React, { useState } from 'react'

interface BlurredBackgroundProps {
  customImageUrl?: string
  opacity?: string
}

export default function EsportsBlurredBackground({
  customImageUrl,
  opacity,
}: BlurredBackgroundProps) {
  const [imageFailed, setImageFailed] = useState(false)

  const defaultImage =
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=2400&auto=format&fit=crop'

  const activeImage = customImageUrl || defaultImage

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      <img
        src={imageFailed ? defaultImage : activeImage}
        alt="Esports Atmosphere"
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

      <div className="absolute inset-0 bg-gradient-to-b from-canvas/20 via-transparent to-canvas/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/30 via-transparent to-canvas/30 pointer-events-none" />
    </div>
  )
}
