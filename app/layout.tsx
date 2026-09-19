import type { Metadata } from 'next'
import './globals.css'
import { TournamentProvider } from '@/context/TournamentContext'
import Navbar from '@/components/Navbar'
import LiveTicker from '@/components/LiveTicker'

export const metadata: Metadata = {
  title: 'CS Games 2026 | Department Championship',
  description: 'Annual Computer Science Department Sports & Gaming Championship featuring Football, Badminton, Chess, Carrom, and Online Games with realtime standings and tactical pitch formations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#FBF9F5] text-[#1A1A1A] min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <TournamentProvider>
          <LiveTicker />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-[#E5E0D8] bg-white py-8 text-center text-xs sm:text-sm text-slate-600">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="font-semibold text-slate-900">CS GAMES 2026</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  Annual Championship
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Department of Computer Science & Engineering • Powered by Next.js & Supabase
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>System Live</span>
              </div>
            </div>
          </footer>
        </TournamentProvider>
      </body>
    </html>
  )
}
