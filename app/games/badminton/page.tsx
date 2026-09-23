import React from 'react'
import type { Metadata } from 'next'
import GameDetailView from '@/components/GameDetailView'

export const metadata: Metadata = {
  title: 'Badminton Doubles Championship | CS Games 2026',
  description:
    'Indoor doubles rally championship at Indoor Badminton Arena. 21-point knockout brackets, live fixtures, and squad standings.',
}

export default function BadmintonGamePage() {
  return <GameDetailView sportSlug="badminton" />
}

