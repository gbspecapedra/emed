import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import React from 'react'
import { FiSearch } from 'react-icons/fi'

interface ISearchProps {
  onChange: (_value: React.SetStateAction<null>) => void
}

export default function Search({ onChange }: ISearchProps) {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <FiSearch />
      </InputLeftElement>
      <Input
        bg="white"
        placeholder="Search..."
        onInput={(e: any) => onChange(e.target.value)}
      />
    </InputGroup>
  )
}
