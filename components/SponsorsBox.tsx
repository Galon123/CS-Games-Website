import React from 'react'
import Image from 'next/image'

export default function SponsorsBox() {
  const sponsors = [
    { id: '1', name: 'Eldorado', image: '/sponsors/eldorado.png' },
    { id: '2', name: 'RMCO', image: '/sponsors/rmco.png' },
    { id: '3', name: 'SixSnack', image: '/sponsors/sixsnack.png' },
  ]

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-10 py-12 border-t border-white/5 bg-ink-950">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-black font-sans lowercase text-paper tracking-wider">
          our partners
        </h2>
        <div className="h-1 w-12 bg-acid mx-auto rounded-full" />
      </div>

      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 px-4">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="relative group w-32 md:w-48 h-32 md:h-48 flex items-center justify-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/10 hover:border-acid/50 shadow-elevated">
            <img 
              src={sponsor.image} 
              alt={sponsor.name}
              className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 opacity-75 group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
