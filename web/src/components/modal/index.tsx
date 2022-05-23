import {
  Button,
  HStack,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'

interface IModalProps {
  children: ReactNode
  title: string
  isVisible: boolean
  isConfirmation?: boolean
  onClose: () => void
  onSubmit: () => void
}

export default function Modal({
  children,
  title,
  isVisible,
  isConfirmation = false,
  onClose,
  onSubmit,
}: IModalProps) {
  return (
    <ChakraModal onClose={onClose} isOpen={isVisible} isCentered size="lg">
      <ModalOverlay />

      <ModalContent as="form" onSubmit={onSubmit} noValidate>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <HStack>
            <Button leftIcon={<FaTimes />} colorScheme="red" onClick={onClose}>
              {isConfirmation ? 'No' : 'Cancel'}
            </Button>
            <Button type="submit" leftIcon={<FaCheck />} colorScheme="green">
              {isConfirmation ? 'Yes' : 'Save'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  )
}
