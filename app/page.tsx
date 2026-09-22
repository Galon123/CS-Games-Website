import React from 'react'
import Hero from '@/components/Hero'
import SeptemberEvents from '@/components/SeptemberEvents'
import SponsorsBox from '@/components/SponsorsBox'

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* High-Impact Hero Showcase */}
      <Hero />

      {/* September Events Calendar Section with Sponsors Ribbon beneath */}
      <div className="space-y-4 sm:space-y-5">
        <SeptemberEvents />
        <SponsorsBox />
      </div>
    </div>
  )
}
