import React from 'react'
import type { Metadata } from 'next'
import ChessView from '@/components/ChessView'

export const metadata: Metadata = {
  title: 'Chess Masters 1v1 | CS Games 2026',
  description:
    'Departmental strategic chess championship in Seminar Hall A. FIDE Rapid time controls, Swiss system standings, and master player dossiers.',
}

export default function ChessGamePage() {
  return <ChessView />
}
