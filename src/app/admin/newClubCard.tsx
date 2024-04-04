'use client'

import { useState } from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'

import { ClubApplication } from '@/types/club'
import { agreeClub, rejectClub } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface NewClubCardProps {
  club: ClubApplication
  setNewClubs: React.Dispatch<React.SetStateAction<ClubApplication[]>>
}

export default function NewClubCard({ club, setNewClubs }: NewClubCardProps) {
  const [processing, setProcessing] = useState<boolean>(false)

  const handleApproveClub = (clubApplicationId: number) => {
    setProcessing(true)
    agreeClub(clubApplicationId)
      .then((res) =>
        res.code === 1
          ? setNewClubs((prev) =>
              prev.filter((c) => c.applicationId !== clubApplicationId)
            )
          : toast.warning(`Approve ${club.clubName} failed.`)
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessing(false))
  }

  const handleRejectClub = (clubApplicationId: number) => {
    setProcessing(true)
    rejectClub(clubApplicationId)
      .then((res) =>
        res.code === 1
          ? setNewClubs((prev) =>
              prev.filter((c) => c.applicationId !== clubApplicationId)
            )
          : toast.warning(`Reject ${club.clubName} failed.`)
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessing(false))
  }

  return (
    <Card className="flex w-full justify-between space-x-4 px-6 py-4">
      <div className="max-w-[calc(90%-88px)] space-y-2">
        <CardHeader className="space-y-0.5 p-0">
          <CardTitle className="truncate text-lg font-medium">
            {club.clubName}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {club.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-end space-x-2 p-0 text-base leading-none">
          <span className="">{club.presidentName}</span>
          <span className="">{club.contactInfo}</span>
          <span>-</span>
          <span className="">{club.activitySpace}</span>
        </CardContent>
      </div>
      <div className="flex flex-col space-y-1.5 self-end">
        <Button
          disabled={processing}
          onClick={() => handleApproveClub(club.applicationId)}
          size="sm"
          className="h-8 w-[88px] px-1"
        >
          {processing && <ReloadIcon className="mr-1 size-4 animate-spin" />}
          Approve
        </Button>
        <Button
          disabled={processing}
          onClick={() => handleRejectClub(club.applicationId)}
          variant="destructive"
          size="sm"
          className="h-8 w-[88px] px-1"
        >
          {processing && <ReloadIcon className="mr-1 size-4 animate-spin" />}
          Reject
        </Button>
      </div>
    </Card>
  )
}
