'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useClub } from '@/hooks/use-club'
import { getMembers } from '@/lib/api'
import { PositionEnum } from '@/types/club'
import { Member } from '@/types/member'

import ApplyingMemberItem from './applying-member-item'
import { columns } from './columns'
import LeavingMemberItem from './leaving-member-item'
import { MemberTable } from './member-tabel'

export default function MemberPres() {
  const { activeClub } = useClub()
  const club = activeClub!

  const [members, setMembers] = useState<Member[]>([])
  const [applyingMembers, setApplyingMembers] = useState<Member[]>([])
  const [leavingMembers, setLeavingMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    getMembers(club.clubId)
      .then((res) => {
        if (res.code === 1) {
          const { members, applyingMembers, leavingMembers } = res.data.reduce<{
            members: Member[]
            applyingMembers: Member[]
            leavingMembers: Member[]
          }>(
            (acc, member) => {
              if (
                [
                  PositionEnum.member,
                  PositionEnum.president,
                  PositionEnum.vicePresident,
                  PositionEnum.cadreMan,
                ].includes(member.position as PositionEnum)
              ) {
                acc.members.push(member)
              } else if (member.position === PositionEnum.applyJoin) {
                acc.applyingMembers.push(member)
              } else if (member.position === PositionEnum.applyQuit) {
                acc.members.push(member)
                acc.leavingMembers.push(member)
              }
              return acc
            },
            { members: [], applyingMembers: [], leavingMembers: [] }
          )

          setMembers(members)
          setApplyingMembers(applyingMembers)
          setLeavingMembers(leavingMembers)
        } else {
          toast.warning('Fetch members failed.')
        }
      })
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
          {applyingMembers.length > 0 && (
            <Card className="my-4 px-6 py-4">
              <CardHeader className="space-y-0 p-0">
                <CardTitle className="text-lg font-medium">
                  Join Requests
                </CardTitle>
                <CardDescription>
                  Users waiting for approval to join.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-3 grid grid-cols-3 gap-x-20 gap-y-4 p-0">
                {applyingMembers.map((member) => (
                  <ApplyingMemberItem
                    key={member.memberId}
                    member={member}
                    setApplyingMembers={setApplyingMembers}
                    setMembers={setMembers}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {leavingMembers.length > 0 && (
            <Card className="my-4 px-6 py-4">
              <CardHeader className="space-y-0 p-0">
                <CardTitle className="text-lg font-medium">
                  Leave Requests
                </CardTitle>
                <CardDescription>
                  Members looking to exit the group.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-3 grid grid-cols-3 gap-x-20 gap-y-4 p-0">
                {leavingMembers.map((member) => (
                  <LeavingMemberItem
                    key={member.memberId}
                    member={member}
                    setLeavingMembers={setLeavingMembers}
                    setMembers={setMembers}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          <h2 className="mt-6 text-xl font-medium leading-none">
            Club Members
          </h2>
          {members.length > 0 ? (
            <MemberTable
              data={members}
              columns={columns}
              isPresedent
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
