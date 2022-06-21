import { Heading, Text, Button, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

const Custom500 = () => {
  const router = useRouter()

  return (
    <Flex flexDirection={'column'} minH={'100vh'} alignItems="center" justifyContent={'center'} py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, blue.400, blue.600)"
        backgroundClip="text"
      >
        500
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Server-side error occurred
      </Text>
      <Text color={'gray.500'} mb={6}>
        We are working it out, please try again later
      </Text>

      <Button
        colorScheme="blue"
        bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
        color="white"
        variant="solid"
        onClick={() => router.replace('/')}
        data-testid='home-button'
      >
        Go to Home
      </Button>
    </Flex>
  )
}

Custom500.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>
}

export default Custom500
