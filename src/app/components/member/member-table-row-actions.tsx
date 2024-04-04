'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Position, positions } from '@/types/club'
import { Member } from '@/types/member'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row, Table } from '@tanstack/react-table'

interface MemberTableRowActionsProps<TData> {
  table: Table<TData>
  row: Row<TData>
}

export function MemberTableRowActions<TData>({
  table,
  row,
}: MemberTableRowActionsProps<TData>) {
  const member = row.original as Member

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex size-8 p-0"
        >
          <DotsHorizontalIcon className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Position</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={member.position}>
              {positions.slice(3).map((position) => (
                <DropdownMenuRadioItem
                  key={position.value}
                  value={position.value}
                  onSelect={() =>
                    table.options.meta?.handleUpdatePosition?.(
                      member.memberId,
                      position.value as Position
                    )
                  }
                >
                  {position.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() =>
            table.options.meta?.handleRemoveMember?.(member.memberId)
          }
        >
          Remove from Club
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
