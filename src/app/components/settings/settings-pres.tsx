'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { editClub } from '@/lib/api'
import { useClub } from '@/hooks/use-club'
import { Button } from '@/components/ui/button'
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

const clubFormSchema = z.object({
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

export type ClubFormValues = z.infer<typeof clubFormSchema>

export default function SettingsPres() {
  const { setMyClubs, activeClub, setActiveClub } = useClub()
  const club = activeClub!

  const [processing, setProcessing] = useState<boolean>(false)

  const defaultValues: Partial<ClubFormValues> = {
    clubName: club.clubName || '',
    activitySpace: club.activitySpace || '',
    contactInfo: club.contactInfo || '',
    description: club.description || '',
  }

  const form = useForm<ClubFormValues>({
    resolver: zodResolver(clubFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const onSubmit = (values: ClubFormValues) => {
    setProcessing(true)
    editClub(club.clubId, values)
      .then((res) => {
        if (res.code === 1) {
          setMyClubs((prev) =>
            prev.map((c) =>
              c.clubId === club.clubId ? { ...c, ...values } : c
            )
          )
          setActiveClub((prev) =>
            prev?.clubId === club.clubId ? { ...prev, ...values } : prev
          )
          toast.success('Upate club successfully.')
        } else {
          toast.warning('Update club failed.')
        }
        setProcessing(false)
      })
      .catch((err) => {
        toast.error('Something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessing(false))
  }

  useEffect(() => {
    form.reset(defaultValues)
  }, [club])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-2.5">
        <FormField
          control={form.control}
          name="clubName"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-accent-foreground">
                Club name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Club's name"
                  className="w-96 text-base"
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
            <FormItem className="space-y-1">
              <FormLabel className="text-accent-foreground">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's the club about?"
                  className="h-24 resize-none text-base"
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
            <FormItem className="space-y-1">
              <FormLabel className="text-accent-foreground">
                Contact info
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Club's email address"
                  className="w-96 text-base"
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
            <FormItem className="space-y-1">
              <FormLabel className="text-accent-foreground">
                Activity space
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Usual meeting spot"
                  className="w-96 text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={processing} className="!mt-6">
          {processing && <ReloadIcon className="mr-1 size-4 animate-spin" />}
          Update Club
        </Button>
      </form>
    </Form>
  )
}
