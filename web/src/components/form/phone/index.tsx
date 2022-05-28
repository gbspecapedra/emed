import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'
import PhoneInput from 'react-phone-input-2'
import { IInputValidator } from '../../../models/interfaces/inputValidator.interface'

import 'react-phone-input-2/lib/style.css'

interface IInputPhoneProps {
  name: string
  label?: string
  defaultValue?: string
  validators?: IInputValidator
}

export const InputPhone: React.FC<IInputPhoneProps> = ({
  name,
  label,
  defaultValue = '',
  validators,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={validators}
      render={({ field }) => (
        <FormControl isInvalid={!!errors[name]}>
          {label && <FormLabel>{label}</FormLabel>}
          <PhoneInput
            country={'br'}
            value={field.value}
            onChange={value => field.onChange(value)}
            enableSearch
            enableAreaCodes
            inputStyle={{
              height: '2.5rem',
            }}
            data-testid={`input-${name}`}
          />

          {!!errors[name] && (
            <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
          )}
        </FormControl>
      )}
    />
  )
}
