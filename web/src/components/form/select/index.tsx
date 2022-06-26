import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import { Dropdown, DropdownProps } from 'primereact/dropdown'
import { Controller, useFormContext } from 'react-hook-form'
import { IInputValidator } from '../../../models/interfaces'

type Options = { label: string; value: string }

interface ISelectProps extends DropdownProps {
  name: string
  options: Options[]
  label?: string
  defaultValue?: string
  placeholder?: string
  validators?: IInputValidator
}

export const Select: React.FC<ISelectProps> = ({
  name,
  label,
  options,
  defaultValue = '',
  placeholder = 'Select an option',
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
            <Dropdown
              {...field}
              {...props}
              id={field.name}
              name={field.name}
              value={field.value}
              onChange={e => field.onChange(e.value)}
              options={options}
              placeholder={placeholder}
              filter
              filterBy="label"
              resetFilterOnHide
              style={{
                width: 'inherit',
              }}
              panelStyle={{
                maxWidth: '700px',
              }}
              data-testid={`select-${name}`}
            />
            {!!errors[name] && (
              <FormErrorMessage><>{errors[name]?.message}</></FormErrorMessage>
            )}
          </FormControl>
        </>
      )}
    />
  )
}
