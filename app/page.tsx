import React from 'react'
import HeroPresentationCarousel from '@/components/HeroPresentationCarousel'
import Hero from '@/components/Hero'
import SeptemberEvents from '@/components/SeptemberEvents'
import SponsorsBox from '@/components/SponsorsBox'

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* Top-Level Hero Presentation Carousel */}
      <HeroPresentationCarousel />

      {/* Secondary Feature Showcase & Tactical Match Center */}
      <Hero />

      {/* September Events Calendar Section with Sponsors Ribbon beneath */}
      <div className="space-y-4 sm:space-y-5">
        <SeptemberEvents />
        <SponsorsBox />
      </div>
    </div>
  )
}
