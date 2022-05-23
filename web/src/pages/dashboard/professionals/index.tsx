import {
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  TagLabel,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import React, { useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { BsJournalMedical } from 'react-icons/bs'
import {
  FaTrashAlt,
  FaUserCheck,
  FaUserEdit,
  FaUserPlus,
  FaUserTimes,
} from 'react-icons/fa'
import Table from '../../../components/table'
import Tooltip from '../../../components/tooltip'
import { Professional } from '../../../models'
import { api } from '../../../services/api'
import { getAPIClient } from '../../../services/axios'
import { useNotification } from '../../../services/hooks/useNotification'
import { useRoles } from '../../../services/hooks/useRoles'
import { formatProfessional } from '../../../services/professionals'
import { EMED_TOKEN } from '../../../utils'

interface IProfessionalsProps {
  professionals: Professional[]
}

const Professionals: React.FC<IProfessionalsProps> = ({ professionals }) => {
  const router = useRouter()
  const notification = useNotification()
  const { isAdmin } = useRoles()

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
        <Tooltip title="Visualize a professional">
          <Button
            colorScheme="gray"
            variant="outline"
            marginRight={2}
            onClick={() => router.push(`/dashboard/patients/view/${row.id}`)}
          >
            <BsJournalMedical />
          </Button>
        </Tooltip>

        {isAdmin && (
          <>
            <Tooltip title="Edit a professional">
              <Button
                colorScheme="blue"
                variant="solid"
                marginRight={2}
                onClick={() =>
                  router.push(`/dashboard/professionals/${row.id}`)
                }
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
          </>
        )}
      </Flex>
    )
  }

  return (
    <>
      <ConfirmDialog />
      <Table
        values={listOfProfessionals}
        header={
          <>
            {isAdmin && (
              <Tooltip title="Create new professional">
                <Button
                  colorScheme="green"
                  variant="solid"
                  onClick={() => router.push(`/dashboard/professionals/create`)}
                >
                  <FaUserPlus />
                </Button>
              </Tooltip>
            )}
          </>
        }
      >
        <Column field="registration" header="Code" sortable />
        <Column field="role" header="Role" sortable />
        <Column field="name" header="Name" sortable />
        <Column field="specialty" header="Specialty" sortable />
        <Column field="email" header="Email" />
        <Column
          field="active"
          header="Status"
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
      </Table>
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
