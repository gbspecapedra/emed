import {
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { Attendance } from '../../../models/attendance.model'
import { AttendanceStatus } from '../../../models/enums'
import { formatDate } from '../../../utils'

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
        maxW={'4xl'}
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
        <Stack px={10} pt={5} pb={10}>
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

export const Header = ({ title }: { title: string }) => (
  <>
    <Heading pt={8} size={'md'}>
      {title}
    </Heading>
    <Divider />
  </>
)

export const Row = ({ title, text }: { title?: string; text?: ReactNode }) => (
  <HStack>
    {title && <Heading size={'sm'}>{`${title}:`}</Heading>}
    <Text>{text}</Text>
  </HStack>
)

export const ListOfAttendances = ({
  attendances,
}: {
  attendances: Attendance[]
}) => {
  const hasAttendances = attendances?.length > 0
  return (
    <>
      {!hasAttendances && <Text>No records found</Text>}
      {hasAttendances &&
        attendances.map(({ id, type, date, status, professional, patient }) => {
          let color = 'red'
          if (status === AttendanceStatus.IN_PROGRESS) {
            color = 'yellow'
          } else if (status === AttendanceStatus.CONFIRMED) {
            color = 'green'
          } else if (status === AttendanceStatus.DONE) {
            color = 'gray'
          }

          return (
            <Flex key={`${id}-${type}`} align={'center'} justify={'center'}>
              <Stack
                spacing={4}
                w={'full'}
                bg={'gray.50'}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
              >
                <Wrap justify={'space-between'}>
                  <WrapItem>
                    <Row text={formatDate(date, 'PPPPpp')} />
                  </WrapItem>
                  <WrapItem>
                    <Row text={type} />
                  </WrapItem>
                  <WrapItem>
                    <Row
                      title={patient ? 'Patient' : 'Attended by'}
                      text={professional?.name ?? patient?.name}
                    />
                  </WrapItem>
                  <WrapItem>
                    <Row
                      text={
                        <Tag
                          size="sm"
                          borderRadius="full"
                          variant="solid"
                          colorScheme={color}
                        >
                          <TagLabel>{status}</TagLabel>
                        </Tag>
                      }
                    />
                  </WrapItem>
                </Wrap>
              </Stack>
            </Flex>
          )
        })}
    </>
  )
}
