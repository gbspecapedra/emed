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
import { Patient } from '../../../models/patient.model'
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

interface IUpdatePatientProps {
  patient: Patient
  plans: HealthPlan[]
}

const UpdatePatient: React.FC<IUpdatePatientProps> = ({ patient, plans }) => {
  const notification = useNotification()

  console.log(patient)

  const methods = useForm<IPatientInputs>({
    mode: 'onChange',
    defaultValues: { ...patient },
  })

  const watchCountry = methods.watch('country')
  const watchState = methods.watch('state')
  const watchPlan = methods.watch('healthPlanId')

  const handleUpdatePatient: SubmitHandler<IPatientInputs> = async values => {
    try {
      await api
        .put(`/patients/${patient.id}`, {
          id: patient.id,
          ...values,
        })
        .then(() => {
          notification.success({
            title: 'Patient updated successfully',
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
      header="Update Patient"
      onSubmit={handleUpdatePatient}
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
          isDisabled
        />
      </HStack>

      <HStack>
        <DatePicker
          name="birthday"
          label="Birthday"
          placeholder="DD/MM/YYYY"
          validators={{ required: 'Birthday is required' }}
        />
        <Select
          name="gender"
          label="Gender"
          placeholder="Select an option"
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
        <Select
          name="country"
          label="Country"
          placeholder="Select an option"
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
          placeholder="Select an option"
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
          placeholder="Select an option"
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
        placeholder="Select an option"
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
          validators={{
            required: !!watchPlan && 'Expiration date is required',
          }}
        />
      )}
    </FormLayout>
  )
}

export default UpdatePatient

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
  const patient = await apiClient.get(`/patients/${params?.id}`)
  const plans = await apiClient.get('/plans')

  return {
    props: { patient: patient.data, plans: plans.data },
  }
}
