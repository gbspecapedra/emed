import { HStack } from '@chakra-ui/react'
import { DataTable } from 'primereact/datatable'
import React, { ReactNode, useRef, useState } from 'react'
import Search from '../search'

interface ITableProps<T> {
  values: T[]
  children: ReactNode
  header?: ReactNode
  rows?: number
}

export default function Table<T>({
  values,
  children,
  header,
  rows = 10,
}: ITableProps<T>) {
  const table = useRef(null)
  const [globalFilter, setGlobalFilter] = useState(null)

  return (
    <DataTable
      ref={table}
      dataKey="id"
      value={values}
      globalFilter={globalFilter}
      header={
        <HStack>
          <Search onChange={value => setGlobalFilter(value)} />
          {header}
        </HStack>
      }
      rows={rows}
      rowsPerPageOptions={[5, 10, 25]}
      paginator
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
      emptyMessage="No records found"
      responsiveLayout="scroll"
      stripedRows
      rowHover
    >
      {children}
    </DataTable>
  )
}
