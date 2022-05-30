import {
  Button,
  HStack,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ResponsiveValue,
} from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form'
import { FaCheck, FaTimes } from 'react-icons/fa'

interface IModalProps<T> {
  children: ReactNode
  methods: UseFormReturn<T, any>
  title: string
  isVisible: boolean
  isConfirmation?: boolean
  size?:
    | ResponsiveValue<
        | 'lg'
        | 'sm'
        | 'md'
        | 'xl'
        | '2xl'
        | (string & {})
        | 'xs'
        | '3xl'
        | '4xl'
        | '5xl'
        | '6xl'
        | 'full'
      >
    | undefined
  onClose: () => void
  onSubmit: SubmitHandler<T>
}

export default function Modal<T>({
  children,
  methods,
  title,
  isVisible,
  isConfirmation = false,
  size = 'md',
  onClose,
  onSubmit,
}: IModalProps<T>) {
  return (
    <ChakraModal onClose={onClose} isOpen={isVisible} isCentered size={size}>
      <ModalOverlay />

      <FormProvider {...methods}>
        <ModalContent
          as="form"
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
        >
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <HStack>
              <Button
                leftIcon={<FaTimes />}
                colorScheme="red"
                onClick={onClose}
              >
                {isConfirmation ? 'No' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                leftIcon={<FaCheck />}
                colorScheme="green"
                onClick={onClose}
              >
                {isConfirmation ? 'Yes' : 'Save'}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </FormProvider>
    </ChakraModal>
  )
}
