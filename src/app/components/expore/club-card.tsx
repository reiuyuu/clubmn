'use client'

import { useState } from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'

import { Club, PositionEnum } from '@/types/club'
import { joinClub } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ClubCardProps {
  club: Club
  setClubs: React.Dispatch<React.SetStateAction<Club[]>>
}

export default function ClubCard({ club, setClubs }: ClubCardProps) {
  const [processing, setProcessing] = useState<boolean>(false)

  const handleJoinClub = (clubId: number) => {
    setProcessing(true)
    joinClub(clubId)
      .then((res) =>
        res.code === 1
          ? setClubs((prev) =>
              prev.map((c) =>
                c.clubId === clubId
                  ? { ...c, position: PositionEnum.applyJoin }
                  : c
              )
            )
          : toast.warning(`Join ${club.clubName} failed.`)
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessing(false))
  }

  return (
    <Card className="flex flex-col justify-between space-y-3 px-6 py-4">
      <CardHeader className="space-y-0.5 p-0">
        <CardTitle className="truncate text-lg font-medium">
          {club.clubName}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {club.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-end justify-between space-x-2 p-0">
        <div className="max-w-[calc(90%-80px)]">
          <p className="truncate text-base leading-none">
            {club.activitySpace}
          </p>
          <p className="mt-2.5 truncate text-sm leading-none">
            {club.contactInfo}
          </p>
        </div>
        <Button
          disabled={club.position === PositionEnum.applyJoin || processing}
          onClick={() => handleJoinClub(club.clubId)}
          size="sm"
          className="h-8 w-20"
        >
          {processing && <ReloadIcon className="mr-1 size-4 animate-spin" />}
          {club.position === PositionEnum.applyJoin ? 'Pending' : 'Join'}
        </Button>
      </CardContent>
    </Card>
  )
}
