import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { Patient } from '../../../../models/patient.model'
import { getAPIClient } from '../../../../services/axios'
import { EMED_TOKEN } from '../../../../utils'

interface IViewPatientProps {
  patient: Patient
}

const ViewPatient: React.FC<IViewPatientProps> = ({ patient }) => {
  return <div>View</div>
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
