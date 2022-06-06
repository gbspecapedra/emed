import {
  Button,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form'

interface IFormLayoutProps<T> {
  children: ReactNode
  methods: UseFormReturn<T, any>
  header: ReactNode
  returnTo?: string
  onSubmit: SubmitHandler<T>
}

export function FormLayout<T>({
  children,
  methods,
  header,
  returnTo,
  onSubmit,
}: IFormLayoutProps<T>) {
  const router = useRouter()
  return (
    <FormProvider {...methods}>
      <Flex
        as="form"
        align={'center'}
        justify={'center'}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'5xl'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            {header}
          </Heading>
          {children}
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              w="full"
              colorScheme="red"
              onClick={() => returnTo && router.push(returnTo)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              w="full"
              colorScheme="green"
              isLoading={methods.formState.isSubmitting}
              disabled={!methods.formState.isValid}
              data-testid="submit-form-button"
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </FormProvider>
  )
}
