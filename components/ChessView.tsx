'use client'

import React, { useState } from 'react'
import ChessHeroCarousel from '@/components/ChessHeroCarousel'
import ChessBlurredBackground from '@/components/ChessBlurredBackground'
import { Trophy, Calendar, Activity, CheckCircle2, Circle, XCircle, MinusCircle } from 'lucide-react'

// --- DATA ---

const MENS_STANDINGS = [
  { pos: 1, name: 'Anirudh Sekhar', pts: 4 },
  { pos: 2, name: 'Royce P S', pts: 3 },
  { pos: '3-4', name: 'Harikrishnan M', pts: 2.5 },
  { pos: '3-4', name: 'Achu kesav', pts: 2.5 },
  { pos: 5, name: 'Jovin James', pts: 2.5 },
  { pos: 6, name: 'Alan Ali', pts: 2.5 },
  { pos: 7, name: 'Samved', pts: 2 },
  { pos: 8, name: 'Abhinand', pts: 2 },
  { pos: 9, name: 'Adwaith shameer', pts: 1 },
  { pos: 10, name: 'David Binoy', pts: 1 },
  { pos: 11, name: 'Lalu Krishna', pts: 1 },
  { pos: 12, name: 'Aarav Dev', pts: 0 },
]

const MENS_ROUNDS = [
  {
    round: 1,
    matches: [
      { id: '1-1', p1: 'David Binoy', p1c: 'White', s1: 0, p2: 'Achu kesav', p2c: 'Black', s2: 1 },
      { id: '1-2', p1: 'Abhinand', p1c: 'White', s1: 0, p2: 'Jovin James', p2c: 'Black', s2: 1 },
      { id: '1-3', p1: 'Aarav Dev', p1c: 'White', s1: 0, p2: 'Royce P S', p2c: 'Black', s2: 1 },
      { id: '1-4', p1: 'Alan Ali', p1c: 'White', s1: 0, p2: 'Anirudh Sekhar', p2c: 'Black', s2: 1 },
      { id: '1-5', p1: 'Lalu Krishna', p1c: 'White', s1: 0, p2: 'Adwaith shameer', p2c: 'Black', s2: 1 },
      { id: '1-6', p1: 'Samved', p1c: 'White', s1: 0, p2: 'Harikrishnan M', p2c: 'Black', s2: 1 },
    ]
  },
  {
    round: 2,
    matches: [
      { id: '2-1', p1: 'Jovin James', p1c: 'White', s1: 0.5, p2: 'Achu kesav', p2c: 'Black', s2: 0.5 },
      { id: '2-2', p1: 'Anirudh Sekhar', p1c: 'White', s1: 1, p2: 'Royce P S', p2c: 'Black', s2: 0 },
      { id: '2-3', p1: 'Harikrishnan M', p1c: 'White', s1: 1, p2: 'Adwaith shameer', p2c: 'Black', s2: 0 },
      { id: '2-4', p1: 'Abhinand', p1c: 'White', s1: 1, p2: 'David Binoy', p2c: 'Black', s2: 0 },
      { id: '2-5', p1: 'Alan Ali', p1c: 'White', s1: 1, p2: 'Aarav Dev', p2c: 'Black', s2: 0 },
      { id: '2-6', p1: 'Samved', p1c: 'White', s1: 1, p2: 'Lalu Krishna', p2c: 'Black', s2: 0 },
    ]
  },
  {
    round: 3,
    matches: [
      { id: '3-1', p1: 'Harikrishnan M', p1c: 'White', s1: 0, p2: 'Anirudh Sekhar', p2c: 'Black', s2: 1 },
      { id: '3-2', p1: 'Royce P S', p1c: 'White', s1: 1, p2: 'Jovin James', p2c: 'Black', s2: 0 },
      { id: '3-3', p1: 'Achu kesav', p1c: 'White', s1: 1, p2: 'Abhinand', p2c: 'Black', s2: 0 },
      { id: '3-4', p1: 'Adwaith shameer', p1c: 'White', s1: 0, p2: 'Alan Ali', p2c: 'Black', s2: 1 },
      { id: '3-5', p1: 'David Binoy', p1c: 'White', s1: 0, p2: 'Samved', p2c: 'Black', s2: 1 },
      { id: '3-6', p1: 'Aarav Dev', p1c: 'White', s1: 0, p2: 'Lalu Krishna', p2c: 'Black', s2: 1 },
    ]
  },
  {
    round: 4,
    matches: [
      { id: '4-1', p1: 'Anirudh Sekhar', p1c: 'White', s1: 1, p2: 'Achu kesav', p2c: 'Black', s2: 0 },
      { id: '4-2', p1: 'Alan Ali', p1c: 'White', s1: 0.5, p2: 'Harikrishnan M', p2c: 'Black', s2: 0.5 },
      { id: '4-3', p1: 'Royce P S', p1c: 'White', s1: 1, p2: 'Samved', p2c: 'Black', s2: 0 },
      { id: '4-4', p1: 'Lalu Krishna', p1c: 'White', s1: 0, p2: 'Jovin James', p2c: 'Black', s2: 1 },
      { id: '4-5', p1: 'Adwaith shameer', p1c: 'White', s1: 0, p2: 'Abhinand', p2c: 'Black', s2: 1 },
      { id: '4-6', p1: 'Aarav Dev', p1c: 'White', s1: 0, p2: 'David Binoy', p2c: 'Black', s2: 1 },
    ]
  }
]

const WOMENS_STANDINGS = [
  { pos: 1, name: 'C jayanthi', pts: 3 },
  { pos: 2, name: 'Anagha', pts: 2 },
  { pos: 3, name: 'Anna Caroline', pts: 1 },
  { pos: 4, name: 'Lakshmi U', pts: 0 },
]
const WOMENS_ROUNDS = [
  {
    round: 1,
    matches: [
      { id: '1-1', p1: 'C jayanthi', p1c: 'White', s1: 1, p2: 'Anna Caroline', p2c: 'Black', s2: 0 },
      { id: '1-2', p1: 'Anagha', p1c: 'White', s1: 1, p2: 'Lakshmi U', p2c: 'Black', s2: 0 },
    ]
  },
  {
    round: 2,
    matches: [
      { id: '2-1', p1: 'Anagha', p1c: 'White', s1: 0, p2: 'C jayanthi', p2c: 'Black', s2: 1 },
      { id: '2-2', p1: 'Lakshmi U', p1c: 'White', s1: 0, p2: 'Anna Caroline', p2c: 'Black', s2: 1 },
    ]
  },
  {
    round: 3,
    matches: [
      { id: '3-1', p1: 'C jayanthi', p1c: 'White', s1: 1, p2: 'Lakshmi U', p2c: 'Black', s2: 0 },
      { id: '3-2', p1: 'Anna Caroline', p1c: 'White', s1: 0, p2: 'Anagha', p2c: 'Black', s2: 1 },
    ]
  }
]

// --- COMPONENTS ---

export default function ChessView() {
  const [category, setCategory] = useState<'mens' | 'womens'>('mens')
  const [activeTab, setActiveTab] = useState<'standings' | 'rounds'>('standings')

  const standings = category === 'mens' ? MENS_STANDINGS : WOMENS_STANDINGS
  const rounds = category === 'mens' ? MENS_ROUNDS : WOMENS_ROUNDS

  return (
    <div className="w-full flex flex-col min-h-screen bg-canvas text-cream selection:bg-acid selection:text-acid-ink font-sans">
      <ChessBlurredBackground />

      
      {/* Hero Section */}
      <section className="w-full">
        <ChessHeroCarousel />
      </section>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
        
        
                        {/* Tournament Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-acid">
              <div className="bg-acid/10 border border-acid/20 px-3 py-1 rounded-full flex items-center space-x-2">
                <Activity className="w-3 h-3" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                  Official Tournament Draw
                </span>
              </div>
              <span className="text-[10px] font-mono text-fog uppercase tracking-widest">
                • CS Games 2026 Chess Championship
              </span>
            </div>
            
            <h2 className="font-serif font-black text-4xl sm:text-5xl text-paper uppercase tracking-wider leading-none">
              CHESS TOURNAMENT
            </h2>
            
            <p className="text-xs sm:text-sm text-mist leading-relaxed font-sans">
              Official tournament standings and match progression across all championship rounds.
            </p>
          </div>
        </div>

        {/* Category Toggle (Badminton Style) */}
        <div className="flex bg-ink-900 border border-white/5 p-1 rounded-xl items-center mx-auto w-full max-w-2xl mb-8 z-10 relative backdrop-blur-sm shadow-xl">
          <button
            onClick={() => setCategory('mens')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-mono font-bold transition-all ${
              category === 'mens'
                ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                : 'text-mist hover:text-paper hover:bg-white/5'
            }`}
          >
            <span>Men's Chess</span>
          </button>
          <button
            onClick={() => setCategory('womens')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-mono font-bold transition-all ${
              category === 'womens'
                ? 'bg-acid text-acid-ink shadow-[0_0_12px_rgba(215,242,43,0.3)] font-black'
                : 'text-mist hover:text-paper hover:bg-white/5'
            }`}
          >
            <span>Women's Chess</span>
          </button>
        </div>
      </main>

      {/* Dedicated Navbar (CS Cup Style) */}
      <div className="sticky top-0 z-40 w-full bg-ink-950/80 backdrop-blur-md border-b border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-center space-x-2 md:space-x-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('standings')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-bold font-mono text-sm transition-all whitespace-nowrap ${
              activeTab === 'standings' ? 'bg-white/10 text-paper border border-white/20' : 'text-fog hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Standings</span>
          </button>
          <button
            onClick={() => setActiveTab('rounds')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-bold font-mono text-sm transition-all whitespace-nowrap ${
              activeTab === 'rounds' ? 'bg-white/10 text-paper border border-white/20' : 'text-fog hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Rounds</span>
          </button>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12 z-10 relative">

                {/* Content Area */}
        <div className="animate-fade-in min-h-[50vh] bg-ink-950/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10 shadow-2xl">
          {activeTab === 'standings' ? (
            <div className="space-y-6">
              <h2 className="text-3xl font-black lowercase text-paper tracking-wider">
                {category === 'mens' ? "Men's" : "Women's"} Standings
              </h2>
              
              {standings.length > 0 ? (
                <div className="bg-ink-900 border border-white/10 rounded-2xl overflow-hidden shadow-card overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-ink-950/50 border-b border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-mist">
                        <th className="p-4 text-center">Pos</th>
                        <th className="p-4">Player</th>
                        <th className="p-4 text-center text-acid">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {standings.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 text-center font-mono font-bold text-fog">{row.pos}</td>
                          <td className="p-4 font-mono font-bold text-paper whitespace-nowrap">{row.name}</td>
                          <td className="p-4 text-center font-mono font-black text-acid">{row.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-ink-900/50 border border-white/5 rounded-2xl">
                  <Trophy className="w-12 h-12 text-fog/30 mb-4" />
                  <p className="text-fog font-mono">Standings will be updated soon.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              <h2 className="text-3xl font-black lowercase text-paper tracking-wider">
                {category === 'mens' ? "Men's" : "Women's"} Rounds
              </h2>

              {rounds.length > 0 ? (
                rounds.map((roundData) => (
                  <div key={roundData.round} className="space-y-6">
                    <h3 className="text-xl font-bold font-mono text-acid border-b border-white/10 pb-2">
                      Round {roundData.round}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roundData.matches.map((match: any) => (
                        <div key={match.id} className="bg-ink-900 border border-white/10 rounded-xl p-4 flex flex-col justify-center space-y-3 hover:border-acid/30 transition-colors">
                          <div className="flex justify-between items-center text-sm font-mono">
                            <span className="text-fog">Board {match.id.split('-')[1]}</span>
                            <span className="text-xs tracking-widest text-mist/50 uppercase">Rapid 15+5</span>
                          </div>
                          
                          <div className="space-y-2">
                            {/* Player 1 */}
                            <div className={`flex justify-between items-center px-3 py-2 rounded-lg ${match.s1 > match.s2 ? 'bg-white/10' : 'bg-transparent'}`}>
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-sm bg-white border border-gray-300" title="White Pieces"></div>
                                <span className={`font-mono font-bold ${match.s1 > match.s2 ? 'text-paper' : 'text-mist'}`}>{match.p1}</span>
                              </div>
                              <span className="font-mono font-black text-paper">{match.s1}</span>
                            </div>
                            
                            {/* Player 2 */}
                            <div className={`flex justify-between items-center px-3 py-2 rounded-lg ${match.s2 > match.s1 ? 'bg-white/10' : 'bg-transparent'}`}>
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-sm bg-black border border-gray-700" title="Black Pieces"></div>
                                <span className={`font-mono font-bold ${match.s2 > match.s1 ? 'text-paper' : 'text-mist'}`}>{match.p2}</span>
                              </div>
                              <span className="font-mono font-black text-paper">{match.s2}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-ink-900/50 border border-white/5 rounded-2xl">
                  <Calendar className="w-12 h-12 text-fog/30 mb-4" />
                  <p className="text-fog font-mono">Round pairings will be updated soon.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Sponsors Section */}
      
    </div>
  )
}
