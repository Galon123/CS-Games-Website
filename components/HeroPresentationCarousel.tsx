'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

export interface PresentationSlide {
  id: string
  title: string
  subtitle: string
  href: string
  imageUrl: string
  fallbackGradient: string
}

const CAROUSEL_SLIDES: PresentationSlide[] = [
  {
    id: 'cs-cup-flagship',
    title: 'The CS Cup.',
    subtitle: 'Annual 6v6 departmental football turf championship',
    href: '/games/football',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=2000&auto=format&fit=crop&q=85',
    fallbackGradient: 'from-emerald-950/80 via-ink-900 to-ink-950',
  },
  {
    id: 'badminton-masters',
    title: 'Badminton.',
    subtitle: 'High-velocity singles and doubles racket clashes',
    href: '/games/badminton',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=2000&auto=format&fit=crop&q=85',
    fallbackGradient: 'from-cyan-950/80 via-ink-900 to-ink-950',
  },
  {
    id: 'chess-invitational',
    title: 'Chess.',
    subtitle: 'Classical strategy and timed tactical warfare',
    href: '/games/chess',
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=2000&auto=format&fit=crop&q=85',
    fallbackGradient: 'from-amber-950/70 via-ink-900 to-ink-950',
  },
  {
    id: 'carrom-showdown',
    title: 'Carrom.',
    subtitle: 'Precision striker battles and pocket showdowns',
    href: '/games/carrom',
    imageUrl: 'https://images.unsplash.com/photo-1767619834318-63184920c4b1?w=2000&auto=format&fit=crop&q=85',
    fallbackGradient: 'from-orange-950/70 via-ink-900 to-ink-950',
  },
  {
    id: 'esports-arena',
    title: 'Esports.',
    subtitle: 'Competitive departmental LAN and arena showdown',
    href: '/games',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=2000&auto=format&fit=crop&q=85',
    fallbackGradient: 'from-violet-950/70 via-ink-900 to-ink-950',
  },
]

const SLIDE_DURATION_MS = 6000

export default function HeroPresentationCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const containerRef = useRef<HTMLDivElement>(null)
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Slide navigation handlers
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length)
  }, [])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play interval with pause-on-hover & reduced motion respect
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
      return
    }

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    progressTimerRef.current = setInterval(() => {
      goToNext()
    }, SLIDE_DURATION_MS)

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    }
  }, [isPlaying, isHovered, goToNext, currentIndex])

  // Keyboard navigation when container is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goToPrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      goToNext()
    } else if (e.key === ' ') {
      e.preventDefault()
      setIsPlaying((prev) => !prev)
    }
  }

  // Touch gesture swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchDeltaX(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const currentX = e.touches[0].clientX
    setTouchDeltaX(currentX - touchStartX)
  }

  const handleTouchEnd = () => {
    if (touchStartX === null) return
    const swipeThreshold = 50
    if (touchDeltaX < -swipeThreshold) {
      goToNext()
    } else if (touchDeltaX > swipeThreshold) {
      goToPrev()
    }
    setTouchStartX(null)
    setTouchDeltaX(0)
  }

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <section
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="CS Games 2026 Presentation Showcase"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden bg-ink-900 shadow-card select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-acid group"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. SLIDES VIEWPORT (Responsive aspect ratios: 4/3 mobile to 21/9 desktop)
          Ensures zero Cumulative Layout Shift (CLS) across viewports.
          ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[420px] sm:min-h-[480px] lg:min-h-[540px] overflow-hidden">
        {CAROUSEL_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex
          const isFailedImage = imageErrors[slide.id]

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${CAROUSEL_SLIDES.length}: ${slide.title}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Slide Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                {!isFailedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={() => handleImageError(slide.id)}
                    className={`w-full h-full object-cover contrast-[102%] brightness-[98%] transition-transform duration-[6500ms] ease-out will-change-transform ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${slide.fallbackGradient}`} />
                )}

                {/* Scrim Gradients - localized to bottom & left to maximize overall image clarity */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 via-35% to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-950/75 via-transparent via-50% to-transparent pointer-events-none" />
              </div>

              {/* Technical Registration Marks (+) per design.md */}
              <span className="absolute top-5 left-6 text-xs font-mono text-acid/60 font-bold select-none pointer-events-none">
                +
              </span>
              <span className="absolute top-5 right-6 text-xs font-mono text-acid/60 font-bold select-none pointer-events-none">
                +
              </span>
              <span className="absolute bottom-6 left-6 text-xs font-mono text-acid/60 font-bold select-none pointer-events-none hidden sm:inline">
                +
              </span>
              <span className="absolute bottom-6 right-6 text-xs font-mono text-acid/60 font-bold select-none pointer-events-none hidden sm:inline">
                +
              </span>

              {/* ─────────────────────────────────────────────────────────────
                  2. SLIDE CONTENT OVERLAY (Title Only per specification)
                  Vast negative space, dramatic display scale, zero clutter.
                  ───────────────────────────────────────────────────────────── */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-7xl mx-auto pointer-events-none">
                <div className="pointer-events-auto max-w-fit pb-1 sm:pb-3 space-y-1 sm:space-y-1.5">
                  <div
                    className="group/title inline-flex items-center gap-2.5 sm:gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-acid rounded-xl"
                  >
                    <h1 className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-paper tracking-tight leading-[1.0] drop-shadow-sm transition-colors duration-200">
                      {slide.title}
                    </h1>
                  </div>
                  <p className="text-[10px] sm:text-[11px] md:text-xs text-mist/75 font-light tracking-wide">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CAROUSEL CONTROLS & PAGINATION
          Previous/Next Arrow Buttons, Pill Indicators, and Play/Pause
          ───────────────────────────────────────────────────────────── */}
      {/* Floating Prev & Next Arrows removed */}

      {/* Slide Pagination Pills & Autoplay Toggle */}
      <div className="absolute left-6 sm:left-10 lg:left-14 bottom-6 sm:bottom-10 z-20 flex items-center space-x-3">
        {/* Pagination Dots/Pills */}
        <div
          role="tablist"
          aria-label="Presentation Carousel Slides"
          className="flex items-center space-x-1.5 p-1 rounded-full bg-ink-900/70 backdrop-blur-md border border-white/10"
        >
          {CAROUSEL_SLIDES.map((slide, idx) => {
            const isCurrent = idx === currentIndex

            return (
              <button
                key={slide.id}
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-acid ${
                  isCurrent
                    ? 'w-8 bg-acid shadow-[0_0_8px_rgba(215,242,43,0.5)]'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            )
          })}
        </div>

        {/* Play / Pause Toggle Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          className="w-7 h-7 rounded-full bg-ink-900/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-fog hover:text-paper hover:border-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-acid"
        >
          {isPlaying ? <Pause className="w-3 h-3 text-acid" /> : <Play className="w-3 h-3 ml-0.5" />}
        </button>
      </div>

      {/* Progress Bar Line along top of carousel */}
      {isPlaying && !isHovered && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5 z-20 overflow-hidden pointer-events-none">
          <div
            key={currentIndex}
            className="h-full bg-acid shadow-[0_0_8px_rgba(215,242,43,0.8)] animate-carousel-progress will-change-transform"
            style={{ animationDuration: `${SLIDE_DURATION_MS}ms` }}
          />
        </div>
      )}
    </section>
  )
}
