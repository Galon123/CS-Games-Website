import React from 'react'
import type { Metadata } from 'next'
import TacticalBoard from '@/components/TacticalBoard'

export const metadata: Metadata = {
  title: 'Formations Studio | CS Games 2026',
  description: 'Interactive 6v6 football pitch formations, squad lineups, and live positions for the CS Cup championship.',
}

export default function TacticsPage() {
  return (
    <div className="py-2">
      <TacticalBoard />
    </div>
  )
}
