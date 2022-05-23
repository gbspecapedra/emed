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
import React, { useRef, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import {
  FaTrashAlt,
  FaUserCheck,
  FaUserEdit,
  FaUserPlus,
  FaUserTimes,
} from 'react-icons/fa'
import Table from '../../../components/table'
import Tooltip from '../../../components/tooltip'
import { Patient } from '../../../models/patient.model'
import { api } from '../../../services/api'
import { getAPIClient } from '../../../services/axios'
import { useNotification } from '../../../services/hooks/useNotification'
import { useRoles } from '../../../services/hooks/useRoles'
import { EMED_TOKEN } from '../../../utils'

interface IPatientsProps {
  patients: Patient[]
}

const Patients: React.FC<IPatientsProps> = ({ patients }) => {
  const router = useRouter()
  const notification = useNotification()
  const { isAdmin } = useRoles()
  const table = useRef(null)

  const [globalFilter, setGlobalFilter] = useState(null)
  const [listOfPatients, setListOfPatients] = useState<Patient[]>(patients)

  async function refetchPatients() {
    const response = await api.get('/patients')
    setListOfPatients(response.data)
  }

  async function handleUpdateStatus(patientId: string, status: boolean) {
    try {
      await api
        .put(`/professionals/${patientId}`, {
          id: patientId,
          active: status,
        })
        .then(() => {
          notification.success({
            title: `Patient successfully ${
              status ? 'activated' : 'deactivated'
            }!`,
          })
          refetchPatients()
        })
        .catch(({ response }) => notification.error(response.data.error))
    } catch (error) {
      notification.error()
    }
  }

  async function handleDeletePatient(patientId: string) {
    try {
      await api
        .delete(`/patients/${patientId}`)
        .then(() => {
          notification.success({
            title: `Patient successfully deleted!`,
          })
          refetchPatients()
        })
        .catch(({ response }) => notification.error(response.data.error))
    } catch (error) {
      notification.error()
    }
  }

  const actionButtons = (row: any) => {
    return (
      <Flex flexDirection="row" justifyContent="end">
        <Tooltip title="Edit a patient">
          <Button
            colorScheme="blue"
            variant="solid"
            marginRight={2}
            onClick={() => router.push(`/dashboard/patients/${row.id}`)}
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
                    accept: () => handleDeletePatient(row.id),
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
      <Table
        values={listOfPatients}
        header={
          <Tooltip title="Create new patient">
            <Button
              colorScheme="green"
              variant="solid"
              onClick={() => router.push(`/dashboard/patients/create`)}
            >
              <FaUserPlus />
            </Button>
          </Tooltip>
        }
      >
        <Column field="socialNumber" header="Social Number" sortable />
        <Column field="name" header="Name" sortable />
        <Column field="contact" header="Contact" sortable />
        <Column field="healthPlan.name" header="Health Plan" />
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
      </Table>
    </>
  )
}

export default Patients

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

  const { data } = await apiClient.get('/patients')

  return {
    props: { patients: data },
  }
}
