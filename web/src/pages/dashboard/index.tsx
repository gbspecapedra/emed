import {
  Box,
  Button,
  Flex,
  FormErrorMessage,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Stack,
  Tag,
  TagLabel,
  Textarea,
} from '@chakra-ui/react'
import { format } from 'date-fns'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'

import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Toolbar } from 'primereact/toolbar'
import React, { useState, useRef } from 'react'

import { BiDotsVerticalRounded } from 'react-icons/bi'
import { BsExclamationTriangle } from 'react-icons/bs'
import {
  FaCheck,
  FaStethoscope,
  FaTimes,
  FaUserEdit,
  FaUserPlus,
  FaUserSlash,
  FaUserTimes,
} from 'react-icons/fa'
import { SiMicrosoftexcel } from 'react-icons/si'

import { Attendance } from '../../models/attendance.model'
import { AttendanceStatus, AttendanceType } from '../../models/enums'
import { api } from '../../services/api'
import { getAPIClient } from '../../services/axios'
import { useNotification } from '../../services/hooks/useNotification'
import { EMED_TOKEN } from '../../utils'

interface IErrorsMap {
  cancellationReason?: {
    message: string
  }
}

interface IAttendanceInputs {
  patientId: string
  professionalId: string
  date: string
}

interface DashboardProps {
  attendances: Attendance[]
  totalCount: number
}

const Dashboard = ({ attendances }: DashboardProps) => {
  const router = useRouter()
  const notification = useNotification()
  const table = useRef(null)

  const [listOfAttendances, setListOfAttendances] =
    useState<Attendance[]>(attendances)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false)
  const [openCancelDialog, setOpenCancelDialog] = useState(false)

  const [selectedAppointment, setSelectedAppointment] =
    useState<Partial<Attendance>>()
  const [errors, setErrors] = useState<IErrorsMap>()

  const [globalFilter, setGlobalFilter] = useState(null)

  async function refetchAttendances() {
    const response = await api.get('/attendances')
    setSelectedAppointment(undefined)
    setListOfAttendances(response.data)
  }

  const handleCreateAttendance = async () => {
    try {
      if (!selectedAppointment) return

      await api
        .post(`/attendances`, {
          ...selectedAppointment,
        })
        .then(() => {
          notification.success({
            title: 'Attendance created!',
          })
          refetchAttendances()
        })
        .catch(({ response }) => notification.error(response.data.error))
    } catch (error) {
      notification.error()
    }
  }

  const handleNotAttended = async (row: any) => {
    try {
      if (!selectedAppointment) return

      await api
        .put(`/attendances/${row.id}`, {
          id: row.id,
          cancellationReason: 'Patient did not attend.',
        })
        .then(() => {
          notification.success({
            title: 'Attendance updated!',
          })
          refetchAttendances()
        })
        .catch(({ response }) => notification.error(response.data.error))
    } catch (error) {
      notification.error()
    }
  }

  const handleCancelAppointment = async () => {
    try {
      if (!selectedAppointment) return

      await api
        .put(`/attendances/${selectedAppointment.id}`, {
          id: selectedAppointment.id,
          cancellationReason: selectedAppointment.cancellationReason,
        })
        .then(() => {
          notification.success({
            title: 'Attendance canceled!',
          })
          refetchAttendances()
        })
        .catch(({ response }) => notification.error(response.data.error))
    } catch (error) {
      notification.error()
    }
  }

  const handleExportToExcel = () => {
    console.log('export to excel')
  }

  const onInputChange = (e: any, name: string) => {
    e.preventDefault()
    const val = (e.target && e.target.value) || ''
    setSelectedAppointment({ ...selectedAppointment, [name]: val })
  }

  const actionButtons = (row: any) => {
    return (
      <Flex flexDirection="row" justifyContent="end">
        <Button
          colorScheme="blue"
          variant="solid"
          marginRight={2}
          onClick={() => router.push('/dashboard/medical-record')}
        >
          <FaStethoscope />
        </Button>
        <Button
          colorScheme="red"
          variant="outline"
          marginRight={2}
          onClick={() => handleNotAttended(row)}
        >
          <FaUserSlash />
        </Button>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<BiDotsVerticalRounded />}
            variant="outline"
          />
          <MenuList>
            <MenuItem
              icon={<FaUserEdit />}
              onClick={() => {
                setSelectedAppointment(row)
                setOpenRescheduleDialog(true)
              }}
            >
              Reschedule
            </MenuItem>
            <MenuItem
              icon={<FaUserTimes />}
              onClick={() => {
                setSelectedAppointment(row)
                setOpenCancelDialog(true)
              }}
            >
              Cancel
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    )
  }

  return (
    <>
      <Box>
        <Toolbar
          className="mb-4 bg-white"
          left={
            <Button
              type="button"
              colorScheme="gray"
              onClick={handleExportToExcel}
            >
              <SiMicrosoftexcel />
            </Button>
          }
          right={
            <Button
              colorScheme="green"
              variant="solid"
              onClick={() => setOpenCreateDialog(true)}
            >
              <FaUserPlus />
            </Button>
          }
        />

        <DataTable
          ref={table}
          value={listOfAttendances}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} appointments"
          globalFilter={globalFilter}
          responsiveLayout="scroll"
        >
          <Column field="patient.name" header="Patient" sortable />
          <Column field="professional.name" header="Professional" sortable />
          <Column
            field="date"
            header="Date"
            body={row => {
              return format(new Date(row.date), 'PPPPpp')
            }}
            sortable
          />
          <Column
            field="status"
            header="Status"
            body={row => {
              let color = 'red'
              if (row.status === AttendanceStatus.IN_PROGRESS) {
                color = 'yellow'
              } else if (row.status === AttendanceStatus.CONFIRMED) {
                color = 'green'
              } else if (row.status === AttendanceStatus.DONE) {
                color = 'gray'
              }

              return (
                <Tag
                  size="md"
                  key={row.id}
                  borderRadius="full"
                  variant="solid"
                  colorScheme={color}
                >
                  <TagLabel>{row.status}</TagLabel>
                </Tag>
              )
            }}
            sortable
          />
          <Column body={actionButtons} exportable={false} />
        </DataTable>
      </Box>

      <Dialog
        visible={openCreateDialog}
        style={{ width: '450px' }}
        header="Create appointment"
        modal
        className="p-fluid"
        footer={
          <React.Fragment>
            <Button
              leftIcon={<FaTimes />}
              colorScheme="red"
              onClick={() => {
                setErrors(undefined)
                setSelectedAppointment(undefined)
                setOpenCreateDialog(false)
              }}
            >
              Cancel
            </Button>
            <Button
              leftIcon={<FaCheck />}
              colorScheme="green"
              onClick={() => {
                setErrors(undefined)
                console.log('save')
              }}
            >
              Create
            </Button>
          </React.Fragment>
        }
        onHide={() => {
          setErrors(undefined)
          setSelectedAppointment(undefined)
          setOpenCreateDialog(false)
        }}
      >
        <Select placeholder="Select attendance type">
          {Object.keys(AttendanceType).map((key, index) => {
            return (
              <option key={index} value={key}>
                {key}
              </option>
            )
          })}
        </Select>
        <Select placeholder="Select patient">
          {Object.keys(AttendanceType).map((key, index) => {
            return (
              <option key={index} value={key}>
                {key}
              </option>
            )
          })}
        </Select>
        <Calendar
          id="date"
          name="date"
          value={new Date(selectedAppointment?.date ?? '')}
          onChange={e => onInputChange(e, 'date')}
          disabledDays={[0, 6]}
          showIcon
          showTime
          showButtonBar
        />
      </Dialog>

      <Dialog
        visible={openCancelDialog}
        style={{ width: '450px' }}
        header="Cancel appointment"
        modal
        footer={
          <React.Fragment>
            <Button
              leftIcon={<FaTimes />}
              colorScheme="red"
              onClick={() => {
                setErrors(undefined)
                setSelectedAppointment(undefined)
                setOpenCancelDialog(false)
              }}
            >
              No
            </Button>
            <Button
              leftIcon={<FaCheck />}
              colorScheme="green"
              onClick={e => {
                if (!e.currentTarget.value) {
                  setErrors({
                    cancellationReason: {
                      message: 'Cancellation reason is required',
                    },
                  })
                } else {
                  handleCancelAppointment()
                }
              }}
            >
              Yes
            </Button>
          </React.Fragment>
        }
        onHide={() => {
          setErrors(undefined)
          setSelectedAppointment(undefined)
          setOpenCancelDialog(false)
        }}
      >
        <Stack align="center">
          <BsExclamationTriangle size={50} color="orange" />
          {selectedAppointment && (
            <span>
              Are you sure you want to cancel the appointment of patient{' '}
              <b>{selectedAppointment.patient?.name}</b>?
            </span>
          )}
          <Textarea
            id="cancellationReason"
            name="cancellationReason"
            onChange={e => onInputChange(e, 'cancellationReason')}
            placeholder="Describe the reason for the cancellation..."
            size="sm"
            resize="none"
            isInvalid={!!errors?.['cancellationReason']}
          />
          {!!errors?.['cancellationReason'] && (
            <FormErrorMessage>
              {errors?.['cancellationReason']?.message}
            </FormErrorMessage>
          )}
        </Stack>
      </Dialog>
    </>
  )
}

export default Dashboard

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

  const { data } = await apiClient.get('/attendances')

  return {
    props: { attendances: data, totalCount: data.length },
  }
}
