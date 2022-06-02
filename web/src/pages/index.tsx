import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import type { ReactElement } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '../components/form/input'
import { TextButtonLink } from '../components/form/textButtonLink'
import { useAuth } from '../services/contexts/AuthContext'
import { emailValidator } from '../utils/validators'

interface ILoginInputs {
  email: string
  password: string
}

const Home = () => {
  const { signIn } = useAuth()

  const methods = useForm<ILoginInputs>({
    mode: 'onChange',
  })

  const onSubmitHandler: SubmitHandler<ILoginInputs> = async (
    form: ILoginInputs,
  ) => {
    await signIn(form)
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Flex justify={'center'}>
          <Heading fontSize={'4xl'}>Welcome Back</Heading>
        </Flex>
        <FormProvider {...methods}>
          <Box
            as="form"
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
            onSubmit={methods.handleSubmit(form => {
              if (methods.formState.isValid) {
                onSubmitHandler(form)
              }
            })}
          >
            <Stack spacing={4}>
              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="your-email@example.com"
                validators={emailValidator}
              />
              <Input
                name="password"
                label="Password"
                type="password"
                validators={{ required: 'Password is required' }}
              />
              <Stack spacing={10}>
                <Flex align={'start'} justify={'right'}>
                  <TextButtonLink label="Forgot my password" href="/password" />
                </Flex>
                <Button
                  type="submit"
                  colorScheme="blue"
                  disabled={!methods.formState.isValid}
                  isLoading={methods.formState.isSubmitting}
                  data-testid="signin-button"
                >
                  Sign-in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </FormProvider>
      </Stack>
    </Flex>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>
}

export default Home
