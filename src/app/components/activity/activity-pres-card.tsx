import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CalendarIcon,
  CircleIcon,
  ReloadIcon,
  SewingPinIcon,
} from '@radix-ui/react-icons'
import { format, parseISO } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Activity, ActivityParticipation } from '@/types/activity'
import {
  editActivitySummary,
  getActivityParticipation,
  getActivitySummary,
  postActivitySummary,
} from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'

const summaryFormSchema = z.object({
  info: z
    .string()
    .min(1, {
      message: 'Summary must be at least 1 characters.',
    })
    .max(300, {
      message: 'Summary must be at most 300 characters.',
    }),
})

export type SummaryFormValues = z.infer<typeof summaryFormSchema>

interface ActivityPresCardProps {
  activity: Activity
}

export default function ActivityPresCard({ activity }: ActivityPresCardProps) {
  const [participations, setParticipations] = useState<ActivityParticipation[]>(
    []
  )
  const [summary, setSummary] = useState<string | null>(null)
  const [editing, setEditing] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)

  const defaultValues: Partial<SummaryFormValues> = {
    info: summary ?? '',
  }

  const form = useForm<z.infer<typeof summaryFormSchema>>({
    resolver: zodResolver(summaryFormSchema),
    defaultValues,
  })

  const onSubmit = (values: SummaryFormValues) => {
    setProcessing(true)
    editing
      ? editActivitySummary(activity.activityId, values)
          .then((res) => {
            if (res.code === 1) {
              setSummary(values.info)
              setEditing(false)
            } else {
              toast.warning('Edit summary failed.')
            }
          })
          .catch((err) => {
            toast.error('something went wrong...')
            console.log(err)
          })
          .finally(() => {
            setProcessing(false)
          })
      : postActivitySummary(activity.activityId, values)
          .then((res) =>
            res.code === 1
              ? setSummary(values.info)
              : toast.warning('Post summary failed.')
          )
          .catch((err) => {
            toast.error('something went wrong...')
            console.log(err)
          })
          .finally(() => setProcessing(false))
  }

  useEffect(() => {
    getActivityParticipation(activity.activityId)
      .then((res) =>
        res.code === 1
          ? setParticipations(res.data)
          : toast.warning('Fetch participations failed.')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })

    getActivitySummary(activity.activityId)
      .then((res) => (res.code === 1 ? setSummary(res.data) : setSummary(null)))
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
  }, [activity.activityId])

  useEffect(() => {
    form.reset(defaultValues)
  }, [summary])

  return (
    <Card className="max-h-80 min-w-[512px] px-6 py-4">
      <CardHeader className="p-0">
        <CardTitle className="truncate text-lg font-medium">
          {activity.theme}
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-0.5 flex p-0">
        <div className="flex flex-[2] flex-col justify-between space-y-1">
          <div className="flex flex-col">
            <CardDescription className="mb-1 line-clamp-3 max-w-[90%]">
              {activity.description}
            </CardDescription>
            <div className="inline-flex max-w-[90%] items-center whitespace-nowrap">
              <CalendarIcon className="mr-2 size-4" />
              {format(parseISO(activity.startTime), 'LLL dd, y')} -{' '}
              {format(parseISO(activity.startTime), 'LLL dd, y')}
            </div>
            <div className="mt-0.5 inline-flex max-w-[90%] items-center">
              <SewingPinIcon className="mr-2 inline size-4 flex-none" />
              <span className="line-clamp-1 max-w-[calc(50%-16px)]">
                {activity.location}
              </span>
              <span className="px-3">·</span>
              <span className="line-clamp-1 max-w-[calc(50%-28px)]">
                {activity.amount} $
              </span>
            </div>
          </div>

          {summary === null || editing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-[85%] items-end justify-between space-x-3 pb-2"
              >
                <FormField
                  control={form.control}
                  name="info"
                  render={({ field }) => (
                    <FormItem className="flex-1 space-y-1">
                      <FormLabel>summary</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write a summary..."
                          className="min-h-20 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute" />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col space-y-1.5">
                  <Button
                    disabled={processing}
                    onClick={() => setEditing(false)}
                    variant="secondary"
                    size="sm"
                    className="h-8 w-[72px]"
                  >
                    Cancle
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing}
                    variant="default"
                    size="sm"
                    className="h-8 w-[72px]"
                  >
                    {processing && (
                      <ReloadIcon className="mr-1 size-4 animate-spin" />
                    )}
                    Post
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="flex w-[85%] flex-1 items-start justify-between space-x-3 pb-2">
              <div className="space-y-1.5">
                <div className="pt-1.5 text-sm font-medium leading-none">
                  summary
                </div>
                <div className="text-muted-foreground line-clamp-4 text-sm">
                  {summary}
                </div>
              </div>
              <Button
                onClick={() => setEditing(true)}
                variant="default"
                size="sm"
                className="h-8 w-[72px] self-end"
              >
                Edit
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="text-sm font-medium">Participations</div>
          {participations.length > 0 ? (
            <ScrollArea className="mt-1.5">
              <div className="space-y-2.5 pr-4">
                {participations.map((p) => (
                  <div
                    key={p.participationId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex max-w-[calc(95%-60px)] flex-col space-y-1">
                      <span className="truncate text-base leading-none">
                        {p.username}
                      </span>
                      <span className="text-muted-foreground truncate text-sm leading-none">
                        {p.email}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex flex-col space-y-1 text-sm leading-none">
                      <div className="inline-flex items-center">
                        <CircleIcon
                          className={cn(
                            'mr-1 size-3',
                            p.signed
                              ? 'fill-emerald-400 text-emerald-400'
                              : 'fill-rose-400 text-rose-400'
                          )}
                        />
                        signed
                      </div>
                      <div className="inline-flex items-center">
                        <CircleIcon
                          className={cn(
                            'mr-1 size-3',
                            p.paid
                              ? 'fill-sky-400 text-sky-400'
                              : 'fill-rose-400 text-rose-400'
                          )}
                        />
                        paid
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-muted-foreground mt-2">
              No one has participated yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
