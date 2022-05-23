import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  TagLabel,
  useDisclosure,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { Toolbar } from 'primereact/toolbar'
import React, { useRef, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import {
  FaTrashAlt,
  FaUserCheck,
  FaUserEdit,
  FaUserPlus,
  FaUserTimes,
} from 'react-icons/fa'
import Tooltip from '../../../components/tooltip'
import { Professional } from '../../../models'
import { api } from '../../../services/api'
import { getAPIClient } from '../../../services/axios'
import { useNotification } from '../../../services/hooks/useNotification'
import { useRoles } from '../../../services/hooks/useRoles'
import { formatProfessional } from '../../../services/professionals'
import { EMED_TOKEN } from '../../../utils'

interface IProfessionalProps {
  professionals: Professional[]
}

const Professionals: React.FC<IProfessionalProps> = ({ professionals }) => {
  const router = useRouter()
  const notification = useNotification()
  const { isAdmin } = useRoles()
  const table = useRef(null)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const [globalFilter, setGlobalFilter] = useState(null)
  const [listOfProfessionals, setListOfProfessionals] =
    useState<Professional[]>(professionals)

  async function refetchProfessionals() {
    const response = await api.get('/professionals')
    const professionals = formatProfessional(response.data)
    setListOfProfessionals(professionals)
  }

  async function handleUpdateStatus(professionalId: string, status: boolean) {
    try {
      await api
        .put(`/professionals/${professionalId}`, {
          id: professionalId,
          active: status,
        })
        .then(() => {
          notification.success({
            title: `Professional successfully ${
              status ? 'activated' : 'deactivated'
            }!`,
          })
          refetchProfessionals()
        })
        .catch(({ response }) => notification.error(response.data.error))
    } catch (error) {
      notification.error()
    }
  }

  async function handleDeleteProfessional(professionalId: string) {
    try {
      await api
        .delete(`/professionals/${professionalId}`)
        .then(() => {
          notification.success({
            title: `Professional successfully deleted!`,
          })
          refetchProfessionals()
        })
        .catch(({ response }) => notification.error(response.data.error))
    } catch (error) {
      notification.error()
    }
  }

  const actionButtons = (row: any) => {
    return (
      <Flex flexDirection="row" justifyContent="end">
        <Tooltip title="Edit a professional">
          <Button
            colorScheme="blue"
            variant="solid"
            marginRight={2}
            onClick={() => router.push(`/dashboard/professionals/${row.id}`)}
          >
            <FaUserEdit />
          </Button>
        </Tooltip>

        <Tooltip title={row.active ? 'Deactivate' : 'Activate'}>
          <Button
            colorScheme={row.active ? 'red' : 'green'}
            variant="outline"
            marginRight={2}
            onClick={() => handleUpdateStatus(row.id, !row.active)}
          >
            {row.active ? <FaUserTimes /> : <FaUserCheck />}
          </Button>
        </Tooltip>

        {isAdmin && (
          <Menu>
            <Tooltip title="More">
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BiDotsVerticalRounded />}
                variant="outline"
              />
            </Tooltip>
            <MenuList>
              <MenuItem
                icon={<FaTrashAlt />}
                onClick={() => {
                  confirmDialog({
                    message: `Are you sure? You can't undo this action afterwards.`,
                    header: 'Delete Professional',
                    icon: 'pi pi-exclamation-triangle',
                    acceptClassName: 'p-button-danger',
                    accept: () => handleDeleteProfessional(row.id),
                  })
                }}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    )
  }

  return (
    <>
      <ConfirmDialog />
      <Box>
        <Toolbar
          className="mb-4 bg-white"
          right={
            <Tooltip title="Create new professional">
              <Button
                colorScheme="green"
                variant="solid"
                onClick={() => router.push(`/dashboard/professionals/create`)}
              >
                <FaUserPlus />
              </Button>
            </Tooltip>
          }
        />

        <DataTable
          ref={table}
          dataKey="id"
          value={listOfProfessionals}
          header={
            <div className="flex justify-content-between align-items-center">
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  type="search"
                  onInput={(e: any) => setGlobalFilter(e.target.value)}
                  placeholder="Search..."
                />
              </span>
            </div>
          }
          globalFilter={globalFilter}
          emptyMessage="No professionals found"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} professionals"
          responsiveLayout="scroll"
          stripedRows
          rowHover
        >
          <Column field="registration" header="Code" sortable />
          <Column field="role" header="Role" sortable />
          <Column field="name" header="Name" sortable />
          <Column field="specialty" header="Specialty" sortable />
          <Column field="email" header="Email" />
          <Column
            field="active"
            sortable
            body={row => {
              return (
                <Tag
                  size="sm"
                  key={row.id}
                  borderRadius="base"
                  variant="solid"
                  colorScheme={row.active ? 'green' : 'red'}
                >
                  <TagLabel>{row.active ? 'ACTIVE' : 'DISABLED'}</TagLabel>
                </Tag>
              )
            }}
          />
          <Column body={actionButtons} exportable={false} />
        </DataTable>
      </Box>
    </>
  )
}

export default Professionals

export const getServerSideProps: GetServerSideProps = async ctx => {
  const apiClient = getAPIClient(ctx)

  const { [EMED_TOKEN]: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const { data } = await apiClient.get('/professionals')
  const professionals = formatProfessional(data)

  return {
    props: { professionals: professionals },
  }
}
