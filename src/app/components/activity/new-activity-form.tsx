import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, PlusIcon, ReloadIcon } from '@radix-ui/react-icons'
import { addDays, format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { newActivity } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'

const newActivityFormSchema = z.object({
  theme: z
    .string()
    .min(1, {
      message: 'Theme must be at least 1 characters.',
    })
    .max(50, {
      message: 'Theme must not be longer than 50 characters.',
    }),
  description: z
    .string()
    .min(1, {
      message: 'Description must be at least 1 characters.',
    })
    .max(200, {
      message: 'Description must not be longer than 200 characters.',
    }),
  date: z.object({
    from: z.date({
      required_error: 'Please select a start date.',
    }),
    to: z.date({
      required_error: 'Please select an end date.',
    }),
  }),
  location: z
    .string()
    .min(1, {
      message: 'Location must be at least 1 characters.',
    })
    .max(50, {
      message: 'Location must not be longer than 50 characters.',
    }),
  amount: z.string(),
})

export type NewActivityFormValues = z.infer<typeof newActivityFormSchema>

interface NewActivityFormProps {
  clubId: number
  onNewActivity: () => void
}

export default function NewActivityForm({
  clubId,
  onNewActivity,
}: NewActivityFormProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)

  const defaultValues: Partial<NewActivityFormValues> = {
    theme: '',
    description: '',
    date: {
      from: new Date(),
      to: addDays(new Date(), 2),
    },
    location: '',
    amount: undefined,
  }

  const form = useForm<NewActivityFormValues>({
    resolver: zodResolver(newActivityFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const onSubmit = (values: NewActivityFormValues) => {
    setProcessing(true)
    newActivity(clubId, values)
      .then((res) => {
        if (res.code === 1) {
          toast.success('Activity created successfully.')
          form.reset(defaultValues)
          onNewActivity()
        } else {
          toast.warning('Activity creation failed.')
        }
      })
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => {
        setProcessing(false)
        setOpen(false)
      })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PlusIcon className="mr-2 size-4" />
          Post New Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="p-5 sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1.5">
            <DialogHeader className="space-y-1">
              <DialogTitle>Post new activity</DialogTitle>
              <DialogDescription>
                Fill in the details to post a new activity.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Theme</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g., 'Retro Game Marathon'"
                      className="h-8 px-2 py-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's this about?"
                      className="min-h-16 resize-none px-2 py-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Date range</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        size="sm"
                        variant="outline"
                        className={cn(
                          'flex h-9 w-60 justify-start px-2 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, 'LLL dd, y')} -{' '}
                              {format(field.value.to, 'LLL dd, y')}
                            </>
                          ) : (
                            format(field.value.from, 'LLL dd, y')
                          )
                        ) : (
                          <span>When does it run?</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Where we'll meet"
                      className="h-8 px-2 py-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Fee</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Fee in dollars"
                      className="h-8 px-2 py-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="!mt-3">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={processing}
                size="sm"
                className="h-8"
              >
                {processing && (
                  <ReloadIcon className="mr-1 size-4 animate-spin" />
                )}
                Post
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
