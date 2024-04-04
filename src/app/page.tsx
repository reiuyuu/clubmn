'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { PositionEnum, positions } from '@/types/club'
import { getMyClubs, logout } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useClub } from '@/hooks/use-club'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SettingsTab from '@/app/components/settings/settings-tab'

import ActivityTab from './components/activity/activity-tab'
import ExporeTab from './components/expore/expore-tab'
import MemberTab from './components/member/member-tab'

export default function Home() {
  const router = useRouter()
  const {
    myClubs,
    setMyClubs,
    activeClub,
    setActiveClub,
    loading,
    setLoading,
  } = useClub()

  const [userInfo, setUserInfo] = useState({
    userId: null,
    username: '',
    email: '',
  })
  const [activeTab, setActiveTab] = useState('activity')

  const handleLogout = () => {
    logout()
      .then()
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => {
        localStorage.removeItem('user')
        router.push('/login')
      })
  }

  const tabComponents = [
    { value: 'activity', label: 'Activity', component: <ActivityTab /> },
    { value: 'member', label: 'Member', component: <MemberTab /> },
    { value: 'expore', label: 'Explore', component: <ExporeTab /> },
    { value: 'settings', label: 'Settings', component: <SettingsTab /> },
  ]

  useEffect(() => {
    setLoading(true)

    const userStr = localStorage.getItem('user')
    const adminStr = localStorage.getItem('admin')
    if (userStr) {
      const user = JSON.parse(userStr)
      setUserInfo(user)
    } else if (adminStr) {
      router.replace('/admin')
    } else {
      router.replace('/login')
    }

    getMyClubs()
      .then((res) => {
        if (res.code === 1) {
          const filteredClubs = res.data.filter(
            (club) =>
              club.position !== PositionEnum.alreadyQuit &&
              club.position !== PositionEnum.applyJoin &&
              club.position !== null
          )

          setMyClubs(filteredClubs)
          setActiveClub(
            filteredClubs.length > 0
              ? filteredClubs.find(
                  (club) => club.position === PositionEnum.president
                ) || filteredClubs[0]
              : null
          )

          filteredClubs.length === 0 ? setActiveTab('expore') : null
        } else {
          localStorage.removeItem('user')
          router.replace('/login')
          toast.warning('login expired, please login again.')
        }
      })
      .catch((err) => {
        localStorage.removeItem('user')
        router.replace('/login')
        toast.error('something went wrong... try login again.')
        console.log(err)
      })
      .finally(() => setLoading(false))
  }, [router])

  return (
    <>
      <header className="mt-6 flex w-full max-w-5xl items-center justify-between">
        <Select
          value={activeClub ? activeClub.clubId.toString() : ''}
          onValueChange={(value) =>
            setActiveClub(
              myClubs.find((club) => club.clubId === +value) ?? null
            )
          }
        >
          <SelectTrigger
            className={cn(
              'flex w-48 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:size-4 [&_svg]:shrink-0'
            )}
            aria-label="Select club"
            disabled={loading || myClubs.length === 0}
          >
            <SelectValue placeholder="Select a club">
              <span className={cn('ml-2')}>
                {myClubs.length > 0
                  ? myClubs.find((club) => club.clubId === activeClub?.clubId)
                      ?.clubName
                  : 'No club'}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {myClubs.some(
              (club) => club.position === PositionEnum.president
            ) && (
              <SelectGroup>
                <SelectLabel className="text-muted-foreground pb-1 pt-2 text-xs font-medium leading-none">
                  Created clubs
                </SelectLabel>
                {myClubs
                  .filter((club) => club.position === PositionEnum.president)
                  .map((club) => (
                    <SelectItem
                      key={club.clubId}
                      value={club.clubId.toString()}
                    >
                      <div className="[&_svg]:text-foreground flex items-center gap-3 [&_svg]:size-4 [&_svg]:shrink-0">
                        {club.clubName}
                      </div>
                    </SelectItem>
                  ))}
              </SelectGroup>
            )}
            {myClubs.some(
              (club) => club.position !== PositionEnum.president
            ) && (
              <SelectGroup>
                <SelectLabel className="text-muted-foreground pb-1 pt-2 text-xs font-medium leading-none">
                  Joined clubs
                </SelectLabel>
                {myClubs
                  .filter((club) => club.position !== PositionEnum.president)
                  .map((club) => (
                    <SelectItem
                      key={club.clubId}
                      value={club.clubId.toString()}
                    >
                      <div className="[&_svg]:text-foreground flex items-center gap-3 [&_svg]:size-4 [&_svg]:shrink-0">
                        {club.clubName}
                      </div>
                    </SelectItem>
                  ))}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative size-8 rounded-full">
              <Avatar className="size-8">
                <AvatarImage
                  src="/placeholder-user.jpg"
                  alt={userInfo.username}
                />
                <AvatarFallback>{userInfo.username}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {userInfo.username}
                </p>
                <p className="text-muted-foreground text-xs leading-none">
                  {userInfo.email}
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
            <>
              {`Welcome back! ${positions.find((pos) => pos.value === activeClub?.position)?.label} ${userInfo.username}`}
            </>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            {tabComponents.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabComponents.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              forceMount
              hidden={activeTab !== tab.value}
            >
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </>
  )
}
