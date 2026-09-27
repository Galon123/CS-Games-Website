def generate_carousel_code(name, image_url):
    return """'use client'

import React, { useState, useEffect } from 'react'

const CAROUSEL_IMAGES = [
  'IMAGE_URL_HERE'
]

export default function NAME_HEREHeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const slides = CAROUSEL_IMAGES

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length, isHovered])

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="NAME_HERE Presentation Showcase"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden bg-ink-900 shadow-card select-none group"
    >
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] overflow-hidden">
        {slides.map((imageUrl, index) => {
          const isActive = index === currentIndex

          return (
            <div
              key={`${imageUrl}-${index}`}
              role="group"
              aria-roledescription="slide"
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={imageUrl}
                  alt="NAME_HERE Showcase"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={`w-full h-full object-cover object-center transition-transform duration-[10000ms] ease-linear ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`}
                />
              </div>
            </div>
          )
        })}

        {slides.length > 1 && (
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="flex items-center space-x-1.5 p-1 rounded-full bg-ink-900/70 backdrop-blur-md border border-white/10">
              {slides.map((_, idx) => {
                const isCurrent = idx === currentIndex
                return (
                  <button
                    key={`pill-${idx}`}
                    role="tab"
                    aria-selected={isCurrent}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                      isCurrent
                        ? 'w-8 bg-acid shadow-[0_0_8px_rgba(215,242,43,0.5)]'
                        : 'w-2.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
""".replace('NAME_HERE', name).replace('IMAGE_URL_HERE', image_url)

with open('components/CarromHeroCarousel.tsx', 'w', encoding='utf-8') as f:
    f.write(generate_carousel_code('Carrom', '/posters/carroms.png'))

with open('components/EsportsHeroCarousel.tsx', 'w', encoding='utf-8') as f:
    f.write(generate_carousel_code('Esports', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=2400&auto=format&fit=crop'))
