import { Dispatch, SetStateAction, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { joinActivity } from '@/lib/api'
import { Activity, MyActivity } from '@/types/activity'

import { CalendarIcon, SewingPinIcon } from '@radix-ui/react-icons'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'

interface ActivityUserClubCardProps {
  activity: Activity
  setMyActivities: Dispatch<SetStateAction<MyActivity[]>>
}

export default function ActivityUserClubCard({
  activity,
  setMyActivities,
}: ActivityUserClubCardProps) {
  const [processing, setProcessing] = useState<boolean>(false)

  const handleJoin = () => {
    setProcessing(true)
    joinActivity(activity.activityId)
      .then((res) =>
        res.code === 1
          ? setMyActivities((prev) => [
              ...prev,
              { ...activity, signed: false, paid: false },
            ])
          : toast.warning('Join failed.')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessing(false))
  }

  return (
    <Card className="flex flex-col justify-between space-y-2 px-6 py-4">
      <CardHeader className="space-y-0.5 p-0">
        <CardTitle className="truncate text-lg font-medium">
          {activity.theme}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {activity.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-end justify-between space-x-2 p-0">
        <div className="max-w-[calc(90%-40px)]">
          <div className="inline-flex items-center whitespace-nowrap">
            <CalendarIcon className="mr-2 size-4" />
            {format(parseISO(activity.startTime), 'LLL dd, y')} -{' '}
            {format(parseISO(activity.startTime), 'LLL dd, y')}
          </div>
          <div className="inline-flex w-full items-center">
            <SewingPinIcon className="mr-2 inline size-4 flex-none" />
            <span className="line-clamp-1">{activity.location}</span>
            <span className="px-3">·</span>
            <span className="line-clamp-1">{activity.amount} $</span>
          </div>
        </div>
        <Button
          disabled={processing}
          onClick={handleJoin}
          variant="secondary"
          size="sm"
          className="h-8 w-16"
        >
          Join
        </Button>
      </CardContent>
    </Card>
  )
}
