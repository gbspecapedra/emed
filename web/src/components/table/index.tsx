import { DataTable, DataTableProps } from 'primereact/datatable'
import React, { ReactNode, useRef } from 'react'

interface ITableProps<T> extends DataTableProps {
  values: T[]
  children: ReactNode
  rows?: number
}

export default function Table<T>({
  values,
  header,
  children,
  rows = 10,
  ...props
}: ITableProps<T>) {
  const table = useRef(null)

  return (
    <DataTable
      {...props}
      ref={table}
      dataKey="id"
      value={values}
      header={header}
      rows={rows}
      emptyMessage="No records found"
      responsiveLayout="scroll"
      stripedRows
      rowHover
    >
      {children}
    </DataTable>
  )
}
