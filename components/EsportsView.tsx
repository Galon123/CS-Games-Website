'use client'

import React, { useState } from 'react'
import EsportsHeroCarousel from '@/components/EsportsHeroCarousel'
import { Activity, X, Info, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface EsportsEvent {
  id: string
  name: string
  type: string
  image: string
  description: string
  registrationLink: string
}

const ESPORTS_EVENTS: EsportsEvent[] = [
  {
    id: 'efootball',
    name: 'E-Football',
    type: '1v1 Knockout',
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1665460/5a730c921132b664412149cb3fa9da491fb01b0d/page_bg_raw.jpg?t=1788505213',
    description: 'Step onto the virtual pitch and prove your skills in the ultimate E-Football showdown. Compete against top players, execute flawless tactics, and claim the championship title. The tournament format will be an intense 1v1 knockout bracket.',
    registrationLink: '#'
  },
  {
    id: 'minimilitia',
    name: 'Mini Militia',
    type: 'Free-for-all',
    image: 'https://wallpaperaccess.com/full/2683336.png',
    description: 'Get ready for intense multiplayer combat! Join the Mini Militia free-for-all battle and dominate the arena. Survive the chaos, score the most kills, utilize power-ups efficiently, and emerge as the ultimate commander. Bring your squad or enter solo.',
    registrationLink: '#'
  }
]

export default function EsportsView() {
  const [selectedEvent, setSelectedEvent] = useState<EsportsEvent | null>(null)

  return (
    <div className="w-full flex flex-col min-h-screen bg-canvas text-cream selection:bg-acid selection:text-acid-ink font-sans">
      
      {/* Hero Section */}
      <section className="w-full">
        <EsportsHeroCarousel />
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-12">
        
        {/* Tournament Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 relative z-10 w-full">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-acid">
              <div className="bg-acid/10 border border-acid/20 px-3 py-1 rounded-full flex items-center space-x-2">
                <Activity className="w-3 h-3" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                  Official Tournament Draw
                </span>
              </div>
              <span className="text-[10px] font-mono text-fog uppercase tracking-widest">
                • CS Games 2026 Esports Championship
              </span>
            </div>
            
            <h2 className="font-serif font-black text-4xl sm:text-5xl text-paper uppercase tracking-wider leading-none">
              ESPORTS TOURNAMENT
            </h2>
            
            <p className="text-xs sm:text-sm text-mist leading-relaxed font-sans">
              Official tournament registrations and information for all digital events.
            </p>
          </div>
        </div>

        {/* Events Section */}
        <div className="space-y-8 animate-fade-in relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {ESPORTS_EVENTS.map((event) => (
              <div key={event.id} className="bg-ink-900 rounded-2xl overflow-hidden border border-white/10 group shadow-card flex flex-col h-[400px]">
                <div className="flex-1 relative overflow-hidden">
                  <img src={event.image} alt={event.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent opacity-90" />
                  
                  <div className="absolute top-4 right-4">
                    <span className="bg-ink-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono text-mist uppercase tracking-widest">
                      {event.type}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col space-y-4">
                    <h3 className="text-3xl font-black font-mono text-paper drop-shadow-md">{event.name}</h3>
                    <div className="flex items-center space-x-3 w-full">
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="flex-1 flex justify-center items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-paper px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>VIEW INFO</span>
                      </button>
                      <Link 
                        href={event.registrationLink}
                        className="flex-1 flex justify-center items-center space-x-2 bg-acid hover:bg-acid/90 text-acid-ink px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-colors shadow-[0_0_15px_rgba(215,242,43,0.3)]"
                      >
                        <span>REGISTER NOW</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* EVENT INFO MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-ink-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 p-2 text-fog hover:text-white bg-ink-950/50 hover:bg-ink-950 rounded-full transition-colors z-20 backdrop-blur-sm border border-white/10">
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-full h-48 sm:h-64 relative shrink-0">
              <img src={selectedEvent.image} alt={selectedEvent.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="text-[10px] font-mono text-acid bg-acid/10 px-2 py-1 rounded-sm border border-acid/20 uppercase tracking-widest mb-2 inline-block">
                  {selectedEvent.type}
                </span>
                <h3 className="font-serif font-black text-3xl sm:text-4xl text-paper uppercase tracking-wider leading-none">
                  {selectedEvent.name}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="space-y-3">
                <h4 className="font-mono font-bold text-sm text-fog uppercase tracking-widest">Event Description</h4>
                <p className="text-sm text-mist leading-relaxed font-sans">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10">
                <Link 
                  href={selectedEvent.registrationLink}
                  className="w-full flex justify-center items-center space-x-2 bg-acid hover:bg-acid/90 text-acid-ink px-6 py-3.5 rounded-xl text-sm font-mono font-bold transition-colors shadow-[0_0_15px_rgba(215,242,43,0.3)]"
                >
                  <span>PROCEED TO REGISTRATION</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
