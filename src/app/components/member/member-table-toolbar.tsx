'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { positions } from '@/types/club'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { MemberTableFacetedFilter } from './member-table-faceted-filter'
import { MemberTableViewOptions } from './member-table-view-options'

interface MemberTableToolbarProps<TData> {
  table: Table<TData>
}

export function MemberTableToolbar<TData>({
  table,
}: MemberTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by name..."
          value={
            (table.getColumn('username')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('username')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('position') && (
          <MemberTableFacetedFilter
            column={table.getColumn('position')}
            title="Position"
            options={positions.slice(3)}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <MemberTableViewOptions table={table} />
    </div>
  )
}
