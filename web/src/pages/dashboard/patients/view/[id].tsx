import { Wrap, WrapItem } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import React from 'react'
import {
  Header,
  ListOfAttendances,
  Row,
  ViewLayout,
} from '../../../../components/form/layout/ViewLayout'
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
      <Wrap justify={'space-between'}>
        <WrapItem>
          <Row title="Birthday" text={formatDate(patient.birthday)} />
        </WrapItem>
        <WrapItem>
          <Row title="Gender" text={patient.gender} />
        </WrapItem>
      </Wrap>
      <Row title="Contact" text={patient.contact} />

      <Header title="Address" />
      <Row title="Zip Code" text={patient.zipcode} />
      <Wrap justify={'space-between'}>
        <WrapItem>
          <Row title="Street" text={patient.street} />
        </WrapItem>
        <WrapItem>
          <Row title="Number" text={`${patient.number ?? `na`}`} />
        </WrapItem>
      </Wrap>
      {patient.complement && (
        <Row title="Complement" text={patient.complement} />
      )}
      <Wrap justify={'space-between'}>
        <WrapItem>
          <Row title="Country" text={patient.country} />
        </WrapItem>
        <WrapItem>
          <Row title="State" text={patient.state} />
        </WrapItem>
        <WrapItem>
          <Row title="County" text={patient.county} />
        </WrapItem>
      </Wrap>

      <Header title="Plan" />
      <Wrap justify={'space-between'}>
        <WrapItem>
          <Row
            title="Health Plan"
            text={patient.healthPlan?.name ?? 'Private'}
          />
        </WrapItem>
        <WrapItem>
          <Row
            title="Expiration"
            text={formatDate(patient.healthPlanExpiration)}
          />
        </WrapItem>
      </Wrap>

      <Header title="Attendances" />
      <ListOfAttendances attendances={patient.attendances} />
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
