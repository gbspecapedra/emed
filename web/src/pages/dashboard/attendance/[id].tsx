import { MedicalRecord } from 'models/record.model'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import React from 'react'
import { Patient } from '../../../models/patient.model'
import { getAPIClient } from '../../../services/axios'
import { EMED_TOKEN } from '../../../utils'

interface IAttendanceProps {
  patient: Patient
  medicalRecord: MedicalRecord
}

const Attendance: React.FC<IAttendanceProps> = ({ patient, medicalRecord }) => {
  console.log(medicalRecord)
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

  const { params } = ctx
  const { data } = await apiClient.get(`/attendances/${params?.id}`)

  return {
    props: { patient: data?.patient, medicalRecord: data?.medicalRecord },
  }
}
