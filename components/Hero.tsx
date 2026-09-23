'use client'

import React from 'react'
import Link from 'next/link'
import { getSportMeta, isCsCupFootball } from '@/lib/sports-theme'
import { useTournament } from '@/context/TournamentContext'

export default function Hero() {
  const { sports } = useTournament()

  // Ensure these exact 5 sports are rendered in order, as per user request
  // (Usually sports context provides them, but if we want to ensure the specific order/image, we map through sports)

  return (
    <div className="space-y-8">
      <section className="py-8 sm:py-12">
        <h2 className="font-black text-4xl sm:text-5xl lg:text-6xl text-paper tracking-tight text-center mb-10" style={{ fontFamily: 'Impact, sans-serif' }}>
          EVENTS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport, idx) => {
            const meta = getSportMeta(sport)
            const isCsCup = isCsCupFootball(sport.name)
            
            // Logic for finding the title string requested by user
            let title = sport.name.toUpperCase();
            if (isCsCup) title = 'CS CUP';
            else if (title.includes('E-FOOTBALL') || title.includes('MILITIA')) title = 'GAMING / ESPORTS';

            return (
              <Link
                key={sport.id}
                href={meta.link}
                className="bg-ink-800 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col border border-white/10 hover:border-white/25 hover:shadow-elevated hover:-translate-y-1"
              >
                {meta.imageUrl ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-ink-900 border-b border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={meta.imageUrl}
                      alt={title}
                      className="w-full h-full object-cover contrast-[115%] group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 to-transparent flex items-end p-5">
                      <h3 className="font-serif font-black text-2xl text-paper uppercase">
                        {title}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 pb-4 flex flex-col items-center justify-center aspect-video bg-ink-900 border-b border-white/10">
                    <h3 className="font-serif font-black text-2xl text-paper uppercase">
                      {title}
                    </h3>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
