'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTournament } from '@/context/TournamentContext'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { isAdmin, liveMatch } = useTournament()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'home', href: '/#home' },
    { label: 'events', href: '/#events' },
    { label: 'schedules', href: '/#schedules' },
    { label: 'about', href: '/#about' },
    { label: 'admin', href: '/admin' },
  ]

  return (
    <header className="fixed top-4 w-full z-50 px-4 transition-all duration-300 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        {/* Floating Pill Container */}
        <nav className={`flex items-center justify-between px-6 py-3 bg-white/95 dark:bg-ink-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-elevated rounded-pill transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
          
          {/* Brand */}
          <Link href="/#home" className="flex items-center space-x-2 group select-none">
            <span className="font-black text-xl tracking-tight text-ink-950 dark:text-paper font-grotesk lowercase">
              cs games
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {liveMatch && (
              <div className="flex items-center space-x-2 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute" />
                <div className="w-2 h-2 rounded-full bg-rose-500 relative" />
                <span className="text-xs font-mono font-bold text-rose-500 uppercase cursor-default">Live Match</span>
              </div>
            )}
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-bold lowercase tracking-wider text-ink-600 dark:text-mist hover:text-acid-hot transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-ink-600 dark:text-mist hover:text-acid-hot transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 bg-white/95 dark:bg-ink-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-none shadow-elevated">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-lg font-bold lowercase tracking-wider text-ink-900 dark:text-paper hover:text-acid-hot"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
