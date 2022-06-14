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
import { format } from 'date-fns'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { Column } from 'primereact/column'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { AiOutlineInfoCircle, AiOutlineWarning } from 'react-icons/ai'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import {
  FaHistory,
  FaStethoscope,
  FaUserEdit,
  FaUserNurse,
  FaUserSlash,
  FaUserTimes,
} from 'react-icons/fa'
import Modal, { IModalInputs, initialValues } from '../../components/modal'
import Paginator from '../../components/paginator'
import Tooltip from '../../components/tooltip'

import { Attendance } from '../../models/attendance.model'
import { AttendanceStatus, ProfessionalRole } from '../../models/enums'
import { api } from '../../services/api'
import { getAPIClient } from '../../services/axios'
import { useAuth } from '../../services/contexts/AuthContext'
import { useNotification } from '../../services/hooks/useNotification'
import { useRoles } from '../../services/hooks/useRoles'
import { EMED_TOKEN, formatDate } from '../../utils'
import CreateAttendance from './_createAttendance'
import { DatePicker } from '@/components/form/datePicker'
import { Textarea } from '@/components/form/textarea'

interface IAttendanceInputs {
  date?: Date
  cancellationReason?: string
}

interface IDashboardProps {
  attendances: Attendance[]
}

const Dashboard: React.FC<IDashboardProps> = ({ attendances }) => {
  const { professional } = useAuth()
  const router = useRouter()
  const { canManageAppointments, canManageAttendances } = useRoles()
  const notification = useNotification()

  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  const [listOfAttendances, setListOfAttendances] =
    useState<Attendance[]>(attendances)

  const [isShowingModal, setIsShowingModal] = useState<boolean>(false)
  const [modal, setModal] = useState<IModalInputs>(initialValues)

  const methods = useForm<IAttendanceInputs>({
    mode: 'onChange',
  })

  const rescheduleAttendance = (
    <DatePicker
      name="date"
      placeholder="DD/MM/YYYY"
      minDate={new Date()}
      disabledDays={[0, 6]}
      showIcon={false}
      showTime
      inline
      stepMinute={15}
      validators={{ required: 'Date is required' }}
    />
  )

  const cancelAttendance = (
    <Textarea
      name="cancellationReason"
      placeholder="Describe the reason for the cancellation..."
      validators={{
        required: 'A reason to cancel an attendance is required',
      }}
    />
  )

  async function refetchAttendances() {
    const response = await api.get('/attendances')
    setSelectedAppointment(null)
    setListOfAttendances(response.data)
  }

  const handleUpdateAttendance = async (form: IAttendanceInputs) => {
    try {
      if (!selectedAppointment || !form) return
      await api
        .put(`/attendances/${selectedAppointment.id}`, {
          id: selectedAppointment.id,
          date:
            selectedAppointment.date ??
            formatDate(form.date, 'yyyy-MM-dd HH:mm:ss'),
          status: form.cancellationReason
            ? AttendanceStatus.CANCELED
            : selectedAppointment.status,
          cancellationReason: form.cancellationReason ?? null,
        })
        .then(() => {
          handleCloseModal()
          notification.success({
            title: `Attendance ${
              selectedAppointment.status === AttendanceStatus.CANCELED
                ? 'canceled'
                : 'updated'
            }!`,
          })
          refetchAttendances()
        })
        .catch(({ response }) => notification.error(response.data.error))
    } catch (error) {
      notification.error()
    }
  }

  const handleAttended = async (row: any) => {
    try {
      if (row.status !== AttendanceStatus.IN_PROGRESS) {
        await api
          .put(`/attendances/${row.id}`, {
            id: row.id,
            status: 'INPROGRESS',
          })
          .then(() => {
            router.push(`/dashboard/attendance/${row.id}`)
          })
          .catch(({ response }) => notification.error(response.data.error))
      } else {
        router.push(`/dashboard/attendance/${row.id}`)
      }
    } catch (error) {
      notification.error()
    }
  }

  const handleNotAttended = async (row: any) => {
    try {
      await api
        .put(`/attendances/${row.id}`, {
          id: row.id,
          status: 'NOTATTENDED',
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

  const handleCloseModal = () => {
    setSelectedAppointment(null)
    setIsShowingModal(false)
  }

  const actionButtons = (row: any) => {
    return (
      <Flex flexDirection="row" justifyContent="end">
        {canManageAttendances && (
          <Tooltip title="Attend">
            <Button
              colorScheme="blue"
              variant="solid"
              marginRight={2}
              onClick={() => handleAttended(row)}
              disabled={
                professional?.id !== row.professionalId ||
                (row.status !== AttendanceStatus.CONFIRMED &&
                  row.status !== AttendanceStatus.IN_PROGRESS)
              }
            >
              {row.professional.role === ProfessionalRole.NURSE ? (
                <FaUserNurse />
              ) : (
                <FaStethoscope />
              )}
            </Button>
          </Tooltip>
        )}
        {canManageAppointments && (
          <Tooltip title="Not attended">
            <Button
              colorScheme="red"
              variant="outline"
              marginRight={2}
              onClick={() => handleNotAttended(row)}
              disabled={row.status !== AttendanceStatus.CONFIRMED}
            >
              <FaUserSlash />
            </Button>
          </Tooltip>
        )}

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
            {canManageAppointments &&
              row.status === AttendanceStatus.CONFIRMED && (
                <>
                  <MenuItem
                    icon={<FaUserEdit />}
                    onClick={() => {
                      setSelectedAppointment({ ...row, date: undefined })
                      setModal({
                        icon: AiOutlineInfoCircle,
                        title: 'Reschedule attendance',
                        subtitle:
                          'Select the next time and date for the patient attendance.',
                        body: rescheduleAttendance,
                      })
                      setIsShowingModal(true)
                    }}
                  >
                    Reschedule attendance
                  </MenuItem>
                  <MenuItem
                    icon={<FaUserTimes />}
                    onClick={() => {
                      setSelectedAppointment(row)
                      setModal({
                        icon: AiOutlineWarning,
                        title: 'Cancel attendance',
                        subtitle:
                          'Are you sure you want to cancel this appointment?',
                        body: cancelAttendance,
                      })
                      setIsShowingModal(true)
                    }}
                  >
                    Cancel attendance
                  </MenuItem>
                </>
              )}
            <MenuItem
              icon={<FaHistory />}
              onClick={() =>
                router.push(`/dashboard/patients/view/${row.patientId}`)
              }
            >
              Medical records
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    )
  }

  return (
    <>
      <Paginator
        name="attendance"
        values={listOfAttendances}
        toggleable
        panelContent={<CreateAttendance refetch={refetchAttendances} />}
        canManageCreateButton={canManageAppointments}
        onClickCreateButton={() => {}}
      >
        <Column field="patient.name" header="Patient" sortable />
        <Column field="professional.name" header="Professional" sortable />
        <Column
          field="date"
          header="Date"
          sortable
          body={row => {
            return format(new Date(row.date), 'PPPPpp')
          }}
        />
        <Column
          field="status"
          header="Status"
          sortable
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
        />
        <Column body={actionButtons} exportable={false} />
      </Paginator>

      <Modal
        methods={methods}
        content={modal}
        isVisible={isShowingModal}
        onClose={handleCloseModal}
        onSubmit={handleUpdateAttendance}
      />
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
    props: { attendances: data },
  }
}
