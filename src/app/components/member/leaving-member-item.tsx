'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { editMemberPosition } from '@/lib/api'
import { PositionEnum } from '@/types/club'
import { Member } from '@/types/member'

import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'

interface LeavingMemberItem {
  member: Member
  setLeavingMembers: React.Dispatch<React.SetStateAction<Member[]>>
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>
}

export default function LeavingMemberItem({
  member,
  setLeavingMembers,
  setMembers,
}: LeavingMemberItem) {
  const [processing, setProcessing] = useState<boolean>(false)

  const handleApproveLeave = (memberId: number) => {
    setProcessing(true)
    editMemberPosition(memberId, PositionEnum.alreadyQuit)
      .then((res) => {
        if (res.code === 1) {
          setLeavingMembers((prev) =>
            prev.filter((m) => m.memberId !== memberId)
          )
          setMembers((prev) => prev.filter((m) => m.memberId !== memberId))
        } else {
          toast.warning('Approve leave failed.')
        }
      })
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessing(false))
  }

  // TODO: can't get original position
  const handleRejectLeave = (memberId: number) => {
    setProcessing(true)
    editMemberPosition(memberId, PositionEnum.member)
      .then((res) => {
        if (res.code === 1) {
          setLeavingMembers((prev) =>
            prev.filter((m) => m.memberId !== memberId)
          )
        } else {
          toast.warning('Reject leave failed.')
        }
      })
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() => setProcessing(false))
  }

  return (
    <div key={member.memberId} className="flex items-end justify-between">
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
          onClick={() => handleApproveLeave(member.memberId)}
        >
          <CheckIcon className="size-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="size-8"
          disabled={processing}
          onClick={() => handleRejectLeave(member.memberId)}
        >
          <Cross2Icon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
