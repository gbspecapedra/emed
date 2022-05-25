import {
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface IViewLayoutProps {
  children: ReactNode
  header: ReactNode
  returnTo: string
  showTag?: boolean
  tag?: boolean
}

export function ViewLayout({
  children,
  header,
  returnTo,
  showTag,
  tag,
}: IViewLayoutProps) {
  const router = useRouter()
  return (
    <Flex align={'center'} justify={'center'}>
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
        <HStack spacing={5}>
          <Heading fontSize={{ base: '2xl', sm: '3xl' }}>{header}</Heading>
          {showTag && (
            <Tag
              size="sm"
              borderRadius="base"
              variant="solid"
              colorScheme={tag ? 'green' : 'red'}
            >
              <TagLabel>{tag ? 'ACTIVE' : 'DISABLED'}</TagLabel>
            </Tag>
          )}
        </HStack>
        <Stack pl={5} pb={10}>
          {children}
        </Stack>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            w="full"
            colorScheme="blue"
            onClick={() => router.push(returnTo)}
          >
            Return
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}

export const Row = ({ title, text }: { title?: string; text?: ReactNode }) => (
  <HStack>
    {title && <Heading size={'sm'}>{`${title}:`}</Heading>}
    <Text>{text}</Text>
  </HStack>
)
