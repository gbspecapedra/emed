import { Input } from '@/components/form/input'
import { FormLayout } from '@/components/form/layout/FormLayout'
import { Textarea } from '@/components/form/textarea'
import { MedicalRecord } from 'models/record.model'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import React, { useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { api } from 'services/api'
import { useNotification } from 'services/hooks/useNotification'
import { Patient } from '../../../models/patient.model'
import { getAPIClient } from '../../../services/axios'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { EMED_TOKEN } from '../../../utils'
import {
  Button,
  FormLabel,
  HStack,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Text,
  VStack,
} from '@chakra-ui/react'
import Tooltip from '@/components/tooltip'
import Table from '@/components/table'
import { Exam } from 'models/exam.model'
import { GoPlusSmall } from 'react-icons/go'
import { Column } from 'primereact/column'
import { FaTimes } from 'react-icons/fa'
import { Medicine } from 'models/medicine.model'

interface IAttendanceInputs {
  description?: string
  weight?: number
  height?: number
  bmi?: string
  diastolicPressure?: number
  systolicPressure?: number
  temperature?: number
}

interface IAttendanceProps {
  patient: Patient
  medicalRecord: MedicalRecord
}

const Attendance: React.FC<IAttendanceProps> = ({ patient, medicalRecord }) => {
  const notification = useNotification()

  const [listOfExams, setListOfExams] = useState<Exam[]>([])
  const [listOfMedicines, setListOfMedicines] = useState<Medicine[]>([])

  const methods = useForm<IAttendanceInputs>({
    mode: 'onChange',
    defaultValues: medicalRecord,
  })

  const watchWeight = methods.watch('weight')
  const watchHeight = methods.watch('height')
  useMemo(() => {
    methods.setValue(
      'bmi',
      ((watchWeight ?? 0) / ((watchHeight ?? 0) * (watchHeight ?? 0))).toFixed(
        2,
      ),
    )
  }, [watchWeight, watchHeight])

  const handleUpdateAttendance: SubmitHandler<
    IAttendanceInputs
  > = async values => {
    try {
      await api
        .put('/records', {
          ...values,
        })
        .then(() => {
          notification.success({
            title: 'Medical record successfully finished',
            to: '/dashboard/patients',
          })
        })
        .catch(({ response }) => {
          notification.error({ message: response.data.error })
        })
    } catch (error) {
      notification.error()
    }
  }

  return (
    <FormLayout
      methods={methods}
      header={`Attendance of ${patient.name}`}
      onSubmit={handleUpdateAttendance}
      returnTo="/dashboard/patients"
    >
      <Textarea name="description" label="Description" />
      <Accordion multiple>
        <AccordionTab header="Anthropometry">
          <HStack>
            <Input name="weight" label="Weight" />
            <Input name="height" label="Height" />
            <InputGroup paddingTop={8}>
              <Tooltip title="Body mass index">
                <InputLeftAddon children="BMI" />
              </Tooltip>
              <Input name="bmi" isDisabled variant="flushed" paddingLeft={4} />
            </InputGroup>
          </HStack>
        </AccordionTab>
        <AccordionTab header="Vitals">
          <VStack align={'flex-start'}>
            <HStack>
              <VStack spacing={0} align="flex-start">
                <FormLabel>Blood pressure</FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    name="diastolicPressure"
                    borderTopEndRadius={0}
                    borderEndEndRadius={0}
                  />
                  <InputLeftAddon children="/" borderRadius={0} />
                  <Input
                    type="number"
                    name="systolicPressure"
                    borderRadius={0}
                  />
                  <InputRightAddon children="mmHg" />
                </InputGroup>
              </VStack>
            </HStack>
            <VStack spacing={0} align="flex-start">
              <FormLabel>Temperature</FormLabel>
              <InputGroup>
                <Input
                  type="number"
                  name="temperature"
                  borderTopEndRadius={0}
                  borderEndEndRadius={0}
                />
                <InputRightAddon children="°C" />
              </InputGroup>
            </VStack>
          </VStack>
        </AccordionTab>
        <AccordionTab header="Requested and/or evaluated exams">
          <Table
            values={listOfExams}
            header={
              <Tooltip title="Add an exam">
                <Button colorScheme="green" variant="solid" onClick={() => {}}>
                  <GoPlusSmall />
                </Button>
              </Tooltip>
            }
          >
            <Column field="name" header="Name" sortable />
            <Column
              body={row => (
                <Button
                  colorScheme="blue"
                  variant="solid"
                  marginRight={2}
                  onClick={() => console.log(row)}
                >
                  <FaTimes />
                </Button>
              )}
              exportable={false}
            />
          </Table>
        </AccordionTab>
        <AccordionTab header="Prescription medicines">
          <Table
            values={listOfMedicines}
            header={
              <Tooltip title="Add a medicine">
                <Button colorScheme="green" variant="solid" onClick={() => {}}>
                  <GoPlusSmall />
                </Button>
              </Tooltip>
            }
          >
            <Column field="name" header="Name" sortable />
            <Column
              body={row => (
                <Button
                  colorScheme="blue"
                  variant="solid"
                  marginRight={2}
                  onClick={() => console.log(row)}
                >
                  <FaTimes />
                </Button>
              )}
              exportable={false}
            />
          </Table>
        </AccordionTab>
      </Accordion>
      <Button>Prescriptions</Button>
    </FormLayout>
  )
}

export default Attendance

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

  const { params } = ctx
  const { data } = await apiClient.get(`/attendances/${params?.id}`)

  return {
    props: { patient: data?.patient, medicalRecord: data?.medicalRecord },
  }
}
