import {
  Divider,
  Heading,
  SimpleGrid,
  Tag,
  TagLabel,
  HStack,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import React from 'react'
import { Row, ViewLayout } from '../../../../components/form/layout/ViewLayout'
import { AttendanceStatus } from '../../../../models/enums'
import { Patient } from '../../../../models/patient.model'
import { getAPIClient } from '../../../../services/axios'
import { EMED_TOKEN, formatDate } from '../../../../utils'

interface IViewPatientProps {
  patient: Patient
}

const ViewPatient: React.FC<IViewPatientProps> = ({ patient }) => {
  return (
    <ViewLayout
      header={patient.name}
      showTag
      tag={patient.active}
      returnTo="/dashboard/patients"
    >
      <Row title="Social Number" text={`${patient.socialNumber}`} />
      <SimpleGrid columns={2}>
        <Row title="Birthday" text={formatDate(patient.birthday)} />
        <Row title="Gender" text={patient.gender} />
      </SimpleGrid>
      <Row title="Contact" text={patient.contact} />

      <Heading pt={8} size={'md'}>
        Address
      </Heading>
      <Divider />
      <Row title="Zip Code" text={patient.zipcode} />
      <SimpleGrid columns={2}>
        <Row title="Street" text={patient.street} />
        <Row title="Number" text={`${patient.number ?? `na`}`} />
      </SimpleGrid>
      {patient.complement && (
        <Row title="Complement" text={patient.complement} />
      )}
      <SimpleGrid columns={3}>
        <Row title="Country" text={patient.country} />
        <Row title="State" text={patient.state} />
        <Row title="County" text={patient.county} />
      </SimpleGrid>

      <Heading pt={8} size={'md'}>
        Plan
      </Heading>
      <Divider />
      <SimpleGrid columns={2}>
        <Row title="Health Plan" text={patient.healthPlan?.name ?? 'Private'} />
        <Row
          title="Expiration"
          text={formatDate(patient.healthPlanExpiration)}
        />
      </SimpleGrid>

      <Heading pt={8} size={'md'}>
        Attendances
      </Heading>
      <Divider />
      {patient.attendances.map(({ id, type, date, status }) => {
        let color = 'red'
        if (status === AttendanceStatus.IN_PROGRESS) {
          color = 'yellow'
        } else if (status === AttendanceStatus.CONFIRMED) {
          color = 'green'
        } else if (status === AttendanceStatus.DONE) {
          color = 'gray'
        }

        return (
          <SimpleGrid key={`${id}-${type}`} columns={2}>
            <HStack>
              <Row
                text={
                  <Tag
                    size="sm"
                    borderRadius="full"
                    variant="solid"
                    colorScheme={color}
                  >
                    <TagLabel>{status}</TagLabel>
                  </Tag>
                }
              />
              <Row text={type} />
            </HStack>
            <Row title="Date" text={formatDate(date, 'PPPPpp')} />
          </SimpleGrid>
        )
      })}
    </ViewLayout>
  )
}

export default ViewPatient

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
  const { data } = await apiClient.get(`/patients/${params?.id}`)

  return {
    props: { patient: data },
  }
}
