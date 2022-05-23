import { Button } from '@chakra-ui/react'
import { Dialog as PrimeReactDialog } from 'primereact/dialog'
import React, { ReactNode } from 'react'

import { FaCheck, FaTimes } from 'react-icons/fa'

interface IDialogProps {
  children: ReactNode
  title: string
  isVisible: boolean
  isConfirmation?: boolean
  onCancel: () => void
  onSubmit: () => void
}

export default function Dialog({
  children,
  title,
  isVisible,
  isConfirmation = false,
  onCancel,
  onSubmit,
}: IDialogProps) {
  return (
    <PrimeReactDialog
      modal
      header={title}
      visible={isVisible}
      className="p-fluid"
      style={{ width: '450px' }}
      closable={false}
      resizable={false}
      onHide={onCancel}
      footer={
        <>
          <Button leftIcon={<FaTimes />} colorScheme="red" onClick={onCancel}>
            {isConfirmation ? 'No' : 'Cancel'}
          </Button>
          <Button
            leftIcon={<FaCheck />}
            colorScheme="green"
            onClick={e => {
              e.preventDefault()
              onSubmit()
            }}
          >
            {isConfirmation ? 'Yes' : 'Save'}
          </Button>
        </>
      }
    >
      {children}
    </PrimeReactDialog>
  )
}
