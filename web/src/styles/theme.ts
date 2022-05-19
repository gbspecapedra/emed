import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  styles: {
    global: {
      html: {
        boxSizing: 'border-box',
        height: '100%',
      },
      body: {
        padding: 0,
        margin: 0,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
        bg: 'gray.50',
      },
      a: {
        color: 'inherit',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
})
