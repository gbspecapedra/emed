import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  ResponsiveValue,
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps,
} from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'
import { IInputValidator } from 'models/interfaces'

type Resize = 'none' | 'block' | 'both' | 'horizontal' | 'inline' | 'vertical'

interface ITextareaProps extends ChakraTextareaProps {
  name: string
  label?: string
  defaultValue?: string
  resize?: ResponsiveValue<Resize>
  size?: ResponsiveValue<'sm' | 'md' | 'lg' | (string & {}) | 'xs'>
  validators?: IInputValidator
}

export const Textarea: React.FC<ITextareaProps> = ({
  name,
  label,
  defaultValue = '',
  resize = 'none',
  size = 'sm',
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
        <FormControl isInvalid={!!errors[name]}>
          {label && <FormLabel>{label}</FormLabel>}
          <ChakraTextarea
            {...field}
            {...props}
            autoFocus
            id={field.name}
            name={field.name}
            _disabled={{ color: 'gray.800', cursor: 'not-allowed' }}
            _placeholder={{ color: 'gray.500' }}
            size={size}
            resize={resize}
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
