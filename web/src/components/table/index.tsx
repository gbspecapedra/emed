import { Button, HStack } from '@chakra-ui/react'
import { DataTable } from 'primereact/datatable'
import { Panel } from 'primereact/panel'
import React, { ReactNode, useRef, useState } from 'react'
import { FaMinus } from 'react-icons/fa'
import { GoPlus } from 'react-icons/go'
import { SiMicrosoftexcel } from 'react-icons/si'
import { saveAsExcelFile } from '../../utils/'
import Search from '../search'
import Tooltip from '../tooltip'

interface ITableProps<T> {
  name: string
  values: T[]
  children: ReactNode
  rows?: number
  toggleable?: boolean
  panelContent?: ReactNode
  canManageCreateButton?: boolean
  onClickCreateButton: () => void
}

export default function Table<T>({
  name,
  values,
  children,
  rows = 10,
  toggleable = false,
  panelContent,
  canManageCreateButton = false,
  onClickCreateButton,
}: ITableProps<T>) {
  const table = useRef(null)
  const [globalFilter, setGlobalFilter] = useState(null)

  const handleExportToExcel = () => {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(values)
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })
      saveAsExcelFile(excelBuffer, `${name}s`)
    })
  }

  return (
    <DataTable
      ref={table}
      dataKey="id"
      value={values}
      globalFilter={globalFilter}
      header={
        <Panel
          collapsed={true}
          headerTemplate={options => {
            return (
              <HStack marginBottom={toggleable ? 1 : 0}>
                <Search onChange={value => setGlobalFilter(value)} />
                <Tooltip title="Export to Excel">
                  <Button
                    type="button"
                    colorScheme="gray"
                    onClick={handleExportToExcel}
                  >
                    <SiMicrosoftexcel />
                  </Button>
                </Tooltip>
                {canManageCreateButton && (
                  <Tooltip title={`Create new ${name}`}>
                    <Button
                      colorScheme="green"
                      variant="solid"
                      onClick={e => {
                        panelContent && options.onTogglerClick(e)
                        onClickCreateButton()
                      }}
                    >
                      {options.collapsed ? <GoPlus /> : <FaMinus />}
                    </Button>
                  </Tooltip>
                )}
              </HStack>
            )
          }}
          toggleable
        >
          {panelContent}
        </Panel>
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
