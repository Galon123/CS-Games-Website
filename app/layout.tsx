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
      <body className="bg-canvas text-cream min-h-screen flex flex-col antialiased selection:bg-acid selection:text-acid-ink font-sans transition-colors duration-200" suppressHydrationWarning>
        <ThemeProvider>
          <TournamentProvider>
            <LiveTicker />
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            {children}
          </main>
          <footer className="border-t border-white/10 bg-ink-900 py-10 text-xs text-mist">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Left Section: Convenors */}
              <div className="flex flex-col space-y-2 text-center sm:text-left">
                <span className="font-serif font-black text-paper tracking-tight text-sm">
                  CS GAMES 2026
                </span>
                <div className="text-[11px] text-mist tracking-wide space-y-1">
                  <p><strong className="text-cream">Convenor:</strong> Name (Phone)</p>
                  <p><strong className="text-cream">Joint Convenors:</strong> Name 1 (Phone), Name 2 (Phone)</p>
                </div>
              </div>

              {/* Center Section: Socials */}
              <div className="flex flex-col items-center justify-center gap-2 text-[11px] font-mono tracking-widest uppercase text-fog">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-acid transition-colors flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  <span>Instagram</span>
                </a>
              </div>

              {/* Right Section: Telemetry */}
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
