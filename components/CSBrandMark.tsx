import React from 'react'

interface CSBrandMarkProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function CSBrandMark({ className = 'w-9 h-9' }: CSBrandMarkProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-lg bg-ink-800 text-paper border border-white/15 select-none transition-colors group-hover:border-white/30 ${className}`}
    >
      {/* Monochrome Editorial CS Athletic Crest SVG */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[74%] h-[74%] text-paper"
      >
        {/* Shield Contour */}
        <path
          d="M20 4L7 9.5V20C7 28 12.8 34.5 20 36.5C27.2 34.5 33 28 33 20V9.5L20 4Z"
          fill="white"
          fillOpacity="0.06"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Athletic Interlocking 'C' & 'S' Monogram */}
        {/* C letterform */}
        <path
          d="M17 14.5H13.5C11.57 14.5 10 16.07 10 18V21.5C10 23.43 11.57 25 13.5 25H17"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* S letterform */}
        <path
          d="M23 15.2C24.2 14.7 25.5 14.5 26.5 14.5H27C28.66 14.5 30 15.84 30 17.5C30 19.16 28.66 20.5 27 20.5H23C21.34 20.5 20 21.84 20 23.5C20 25.16 21.34 26.5 23 26.5H27.5C28.8 26.5 29.8 26.1 30 25.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Championship Top Star */}
        <path
          d="M20 8.5L21.2 11H23.8L21.7 12.6L22.5 15.1L20 13.5L17.5 15.1L18.3 12.6L16.2 11H18.8L20 8.5Z"
          fill="#D7F22B"
          stroke="#D7F22B"
          strokeWidth="0.4"
        />
      </svg>
    </div>
  )
}
