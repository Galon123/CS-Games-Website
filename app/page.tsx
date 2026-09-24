import React from 'react'
import HeroPresentationCarousel from '@/components/HeroPresentationCarousel'
import Hero from '@/components/Hero'
import SeptemberEvents from '@/components/SeptemberEvents'
import SponsorsBox from '@/components/SponsorsBox'
import AboutSection from '@/components/AboutSection'

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Home / Hero Section */}
      <section id="home" className="w-full">
        <HeroPresentationCarousel />
      </section>

      {/* Events Section */}
      <section id="events">
        <Hero />
      </section>

      {/* Schedules Section */}
      <section id="schedules" className="w-full px-2 sm:px-4 lg:px-6 py-16">
        <SeptemberEvents />
      </section>

      {/* About Section */}
      <section id="about" className="w-full px-2 sm:px-4 lg:px-6 py-16">
        <AboutSection />
      </section>

      {/* Sponsors Section */}
      <section className="bg-ink-950 py-16 border-t border-white/5">
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <SponsorsBox />
        </div>
      </section>
    </div>
  )
}
