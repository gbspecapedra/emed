import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  HStack,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Stack,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { Exam } from 'models/exam.model'
import { Medicine } from 'models/medicine.model'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FaTimes } from 'react-icons/fa'
import { GoPlus } from 'react-icons/go'
import { api } from 'services/api'
import { useNotification } from 'services/hooks/useNotification'
import { getAPIClient } from '../../../services/axios'
import { calculateBMI, EMED_TOKEN, nullsToUndefined } from '../../../utils'
import { Input } from '@/components/form/input'
import { Select } from '@/components/form/select'
import { Textarea } from '@/components/form/textarea'
import Table from '@/components/table'
import Tooltip from '@/components/tooltip'
import { Attendance } from '@/models/attendance.model'

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
  attendanceId: number
  attendance: Attendance
  exams: Exam[]
}

const Attendance: React.FC<IAttendanceProps> = ({
  attendanceId,
  attendance: { patient, medicalRecord },
  exams,
}) => {
  const router = useRouter()
  const notification = useNotification()

  const [listOfExams, setListOfExams] = useState<Exam[]>([])
  const [listOfMedicines, setListOfMedicines] = useState<Medicine[]>([])
  const [action, setAction] = useState<'save' | 'finalize'>('save')

  const methods = useForm<IAttendanceInputs>({
    mode: 'onChange',
    defaultValues: nullsToUndefined(medicalRecord),
  })

  const watchWeight = methods.watch('weight')
  const watchHeight = methods.watch('height')

  const { bmi, label } = calculateBMI(
    watchWeight ?? medicalRecord.weight,
    watchHeight ?? medicalRecord.height,
  )

  useEffect(() => {
    methods.setValue('bmi', bmi)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdateAttendance: SubmitHandler<
    IAttendanceInputs
  > = async values => {
    try {
      await api
        .put(`/records/${medicalRecord.id}`, {
          id: medicalRecord.id,
          ...values,
        })
        .then(() => {
          notification.success({
            title: 'Medical record successfully saved',
            to: '/dashboard',
          })
        })
        .catch(({ response }) => {
          notification.error({ message: response.data.error })
        })
    } catch (error) {
      notification.error()
    }
  }

  const handleFinalizeAttendance: SubmitHandler<
    IAttendanceInputs
  > = async values => {
    try {
      await api
        .put(`/attendances/${attendanceId}`, {
          id: attendanceId,
          status: 'DONE',
        })
        .then(() => {
          handleUpdateAttendance(values)
        })
        .catch(({ response }) => notification.error(response.data.error))
    } catch (error) {
      notification.error()
    }
  }

  const handleAttendance: SubmitHandler<IAttendanceInputs> = async values => {
    if (action === 'save') {
      handleUpdateAttendance(values)
    } else {
      handleFinalizeAttendance(values)
    }
  }

  return (
    <FormProvider {...methods}>
      <Flex
        as="form"
        align={'center'}
        justify={'center'}
        onSubmit={methods.handleSubmit(handleAttendance)}
      >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'5xl'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            {`Attendance of ${patient.name}`}
          </Heading>
          <Textarea
            name="description"
            label="Description"
            validators={{ required: 'Description is required' }}
          />
          <Accordion multiple>
            <AccordionTab header="Anthropometry">
              <HStack>
                <Input name="weight" label="Weight" />
                <Input name="height" label="Height" />
                <Box width={'80%'}>
                  <FormLabel textAlign={'right'}>{label}</FormLabel>
                  <InputGroup>
                    <Tooltip title="Body mass index">
                      <InputLeftAddon>BMI</InputLeftAddon>
                    </Tooltip>
                    <Input
                      name="bmi"
                      isDisabled
                      variant="flushed"
                      paddingLeft={4}
                    />
                  </InputGroup>
                </Box>
              </HStack>
            </AccordionTab>
            <AccordionTab header="Vitals">
              <VStack align={'flex-start'}>
                <HStack>
                  <VStack spacing={0} align="flex-start">
                    <FormLabel>Blood pressure</FormLabel>
                    <InputGroup>
                      <Input
                        name="diastolicPressure"
                        borderTopEndRadius={0}
                        borderEndEndRadius={0}
                      />
                      <InputLeftAddon borderRadius={0}>/</InputLeftAddon>
                      <Input name="systolicPressure" borderRadius={0} />
                      <InputRightAddon>mmHg</InputRightAddon>
                    </InputGroup>
                  </VStack>
                </HStack>
                <VStack spacing={0} align="flex-start">
                  <FormLabel>Temperature</FormLabel>
                  <InputGroup>
                    <Input
                      name="temperature"
                      borderTopEndRadius={0}
                      borderEndEndRadius={0}
                    />
                    <InputRightAddon>°C</InputRightAddon>
                  </InputGroup>
                </VStack>
              </VStack>
            </AccordionTab>
            <AccordionTab header="Requested and/or evaluated exams">
              <Table
                values={listOfExams}
                header={
                  <HStack>
                    <Select
                      name="exam"
                      options={exams.map(({ id, name }: Exam) => {
                        return {
                          label: name,
                          value: `${id}`,
                        }
                      })}
                    />
                    <Button
                      colorScheme="green"
                      variant="outline"
                      marginRight={2}
                      onClick={() => {}}
                    >
                      <GoPlus />
                    </Button>
                  </HStack>
                }
              >
                <Column field="name"></Column>
                <Column
                  body={row => (
                    <Button
                      colorScheme="blue"
                      variant="ghost"
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
              <DataTable value={listOfMedicines} responsiveLayout="scroll">
                <Column field="name" header="Name"></Column>
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
              </DataTable>
            </AccordionTab>
          </Accordion>
          <Button>Prescriptions</Button>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              w="full"
              colorScheme="red"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              w="full"
              colorScheme="green"
              isLoading={methods.formState.isSubmitting}
              disabled={!methods.formState.isValid}
              onClick={() => setAction('save')}
              data-testid="save-form-button"
            >
              Save
            </Button>
            <Button
              type="submit"
              w="full"
              colorScheme="blue"
              isLoading={methods.formState.isSubmitting}
              disabled={!methods.formState.isValid}
              onClick={() => setAction('finalize')}
              data-testid="finalize-form-button"
            >
              Finalize attendance
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </FormProvider>
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
  const attendance = await apiClient.get(`/attendances/${params?.id}`)
  const exams = await apiClient.get('/exams')
  const medicines = await apiClient.get('/medicines')

  return {
    props: {
      attendanceId: attendance?.data?.id,
      attendance: attendance?.data,
      exams: exams.data,
      medicines: medicines?.data,
    },
  }
}
