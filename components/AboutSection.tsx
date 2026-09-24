import React from 'react'

export default function AboutSection() {
  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
        
        {/* Visual / Abstract Element (like the Cassette Tape in reference) */}
        <div className="w-full md:w-5/12 flex justify-center relative">
          <div className="w-64 h-64 md:w-80 md:h-80 bg-ink-800 border-2 border-acid flex items-center justify-center transform -rotate-3 transition-transform hover:rotate-0 duration-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[carousel-progress_3s_linear_infinite]" />
            <span className="font-black text-6xl text-ink-950 tracking-tighter mix-blend-difference z-10 group-hover:scale-110 transition-transform duration-500 select-none">
              CS '26
            </span>
            <div className="absolute top-4 left-4 w-3 h-3 bg-acid animate-pulse" />
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-acid animate-pulse delay-75" />
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
              CS GAMES 2026 is a prestigious intra-departmental tournament for tech-enthusiast students 
              to showcase their athletic skills, strategic thinking, and team synergy. Across its 
              previous editions, CS GAMES has recorded massive participation, generating immense 
              excitement and building a tightly-knit community.
            </p>
            <p>
              Notably, this edition witnesses the introduction of live telemetry, advanced tactical 
              boards for the CS Cup, and a sprawling expansion into competitive e-sports. 
              Establishing the event as a credible and impactful student-led initiative, we aim 
              to push the boundaries of what a collegiate sports event can be.
            </p>
          </div>

          <button className="relative z-10 px-8 py-3 bg-acid text-ink-950 font-bold lowercase tracking-widest hover:bg-white hover:text-ink-950 transition-colors border border-transparent hover:border-acid">
            explore
          </button>
        </div>

      </div>
    </section>
  )
}
