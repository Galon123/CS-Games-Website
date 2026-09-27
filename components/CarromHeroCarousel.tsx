'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const CAROUSEL_IMAGES = [
  {
    id: 'carrom-1',
    url: '/posters/carroms.png',
    alt: 'Carrom Tournament 2026',
    title: 'CARROM SHOWDOWN',
    description: 'Precision, Angles, and Strikes.',
  },
]

export default function CarromHeroCarousel() {
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
            className="object-cover object-top"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
}
