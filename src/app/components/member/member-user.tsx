'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { PositionEnum } from '@/types/club'
import { Member } from '@/types/member'
import { getMembers } from '@/lib/api'
import { useClub } from '@/hooks/use-club'
import { Skeleton } from '@/components/ui/skeleton'

import { columns } from './columns'
import { MemberTable } from './member-tabel'

export default function MemberUser() {
  const { activeClub } = useClub()
  const club = activeClub!

  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    getMembers(club.clubId)
      .then((res) =>
        res.code === 1
          ? setMembers(
              res.data.filter(
                (member) =>
                  member.position === PositionEnum.member ||
                  member.position === PositionEnum.president ||
                  member.position === PositionEnum.vicePresident ||
                  member.position === PositionEnum.cadreMan ||
                  member.position === PositionEnum.applyQuit
              )
            )
          : toast.warning('Fetch members failed.')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setLoading(false))
  }, [club.clubId])

  return (
    <>
      {loading ? (
        <Skeleton className="my-4 h-[calc(100vh-384px)] w-full" />
      ) : (
        <>
          <h2 className="mt-6 text-xl font-medium leading-none">
            Club Members
          </h2>
          {members.length > 0 ? (
            <MemberTable
              data={members}
              columns={columns}
              setMembers={setMembers}
            />
          ) : (
            <p className="my-4 text-lg">No one in the club yet.</p>
          )}
        </>
      )}
    </>
  )
}
