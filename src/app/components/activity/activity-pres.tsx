import { useEffect, useState } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { useClub } from '@/hooks/use-club'
import { getClubActivities } from '@/lib/api'
import { Activity } from '@/types/activity'

import { toast } from 'sonner'

import ActivityPresCard from './activity-pres-card'
import NewActivityForm from './new-activity-form'

export default function ActivityPres() {
  const { activeClub } = useClub()
  const club = activeClub!

  const [clubActivities, setClubActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const onNewActivity = () => {
    getClubActivities(club.clubId)
      .then((res) =>
        res.code === 1
          ? setClubActivities(res.data)
          : toast.warning('Fetch activities failed.')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
  }

  useEffect(() => {
    setLoading(true)
    getClubActivities(club.clubId)
      .then((res) =>
        res.code === 1
          ? setClubActivities(res.data)
          : toast.warning('Fetch activities failed.')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setLoading(false))
  }, [club.clubId])

  return (
    <>
      <div className="flex justify-between">
        <p className="text-muted-foreground text-base leading-tight">
          Manage or create your club activities.
        </p>
        <NewActivityForm clubId={club.clubId} onNewActivity={onNewActivity} />
      </div>

      {loading ? (
        <Skeleton className="h- my-4 h-[calc(100vh-420px)] w-full" />
      ) : (
        <div className="mb-4 mt-2 space-y-4">
          {clubActivities.map((activity) => (
            <ActivityPresCard key={activity.activityId} activity={activity} />
          ))}
        </div>
      )}
    </>
  )
}
