'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useClub } from '@/hooks/use-club'

import MemberPres from './member-pres'
import MemberUser from './member-user'

export default function MemberTab() {
  const { activeClub, loading } = useClub()

  return (
    <div className="w-full">
      <p className="text-muted-foreground text-base leading-tight">
        {activeClub?.position === 'president'
          ? 'Manage your club members.'
          : 'Check your club members.'}
      </p>
      {loading ? (
        <Skeleton className="my-4 h-[calc(100vh-384px)] w-full" />
      ) : activeClub ? (
        activeClub.position === 'president' ? (
          <MemberPres />
        ) : (
          <MemberUser />
        )
      ) : (
        <p className="my-4 text-lg">No club yet. go explore and join one!</p>
      )}
    </div>
  )
}
