'use client'

import React from 'react'
import CarromHeroCarousel from '@/components/CarromHeroCarousel'
import CarromBracketSection from '@/components/CarromBracketSection'
import CarromBlurredBackground from '@/components/CarromBlurredBackground'

export default function CarromView() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-canvas text-cream selection:bg-acid selection:text-acid-ink font-sans">`n      <CarromBlurredBackground />
      <section className="w-full">
        <CarromHeroCarousel />
      </section>

      <CarromBracketSection />
    </div>
  )
}
