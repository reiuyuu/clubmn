'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Skeleton } from '@/components/ui/skeleton'
import { getClubs } from '@/lib/api'
import { Club, PositionEnum } from '@/types/club'

import ClubCard from './club-card'
import NewClubForm from './new-club-form'

export default function ExporeTab() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    getClubs()
      .then((res) =>
        res.code === 1
          ? setClubs(
              res.data.filter(
                (club) =>
                  club.position === PositionEnum.applyJoin ||
                  club.position === null
              )
            )
          : toast.warning('Fetch clubs failed.')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="flex justify-between">
        <p className="text-muted-foreground text-base leading-tight">
          Explore or apply for new clubs.
        </p>
        <NewClubForm />
      </div>

      {loading ? (
        <Skeleton className="my-4 h-[calc(100vh-420px)] w-full" />
      ) : clubs.length === 0 ? (
        <p className="my-4 text-lg">No more clubs to join, create one!</p>
      ) : (
        <div className="mb-4 mt-2 grid grid-cols-1 gap-5 md:grid-cols-2">
          {clubs.map((club) => (
            <ClubCard key={club.clubId} club={club} setClubs={setClubs} />
          ))}
        </div>
      )}
    </>
  )
}
