import { useEffect, useState } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { useClub } from '@/hooks/use-club'
import { getClubActivities, getMyActivities } from '@/lib/api'
import { Activity, MyActivity } from '@/types/activity'

import { toast } from 'sonner'

import ActivityUserClubCard from './activity-user-club-card'
import ActivityUserMyCard from './activity-user-my-card'

export default function ActivityUser() {
  const { activeClub } = useClub()
  const club = activeClub!

  const [myActivities, setMyActivities] = useState<MyActivity[]>([])
  const [clubActivities, setClubActivities] = useState<Activity[]>([])
  const [loadingMyActivities, setLoadingMyActivities] = useState<boolean>(true)
  const [loadingClubActivities, setLoadingClubActivities] =
    useState<boolean>(true)

  useEffect(() => {
    setLoadingMyActivities(true)
    setLoadingClubActivities(true)

    getMyActivities(club.clubId)
      .then((res) =>
        res.code === 1
          ? setMyActivities(res.data)
          : toast.warning('Fetch my activities failed.')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setLoadingMyActivities(false))

    getClubActivities(club.clubId)
      .then((res) =>
        res.code === 1
          ? setClubActivities(res.data)
          : toast.warning('Fetch club activities failed.')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setLoadingClubActivities(false))
  }, [club.clubId])

  useEffect(() => {
    const unJoinedActivities = clubActivities.filter(
      (ca) => !myActivities.some((ma) => ma.activityId === ca.activityId)
    )

    setClubActivities(unJoinedActivities)
  }, [myActivities])

  return (
    <>
      <div className="w-full">
        <p className="text-muted-foreground text-base leading-tight">
          View or expore your club activities.
        </p>
      </div>

      <h2 className="mt-6 text-xl font-medium leading-none">My Activities</h2>
      {loadingMyActivities ? (
        <Skeleton className="my-4 h-[calc(50vh-256px)] w-full" />
      ) : (
        <div className="my-3 grid grid-cols-1 gap-5 md:grid-cols-2">
          {myActivities.map((activity) => (
            <ActivityUserMyCard
              key={activity.activityId}
              activity={activity}
              setMyActivities={setMyActivities}
            />
          ))}
        </div>
      )}

      <h2 className="mt-6 text-xl font-medium leading-none">Club Activities</h2>
      {loadingClubActivities ? (
        <Skeleton className="my-4 h-[calc(50vh-256px)] w-full" />
      ) : (
        <div className="my-3 grid grid-cols-1 gap-5 md:grid-cols-2">
          {clubActivities.map((activity) => (
            <ActivityUserClubCard
              key={activity.activityId}
              activity={activity}
              setMyActivities={setMyActivities}
            />
          ))}
        </div>
      )}
    </>
  )
}
