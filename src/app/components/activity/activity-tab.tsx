'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useClub } from '@/hooks/use-club'

import ActivityPres from './activity-pres'
import ActivityUser from './activity-user'

export default function ActivityTab() {
  const { activeClub, loading } = useClub()

  return (
    <>
      {loading ? (
        <Skeleton className="my-4 h-[calc(100vh-384px)] w-full" />
      ) : activeClub ? (
        activeClub.position === 'president' ? (
          <ActivityPres />
        ) : (
          <ActivityUser />
        )
      ) : (
        <p className="my-4 text-lg">No club yet. go explore and join one!</p>
      )}
    </>
  )
}
