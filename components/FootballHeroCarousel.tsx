'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  X,
  Lock,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { useTournament } from '@/context/TournamentContext'
import { DEFAULT_FOOTBALL_CAROUSEL_IMAGES } from '@/lib/mock-data'

const SLIDE_DURATION_MS = 6000

// Curated Football presets for quick one-click addition by admins
const FOOTBALL_PRESET_SUGGESTIONS = [
  {
    name: 'Football Pitch Action',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=2000&auto=format&fit=crop&q=85',
  },
  {
    name: 'Turf Close Up',
    url: 'https://images.unsplash.com/photo-1518605368461-1eb767ac16ab?w=2000&auto=format&fit=crop&q=85',
  },
  {
    name: 'Stadium Lights',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=2000&auto=format&fit=crop&q=85',
  },
  {
    name: 'Goal Net',
    url: 'https://images.unsplash.com/photo-1553775282-20af80779df7?w=2000&auto=format&fit=crop&q=85',
  },
  {
    name: 'Football Ball',
    url: 'https://images.unsplash.com/photo-1516422452136-168798e12467?w=2000&auto=format&fit=crop&q=85',
  },
]

export default function FootballHeroCarousel() {
  const {
    footballCarouselImages,
    updateFootballCarouselImages,
    resetFootballCarouselImages,
    isAdmin,
    setIsAdmin,
  } = useTournament()

  // Use images from context or fallback to default
  const slides =
    footballCarouselImages && footballCarouselImages.length > 0
      ? footballCarouselImages
      : DEFAULT_FOOTBALL_CAROUSEL_IMAGES

  // Carousel interactive state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Admin Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [adminPasswordInput, setAdminPasswordInput] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)

  // In-modal draft images editing state
  const [draftImages, setDraftImages] = useState<string[]>(slides)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Keep draft images in sync whenever slides update or editor opens
  useEffect(() => {
    if (!isEditorOpen) {
      setDraftImages(slides)
    }
  }, [slides, isEditorOpen])

  // Slide navigation handlers
  const goToNext = useCallback(() => {
    if (slides.length <= 1) return
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const goToPrev = useCallback(() => {
    if (slides.length <= 1) return
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play interval with pause-on-hover & reduced motion respect
  useEffect(() => {
    if (!isPlaying || isHovered || slides.length <= 1) {
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
  }, [isPlaying, isHovered, goToNext, currentIndex, slides.length])

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

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }))
  }

  // -------------------------------------------------------------
  // Draft Image Editing Actions
  // -------------------------------------------------------------
  const handleAddImage = () => {
    const trimmed = newImageUrl.trim()
    if (!trimmed) return
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
      alert('Please enter a valid URL starting with http://, https://, or /')
      return
    }
    setDraftImages((prev) => [...prev, trimmed])
    setNewImageUrl('')
  }

  const handleUpdateDraftUrl = (index: number, newUrl: string) => {
    setDraftImages((prev) => {
      const copy = [...prev]
      copy[index] = newUrl
      return copy
    })
  }

  const handleRemoveImage = (index: number) => {
    if (draftImages.length <= 1) {
      alert('The carousel must contain at least 1 image.')
      return
    }
    setDraftImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= draftImages.length) return
    setDraftImages((prev) => {
      const copy = [...prev]
      const temp = copy[index]
      copy[index] = copy[targetIdx]
      copy[targetIdx] = temp
      return copy
    })
  }

  const handleQuickAddPreset = (url: string) => {
    if (draftImages.includes(url)) {
      alert('This image is already in the carousel.')
      return
    }
    setDraftImages((prev) => [...prev, url])
  }

  const handleSaveImages = async () => {
    const validImages = draftImages.map((img) => img.trim()).filter(Boolean)
    if (validImages.length === 0) {
      alert('Please provide at least one valid image URL.')
      return
    }
    await updateFootballCarouselImages(validImages)
    setCurrentIndex(0)
    setSaveSuccessMsg('Football carousel images updated successfully!')
    setTimeout(() => {
      setSaveSuccessMsg(null)
      setIsEditorOpen(false)
    }, 1200)
  }

  const handleResetDefaults = async () => {
    if (confirm('Reset carousel back to the default Football tournament images?')) {
      await resetFootballCarouselImages()
      setDraftImages(DEFAULT_FOOTBALL_CAROUSEL_IMAGES)
      setCurrentIndex(0)
      setSaveSuccessMsg('Restored default images!')
      setTimeout(() => setSaveSuccessMsg(null), 1500)
    }
  }

  const handleQuickAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPasswordInput.trim() === 'admin123' || adminPasswordInput.trim().length >= 6) {
      setIsAdmin(true)
      setIsAuthOpen(false)
      setIsEditorOpen(true)
      setAdminPasswordInput('')
      setAuthError(null)
    } else {
      setAuthError('Incorrect password. (Default is admin123 or at least 6 characters)')
    }
  }

  return (
    <>
      <section
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Football Presentation Showcase"
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
            1. SLIDES VIEWPORT
            Zero text overlays (no names, no sentences) per instructions.
            Pure visual cinematic showcase with Ken Burns scale effect.
            ───────────────────────────────────────────────────────────── */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] overflow-hidden">
          {slides.map((imageUrl, index) => {
            const isActive = index === currentIndex
            const isFailed = imageErrors[index]

            return (
              <div
                key={`${imageUrl}-${index}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${slides.length}`}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Slide Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                  {!isFailed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt="Football Championship Showcase"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      onError={() => handleImageError(index)}
                      className={`w-full h-full object-cover contrast-[102%] brightness-[98%] transition-transform duration-[6500ms] ease-out will-change-transform ${
                        isActive ? 'scale-105' : 'scale-100'
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-950/80 via-ink-900 to-ink-950 flex items-center justify-center">
                      <span className="text-xs font-mono text-fog">Image preview unavailable</span>
                    </div>
                  )}

                  {/* Scrim Gradients localized to bottom & left for visual depth without clouding imagery */}
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
              </div>
            )
          })}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. FLOATING HOVER PREV / NEXT ARROWS
            Subtle chevron buttons for effortless slide navigation
            ───────────────────────────────────────────────────────────── */}
        {slides.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-ink-900/60 hover:bg-ink-900/90 backdrop-blur-md border border-white/10 text-paper flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 hover:border-acid/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-acid"
            >
              <ChevronLeft className="w-5 h-5 text-paper" />
            </button>
            <button
              onClick={goToNext}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-ink-900/60 hover:bg-ink-900/90 backdrop-blur-md border border-white/10 text-paper flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 hover:border-acid/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-acid"
            >
              <ChevronRight className="w-5 h-5 text-paper" />
            </button>
          </>
        )}

        {/* ─────────────────────────────────────────────────────────────
            3. ADMIN CONTROLS BUTTON (TOP RIGHT)
            Visible directly on the carousel for authorized administrators
            ───────────────────────────────────────────────────────────── */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-30 flex items-center space-x-2">
          {isAdmin ? (
            <button
              onClick={() => {
                setDraftImages([...slides])
                setIsEditorOpen(true)
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-ink-900/85 hover:bg-ink-800 text-xs font-mono font-bold text-acid border border-acid/50 hover:border-acid backdrop-blur-md shadow-md hover:shadow-glow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-acid"
              title="Admin: Edit Football Hero Carousel Images"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Edit Images ({slides.length})</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-ink-900/60 hover:bg-ink-900/90 text-[11px] font-mono text-fog hover:text-paper border border-white/10 hover:border-white/25 backdrop-blur-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-acid opacity-70 hover:opacity-100"
              title="Admin access to customize carousel images"
            >
              <Lock className="w-3 h-3 text-acid" />
              <span>Admin Edit</span>
            </button>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. CAROUSEL PAGINATION PILLS & AUTOPLAY TOGGLE (BOTTOM LEFT)
            Identical design to the home page presentation carousel
            ───────────────────────────────────────────────────────────── */}
        <div className="absolute left-6 sm:left-10 lg:left-14 bottom-6 sm:bottom-10 z-20 flex items-center space-x-3">
          {/* Pagination Dots/Pills */}
          {slides.length > 1 && (
            <div
              role="tablist"
              aria-label="Football Presentation Carousel Slides"
              className="flex items-center space-x-1.5 p-1 rounded-full bg-ink-900/70 backdrop-blur-md border border-white/10"
            >
              {slides.map((_, idx) => {
                const isCurrent = idx === currentIndex

                return (
                  <button
                    key={`pill-${idx}`}
                    role="tab"
                    aria-selected={isCurrent}
                    aria-label={`Go to slide ${idx + 1}`}
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
          )}

          {/* Play / Pause Toggle Button */}
          {slides.length > 1 && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              className="w-7 h-7 rounded-full bg-ink-900/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-fog hover:text-paper hover:border-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-acid"
            >
              {isPlaying ? <Pause className="w-3 h-3 text-acid" /> : <Play className="w-3 h-3 ml-0.5" />}
            </button>
          )}
        </div>

        {/* Progress Bar Line along top of carousel */}
        {isPlaying && !isHovered && slides.length > 1 && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5 z-20 overflow-hidden pointer-events-none">
            <div
              key={currentIndex}
              className="h-full bg-acid shadow-[0_0_8px_rgba(215,242,43,0.8)] animate-carousel-progress will-change-transform"
              style={{ animationDuration: `${SLIDE_DURATION_MS}ms` }}
            />
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. ADMIN IMAGE EDITOR MODAL
          Allows adding, editing, reordering, deleting, and resetting
          Football carousel images with instant live previews.
          ───────────────────────────────────────────────────────────── */}
      {isEditorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="editor-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsEditorOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-ink-800 border border-white/15 rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-acid/15 text-acid border border-acid/30 uppercase">
                    ADMIN CONSOLE
                  </span>
                  <span className="text-xs font-mono text-fog">Football Hero Showcase</span>
                </div>
                <h3 id="editor-modal-title" className="font-serif font-black text-2xl text-paper mt-1">
                  Manage Carousel Images
                </h3>
                <p className="text-xs text-mist mt-0.5 font-sans">
                  Customize the presentation photos shown in the hero carousel of the Football page.
                </p>
              </div>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-lg text-mist hover:text-paper hover:bg-white/10 transition-colors"
                aria-label="Close editor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Toast */}
            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Current Slide Stack */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-fog font-bold">
                  Current Slides ({draftImages.length})
                </span>
                <span className="text-[11px] font-mono text-mist">
                  Drag or use arrows to adjust sequence
                </span>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {draftImages.map((url, idx) => (
                  <div
                    key={`draft-${idx}`}
                    className="p-3 rounded-xl bg-ink-900 border border-white/10 flex items-center gap-3 group/slide hover:border-white/20 transition-all"
                  >
                    {/* Position Badge */}
                    <span className="w-6 h-6 rounded-md bg-white/5 border border-white/10 font-mono text-xs font-bold text-mist flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    {/* Image Thumbnail Preview */}
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/10 bg-ink-950 shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Slide ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>

                    {/* Image URL Input */}
                    <div className="flex-1 min-w-0">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleUpdateDraftUrl(idx, e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-ink-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-paper focus:outline-none focus:border-acid"
                      />
                    </div>

                    {/* Slide Action Controls */}
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleMoveImage(idx, 'up')}
                        disabled={idx === 0}
                        aria-label="Move slide up"
                        title="Move slide up"
                        className="p-1.5 rounded-md hover:bg-white/10 text-mist hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveImage(idx, 'down')}
                        disabled={idx === draftImages.length - 1}
                        aria-label="Move slide down"
                        title="Move slide down"
                        className="p-1.5 rounded-md hover:bg-white/10 text-mist hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        disabled={draftImages.length <= 1}
                        aria-label="Delete slide"
                        title="Delete slide"
                        className="p-1.5 rounded-md hover:bg-rose-500/20 text-mist hover:text-rose-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Slide Form */}
            <div className="p-4 rounded-xl bg-ink-900/60 border border-white/10 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-fog font-bold block">
                Add New Carousel Slide
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste Unsplash or direct image URL (https://...)"
                  className="flex-1 w-full bg-ink-800 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-paper placeholder-fog/60 focus:outline-none focus:border-acid"
                />
                <button
                  onClick={handleAddImage}
                  disabled={!newImageUrl.trim()}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono font-bold text-paper hover:text-acid disabled:opacity-40 transition-colors flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Slide</span>
                </button>
              </div>
            </div>

            {/* Quick-Add Curated Football Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-fog font-bold flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-acid" />
                <span>Quick-Add Curated Football Presets</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {FOOTBALL_PRESET_SUGGESTIONS.map((preset, pIdx) => {
                  const isAlreadyAdded = draftImages.includes(preset.url)

                  return (
                    <button
                      key={pIdx}
                      onClick={() => handleQuickAddPreset(preset.url)}
                      disabled={isAlreadyAdded}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono text-left border transition-all ${
                        isAlreadyAdded
                          ? 'bg-white/5 border-white/10 text-fog cursor-not-allowed opacity-50'
                          : 'bg-white/5 hover:bg-white/10 border-white/15 hover:border-acid/40 text-mist hover:text-paper'
                      }`}
                    >
                      {preset.name} {isAlreadyAdded ? '✓' : '+'}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleResetDefaults}
                className="px-3.5 py-2 rounded-lg text-xs font-mono text-mist hover:text-paper hover:bg-white/5 border border-white/10 flex items-center space-x-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-fog" />
                <span>Restore Defaults</span>
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-mono text-mist hover:text-paper hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveImages}
                  className="px-5 py-2 rounded-lg bg-acid text-acid-ink hover:bg-acid-hot text-xs font-mono font-black tracking-wide uppercase transition-colors shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. ADMIN QUICK AUTHENTICATION MODAL
          Prompts for quick admin unlock when user is not logged in
          ───────────────────────────────────────────────────────────── */}
      {isAuthOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsAuthOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-ink-800 border border-white/15 rounded-2xl p-6 space-y-5 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-xl bg-acid/15 border border-acid/30 flex items-center justify-center text-acid">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-black text-xl text-paper mt-2">
                  Admin Verification
                </h3>
                <p className="text-xs text-mist">
                  Enter admin credentials to customize the Football hero carousel images.
                </p>
              </div>
              <button
                onClick={() => setIsAuthOpen(false)}
                className="p-1.5 rounded-lg text-mist hover:text-paper"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-fog uppercase mb-1">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Enter admin password (e.g. admin123)"
                  autoFocus
                  className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-paper focus:outline-none focus:border-acid"
                />
                {authError && <p className="text-[11px] text-rose-400 mt-1">{authError}</p>}
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href="/admin"
                  className="text-[11px] font-mono text-fog hover:text-acid underline flex items-center space-x-1"
                >
                  <span>Go to Admin Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-acid text-acid-ink hover:bg-acid-hot text-xs font-mono font-bold"
                >
                  Unlock &amp; Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
