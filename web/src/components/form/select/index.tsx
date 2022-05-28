import {
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'
import { IInputValidator } from '../../../models/interfaces'

type Options = { label: string; value: string }

interface ISelectProps extends ChakraSelectProps {
  name: string
  options: Options[]
  label?: string
  defaultValue?: string
  validators?: IInputValidator
}

export const Select: React.FC<ISelectProps> = ({
  name,
  label,
  options,
  defaultValue = '',
  validators,
  ...props
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
        <>
          <FormControl isInvalid={!!errors[name]}>
            {label && <FormLabel>{label}</FormLabel>}
            <ChakraSelect
              {...field}
              {...props}
              autoFocus
              id={field.name}
              name={field.name}
              _placeholder={{ color: 'gray.500' }}
              data-testid={`select-${name}`}
            >
              {options.map(option => (
                <option
                  key={`${option.label}-${option.value}`}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </ChakraSelect>
            {!!errors[name] && (
              <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
            )}
          </FormControl>
        </>
      )}
    />
  )
}
