'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTournament } from '@/context/TournamentContext'
import { Trophy, Users, Shield, LayoutDashboard, Cpu, Menu, X, Flame, Crosshair } from 'lucide-react'
import CSBrandMark from '@/components/CSBrandMark'

export default function Navbar() {
  const pathname = usePathname()
  const { isAdmin } = useTournament()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Overview', href: '/', icon: Flame },
    { label: 'Leaderboards', href: '/leaderboards', icon: Trophy },
    { label: 'Teams & Rosters', href: '/roster', icon: Users },
    { label: 'CS Cup Pitch', href: '/tactics', icon: Crosshair },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-[#1A1A1A]">
      <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Championship Crest */}
          <Link href="/" className="flex items-center space-x-3 group select-none">
            <CSBrandMark className="w-10 h-10 group-hover:scale-105 transition-transform duration-200 shadow-editorial-sm rounded-md" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-lg tracking-tight text-[#1A1A1A]">
                  CS GAMES
                </span>
                <span className="font-serif font-black text-lg tracking-tight text-[#1E40AF]">
                  2026
                </span>
                <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-mono font-black px-2 py-0.5 rounded bg-[#F59E0B] text-[#1A1A1A] border border-[#1A1A1A] shadow-2xs">
                  <span>★</span>
                  <span>MEET</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-wide uppercase font-mono">
                Dept. of Computer Science &amp; Engineering
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#1E40AF] text-white border-2 border-[#172554] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
                      : 'text-slate-700 hover:text-[#1A1A1A] hover:bg-slate-100 border-2 border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right: Admin Button */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/admin"
              className={`flex items-center space-x-2 text-xs font-black px-3.5 py-1.5 rounded-md border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 ${
                pathname === '/admin'
                  ? 'bg-[#1E40AF] text-white'
                  : isAdmin
                  ? 'bg-[#10B981] text-[#1A1A1A]'
                  : 'bg-[#F59E0B] hover:bg-[#D97706] text-[#1A1A1A]'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>{isAdmin ? 'Admin (Active)' : 'Admin Portal'}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-800 hover:bg-slate-100 focus:outline-none border border-slate-300"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E0D8] bg-white px-4 pt-2 pb-4 space-y-1 shadow-md">
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
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <div className="pt-2 border-t border-slate-100 mt-2">
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Shield className="w-4 h-4 text-blue-600" />
              <span>{isAdmin ? 'Admin Console (Active)' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
