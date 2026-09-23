
import re

# 1. Update mock-data.ts
mock_data_path = 'lib/mock-data.ts'
with open(mock_data_path, 'r', encoding='utf-8') as f:
    mock_data = f.read()

football_images = '''
export const DEFAULT_FOOTBALL_CAROUSEL_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1574629810360-7efbb6b490f0?w=2000&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1518605368461-1b606c4b9d03?w=2000&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?w=2000&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1551280857-2b9bbe5204f6?w=2000&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1508344928928-7137b67de192?w=2000&auto=format&fit=crop&q=85',
]
'''
if 'DEFAULT_FOOTBALL_CAROUSEL_IMAGES' not in mock_data:
    mock_data = mock_data.replace('export const DEFAULT_BADMINTON_CAROUSEL_IMAGES: string[] = [', football_images + '\nexport const DEFAULT_BADMINTON_CAROUSEL_IMAGES: string[] = [')
    
    # also add it to the football sport init
    mock_data = mock_data.replace('slug: ''football'',\n    carousel_images: []', 'slug: ''football'',\n    carousel_images: DEFAULT_FOOTBALL_CAROUSEL_IMAGES')

with open(mock_data_path, 'w', encoding='utf-8') as f:
    f.write(mock_data)


# 2. Update TournamentContext.tsx
ctx_path = 'context/TournamentContext.tsx'
with open(ctx_path, 'r', encoding='utf-8') as f:
    ctx = f.read()

if 'footballCarouselImages' not in ctx:
    ctx = ctx.replace('import { DEFAULT_BADMINTON_CAROUSEL_IMAGES } from', 'import { DEFAULT_BADMINTON_CAROUSEL_IMAGES, DEFAULT_FOOTBALL_CAROUSEL_IMAGES } from')
    ctx = ctx.replace('const BADMINTON_CAROUSEL_STORAGE_KEY = ''cs-games-badminton-carousel-v1''', 'const BADMINTON_CAROUSEL_STORAGE_KEY = ''cs-games-badminton-carousel-v1''\nconst FOOTBALL_CAROUSEL_STORAGE_KEY = ''cs-games-football-carousel-v1''')
    
    interface_add = '''
  footballCarouselImages: string[]
  updateFootballCarouselImages: (images: string[]) => Promise<void>
  resetFootballCarouselImages: () => Promise<void>
'''
    ctx = ctx.replace('badmintonCarouselImages: string[]', interface_add + '  badmintonCarouselImages: string[]')
    
    state_add = '''
  const [footballCarouselImages, setFootballCarouselImages] = useState<string[]>(() => {
    const found = initialSports.find((s) => s.name.toLowerCase().includes('cs cup') || s.name.toLowerCase().includes('football'))
    return found?.carousel_images && found.carousel_images.length > 0
      ? found.carousel_images
      : DEFAULT_FOOTBALL_CAROUSEL_IMAGES
  })

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(FOOTBALL_CAROUSEL_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFootballCarouselImages(parsed)
          }
        }
      }
    } catch (e) {}
  }, [])
'''
    ctx = ctx.replace('const [badmintonCarouselImages, setBadmintonCarouselImages] = useState<string[]>(() => {', state_add + '\n  const [badmintonCarouselImages, setBadmintonCarouselImages] = useState<string[]>(() => {')
    
    sport_update = '''
      if (updates.carousel_images && (updates.name?.toLowerCase().includes('cs cup') || updates.name?.toLowerCase().includes('football'))) {
        setFootballCarouselImages(updates.carousel_images)
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(FOOTBALL_CAROUSEL_STORAGE_KEY, JSON.stringify(updates.carousel_images))
          } catch (e) {}
        }
      }
'''
    ctx = ctx.replace('if (updates.carousel_images && updates.name?.toLowerCase().includes(''badminton'')) {', sport_update + '\n      if (updates.carousel_images && updates.name?.toLowerCase().includes(''badminton'')) {')
    
    methods_add = '''
  const updateFootballCarouselImages = useCallback(
    async (images: string[]) => {
      setFootballCarouselImages(images)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(FOOTBALL_CAROUSEL_STORAGE_KEY, JSON.stringify(images))
        } catch (e) {
          console.warn('Failed saving football carousel images', e)
        }
      }

      setSports((prev) =>
        prev.map((s) =>
          (s.name.toLowerCase().includes('cs cup') || s.name.toLowerCase().includes('football')) ? { ...s, carousel_images: images } : s
        )
      )

      if (isSupabaseConfigured() && supabase) {
        const targetSport = sports.find((s) => s.name.toLowerCase().includes('cs cup') || s.name.toLowerCase().includes('football'))
        if (targetSport) {
          const { error } = await supabase
            .from('sports')
            .update({ carousel_images: images })
            .eq('id', targetSport.id)
          if (error) {
            console.error('Supabase error saving football carousel images', error)
          }
        }
      }
    },
    [sports]
  )

  const resetFootballCarouselImages = useCallback(async () => {
    await updateFootballCarouselImages(DEFAULT_FOOTBALL_CAROUSEL_IMAGES)
  }, [updateFootballCarouselImages])
'''
    ctx = ctx.replace('const updateBadmintonCarouselImages = useCallback(', methods_add + '\n  const updateBadmintonCarouselImages = useCallback(')
    
    returns_add = '''
    footballCarouselImages,
    updateFootballCarouselImages,
    resetFootballCarouselImages,
'''
    ctx = ctx.replace('badmintonCarouselImages,', returns_add + '    badmintonCarouselImages,')

with open(ctx_path, 'w', encoding='utf-8') as f:
    f.write(ctx)


# 3. Modify FootballHeroCarousel.tsx
carousel_path = 'components/FootballHeroCarousel.tsx'
with open(carousel_path, 'r', encoding='utf-8') as f:
    carousel = f.read()

carousel = carousel.replace('DEFAULT_BADMINTON_CAROUSEL_IMAGES', 'DEFAULT_FOOTBALL_CAROUSEL_IMAGES')
carousel = carousel.replace('BADMINTON_PRESET_SUGGESTIONS', 'FOOTBALL_PRESET_SUGGESTIONS')
carousel = carousel.replace('badmintonCarouselImages', 'footballCarouselImages')
carousel = carousel.replace('updateBadmintonCarouselImages', 'updateFootballCarouselImages')
carousel = carousel.replace('resetBadmintonCarouselImages', 'resetFootballCarouselImages')
carousel = carousel.replace('BadmintonHeroCarousel', 'FootballHeroCarousel')
carousel = carousel.replace('Badminton Smash Action', 'Football Match Play')
carousel = carousel.replace('Court Floor Rally Clashes', 'Stadium Night Lights')
carousel = carousel.replace('Doubles Championship Rally', 'Goal Celebration')
carousel = carousel.replace('Rackets & Feather Shuttlecock', 'Soccer Ball on Pitch')
carousel = carousel.replace('Indoor Arena Court Lines', 'Team Formation')

with open(carousel_path, 'w', encoding='utf-8') as f:
    f.write(carousel)
