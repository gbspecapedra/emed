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

interface IInputProps extends ChakraInputProps {
  name: string
  type: string
  label?: string
  defaultValue?: string
  validators?: IInputValidator
}

export const Input: React.FC<IInputProps> = ({
  name,
  label,
  type,
  defaultValue = '',
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
        <>
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
                _placeholder={{ color: 'gray.500' }}
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
        </>
      )}
    />
  )
}
