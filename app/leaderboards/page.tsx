import React, { Suspense } from 'react'
import LeaderboardTable from '@/components/LeaderboardTable'

export default function LeaderboardsPage({
  searchParams,
}: {
  searchParams?: { sport?: string }
}) {
  return (
    <div className="py-2">
      <Suspense fallback={<div className="text-muted-gray font-mono p-8 text-center">Loading Leaderboards...</div>}>
        <LeaderboardTable initialSportName={searchParams?.sport} />
      </Suspense>
    </div>
  )
}
