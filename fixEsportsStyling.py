with open('components/EsportsView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the background import
if 'EsportsBlurredBackground' not in content or 'import EsportsBlurredBackground from' not in content:
    content = content.replace("import EsportsHeroCarousel from '@/components/EsportsHeroCarousel'", "import EsportsHeroCarousel from '@/components/EsportsHeroCarousel'\nimport EsportsBlurredBackground from '@/components/EsportsBlurredBackground'")

# Add the background component right after the main div
content = content.replace('<div className="w-full flex flex-col min-h-screen bg-canvas text-cream selection:bg-acid selection:text-acid-ink font-sans">', '<div className="w-full flex flex-col min-h-screen bg-canvas text-cream selection:bg-acid selection:text-acid-ink font-sans">\n      <EsportsBlurredBackground />')

# Wrap the main content in a glass container and change the wrapper padding
content = content.replace('<main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-12">', '<main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">\n        <div className="bg-ink-950/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10 shadow-2xl space-y-12 mb-12">')

content = content.replace('</main>', '</div>\n      </main>')

# Fix the card sizing (from h-[400px] to aspect-[3/4] or aspect-[4/5])
content = content.replace('className="bg-ink-900 rounded-2xl overflow-hidden border border-white/10 group shadow-card flex flex-col h-[400px]"', 'className="bg-ink-900 rounded-2xl overflow-hidden border border-white/10 group shadow-card cursor-pointer"')

content = content.replace('<div className="flex-1 relative overflow-hidden">', '<div className="aspect-[3/4] relative overflow-hidden">')

# Make the card register link open in a new tab
content = content.replace('className="flex-1 flex justify-center items-center space-x-2 bg-acid hover:bg-acid/90 text-acid-ink px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-colors shadow-[0_0_15px_rgba(215,242,43,0.3)]"\n                      >', 'className="flex-1 flex justify-center items-center space-x-2 bg-acid hover:bg-acid/90 text-acid-ink px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-colors shadow-[0_0_15px_rgba(215,242,43,0.3)]"\n                        target="_blank"\n                        rel="noopener noreferrer"\n                      >')

with open('components/EsportsView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
