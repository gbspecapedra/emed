import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Button,
  Icon,
  FormLabel,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { IInputValidator } from '../../../models/interfaces/inputValidator.interface'

type InputType = 'text' | 'email' | 'password' | 'number'

interface IInputProps extends ChakraInputProps {
  name: string
  type?: InputType
  label?: string
  defaultValue?: any
  validators?: IInputValidator
}

export const Input: React.FC<IInputProps> = ({
  name,
  label,
  type = 'text',
  defaultValue = undefined,
  validators,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const isPassword = type === 'password'
  const [show, setShow] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={validators}
      render={({ field }) => (
        <FormControl isInvalid={!!errors[name]}>
          {label && <FormLabel>{label}</FormLabel>}
          <InputGroup>
            <ChakraInput
              {...field}
              {...props}
              autoFocus
              id={field.name}
              name={field.name}
              type={isPassword && show ? 'text' : type}
              _disabled={{ color: 'gray.800', cursor: 'not-allowed' }}
              _placeholder={{ color: 'gray.500' }}
              data-testid={`input-${name}`}
            />
            {isPassword && (
              <InputRightElement>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="blackAlpha"
                  marginRight={1}
                  onClick={() => setShow(!show)}
                >
                  {show ? (
                    <Icon as={AiOutlineEyeInvisible} />
                  ) : (
                    <Icon as={AiOutlineEye} />
                  )}
                </Button>
              </InputRightElement>
            )}
          </InputGroup>
          {!!errors[name] && (
            <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
          )}
        </FormControl>
      )}
    />
  )
}
