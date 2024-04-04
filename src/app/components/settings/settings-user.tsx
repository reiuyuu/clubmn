'use client'

import { useState } from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'

import { quitClub } from '@/lib/api'
import { useClub } from '@/hooks/use-club'
import { Button } from '@/components/ui/button'

export default function SettingsUser() {
  const { myClubs, setMyClubs, activeClub, setActiveClub } = useClub()
  const club = activeClub!

  const [processing, setProcessing] = useState<boolean>(false)

  const handleQuitClub = (clubId: number) => {
    setProcessing(true)
    quitClub(clubId)
      .then((res) => {
        if (res.code === 1) {
          setMyClubs(
            myClubs.map((c) =>
              c.clubId === clubId ? { ...c, position: 'applyQuit' } : c
            )
          )
          setActiveClub((prev) =>
            prev && prev.clubId === clubId
              ? { ...prev, position: 'applyQuit' }
              : prev
          )
        } else {
          toast.warning('Quit club failed.')
        }
      })
      .catch((err) => {
        toast.error('Something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessing(false))
  }

  return (
    <>
      <div className="my-4 flex flex-col space-y-2">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Club name</span>
          <span className="text-base">{club.clubName}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Description</span>
          <span className="text-base">{club.description}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Contact info</span>
          <span className="text-base">{club.contactInfo}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Activity space</span>
          <span className="text-base">{club.activitySpace}</span>
        </div>
      </div>

      <Button
        variant="destructive"
        onClick={() => handleQuitClub(club.clubId)}
        disabled={processing || club.position === 'applyQuit'}
      >
        {processing && <ReloadIcon className="mr-1 size-4 animate-spin" />}
        {club.position !== 'applyQuit' ? 'Quit club' : 'Leave request pending'}
      </Button>
    </>
  )
}
