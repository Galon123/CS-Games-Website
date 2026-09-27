'use client'

import React from 'react'
import { INITIAL_SEPTEMBER_EVENTS } from '@/lib/events-data'

export default function SeptemberEvents() {
  const events = INITIAL_SEPTEMBER_EVENTS.sort((a, b) => a.day - b.day)

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col space-y-2 text-center items-center">
        <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-acid">
          Official Calendar
        </span>
        <h2 className="text-4xl md:text-5xl font-sans font-black text-paper lowercase tracking-tight">
          schedules
        </h2>
        <p className="text-sm text-mist max-w-lg font-sans leading-relaxed text-center">
          Official championship milestones, mock assessment rounds, and technical workshops scheduled for the Department of Computer Science.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => {
          const isNeon = evt.isHighlighted
          return (
            <div
              key={evt.id}
              className={`relative rounded-xl p-6 flex flex-col justify-between overflow-hidden shadow-elevated transition-transform hover:-translate-y-1 \${
                isNeon
                  ? 'bg-acid text-slate-950 border border-acid shadow-[0_0_20px_rgba(215,242,43,0.25)]'
                  : 'bg-ink-900/80 text-cream border border-white/10 hover:border-white/20'
              }`}
            >
              {isNeon && (
                <div className="absolute top-0 right-0 bg-slate-950 text-acid text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                  Hot
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-8">
                <div className={`w-16 h-16 shrink-0 flex flex-col items-center justify-center rounded-lg border \${
                  isNeon ? 'bg-black text-acid border-black' : 'bg-white/5 text-paper border-white/10'
                }`}>
                  <span className="text-2xl font-sans font-black leading-none">{evt.day}</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest mt-1">SEP</span>
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className={`font-sans font-black text-lg sm:text-xl uppercase tracking-wide leading-tight \${
                    isNeon ? 'text-slate-950' : 'text-paper'
                  }`}>
                    {evt.title}
                  </h3>
                  {evt.category && (
                    <span className={`text-xs font-mono mt-1 font-semibold \${
                      isNeon ? 'text-slate-800' : 'text-acid'
                    }`}>
                      {evt.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <div className={`text-sm font-sans \${isNeon ? 'text-slate-900 font-semibold' : 'text-mist'}`}>
                  {evt.description}
                </div>
                
                <div className={`flex flex-wrap items-center gap-4 text-xs font-mono pt-4 border-t \${
                  isNeon ? 'border-slate-950/20 text-slate-900 font-semibold' : 'border-white/10 text-mist'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>{evt.time}</span>
                  </div>
                  {evt.venue && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <span>{evt.venue}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
