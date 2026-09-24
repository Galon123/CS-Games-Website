import React from 'react'
import type { Metadata } from 'next'
import CsCupView from '@/components/CsCupView'

export const metadata: Metadata = {
  title: 'The CS Cup (Football) | CS Games 2026',
  description:
    'The premier 6v6 football championship on regulation turf with interactive tactical pitch tracking, live score telemetry, and squad lineups.',
}

export default function FootballGamePage() {
  return <CsCupView />
}
