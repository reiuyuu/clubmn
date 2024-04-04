import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getActivitySummary, payActivity, signActivity } from '@/lib/api'
import { MyActivity } from '@/types/activity'

import { CalendarIcon, SewingPinIcon } from '@radix-ui/react-icons'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'

interface ActivityUserMyCardProps {
  activity: MyActivity
  setMyActivities: Dispatch<SetStateAction<MyActivity[]>>
}

export default function ActivityUserMyCard({
  activity,
  setMyActivities,
}: ActivityUserMyCardProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [processingSign, setProcessingSign] = useState<boolean>(false)
  const [processingPay, setProcessingPay] = useState<boolean>(false)

  const handleSign = () => {
    setProcessingSign(true)
    signActivity(activity.activityId)
      .then((res) =>
        res.code === 1
          ? setMyActivities((prev) =>
              prev.map((a) =>
                a.activityId === activity.activityId
                  ? { ...a, signed: true }
                  : a
              )
            )
          : toast.warning('Sign failed.')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessingSign(false))
  }

  const handlePay = () => {
    setProcessingPay(true)
    payActivity(activity.activityId)
      .then((res) =>
        res.code === 1
          ? setMyActivities((prev) =>
              prev.map((a) =>
                a.activityId === activity.activityId ? { ...a, paid: true } : a
              )
            )
          : toast.warning('Pay failed.')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessingPay(false))
  }

  useEffect(() => {
    getActivitySummary(activity.activityId)
      .then((res) => (res.code === 1 ? setSummary(res.data) : setSummary(null)))
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
  }, [activity.activityId])

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
          <div className="mt-2 space-y-1.5">
            <div className="text-sm font-medium leading-none">summary</div>
            <div className="text-muted-foreground line-clamp-4 text-sm">
              {summary ? summary : 'No summary yet.'}
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <Button
            disabled={activity.signed || processingSign}
            onClick={handleSign}
            variant="secondary"
            size="sm"
            className="h-8 w-16"
          >
            {activity.signed ? 'Signed' : 'Sign'}
          </Button>
          <Button
            disabled={activity.paid || processingPay}
            onClick={handlePay}
            variant="secondary"
            size="sm"
            className="h-8 w-16"
          >
            {activity.paid ? 'Paid' : 'Pay'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
