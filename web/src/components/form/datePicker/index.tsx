import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import { Calendar, CalendarProps } from 'primereact/calendar'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { IInputValidator } from '../../../models/interfaces'

interface IDatePickerProps extends CalendarProps {
  name: string
  label?: string
  defaultValue?: string
  validators?: IInputValidator
  showTime?: boolean
  showIcon?: boolean
  inline?: boolean
}

export const DatePicker: React.FC<IDatePickerProps> = ({
  name,
  label,
  defaultValue = '',
  validators,
  showTime = false,
  showIcon = true,
  inline = false,
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
        <FormControl isInvalid={!!errors[name]}>
          {label && <FormLabel>{label}</FormLabel>}
          <Calendar
            {...field}
            {...props}
            id={field.name}
            value={field.value}
            onChange={e => field.onChange(e.value)}
            dateFormat="dd/mm/yy"
            mask="99/99/9999"
            showIcon={showIcon}
            showTime={showTime}
            readOnlyInput
            hideOnDateTimeSelect
            style={{
              height: !inline && '2.5rem',
              width: 'inherit',
            }}
            inline={inline}
            data-testid={`datepicker-${name}`}
          />
          {!!errors[name] && (
            <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
          )}
        </FormControl>
      )}
    />
  )
}
