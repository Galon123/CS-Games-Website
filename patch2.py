
with open('components/GameDetailView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import_statement = '''import BadmintonHeroCarousel from '@/components/BadmintonHeroCarousel'
import FootballHeroCarousel from '@/components/FootballHeroCarousel'
'''
text = text.replace('import BadmintonHeroCarousel from ''@/components/BadmintonHeroCarousel''', import_statement)

usage_statement = '''      {isBadminton && (
        <BadmintonHeroCarousel />
      )}
      {isCsCup && (
        <FootballHeroCarousel />
      )}
'''
text = text.replace('      {isBadminton && (\n        <BadmintonHeroCarousel />\n      )}\n', usage_statement)

with open('components/GameDetailView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
