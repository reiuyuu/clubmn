'use client'

import { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { editMemberPosition } from '@/lib/api'
import { Position, PositionEnum } from '@/types/club'
import { Member } from '@/types/member'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { toast } from 'sonner'

import { MemberTablePagination } from './member-table-pagination'
import { MemberTableToolbar } from './member-table-toolbar'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    isPresedent?: boolean
    processingPosList?: number[]
    handleUpdatePosition?: (memberId: number, position: Position) => void
    handleRemoveMember?: (memberId: number) => void
  }
}

interface MemberTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isPresedent?: boolean
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>
}

export function MemberTable<TData, TValue>({
  columns,
  data,
  isPresedent,
  setMembers,
}: MemberTableProps<TData, TValue>) {
  const [processingPosList, setProcessingPosList] = useState<number[]>([])

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const handleUpdatePosition = (memberId: number, position: Position) => {
    setProcessingPosList((prev) => [...prev, memberId])
    editMemberPosition(memberId, position)
      .then((res) =>
        res.code === 1
          ? setMembers((prev) =>
              prev.map((m) =>
                m.memberId === memberId ? { ...m, position } : m
              )
            )
          : toast.warning('Update position failed.')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
      .finally(() =>
        setProcessingPosList((prev) => prev.filter((id) => id !== memberId))
      )
  }

  const handleRemoveMember = (memberId: number) => {
    editMemberPosition(memberId, PositionEnum.alreadyQuit)
      .then((res) =>
        res.code === 1
          ? setMembers((prev) => prev.filter((m) => m.memberId !== memberId))
          : toast.warning('Remove member failed.')
      )
      .catch((err) => {
        toast.error('something went wrong...')
        console.log(err)
      })
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    meta: {
      isPresedent,
      processingPosList,
      handleUpdatePosition,
      handleRemoveMember,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="my-4 space-y-4">
      <MemberTableToolbar table={table} />
      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="px-4 first:w-1/5 last:w-1/12 [&:nth-child(3)]:w-1/5"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <MemberTablePagination table={table} />
    </div>
  )
}
