import { Wrap, WrapItem } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import {
  Header,
  ListOfAttendances,
  Row,
  ViewLayout,
} from '../../../../components/form/layout/ViewLayout'
import { Professional } from '../../../../models'
import { getAPIClient } from '../../../../services/axios'
import { formatProfessional } from '../../../../services/professionals'
import { EMED_TOKEN } from '../../../../utils'

interface IViewProfessionalProps {
  professional: Professional
}

const ViewProfessional: React.FC<IViewProfessionalProps> = ({
  professional,
}) => {
  return (
    <ViewLayout header={professional.name} showTag tag={professional.active}>
      <Wrap justify={'space-between'}>
        <WrapItem>
          <Row title="Role" text={professional.role} />
        </WrapItem>
        <WrapItem>
          <Row title="Registration Number" text={professional.registration} />
        </WrapItem>
      </Wrap>
      <Row title="Specialty" text={professional.specialty} />
      <Row title="Email" text={professional.email} />

      <Header title="Attendances" />
      <ListOfAttendances attendances={professional.attendances} />
    </ViewLayout>
  )
}

export default ViewProfessional

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
  const { data } = await apiClient.get(`/professionals/${params?.id}`)
  const professional = formatProfessional([data])

  return {
    props: { professional: professional[0] },
  }
}
