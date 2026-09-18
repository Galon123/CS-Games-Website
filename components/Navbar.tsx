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
    <header className="sticky top-0 z-50 bg-[#090D16]/95 backdrop-blur-md border-b border-slate-800/80">
      <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
              <Trophy className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm tracking-tight text-white">
                  CS Sports League
                </span>
                <span className="hidden sm:inline-block text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Championship
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">Department of Computer Science</p>
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
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right: Admin Button */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/admin"
              className={`flex items-center space-x-2 text-xs font-medium px-3.5 py-1.5 rounded-lg border transition-all ${
                pathname === '/admin'
                  ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                  : isAdmin
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Shield className={`w-3.5 h-3.5 ${isAdmin ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{isAdmin ? 'Admin Console (Active)' : 'Admin'}</span>
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
        <div className="md:hidden border-b border-slate-800 bg-[#090D16] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <div className="pt-2 border-t border-slate-800/80 mt-2">
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span>{isAdmin ? 'Admin Console (Active)' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
