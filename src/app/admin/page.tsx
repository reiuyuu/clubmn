'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { ClubApplication } from '@/types/club'
import { adminLogout, getAllNewClubs } from '@/lib/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

import NewClubCard from './newClubCard'

export default function AdminHome() {
  const router = useRouter()

  const [adminInfo, setAdminInfo] = useState({
    adminId: null,
    username: '',
    email: '',
  })
  const [newClubs, setNewClubs] = useState<ClubApplication[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const handleLogout = () => {
    adminLogout()
      .then()
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => {
        localStorage.removeItem('admin')
        router.push('/admin/login')
      })
  }

  useEffect(() => {
    setLoading(true)

    const userStr = localStorage.getItem('user')
    const adminStr = localStorage.getItem('admin')
    if (adminStr) {
      const admin = JSON.parse(adminStr)
      setAdminInfo(admin)
    } else if (userStr) {
      router.replace('/')
    } else {
      router.replace('/admin/login')
    }

    getAllNewClubs()
      .then((res) => {
        if (res.code === 1) {
          setNewClubs(res.data.filter((club) => club.status === 'apply'))
        } else {
          localStorage.removeItem('admin')
          router.replace('/admin/login')
          toast.warning('login expired, please login again.')
        }
      })
      .catch((err) => {
        localStorage.removeItem('admin')
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setLoading(false))
  }, [router])

  return (
    <>
      <header className="mt-6 flex w-full max-w-5xl justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative size-8 rounded-full">
              <Avatar className="size-8">
                <AvatarImage
                  src="/placeholder-user.jpg"
                  alt={adminInfo.username}
                />
                <AvatarFallback>{adminInfo.username}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {adminInfo.username}
                </p>
                <p className="text-muted-foreground text-xs leading-none">
                  {adminInfo.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="my-3 flex w-full max-w-5xl flex-1 flex-col items-stretch space-y-4">
        <div className="flex items-center justify-center whitespace-nowrap py-7 text-3xl font-semibold leading-tight">
          {loading ? (
            <Skeleton className="h-[37.5px] w-2/5 rounded-md" />
          ) : (
            'Welcome back! admin'
          )}
        </div>

        <p className="text-muted-foreground text-base leading-tight">
          Review club applications.
        </p>

        {loading ? (
          <Skeleton className="h-[calc(100vh-320px)] w-full" />
        ) : newClubs.length === 0 ? (
          <p className="text-lg">No more new club applications yet.</p>
        ) : (
          <div className="flex flex-col space-y-5">
            {newClubs.map((club) => (
              <NewClubCard
                key={club.applicationId}
                club={club}
                setNewClubs={setNewClubs}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
