import type { Metadata } from 'next'
import './globals.css'
import { TournamentProvider } from '@/context/TournamentContext'
import Navbar from '@/components/Navbar'
import LiveTicker from '@/components/LiveTicker'

export const metadata: Metadata = {
  title: 'CS Sports League | Department Championship',
  description: 'Annual Computer Science Department Sports & Gaming Championship featuring 6v6 Football, Badminton, Chess, Table Tennis, and Esports with live scores and tactical formations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <TournamentProvider>
          <LiveTicker />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="border-t border-slate-800/80 bg-[#060911] py-8 text-center text-sm text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="font-medium text-slate-200">CS Sports Championship 2026</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Annual Tournament
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Department of Computer Science & Engineering • Next.js & Supabase
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>System Operational</span>
              </div>
            </div>
          </footer>
        </TournamentProvider>
      </body>
    </html>
  )
}
