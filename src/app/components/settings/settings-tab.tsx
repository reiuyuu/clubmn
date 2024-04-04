'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useClub } from '@/hooks/use-club'
import SettingsPres from './settings-pres'
import SettingsUser from './settings-user'

export default function SettingsTab() {
  const { activeClub, loading } = useClub()

  return (
    <div className="max-w-[75%]">
      <p className="text-muted-foreground text-base leading-tight">
        Manage your club settings.
      </p>

      {loading ? (
        <Skeleton className="my-4 h-[calc(100vh-384px)] w-full" />
      ) : activeClub ? (
        activeClub.position === 'president' ? (
          <SettingsPres />
        ) : (
          <SettingsUser />
        )
      ) : (
        <p className="my-4 text-lg">No club yet. go explore and join one!</p>
      )}
    </div>
  )
}
