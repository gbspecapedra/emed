import {
  Button,
  HStack,
  Icon,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react'
import React, { ElementType } from 'react'
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form'

export interface IModalInputs {
  icon?: ElementType
  title: string
  subtitle: string
  body: JSX.Element
}

export const initialValues: IModalInputs = {
  title: '',
  subtitle: '',
  body: <></>,
}

interface IModalProps<T> {
  methods: UseFormReturn<T, any>
  content: IModalInputs
  isVisible: boolean
  onClose: () => void
  onSubmit: SubmitHandler<T>
}

export default function Modal<T>({
  methods,
  content: { icon, title, subtitle, body },
  isVisible,
  onClose,
  onSubmit,
}: IModalProps<T>) {
  return (
    <ChakraModal onClose={onClose} isOpen={isVisible} isCentered size="lg">
      <ModalOverlay />

      <FormProvider {...methods}>
        <ModalContent
          as="form"
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
        >
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <Stack align="stretch">
              <HStack align="center" justify="center">
                {icon && <Icon as={icon} fontSize="30" />}
                <span>{subtitle}</span>
              </HStack>
              {body}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button colorScheme="red" onClick={onClose}>
                No
              </Button>
              <Button type="submit" colorScheme="green" onClick={onClose}>
                Yes
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </FormProvider>
    </ChakraModal>
  )
}
