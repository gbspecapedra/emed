import { Tooltip as ChakraTolltip } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

interface ITooltipProps {
  title: string
  children: ReactNode
}

export default function Tooltip({ title, children }: ITooltipProps) {
  return (
    <ChakraTolltip label={title} hasArrow placement="top-end">
      {children}
    </ChakraTolltip>
  )
}
