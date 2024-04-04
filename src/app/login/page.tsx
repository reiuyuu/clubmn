'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRightIcon, ReloadIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { login } from '@/lib/api'
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

const loginFormSchema = z.object({
  username: z.string().min(1, {
    message: 'Please enter your username.',
  }),
  password: z.string().min(1, {
    message: 'Please enter your password.',
  }),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export default function Login() {
  const router = useRouter()

  const [processing, setProcessing] = useState<boolean>(false)

  const defaultValues: Partial<LoginFormValues> = {
    username: '',
    password: '',
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const onSubmit = (values: LoginFormValues) => {
    setProcessing(true)
    login(values.username, values.password)
      .then((res) => {
        if (res.code === 1) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              userId: res.data.userId,
              username: res.data.username,
              email: res.data.email,
            })
          )
          router.push('/')
        } else {
          toast.warning('login failed, check your username and password.')
        }
      })
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessing(false))
  }

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    const adminStr = localStorage.getItem('admin')

    userStr ? router.replace('/') : adminStr && router.replace('/admin')
  }, [])

  return (
    <main className="flex w-full max-w-5xl flex-1 flex-col items-center justify-center">
      <div className="whitespace-nowrap py-4 text-2xl font-semibold leading-none">
        Log in to Explore Club Events
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-72 space-y-3 py-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>username</FormLabel>
                <FormControl>
                  <Input id="username" placeholder="Your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    placeholder="Your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!form.formState.isValid || processing}
            size="sm"
            className="!mt-6 w-full"
          >
            {processing && <ReloadIcon className="mr-1 size-4 animate-spin" />}
            Login
          </Button>
        </form>
      </Form>

      <Button variant="link" size="sm" className="text-muted-foreground">
        <Link href="/admin/login">Log in as admin</Link>
        <ArrowRightIcon className="ml-1 size-4" />
      </Button>
    </main>
  )
}
