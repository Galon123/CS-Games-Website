with open('components/CarromBracketSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<section className="w-full relative py-12 md:py-24 bg-canvas overflow-hidden">',
    '<section className="w-full relative py-12 md:py-24 overflow-hidden z-10 mb-12">'
)
content = content.replace(
    '<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">',
    '<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-ink-950/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10 shadow-2xl">'
)

with open('components/CarromBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
