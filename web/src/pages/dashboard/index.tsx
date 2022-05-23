import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
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
import { InputText } from 'primereact/inputtext'
import { Toolbar } from 'primereact/toolbar'
import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { BiDotsVerticalRounded } from 'react-icons/bi'
import { BsExclamationTriangle, BsFillInfoCircleFill } from 'react-icons/bs'
import {
  FaHistory,
  FaStethoscope,
  FaUserEdit,
  FaUserNurse,
  FaUserSlash,
  FaUserTimes,
} from 'react-icons/fa'
import { GoPlus } from 'react-icons/go'
import { SiMicrosoftexcel } from 'react-icons/si'
import Modal from '../../components/modal'
import Tooltip from '../../components/tooltip'
import { Professional } from '../../models'

import { Attendance } from '../../models/attendance.model'
import {
  AttendanceStatus,
  AttendanceType,
  ProfessionalRole,
} from '../../models/enums'
import { Patient } from '../../models/patient.model'
import { api } from '../../services/api'
import { getAPIClient } from '../../services/axios'
import { useAuth } from '../../services/contexts/AuthContext'
import { useNotification } from '../../services/hooks/useNotification'
import { useRoles } from '../../services/hooks/useRoles'
import { EMED_TOKEN, saveAsExcelFile } from '../../utils'

interface DashboardProps {
  attendances: Attendance[]
}

const Dashboard: React.FC<DashboardProps> = ({ attendances }) => {
  const { professional } = useAuth()
  const router = useRouter()
  const {
    canManageAppointments,
    canManageAttendances,
    canManageMedicalRecords,
  } = useRoles()
  const notification = useNotification()
  const table = useRef(null)

  const [globalFilter, setGlobalFilter] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Attendance>(
    {} as Attendance,
  )

  const [listOfAttendances, setListOfAttendances] =
    useState<Attendance[]>(attendances)
  const [listOfPatients, setListOfPatients] = useState<Patient[]>([])
  const [listOfProfessionals, setListOfProfessionals] = useState<
    Professional[]
  >([])

  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false)
  const [openCancelDialog, setOpenCancelDialog] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm()

  async function refetchAttendances() {
    const response = await api.get('/attendances')
    setSelectedAppointment({} as Attendance)
    setListOfAttendances(response.data)
  }

  async function fetchPatients() {
    const response = await api.get('/patients')
    setListOfPatients(response.data)
  }

  async function fetchProfessionals() {
    const response = await api.get('/professionals')
    setListOfProfessionals(response.data)
  }

  const handleCreateAttendance = async (form: any) => {
    handleCloseModal()

    console.log('create')

    // try {
    //   if (!selectedAppointment) return
    //   await api
    //     .post(`/attendances`, {
    //       ...selectedAppointment,
    //     })
    //     .then(() => {
    //       notification.success({
    //         title: 'Attendance created!',
    //       })
    //       refetchAttendances()
    //     })
    //     .catch(({ response }) => notification.error(response.data.error))
    // } catch (error) {
    //   notification.error()
    // }
  }

  const handleUpdateAttendance = async (form: any) => {
    console.log(form)
    handleCloseModal()

    // try {
    //   if (!selectedAppointment) return
    //   await api
    //     .put(`/attendances/${selectedAppointment.id}`, {
    //       id: selectedAppointment.id,
    //       date: formatISO9075(selectedAppointment.date),
    //       status: selectedAppointment.cancellationReason
    //         ? AttendanceStatus.CANCELED
    //         : selectedAppointment.status,
    //       cancellationReason: selectedAppointment.cancellationReason ?? null,
    //     })
    //     .then(() => {
    //       notification.success({
    //         title: `Attendance ${
    //           selectedAppointment.status === AttendanceStatus.CANCELED
    //             ? 'canceled'
    //             : 'updated'
    //         }!`,
    //       })
    //       refetchAttendances()
    //     })
    //     .catch(({ response }) => notification.error(response.data.error))
    // } catch (error) {
    //   notification.error()
    // }
  }

  const handleNotAttended = async (row: any) => {
    try {
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

  const handleExportToExcel = () => {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(attendances)
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })
      saveAsExcelFile(excelBuffer, 'attendances')
    })
  }

  const handleCloseModal = () => {
    setSelectedAppointment({} as Attendance)
    setOpenCreateDialog(false)
    setOpenRescheduleDialog(false)
    setOpenCancelDialog(false)
  }

  const actionButtons = (row: any) => {
    return (
      <Flex flexDirection="row" justifyContent="end">
        {canManageAttendances() && (
          <Tooltip title="Attend">
            <Button
              colorScheme="blue"
              variant="solid"
              marginRight={2}
              onClick={() =>
                router.push(`/dashboard/attendance/${row.patientId}`)
              }
              disabled={professional?.id !== row.professionalId}
            >
              {row.professional.type === ProfessionalRole.NURSE ? (
                <FaUserNurse />
              ) : (
                <FaStethoscope />
              )}
            </Button>
          </Tooltip>
        )}
        {canManageAppointments() && (
          <Tooltip title="Not attended">
            <Button
              colorScheme="red"
              variant="outline"
              marginRight={2}
              onClick={() => handleNotAttended(row)}
            >
              <FaUserSlash />
            </Button>
          </Tooltip>
        )}
        {(canManageAppointments() || canManageMedicalRecords()) && (
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
              {canManageAppointments() && (
                <>
                  <MenuItem
                    icon={<FaUserEdit />}
                    onClick={() => {
                      setSelectedAppointment({ ...row, date: undefined })
                      setOpenRescheduleDialog(true)
                    }}
                  >
                    Reschedule appointment
                  </MenuItem>
                  <MenuItem
                    icon={<FaUserTimes />}
                    onClick={() => {
                      setSelectedAppointment(row)
                      setOpenCancelDialog(true)
                    }}
                  >
                    Cancel appointment
                  </MenuItem>
                </>
              )}
              {canManageMedicalRecords() && (
                <MenuItem
                  icon={<FaHistory />}
                  onClick={() => router.push('/dashboard/medical-record')}
                >
                  Medical Records
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        )}
      </Flex>
    )
  }

  return (
    <>
      <Box>
        <Toolbar
          className="mb-4 bg-white"
          left={
            <Tooltip title="Export to Excel">
              <Button
                type="button"
                colorScheme="gray"
                onClick={handleExportToExcel}
              >
                <SiMicrosoftexcel />
              </Button>
            </Tooltip>
          }
          right={
            <>
              {canManageAppointments() && (
                <Tooltip title="Create new appointment">
                  <Button
                    colorScheme="green"
                    variant="solid"
                    onClick={async () => {
                      await fetchPatients()
                      await fetchProfessionals()
                      setOpenCreateDialog(true)
                    }}
                  >
                    <GoPlus />
                  </Button>
                </Tooltip>
              )}
            </>
          }
        />

        <DataTable
          ref={table}
          dataKey="id"
          value={listOfAttendances}
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
          emptyMessage="No appointments found"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} appointments"
          responsiveLayout="scroll"
          stripedRows
          rowHover
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
        </DataTable>
      </Box>

      <Modal
        title="Create appointment"
        isVisible={openCreateDialog}
        onClose={handleCloseModal}
        onSubmit={handleSubmit(handleCreateAttendance)}
      >
        <FormControl isInvalid={errors.type}>
          <FormLabel htmlFor="type">Type</FormLabel>
          <Select
            id="type"
            placeholder="Select an option"
            {...register('type', {
              required: 'Attendance type is required',
            })}
          >
            {Object.keys(AttendanceType).map((key, index) => {
              return (
                <option key={index} value={key}>
                  {key}
                </option>
              )
            })}
          </Select>
          <FormErrorMessage>
            {errors.type && errors.type.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.professional}>
          <FormLabel htmlFor="professional">Professional</FormLabel>
          <Select
            id="professional"
            placeholder="Select a professional"
            {...register('professional', {
              required: 'Choose a professional is required',
            })}
          >
            {listOfProfessionals
              .filter(professional => {
                if (selectedAppointment.type === AttendanceType.TRIAGE) {
                  return professional.role === ProfessionalRole.NURSE
                }
                return professional.role === ProfessionalRole.DOCTOR
              })
              .map(({ id, name }) => {
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                )
              })}
          </Select>
          <FormErrorMessage>
            {errors.professional && errors.professional.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.patient}>
          <FormLabel htmlFor="patient">Patient</FormLabel>
          <Select
            id="patient"
            placeholder="Select a patient"
            {...register('patient', {
              required: 'Choose a patient is required',
            })}
          >
            {listOfPatients.map(({ id, name }) => {
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              )
            })}
          </Select>
          <FormErrorMessage>
            {errors.patient && errors.patient.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.date}>
          <FormLabel htmlFor="date">Date</FormLabel>
          <Calendar
            id="date"
            value={selectedAppointment?.date}
            minDate={new Date()}
            dateFormat="MM dd, yy"
            disabledDays={[0, 6]}
            hourFormat="12"
            showTime
            readOnlyInput
            {...register('date', {
              required: 'Date is required',
            })}
          />
          <FormErrorMessage>
            {errors.date && errors.date.message}
          </FormErrorMessage>
        </FormControl>
      </Modal>

      <Modal
        title="Reschedule appointment"
        isConfirmation
        isVisible={openRescheduleDialog}
        onClose={handleCloseModal}
        onSubmit={handleSubmit(handleUpdateAttendance)}
      >
        <Stack align="stretch">
          <HStack align="center">
            <BsFillInfoCircleFill size={30} color="blue" />
            <span>
              Select a date for the next attendance for patient{' '}
              <b>{selectedAppointment?.patient?.name}</b>.
            </span>
          </HStack>
          <FormControl isInvalid={errors.date}>
            <Calendar
              id="date"
              value={selectedAppointment?.date}
              minDate={new Date()}
              dateFormat="MM dd, yy"
              disabledDays={[0, 6]}
              hourFormat="12"
              showTime
              readOnlyInput
              {...register('date', {
                required: 'Date is required',
              })}
            />
            <FormErrorMessage>
              {errors.date && errors.date.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>
      </Modal>

      <Modal
        title="Cancel appointment"
        isConfirmation
        isVisible={openCancelDialog}
        onClose={handleCloseModal}
        onSubmit={handleSubmit(handleUpdateAttendance)}
      >
        <Stack align="stretch">
          <HStack align="center">
            <BsExclamationTriangle size={40} color="orange" />
            <span>
              Are you sure you want to cancel the appointment of patient{' '}
              <b>{selectedAppointment?.patient?.name}</b>?
            </span>
          </HStack>

          <FormControl isInvalid={errors.cancellationReason}>
            <Textarea
              id="cancellationReason"
              placeholder="Describe the reason for the cancellation..."
              size="sm"
              resize="none"
              {...register('cancellationReason', {
                required: 'This is required',
              })}
            />
            <FormErrorMessage>
              {errors.cancellationReason && errors.cancellationReason.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>
      </Modal>
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
