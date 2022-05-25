import { SimpleGrid } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { Row, ViewLayout } from '../../../../components/form/layout/ViewLayout'
import { Professional } from '../../../../models'
import { getAPIClient } from '../../../../services/axios'
import { EMED_TOKEN } from '../../../../utils'

interface IViewProfessionalProps {
  professional: Professional
}

const ViewProfessional: React.FC<IViewProfessionalProps> = ({
  professional,
}) => {
  return (
    <ViewLayout
      header={professional?.name}
      showTag
      tag={professional.active}
      returnTo="/dashboard/professionals"
    >
      <SimpleGrid columns={2}>
        <Row title="Role" text={professional.role} />
        <Row
          title="Registration Number"
          text={`${professional.registrationNumber}/${professional.registrationState}`}
        />
      </SimpleGrid>
      <Row title="Specialty" text={professional.specialty} />
      <Row title="Email" text={professional.email} />
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

  return {
    props: { professionals: data },
  }
}
