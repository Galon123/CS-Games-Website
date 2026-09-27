import type { Metadata } from 'next'
import { Anton, DM_Sans } from 'next/font/google'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
})
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { TournamentProvider } from '@/context/TournamentContext'
import Navbar from '@/components/Navbar'
import LiveMatchOverlay from '@/components/LiveMatchOverlay'

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
    <html lang="en" className={`dark ${anton.variable} ${dmSans.variable}`} suppressHydrationWarning>
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
            <Navbar />
            <main className="flex-1 w-full">
            {children}
          </main>
          <footer className="border-t border-white/10 bg-ink-950 relative z-20 py-12 text-xs text-mist">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                
                {/* Left Section: Convenor */}
                <div className="flex flex-col space-y-1 text-left items-start">
                  <div className="font-anton text-paper tracking-wider text-xl uppercase leading-tight">
                    CONVENOR
                  </div>
                  <div className="font-sans text-paper text-sm">
                    SREEHARI A
                  </div>
                  <div className="font-sans text-mist text-sm">
                    88482 04727
                  </div>
                </div>
  
                {/* Center Section: Title & Socials */}
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <span className="font-anton text-paper tracking-wider text-3xl sm:text-4xl uppercase">
                    CS GAMES 2026
                  </span>
                  <a href="https://www.instagram.com/cse_gec/" target="_blank" rel="noopener noreferrer" className="hover:text-acid transition-colors text-fog flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                </div>
  
                {/* Right Section: Joint Convenors */}
                <div className="flex flex-col space-y-3 text-right items-end">
                  <div className="font-anton text-paper tracking-wider text-xl uppercase leading-tight">
                    JOINT CONVENORS
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-col">
                      <span className="font-sans text-paper text-sm uppercase">ASHWIN D SREENIVAS</span>
                      <span className="font-sans text-mist text-sm">94472 04941</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-paper text-sm uppercase">CHRISTEENA GEEJO</span>
                      <span className="font-sans text-mist text-sm">89213 57607</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </footer>
        </TournamentProvider>
      </ThemeProvider>
    </body>
  </html>
  )
}
