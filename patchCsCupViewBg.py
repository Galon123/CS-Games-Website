import os
import re

with open('components/CsCupView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add FootballBlurredBackground import
if "FootballBlurredBackground" not in content:
    content = content.replace("import FootballHeroCarousel from '@/components/FootballHeroCarousel'", "import FootballHeroCarousel from '@/components/FootballHeroCarousel'\nimport FootballBlurredBackground from '@/components/FootballBlurredBackground'")

# Add FootballBlurredBackground usage
if "<FootballBlurredBackground />" not in content:
    content = content.replace('<div className="w-full flex flex-col min-h-screen bg-canvas text-cream selection:bg-acid selection:text-acid-ink font-sans">', '<div className="w-full flex flex-col min-h-screen bg-canvas text-cream selection:bg-acid selection:text-acid-ink font-sans">\n      <FootballBlurredBackground />\n')

with open('components/CsCupView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
