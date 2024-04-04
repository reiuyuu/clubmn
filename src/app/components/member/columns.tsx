'use client'

import { positions } from '@/types/club'
import { Member } from '@/types/member'

import { ReloadIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

import { MemberTableColumnHeader } from './member-table-column-header'
import { MemberTableRowActions } from './member-table-row-actions'

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <MemberTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="truncate font-medium">{row.getValue('username')}</div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <MemberTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return <div className="truncate font-medium">{row.getValue('email')}</div>
    },
  },
  {
    accessorKey: 'position',
    header: ({ column }) => (
      <MemberTableColumnHeader column={column} title="Position" />
    ),
    cell: ({ table, row }) => {
      const position = positions.find(
        (position) => position.value === row.getValue('position')
      )

      if (!position) {
        return null
      }

      return table.options?.meta?.processingPosList?.includes(
        row.original.userId
      ) ? (
        <ReloadIcon className="size-4 animate-spin" />
      ) : (
        <div className="truncate">{position.label}</div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'joinDate',
    header: ({ column }) => (
      <MemberTableColumnHeader column={column} title="Join Date" />
    ),
    cell: ({ row }) => (
      <div className="truncate">{row.getValue('joinDate')}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ table, row }) =>
      table.options?.meta?.isPresedent ? (
        <MemberTableRowActions table={table} row={row} />
      ) : (
        <div className="size-8" />
      ),
  },
]
