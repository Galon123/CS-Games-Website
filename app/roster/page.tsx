import React, { Suspense } from 'react'
import TeamRoster from '@/components/TeamRoster'

export default function RosterPage() {
  return (
    <div className="py-2">
      <Suspense fallback={<div className="text-slate-400 text-xs p-8 text-center">Loading Rosters...</div>}>
        <TeamRoster />
      </Suspense>
    </div>
  )
}
