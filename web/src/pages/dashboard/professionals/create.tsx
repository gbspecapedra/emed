import { FormLabel, Heading, HStack } from '@chakra-ui/react'
import { State } from 'country-state-city'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '../../../components/form/input'
import { FormLayout } from '../../../components/form/layout'
import { Select } from '../../../components/form/select'
import { ProfessionalRole } from '../../../models/enums'
import { Specialty } from '../../../models/specialty.model'
import { api } from '../../../services/api'
import { getAPIClient } from '../../../services/axios'
import { useNotification } from '../../../services/hooks/useNotification'
import { EMED_TOKEN } from '../../../utils'
import { emailValidator } from '../../../utils/validators'

interface IProfessionalInputs {
  role: ProfessionalRole
  name: string
  registrationNumber?: number
  registrationState?: string
  specialty?: string
  email: string
}

interface ICreateProfessionalProps {
  specialties: Specialty[]
}

const CreateProfessional: React.FC<ICreateProfessionalProps> = ({
  specialties,
}) => {
  const notification = useNotification()

  const methods = useForm<IProfessionalInputs>({
    mode: 'onChange',
  })

  const watchRole = methods.watch('role')
  const isRequiredForRole = !!watchRole?.match(
    `^((?!(${ProfessionalRole.ADMIN}|${ProfessionalRole.RECEPTIONIST})).)*$`,
  )

  const handleCreateProfessional: SubmitHandler<
    IProfessionalInputs
  > = async values => {
    try {
      await api
        .post('/professionals', {
          ...values,
        })
        .then(() => {
          notification.success({
            title: 'Professional created successfully',
            to: '/dashboard/professionals',
          })
        })
        .catch(({ response }) => {
          notification.error({ message: response.data.error })
        })
    } catch (error) {
      notification.error()
    }
  }

  return (
    <FormLayout
      methods={methods}
      header="Create Professional"
      onSubmit={handleCreateProfessional}
      returnTo="/dashboard/professionals"
    >
      <Select
        label="Role"
        name="role"
        options={Object.keys(ProfessionalRole).map(key => {
          return {
            label: key.charAt(0) + key.slice(1).toLowerCase(),
            value: key,
          }
        })}
        validators={{ required: 'Role is required' }}
      />
      {isRequiredForRole && (
        <>
          <FormLabel>Registration Number / State</FormLabel>
          <HStack>
            <Input
              name="registrationNumber"
              type="number"
              placeholder="000000"
              validators={{ required: isRequiredForRole }}
            />
            <Heading size="lg">/</Heading>
            <Select
              name="registrationState"
              options={State.getAllStates().map(({ name, isoCode }) => {
                return {
                  label: name,
                  value: isoCode,
                }
              })}
              validators={{ required: isRequiredForRole }}
            />
          </HStack>
        </>
      )}
      <Input
        name="name"
        label="Full name"
        placeholder="Jane Doe"
        validators={{ required: 'Name is required' }}
      />
      {isRequiredForRole && (
        <Select
          label="Specialty"
          name="specialty"
          options={specialties.map(({ name }: Specialty) => {
            return {
              label: name,
              value: name,
            }
          })}
          validators={{
            required: isRequiredForRole && 'Specialty is required',
          }}
        />
      )}
      <Input
        name="email"
        label="Email"
        type="email"
        placeholder="your-email@example.com"
        validators={emailValidator}
      />
    </FormLayout>
  )
}

export default CreateProfessional

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

  const { data } = await apiClient.get('/specialties')

  return {
    props: { specialties: data },
  }
}
