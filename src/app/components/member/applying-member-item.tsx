'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { editMemberPosition } from '@/lib/api'
import { PositionEnum } from '@/types/club'
import { Member } from '@/types/member'

import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'

interface ApplyingMemberItemProps {
  member: Member
  setApplyingMembers: React.Dispatch<React.SetStateAction<Member[]>>
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>
}

export default function ApplyingMemberItem({
  member,
  setApplyingMembers,
  setMembers,
}: ApplyingMemberItemProps) {
  const [processing, setProcessing] = useState<boolean>(false)

  const handleApproveJoin = (memberId: number) => {
    setProcessing(true)
    editMemberPosition(memberId, PositionEnum.member)
      .then((res) => {
        if (res.code === 1) {
          setApplyingMembers((prev) =>
            prev.filter((m) => m.memberId !== memberId)
          )
          setMembers((prev) => [
            ...prev,
            {
              ...member,
              position: PositionEnum.member,
            },
          ])
        } else {
          toast.warning('Approve join failed.')
        }
      })
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessing(false))
  }

  const handleRejectJoin = (memberId: number) => {
    setProcessing(true)
    editMemberPosition(memberId, PositionEnum.alreadyQuit)
      .then((res) =>
        res.code === 1
          ? setApplyingMembers((prev) =>
              prev.filter((m) => m.memberId !== memberId)
            )
          : toast.warning('Reject join failed')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessing(false))
  }

  return (
    <div className="flex items-end justify-between">
      <div className="flex max-w-[calc(95%-72px)] flex-col space-y-1.5">
        <span className="truncate text-base leading-none">
          {member.username}
        </span>
        <span className="text-muted-foreground truncate text-sm leading-none">
          {member.email}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="default"
          size="icon"
          className="size-8"
          disabled={processing}
          onClick={() => handleApproveJoin(member.memberId)}
        >
          <CheckIcon className="size-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="size-8"
          disabled={processing}
          onClick={() => handleRejectJoin(member.memberId)}
        >
          <Cross2Icon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
