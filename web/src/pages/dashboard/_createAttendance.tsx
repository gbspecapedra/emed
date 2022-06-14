import { Button, Flex, Heading, HStack, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { DatePicker } from '@/components/form/datePicker'
import { Select } from '@/components/form/select'
import { AttendanceType, ProfessionalRole } from '@/models/enums'
import { Patient } from '@/models/patient.model'
import { Professional } from '@/models/professional.model'
import { api } from '@/services/api'
import { useNotification } from '@/services/hooks/useNotification'

interface IAttendanceInputs {
  type: AttendanceType
  professional: string
  patient: string
  date: Date
}

interface ICreateAttendanceProps {
  refetch: () => void
}

const CreateAttendance: React.FC<ICreateAttendanceProps> = ({ refetch }) => {
  const notification = useNotification()
  const [listOfPatients, setListOfPatients] = useState<Patient[]>([])
  const [listOfProfessionals, setListOfProfessionals] = useState<
    Professional[]
  >([])

  const methods = useForm<IAttendanceInputs>({
    mode: 'onChange',
  })

  const watchType = methods.watch('type')

  const handleCreateAttendance = async (form: IAttendanceInputs) => {
    try {
      await api
        .post('/attendances', {
          type: form.type,
          professionalId: Number(form.professional),
          patientId: Number(form.patient),
          date: form.date,
        })
        .then(() => {
          notification.success({
            title: 'Attendance created!',
          })
          methods.reset()
          refetch()
        })
        .catch(({ response }) => notification.error(response.data.error))
    } catch (error) {
      notification.error()
    }
  }

  async function fetchPatients() {
    const response = await api.get('/patients')
    setListOfPatients(response.data)
  }

  async function fetchProfessionals() {
    const response = await api.get('/professionals')
    setListOfProfessionals(response.data)
  }

  useEffect(() => {
    async function load() {
      await fetchProfessionals()
      await fetchPatients()
    }

    load()
  }, [])

  return (
    <FormProvider {...methods}>
      <Flex
        as="form"
        align={'center'}
        justify={'center'}
        onSubmit={methods.handleSubmit(handleCreateAttendance)}
      >
        <Stack spacing={4} w={'full'} maxW={'5xl'}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            Create new appointment
          </Heading>
          <HStack>
            <Select
              name="type"
              label="Type"
              options={Object.keys(AttendanceType).map(key => {
                return {
                  label: key,
                  value: key,
                }
              })}
              validators={{ required: 'Attendance type is required' }}
            />
            <DatePicker
              name="date"
              label="Date"
              placeholder="DD/MM/YYYY"
              minDate={new Date()}
              disabledDays={[0, 6]}
              showTime
              stepMinute={15}
              validators={{ required: 'Date is required' }}
            />
          </HStack>
          <HStack>
            <Select
              name="professional"
              label="Professional"
              options={listOfProfessionals
                .filter(professional => {
                  if (watchType === AttendanceType.TRIAGE) {
                    return professional.role === ProfessionalRole.NURSE
                  }
                  return professional.role === ProfessionalRole.DOCTOR
                })
                .map(({ id, name }) => {
                  return {
                    label: name,
                    value: id.toString(),
                  }
                })}
              validators={{ required: 'Professional is required' }}
            />

            <Select
              name="patient"
              label="Patient"
              options={listOfPatients.map(({ id, name }) => {
                return {
                  label: name,
                  value: id.toString(),
                }
              })}
              validators={{ required: 'Patient is required' }}
            />
          </HStack>
          <Button
            type="submit"
            w="full"
            colorScheme="green"
            isLoading={methods.formState.isSubmitting}
            disabled={!methods.formState.isValid}
            data-testid="submit-form-button"
          >
            Save
          </Button>
        </Stack>
      </Flex>
    </FormProvider>
  )
}

export default CreateAttendance
