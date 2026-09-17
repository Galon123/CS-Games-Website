'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTournament } from '@/context/TournamentContext'
import { Trophy, Users, Shield, LayoutDashboard, Cpu, Menu, X, Flame, Crosshair } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { isAdmin } = useTournament()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Overview', href: '/', icon: Flame },
    { label: 'Leaderboards', href: '/leaderboards', icon: Trophy },
    { label: 'Teams & Rosters', href: '/roster', icon: Users },
    { label: 'Tactical Pitch', href: '/tactics', icon: Crosshair },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800/80">
      <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-neon-lime transition-colors">
              <Cpu className="w-5 h-5 text-neon-lime" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-wide text-ice-white font-mono">
                  CS NEXUS ARENA
                </span>
              </div>
              <p className="text-[10px] text-muted-gray">Computer Science Sports Championship</p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium font-mono uppercase tracking-wider transition-all ${
                    isActive
                      ? 'text-neon-lime bg-slate-800/90 font-bold border-b-2 border-neon-lime'
                      : 'text-muted-gray hover:text-ice-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-neon-lime' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right: Admin Button */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/admin"
              className={`flex items-center space-x-2 text-xs font-mono px-3.5 py-1.5 rounded-lg border transition-all ${
                pathname === '/admin'
                  ? 'bg-neon-lime text-slate-950 font-bold border-neon-lime'
                  : isAdmin
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/40'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-neon-lime" />
              <span>{isAdmin ? 'Admin (Active)' : 'Admin'}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0F172A] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider ${
                  isActive
                    ? 'text-neon-lime bg-slate-800 font-bold'
                    : 'text-muted-gray hover:text-ice-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <div className="pt-2 border-t border-slate-800 mt-2">
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white"
            >
              <Shield className="w-4 h-4 text-neon-lime" />
              <span>{isAdmin ? 'Admin Console (Active)' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
