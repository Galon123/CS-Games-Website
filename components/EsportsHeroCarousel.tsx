'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const CAROUSEL_IMAGES = [
  {
    id: 'esports-1',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=2400&auto=format&fit=crop',
    alt: 'Esports Arena',
    title: 'ESPORTS CHAMPIONSHIP',
    description: 'Digital Battlegrounds. Real Glory.',
  },
]

export default function EsportsHeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (CAROUSEL_IMAGES.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden bg-ink-950">
      {CAROUSEL_IMAGES.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-ink-950/40 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-transparent z-20" />
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}
