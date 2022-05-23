import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { Column } from 'primereact/column'

import React from 'react'
import Table from '../../../components/table'

import { Medicine } from '../../../models/medicine.model'
import { getAPIClient } from '../../../services/axios'
import { EMED_TOKEN } from '../../../utils'

interface IMedicinesProps {
  medicines: Medicine[]
}

const Medicines: React.FC<IMedicinesProps> = ({ medicines }) => {
  return (
    <Table values={medicines}>
      <Column field="name" header="Name" sortable />
      <Column field="substance" header="Substance" sortable />
      <Column field="producer" header="Producer" sortable />
      <Column field="concentration" header="Concentration" sortable />
      <Column field="usage" header="Usage" sortable />
    </Table>
  )
}

export default Medicines

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

  const { data } = await apiClient.get('/medicines')

  return {
    props: { medicines: data },
  }
}
