import { HStack } from '@chakra-ui/react'
import { City, Country, State } from 'country-state-city'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { DatePicker } from '../../../components/form/datePicker'
import { Input } from '../../../components/form/input'
import { FormLayout } from '../../../components/form/layout/FormLayout'
import { InputPhone } from '../../../components/form/phone'
import { Select } from '../../../components/form/select'
import { HealthPlan } from '../../../models/plan.model'
import { api } from '../../../services/api'
import { getAPIClient } from '../../../services/axios'
import { useNotification } from '../../../services/hooks/useNotification'
import { EMED_TOKEN, GENDER } from '../../../utils'

interface IPatientInputs {
  name: string
  socialNumber: number
  birthday: Date
  gender: string
  contact: string

  zipcode: string
  street: string
  number?: number
  complement?: string
  country: string
  state: string
  city: string
  county: string

  healthPlanId?: number
  healthPlanExpiration?: Date
}

interface ICreatePatientProps {
  plans: HealthPlan[]
}

const CreatePatient: React.FC<ICreatePatientProps> = ({ plans }) => {
  const notification = useNotification()

  const methods = useForm<IPatientInputs>({
    mode: 'onChange',
  })

  const watchCountry = methods.watch('country')
  const watchState = methods.watch('state')
  const watchPlan = methods.watch('healthPlanId')

  const handleCreatePatient: SubmitHandler<IPatientInputs> = async values => {
    try {
      await api
        .post('/patients', {
          ...values,
        })
        .then(() => {
          notification.success({
            title: 'Patient created successfully',
            to: '/dashboard/patients',
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
      header="Create Patient"
      onSubmit={handleCreatePatient}
      returnTo="/dashboard/patients"
    >
      <HStack>
        <Input
          name="name"
          label="Full name"
          placeholder="Jane Doe"
          validators={{ required: 'Name is required' }}
        />
        <Input
          name="socialNumber"
          label="Social Number"
          type="number"
          placeholder="000000"
          validators={{ required: 'Social number is required' }}
        />
      </HStack>

      <HStack>
        <DatePicker
          name="birthday"
          label="Birthday"
          placeholder="DD/MM/YYYY"
          maxDate={new Date()}
          validators={{ required: 'Birthday is required' }}
        />
        <Select
          name="gender"
          label="Gender"
          options={GENDER.map(({ value }) => {
            return {
              label: value,
              value: value,
            }
          })}
          validators={{ required: 'Gender is required' }}
        />
        <InputPhone
          name="contact"
          label="Contact"
          validators={{ required: 'Contact is required' }}
        />
      </HStack>

      <Input
        name="zipcode"
        label="Zip Code"
        validators={{ required: 'Zip code is required' }}
      />

      <HStack>
        <Input
          name="street"
          label="Street"
          validators={{ required: 'Street name is required' }}
        />
        <Input name="number" label="Number" />
      </HStack>

      <Input name="complement" label="Complement" />

      <HStack>
        <Select
          name="country"
          label="Country"
          options={Country.getAllCountries().map(({ name, isoCode }) => {
            return {
              label: name,
              value: isoCode,
            }
          })}
          validators={{ required: 'Country is required' }}
        />
        <Select
          name="state"
          label="State/Region/Province"
          options={State.getStatesOfCountry(watchCountry).map(
            ({ name, isoCode }) => {
              return {
                label: name,
                value: isoCode,
              }
            },
          )}
          validators={{ required: 'State/Region/Province is required' }}
        />
      </HStack>

      <HStack>
        <Select
          name="city"
          label="City"
          options={City.getCitiesOfState(watchCountry, watchState).map(
            ({ name }) => {
              return {
                label: name,
                value: name,
              }
            },
          )}
          validators={{ required: 'City is required' }}
        />
        <Input
          name="county"
          label="County"
          validators={{
            required: 'County is required',
          }}
        />
      </HStack>

      <Select
        name="healthPlanId"
        label="Health Plan"
        options={plans.map(({ id, registrationNumber, name }: HealthPlan) => {
          return {
            label: `${name} - ${registrationNumber}`,
            value: id,
          }
        })}
      />

      {!!watchPlan && (
        <DatePicker
          name="healthPlanExpiration"
          label="Expiration date"
          placeholder="DD/MM/YYYY"
          minDate={new Date()}
          validators={{
            required: !!watchPlan && 'Expiration date is required',
          }}
        />
      )}
    </FormLayout>
  )
}

export default CreatePatient

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

  const { data } = await apiClient.get('/plans')

  return {
    props: { plans: data },
  }
}
