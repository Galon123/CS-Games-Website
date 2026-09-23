'use client'

import React from 'react'
import Link from 'next/link'
import { getSportMeta, isCsCupFootball } from '@/lib/sports-theme'
import { useTournament } from '@/context/TournamentContext'

export default function Hero() {
  const { sports } = useTournament()

  // We find the real slugs from the context for linking, but we enforce exactly 5 cards.
  const findSportSlug = (keywords: string[]) => {
    const found = sports.find(s => keywords.some(k => s.name.toLowerCase().includes(k.toLowerCase())));
    if (found) {
      return getSportMeta(found).link;
    }
    return '/games';
  }

  const eventCards = [
    {
      title: 'CS CUP',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
      href: findSportSlug(['football', 'cs cup'])
    },
    {
      title: 'BADMINTON',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
      href: findSportSlug(['badminton'])
    },
    {
      title: 'CHESS',
      image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop&q=80',
      href: findSportSlug(['chess'])
    },
    {
      title: 'CARROMS',
      image: 'https://images.unsplash.com/photo-1767619834318-63184920c4b1?w=800&auto=format&fit=crop&q=80',
      href: findSportSlug(['carrom'])
    },
    {
      title: 'E-SPORTS',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80', // generic esports/gaming image
      href: findSportSlug(['e-football', 'esports', 'militia'])
    }
  ]

  return (
    <div className="space-y-8">
      <section className="py-8 sm:py-12">
        <h2 className="font-black text-4xl sm:text-5xl lg:text-6xl text-paper tracking-tight text-center mb-10" style={{ fontFamily: 'Impact, sans-serif' }}>
          EVENTS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventCards.map((card, idx) => (
            <Link
              key={idx}
              href={card.href}
              className="bg-ink-800 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col border border-white/10 hover:border-white/25 hover:shadow-elevated hover:-translate-y-1"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-ink-900 border-b border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover contrast-[115%] group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 to-transparent flex items-end p-5">
                  <h3 className="font-serif font-black text-2xl text-paper uppercase">
                    {card.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
