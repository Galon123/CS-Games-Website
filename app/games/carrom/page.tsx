import React from 'react'
import type { Metadata } from 'next'
import GameDetailView from '@/components/GameDetailView'

export const metadata: Metadata = {
  title: 'Carrom Quad 1v1v1v1 | CS Games 2026',
  description:
    '4-Player simultaneous 1v1v1v1 carrom showdown at Student Activity Center. Live board scores, points race, and participant lineups.',
}

export default function CarromGamePage() {
  return <GameDetailView sportSlug="carrom" />
}
