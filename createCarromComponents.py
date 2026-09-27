import os

# 1. Carrom Hero Carousel
carrom_hero = """'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const CAROUSEL_IMAGES = [
  {
    id: 'carrom-1',
    url: '/posters/main_poster.jpg',
    alt: 'Carrom Tournament 2026',
    title: 'CARROM SHOWDOWN',
    description: 'Precision, Angles, and Strikes.',
  },
]

export default function CarromHeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (CAROUSEL_IMAGES.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden bg-ink-950">
      {CAROUSEL_IMAGES.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-ink-950/40 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-transparent z-20" />
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover object-top"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}
"""

with open('components/CarromHeroCarousel.tsx', 'w', encoding='utf-8') as f:
    f.write(carrom_hero)


# 2. Carrom Bracket Section
carrom_bracket = """'use client'

import React from 'react'
import { Activity } from 'lucide-react'

type CarromRoundKey = 'quarter_finals' | 'semi_finals' | 'finals'

interface CarromMatch {
  id: string
  round: CarromRoundKey
  roundTitle: string
  team1: { name: string }
  team2: { name: string }
  winnerTeam?: 1 | 2
}

const CARROM_MATCHES: CarromMatch[] = [
  // Quarters
  {
    id: 'q1', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Team Shivas' }, team2: { name: 'Team Samit' }, winnerTeam: 1,
  },
  {
    id: 'q2', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Team Sooraj' }, team2: { name: 'Team Prideson' }, winnerTeam: 1,
  },
  {
    id: 'q3', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Team Rohith' }, team2: { name: 'Team Lakshmi U' }, winnerTeam: 1,
  },
  {
    id: 'q4', round: 'quarter_finals', roundTitle: 'Quarter Finals',
    team1: { name: 'Team Daniel' }, team2: { name: 'Team Amal' }, winnerTeam: 2,
  },
  // Semis
  {
    id: 's1', round: 'semi_finals', roundTitle: 'Semi Finals',
    team1: { name: 'Team Shivas' }, team2: { name: 'Team Sooraj' }, winnerTeam: 2,
  },
  {
    id: 's2', round: 'semi_finals', roundTitle: 'Semi Finals',
    team1: { name: 'Team Rohith' }, team2: { name: 'Team Amal' }, winnerTeam: 1,
  },
  // Final
  {
    id: 'f1', round: 'finals', roundTitle: 'Finals',
    team1: { name: 'Team Sooraj' }, team2: { name: 'Team Rohith' }, winnerTeam: 1,
  }
]

export default function CarromBracketSection() {
  const matchesByRound: Record<CarromRoundKey, CarromMatch[]> = {
    quarter_finals: CARROM_MATCHES.filter(m => m.round === 'quarter_finals'),
    semi_finals: CARROM_MATCHES.filter(m => m.round === 'semi_finals'),
    finals: CARROM_MATCHES.filter(m => m.round === 'finals'),
  }

  const renderMatchCard = (match?: CarromMatch) => {
    if (!match) return null
    const team1Won = match.winnerTeam === 1
    const team2Won = match.winnerTeam === 2

    return (
      <div className="relative w-full md:w-72 shrink-0 bg-ink-900 border border-white/10 rounded-2xl shadow-xl p-3 z-10 flex flex-col space-y-2">
        <div className="flex justify-between items-center mb-1 px-1">
          <span className="text-[10px] font-mono text-fog font-bold uppercase tracking-wider">
            {match.roundTitle}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {/* Team 1 */}
          <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
              team1Won ? 'bg-acid/20 border border-acid/50 text-paper font-bold' : 'bg-ink-900/70 border border-white/5 text-mist'
            }`}>
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <span className={`w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center shrink-0 ${
                team1Won ? 'bg-acid text-acid-ink font-black' : 'bg-white/10 text-fog'
              }`}>
                {team1Won ? '✓' : '1'}
              </span>
              <span className="text-sm truncate">
                {match.team1.name}
              </span>
            </div>
            {team1Won && <span className="text-xs text-acid font-mono font-bold uppercase">WIN</span>}
          </div>

          {/* Team 2 */}
          <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
              team2Won ? 'bg-acid/20 border border-acid/50 text-paper font-bold' : 'bg-ink-900/70 border border-white/5 text-mist'
            }`}>
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <span className={`w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center shrink-0 ${
                team2Won ? 'bg-acid text-acid-ink font-black' : 'bg-white/10 text-fog'
              }`}>
                {team2Won ? '✓' : '2'}
              </span>
              <span className="text-sm truncate">
                {match.team2.name}
              </span>
            </div>
            {team2Won && <span className="text-xs text-acid font-mono font-bold uppercase">WIN</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full relative py-12 md:py-24 bg-canvas overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-acid">
              <div className="bg-acid/10 border border-acid/20 px-3 py-1 rounded-full flex items-center space-x-2">
                <Activity className="w-3 h-3" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                  Official Tournament Draw
                </span>
              </div>
              <span className="text-[10px] font-mono text-fog uppercase tracking-widest">
                • CS Games 2026 Carrom Championship
              </span>
            </div>
            
            <h2 className="font-serif font-black text-4xl sm:text-5xl text-paper uppercase tracking-wider leading-none">
              CARROM
            </h2>
            
            <p className="text-xs sm:text-sm text-mist leading-relaxed font-sans">
              Official tournament knockout draw and match progression.
            </p>
          </div>
        </div>

        {/* Bracket Scroll Area */}
        <div className="w-full overflow-x-auto pb-16 no-scrollbar relative z-10 cursor-grab active:cursor-grabbing">
          <div className="flex min-w-max md:justify-center p-4">
            <div className="flex items-stretch gap-8 md:gap-16 relative">
              {/* Quarter Finals */}
              <div className="flex flex-col justify-between gap-16 relative w-72 shrink-0">
                {matchesByRound.quarter_finals.map((match, i) => (
                  <div key={match.id} className="relative z-10">
                    {renderMatchCard(match)}
                  </div>
                ))}
              </div>

              {/* Connector from QF to SF */}
              <div className="absolute left-[288px] top-0 bottom-0 w-8 md:w-16 hidden md:block">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  {/* Q1 & Q2 to S1 */}
                  <path d="M 0 100 L 32 100 L 32 250 L 64 250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M 0 380 L 32 380 L 32 250 L 64 250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  {/* Q3 & Q4 to S2 */}
                  <path d="M 0 660 L 32 660 L 32 810 L 64 810" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M 0 940 L 32 940 L 32 810 L 64 810" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                </svg>
              </div>

              {/* Semi Finals */}
              <div className="flex flex-col justify-around relative w-72 shrink-0">
                {matchesByRound.semi_finals.map((match, i) => (
                  <div key={match.id} className="relative z-10 mt-16 mb-16">
                    {renderMatchCard(match)}
                  </div>
                ))}
              </div>

              {/* Connector from SF to F */}
              <div className="absolute left-[640px] top-0 bottom-0 w-8 md:w-16 hidden md:block">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <path d="M 0 250 L 32 250 L 32 530 L 64 530" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M 0 810 L 32 810 L 32 530 L 64 530" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                </svg>
              </div>

              {/* Finals */}
              <div className="flex flex-col justify-center relative w-72 shrink-0">
                {matchesByRound.finals.map((match) => (
                  <div key={match.id} className="relative z-10">
                    {renderMatchCard(match)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
"""

with open('components/CarromBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(carrom_bracket)


# 3. Carrom View
carrom_view = """'use client'

import React from 'react'
import CarromHeroCarousel from '@/components/CarromHeroCarousel'
import CarromBracketSection from '@/components/CarromBracketSection'

export default function CarromView() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-canvas text-cream selection:bg-acid selection:text-acid-ink font-sans">
      <section className="w-full">
        <CarromHeroCarousel />
      </section>

      <CarromBracketSection />
    </div>
  )
}
"""

with open('components/CarromView.tsx', 'w', encoding='utf-8') as f:
    f.write(carrom_view)


# 4. Modify app/games/carrom/page.tsx to use CarromView
carrom_page = """import React from 'react'
import type { Metadata } from 'next'
import CarromView from '@/components/CarromView'

export const metadata: Metadata = {
  title: 'Carrom | CS Games 2026',
  description: 'Carrom tournament brackets and results.',
}

export default function CarromGamePage() {
  return <CarromView />
}
"""

with open('app/games/carrom/page.tsx', 'w', encoding='utf-8') as f:
    f.write(carrom_page)
