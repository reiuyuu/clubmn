'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { newClub } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon, ReloadIcon } from '@radix-ui/react-icons'

const newClubFormSchema = z.object({
  clubName: z
    .string()
    .min(1, {
      message: 'Club name must be at least 1 characters.',
    })
    .max(50, {
      message: 'Club name must not be longer than 50 characters.',
    }),
  description: z
    .string()
    .min(1, {
      message: 'Description must be at least 1 characters.',
    })
    .max(300, {
      message: 'Description must not be longer than 300 characters.',
    }),
  contactInfo: z.string().email({
    message: 'Contact info must be a valid email address.',
  }),
  activitySpace: z
    .string()
    .min(1, {
      message: 'Activity space must be at least 1 characters.',
    })
    .max(100, {
      message: 'Activity space must not be longer than 100 characters.',
    }),
})

export type NewClubFormValues = z.infer<typeof newClubFormSchema>

export default function NewClubForm() {
  const [open, setOpen] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)

  const defaultValues: Partial<NewClubFormValues> = {
    clubName: '',
    description: '',
    contactInfo: '',
    activitySpace: '',
  }

  const form = useForm<NewClubFormValues>({
    resolver: zodResolver(newClubFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const onSubmit = (values: NewClubFormValues) => {
    setProcessing(true)
    newClub(values)
      .then((res) => {
        if (res.code === 1) {
          toast.success('Club application submitted successfully.')
          form.reset(defaultValues)
        } else {
          toast.warning('Club application sumbit failed.')
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
          Start New Club
        </Button>
      </DialogTrigger>
      <DialogContent className="p-5 sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1.5">
            <DialogHeader className="space-y-1">
              <DialogTitle>Start new club</DialogTitle>
              <DialogDescription>
                Fill in the details to start a new club.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="clubName"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Cub name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g., 'Coding Crusaders'"
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
                      placeholder="What's the club about?"
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
              name="contactInfo"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Contact info</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="How to reach us"
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
              name="activitySpace"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Activity space</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Usual meeting spot"
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
                Apply
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
