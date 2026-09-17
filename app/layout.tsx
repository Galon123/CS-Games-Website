import type { Metadata } from 'next'
import './globals.css'
import { TournamentProvider } from '@/context/TournamentContext'
import Navbar from '@/components/Navbar'
import LiveTicker from '@/components/LiveTicker'

export const metadata: Metadata = {
  title: 'CS Nexus Arena | Sports & Gaming Championship',
  description: 'Annual Computer Science Department Sports & Gaming Event featuring Football, Badminton, Chess, and Carroms with live tactical board and realtime scores.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-ice-white min-h-screen flex flex-col antialiased selection:bg-neon-lime selection:text-black">
        <TournamentProvider>
          <LiveTicker />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="border-t border-slate-800 bg-[#0B1120] py-8 text-center text-sm text-muted-gray">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neon-lime animate-pulse"></span>
                <span className="font-semibold text-ice-white tracking-wider">CS NEXUS ARENA 2026</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 text-cyber-cyan border border-cyber-cyan/30">
                  CYBER ATHLETIC
                </span>
              </div>
              <p className="text-xs text-muted-gray">
                Department of Computer Science & Engineering • Powered by Next.js, Tailwind CSS & Supabase
              </p>
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-neon-lime font-mono">SYS.STATUS: OPERATIONAL</span>
              </div>
            </div>
          </footer>
        </TournamentProvider>
      </body>
    </html>
  )
}
