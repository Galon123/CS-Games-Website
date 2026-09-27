import React from 'react'
import type { Metadata } from 'next'
import EsportsView from '@/components/EsportsView'

export const metadata: Metadata = {
  title: 'Esports | CS Games 2026',
  description: 'Esports tournament registrations and details.',
}

export default function EsportsGamePage() {
  return <EsportsView />
}
