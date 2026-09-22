import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { TournamentProvider } from '@/context/TournamentContext'
import Navbar from '@/components/Navbar'
import LiveTicker from '@/components/LiveTicker'

export const metadata: Metadata = {
  title: 'CS Games 2026 | Department Championship',
  description:
    'Annual Computer Science Department Sports & Gaming Championship featuring Football, Badminton, Chess, Carrom, and Esports with realtime standings and tactical pitch formations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var storedTheme = localStorage.getItem('cs-games-theme');
                if (storedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.style.colorScheme = 'light';
                } else if (storedTheme === 'dark') {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                  // Keep dark default unless explicit light preference or chosen
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })()`,
          }}
        />
      </head>
      <body className="bg-canvas text-cream min-h-screen flex flex-col antialiased selection:bg-acid selection:text-acid-ink font-sans transition-colors duration-200">
        <ThemeProvider>
          <TournamentProvider>
            <LiveTicker />
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            {children}
          </main>
          <footer className="border-t border-white/10 bg-ink-900 py-10 text-xs text-mist">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-acid shadow-[0_0_8px_rgba(215,242,43,0.6)]" />
                  <span className="font-serif font-black text-paper tracking-tight text-sm">
                    CS Games.
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/5 text-mist border border-white/10">
                    2026 Meet
                  </span>
                </div>
                <span className="hidden sm:inline text-white/20">|</span>
                <p className="text-[11px] text-mist tracking-wide">
                  Department of Computer Science &amp; Engineering
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono uppercase tracking-[0.14em] text-fog">
                <span>ATHLETICS</span>
                <span className="text-white/20">•</span>
                <span>ESPORTS</span>
                <span className="text-white/20">•</span>
                <span>TACTICS</span>
                <span className="text-white/20">•</span>
                <span>STANDINGS</span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-mist">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span className="font-mono text-[11px] text-paper font-medium">System Telemetry Live</span>
              </div>
            </div>
          </footer>
        </TournamentProvider>
      </ThemeProvider>
    </body>
  </html>
  )
}
