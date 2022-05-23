import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { Column } from 'primereact/column'
import React from 'react'
import Table from '../../../components/table'

import { Exam } from '../../../models/exam.model'
import { getAPIClient } from '../../../services/axios'
import { EMED_TOKEN } from '../../../utils'

interface IExamsProps {
  exams: Exam[]
}

const Exams: React.FC<IExamsProps> = ({ exams }) => {
  return (
    <Table values={exams}>
      <Column field="name" header="Name" sortable />
      <Column field="description" header="Description" sortable />
    </Table>
  )
}

export default Exams

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

  const { data } = await apiClient.get('/exams')

  return {
    props: { exams: data },
  }
}
