import { Button, Flex, HStack } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { Column } from 'primereact/column'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaTimes } from 'react-icons/fa'
import { GoPlus } from 'react-icons/go'
import { FormLayout } from '@/components/form/layout/FormLayout'
import { Select } from '@/components/form/select'
import Table from '@/components/table'
import { Exam } from '@/models/exam.model'
import { Medicine } from '@/models/medicine.model'
import { getAPIClient } from '@/services/axios'
import { useNotification } from '@/services/hooks/useNotification'
import { EMED_TOKEN } from '@/utils/constants'

interface IPrescriptionInputs {
  exam?: Exam
  medicine?: Medicine
}

interface IPrescriptionProps {
  exams: Exam[]
  medicines: Medicine[]
}

const Prescription: React.FC<IPrescriptionProps> = ({ exams, medicines }) => {
  const notification = useNotification()

  const [listOfExams, setListOfExams] = useState<Exam[]>([])
  const [listOfMedicines, setListOfMedicines] = useState<Medicine[]>([])

  const methods = useForm<IPrescriptionInputs>({
    mode: 'onChange',
  })

  const watchExamId = methods.watch('exam')
  const watchMedicineId = methods.watch('medicine')

  const addExam = () => {
    const exam = exams.find(value => value.id === Number(watchExamId))
    if (exam) setListOfExams([...listOfExams, exam])
  }

  const addMedicine = () => {
    const med = medicines.find(value => value.id === Number(watchMedicineId))
    if (med) setListOfMedicines([...listOfMedicines, med])
  }

  const handleUpdateAttendance: SubmitHandler<
    IPrescriptionInputs
  > = async () => {
    console.log(listOfExams)
    console.log(listOfMedicines)
  }

  return (
    <FormLayout
      methods={methods}
      header="Prescriptions"
      onSubmit={handleUpdateAttendance}
      returnTo="/attendance"
    >
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
              onClick={() => addExam()}
            >
              <GoPlus />
            </Button>
          </HStack>
        }
      >
        <Column field="name"></Column>
        <Column
          body={row => (
            <Flex flexDirection="row" justifyContent="end">
              <Button
                colorScheme="red"
                variant="ghost"
                onClick={() => {
                  setListOfExams(listOfExams.filter(({ id }) => id !== row.id))
                }}
              >
                <FaTimes />
              </Button>
            </Flex>
          )}
          exportable={false}
        />
      </Table>
      <Table
        values={listOfMedicines}
        header={
          <HStack>
            <Select
              name="exam"
              options={medicines.map(({ id, name }: Medicine) => {
                return {
                  label: name,
                  value: `${id}`,
                }
              })}
            />
            <Button
              colorScheme="green"
              variant="outline"
              onClick={() => addMedicine()}
            >
              <GoPlus />
            </Button>
          </HStack>
        }
      >
        <Column field="name"></Column>
        <Column
          body={row => (
            <Flex flexDirection="row" justifyContent="end">
              <Button
                colorScheme="red"
                variant="ghost"
                onClick={() => {
                  setListOfMedicines(
                    listOfMedicines.filter(({ id }) => id !== row.id),
                  )
                }}
              >
                <FaTimes />
              </Button>
            </Flex>
          )}
          exportable={false}
        />
      </Table>
    </FormLayout>
  )
}

export default Prescription

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

  const exams = await apiClient.get('/exams')
  const medicines = await apiClient.get('/medicines')

  return {
    props: { exams: exams.data, medicines: medicines?.data },
  }
}
