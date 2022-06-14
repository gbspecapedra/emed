import { Stack } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import React from 'react'
import { Chart } from 'react-google-charts'
import { getAPIClient } from '@/services/axios'
import { EMED_TOKEN } from '@/utils/constants'

interface IReportsProps {
  type: any
  status: any
}

const Reports: React.FC<IReportsProps> = ({ type, status }) => {
  const data = status.map(
    ({ status, total }: { status: string; total: number }) => [status, total],
  )

  console.log([['Status', 'Total'], data[0]])

  return (
    <Stack>
      <Chart
        chartType="PieChart"
        data={[
          ['Task', 'Hours per Day'],
          ['Work', 11],
          ['Eat', 2],
          ['Commute', 2],
          ['Watch TV', 2],
          ['Sleep', 7],
        ]}
        options={{
          title: 'Attendance type',
        }}
        width="100%"
        height="400px"
        legendToggle
      />

      <Chart
        chartType="PieChart"
        data={[['Status', 'Total'], data]}
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
