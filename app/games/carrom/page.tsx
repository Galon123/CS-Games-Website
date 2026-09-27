import React from 'react'
import type { Metadata } from 'next'
import CarromView from '@/components/CarromView'

export const metadata: Metadata = {
  title: 'Carrom | CS Games 2026',
  description: 'Carrom tournament brackets and results.',
}

export default function CarromGamePage() {
  return <CarromView />
}
