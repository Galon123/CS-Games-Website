import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutSection() {
  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
        
        {/* Visual / Poster */}
        <div className="w-full md:w-5/12 flex justify-center relative">
          <div className="w-full max-w-sm aspect-[3/4] relative rounded-md overflow-hidden border border-white/10 shadow-2xl group">
            <Image 
              src="/posters/main_poster.jpg"
              alt="CS GAMES 2026 Poster"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent opacity-80" />
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full md:w-7/12 space-y-8 relative">
          <div className="absolute -left-12 -top-12 text-9xl font-black text-white/[0.02] select-none pointer-events-none lowercase tracking-tighter">
            about
          </div>
          
          <h2 className="text-4xl md:text-5xl font-sans font-black text-paper lowercase tracking-tight border-b border-acid pb-6 relative z-10 inline-block">
            about
          </h2>

          <div className="space-y-6 text-sm md:text-base font-grotesk text-mist leading-relaxed relative z-10">
            <p>
              CS GAMES 2026 is the annual intra-departmental sporting and gaming championship of the Computer Science and Engineering department, bringing together students to compete, collaborate, and celebrate the spirit of sportsmanship.
            </p>
            <p>
              Building on the enthusiasm and participation of previous editions, this year brings together a diverse range of competitions spanning traditional sports, strategic board games, and competitive esports.
            </p>
            <p>
              More than just a tournament, CS GAMES is a celebration of teamwork, strategy, sportsmanship, and the vibrant community that defines the department.
            </p>
          </div>

          <Link href="/#events" className="inline-block relative z-10 px-8 py-3 bg-acid text-ink-950 font-bold lowercase tracking-widest hover:bg-white hover:text-ink-950 transition-colors border border-transparent hover:border-acid">
            explore
          </Link>
        </div>

      </div>
    </section>
  )
}
