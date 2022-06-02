import {
  Button,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import { decode } from 'js-base64'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ReactElement, useRef } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '@/components/form/input'
import { useAuth } from '@/services/contexts/AuthContext'
import { passwordStrengthValidator } from '@/utils/validators/passwordValidator'

interface IResetPasswordInputs {
  password: string
  passwordConfirmation: string
}

interface IResetPasswordProps {
  email: string
}

const ResetPassword = ({ email }: IResetPasswordProps) => {
  const emailDecoded = decode(email)

  const { resetPassword } = useAuth()
  const router = useRouter()

  const methods = useForm<IResetPasswordInputs>({
    mode: 'onChange',
  })
  const password = useRef({})
  password.current = methods.watch('password', '')

  const onSubmitHandler: SubmitHandler<IResetPasswordInputs> = async (
    form: IResetPasswordInputs,
  ) => {
    await resetPassword({ ...form, email: emailDecoded })
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <FormProvider {...methods}>
        <Stack
          as="form"
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}
          onSubmit={methods.handleSubmit(form => {
            if (methods.formState.isValid) {
              onSubmitHandler(form)
            }
          })}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Enter new password
          </Heading>
          <Input
            name="password"
            label="Password"
            type="password"
            validators={passwordStrengthValidator}
          />
          <Input
            name="passwordConfirmation"
            label="Password Confirmation"
            type="password"
            validators={{
              required: 'Confirm password is required',
              validate: value => {
                if (password.current) {
                  return (
                    password.current === value ||
                    'The password and confirmation do not match'
                  )
                }
                return false
              },
            }}
          />
          <Stack>
            <Button
              type="submit"
              colorScheme="blue"
              disabled={!methods.formState.isValid}
              isLoading={methods.formState.isSubmitting}
              data-testid="reset-button"
            >
              Update Password
            </Button>
            <Button
              w="full"
              colorScheme="gray"
              onClick={() => router.replace('/')}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </Flex>
  )
}

ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>
}

export default ResetPassword

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      email: ctx.params?.email,
    },
  }
}
