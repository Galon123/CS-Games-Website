'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTournament } from '@/context/TournamentContext'
import {
  Trophy,
  Users,
  Shield,
  Menu,
  X,
  Flame,
  Crosshair,
  Gamepad2,
} from 'lucide-react'
import CSBrandMark from '@/components/CSBrandMark'
import ThemeToggle from '@/components/ThemeToggle'
import { getSportMeta, getSportSlug, isCsCupFootball } from '@/lib/sports-theme'

export default function Navbar() {
  const pathname = usePathname()
  const { isAdmin, sports } = useTournament()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { label: 'HOME', href: '/', icon: Flame },
    { label: 'EVENTS', href: '/events', icon: Gamepad2 },
    { label: 'SCHEDULE', href: '/schedule', icon: Trophy },
    { label: 'ABOUT', href: '/about', icon: Users },
  ]

  return (
    <header className="sticky top-0 z-50 bg-ink-900/95 backdrop-blur-md border-b border-white/10 shadow-subtle">
      {/* Primary Navigation Row */}
      <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Championship Lockup */}
          <Link href="/" className="flex items-center space-x-3 group select-none">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-3xl tracking-tight text-paper" style={{ fontFamily: 'Impact, sans-serif' }}>
                  CS GAMES 2026
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-paper border border-white/20 shadow-xs'
                      : 'text-mist hover:text-paper hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-acid' : 'text-fog group-hover:text-mist'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right: Admin Button */}
          <div className="hidden md:flex items-center space-x-2.5">
            <Link
              href="/admin"
              className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-full transition-all duration-200 ${
                pathname === '/admin'
                  ? 'bg-acid text-acid-ink shadow-[0_0_16px_rgba(215,242,43,0.35)]'
                  : isAdmin
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-cream border border-white/15 hover:border-white/30'
              }`}
            >
              <Shield
                className={`w-3.5 h-3.5 ${
                  pathname === '/admin'
                    ? 'text-acid-ink'
                    : isAdmin
                    ? 'text-emerald-400'
                    : 'text-mist'
                }`}
              />
              <span className="tracking-wide">
                {isAdmin ? 'Admin Console (Active)' : 'Admin Portal'}
              </span>
            </Link>
          </div>

          {/* Mobile Right: Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-cream hover:text-paper hover:bg-white/5 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-acid"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          SECONDARY SPORTS STRIP (Instant 1-Click Game Switcher in Header)
          Gives direct 1-click access to every game on every page
          ───────────────────────────────────────────────────────────── */}
      <div className="border-t border-white/5 bg-ink-950/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-1.5 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs font-mono">
          <span className="text-[10px] font-bold uppercase tracking-wider text-fog shrink-0 pr-1 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-acid" />
            <span>GAMES:</span>
          </span>

          <Link
            href="/games"
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors shrink-0 ${
              pathname === '/games'
                ? 'bg-white/20 text-paper font-bold'
                : 'text-mist hover:text-paper hover:bg-white/5'
            }`}
          >
            All Disciplines ({sports.length})
          </Link>

          {sports.map((sport) => {
            const slug = getSportSlug(sport)
            const isCs = isCsCupFootball(sport.name)
            const isCurrent = pathname === `/games/${slug}`

            return (
              <Link
                key={sport.id}
                href={`/games/${slug}`}
                className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-acid text-acid-ink font-bold shadow-xs'
                    : 'text-mist hover:text-paper hover:bg-white/5 border border-transparent'
                }`}
              >
                {isCs && <span className={isCurrent ? 'text-acid-ink' : 'text-acid'}>★</span>}
                <span>{isCs ? 'CS Cup (Football)' : sport.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE MENU DRAWER
          Includes Overview, all individual games, standings, rosters, admin
          ───────────────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-ink-800/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 shadow-elevated max-h-[85vh] overflow-y-auto">
          {/* Main Nav Links */}
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                pathname === '/'
                  ? 'bg-white/10 text-paper border border-white/20'
                  : 'text-mist hover:text-paper hover:bg-white/5'
              }`}
            >
              <Flame className={`w-4 h-4 ${pathname === '/' ? 'text-acid' : 'text-fog'}`} />
              <span>Overview</span>
            </Link>
          </div>

          {/* Dedicated Individual Games Section */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between px-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-fog">
                Tournament Games ({sports.length})
              </span>
              <Link
                href="/games"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[10px] font-mono font-bold text-acid hover:underline"
              >
                Directory &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {sports.map((sport) => {
                const slug = getSportSlug(sport)
                const meta = getSportMeta(sport)
                const isCs = isCsCupFootball(sport.name)
                const isCurrent = pathname === `/games/${slug}`
                const Icon = meta.icon

                return (
                  <Link
                    key={sport.id}
                    href={`/games/${slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors ${
                      isCurrent
                        ? 'bg-acid text-acid-ink font-bold shadow-xs'
                        : 'text-mist hover:text-paper hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isCurrent ? 'text-acid-ink' : isCs ? 'text-acid' : 'text-fog'
                        }`}
                      />
                      <span className="font-medium">
                        {isCs ? 'CS Cup (Football)' : sport.name}
                      </span>
                      {isCs && <span className="text-xs font-bold">★</span>}
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isCurrent ? 'bg-black/20 text-acid-ink font-bold' : 'bg-white/5 text-fog'
                      }`}
                    >
                      {meta.badgeText}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Secondary Hub Pages */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <Link
              href="/leaderboards"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                pathname.startsWith('/leaderboards')
                  ? 'bg-white/10 text-paper border border-white/20'
                  : 'text-mist hover:text-paper hover:bg-white/5'
              }`}
            >
              <Trophy
                className={`w-4 h-4 ${
                  pathname.startsWith('/leaderboards') ? 'text-acid' : 'text-fog'
                }`}
              />
              <span>Tournament Standings</span>
            </Link>

            <Link
              href="/roster"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                pathname.startsWith('/roster')
                  ? 'bg-white/10 text-paper border border-white/20'
                  : 'text-mist hover:text-paper hover:bg-white/5'
              }`}
            >
              <Users
                className={`w-4 h-4 ${
                  pathname.startsWith('/roster') ? 'text-acid' : 'text-fog'
                }`}
              />
              <span>Teams &amp; Rosters</span>
            </Link>

            <Link
              href="/tactics"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                pathname.startsWith('/tactics')
                  ? 'bg-white/10 text-paper border border-white/20'
                  : 'text-mist hover:text-paper hover:bg-white/5'
              }`}
            >
              <Crosshair
                className={`w-4 h-4 ${
                  pathname.startsWith('/tactics') ? 'text-acid' : 'text-fog'
                }`}
              />
              <span>CS Cup Formations Studio</span>
            </Link>
          </div>

          {/* Theme Mode Selector in Mobile Drawer */}
          <div className="pt-3 border-t border-white/10">
            <ThemeToggle variant="row" />
          </div>

          {/* Admin link */}
          <div className="pt-2">
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-bold bg-white/5 text-paper border border-white/15 hover:bg-white/10"
            >
              <Shield className="w-4 h-4 text-acid" />
              <span>{isAdmin ? 'Admin Console (Active)' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
