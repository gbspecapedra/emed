import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import React from 'react'
import { Patient } from '../../../models/patient.model'
import { getAPIClient } from '../../../services/axios'
import { EMED_TOKEN } from '../../../utils'

interface IAttendanceProps {
  patient: Patient
}

const Attendance: React.FC<IAttendanceProps> = ({ patient }) => {
  return <div>{`Attendance ${patient?.name}`}</div>
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

  const { data } = await apiClient.get(`/patients/${ctx.params?.id}`)

  return {
    props: { patient: data },
  }
}
