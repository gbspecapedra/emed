import { Stack } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import React from 'react'
import { Chart } from 'react-google-charts'
import { getAPIClient } from '@/services/axios'
import { EMED_TOKEN } from '@/utils/constants'

type ReportType = { [x: string]: any }

interface IReportsProps {
  type: ReportType
  status: ReportType
}

const Reports: React.FC<IReportsProps> = ({ type, status }) => {
  return (
    <Stack>
      <Chart
        chartType="PieChart"
        data={[['Type', 'Total']].concat(
          type.map((obj: ReportType) => {
            return Object.keys(obj).map(key => obj[key])
          }),
        )}
        options={{
          title: 'Attendance type',
        }}
        width="100%"
        height="400px"
        legendToggle
      />

      <Chart
        chartType="PieChart"
        data={[['Status', 'Total']].concat(
          status.map((obj: ReportType) => {
            return Object.keys(obj).map(key => obj[key])
          }),
        )}
        options={{
          title: 'Attendance status',
        }}
        width="100%"
        height="400px"
        legendToggle
      />
    </Stack>
  )
}

export default Reports

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

  const attendanceType = await apiClient.get('/reports/type')
  const attendanceStatus = await apiClient.get('/reports/status')

  return {
    props: { type: attendanceType?.data, status: attendanceStatus?.data },
  }
}
