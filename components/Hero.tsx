'use client'

import React from 'react'
import Link from 'next/link'
import { getSportMeta } from '@/lib/sports-theme'
import { useTournament } from '@/context/TournamentContext'

export default function Hero() {
  const { sports } = useTournament()

  const findSportSlug = (keywords: string[]) => {
    const found = sports.find(s => keywords.some(k => s.name.toLowerCase().includes(k.toLowerCase())));
    return found ? getSportMeta(found).link : '/games';
  }

  const eventCards = [
    { title: 'cs cup', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80', href: findSportSlug(['football', 'cs cup']) },
    { title: 'badminton', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80', href: findSportSlug(['badminton']) },
    { title: 'chess', image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop&q=80', href: findSportSlug(['chess']) },
    { title: 'carroms', image: 'https://images.unsplash.com/photo-1626880053935-430c4826b5d9?w=800&auto=format&fit=crop&q=80', href: findSportSlug(['carrom']) },
    { title: 'e-sports', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80', href: findSportSlug(['esport', 'militia']) },
  ]

  return (
    <section id="games" className="py-16">
      <div className="w-full space-y-12">
        
        <h2 className="text-4xl md:text-5xl font-sans font-black text-paper lowercase tracking-tight border-b border-white/10 pb-6 px-4 md:px-8">
          events
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          {eventCards.map((card, idx) => (
            <Link
              key={idx}
              href={card.href}
              className="group relative overflow-hidden block w-full aspect-[4/1] md:aspect-[1/2.18] bg-ink-900 border border-white/10 transition-all duration-300 hover:border-acid"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-900/40 to-transparent" />
              
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                <h3 className="text-2xl md:text-3xl font-grotesk font-black text-paper lowercase tracking-tight group-hover:text-acid transition-colors drop-shadow-md">
                  {card.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
