import Custom404 from '../pages/404'
import { render, act, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'

describe('Custom404 page', () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <ChakraProvider>
          <Custom404 />
        </ChakraProvider>
      )
    })
  })

  it('should display heading', () => {
    const heading = screen.getByRole('heading', {
      name: '404',
    })
    expect(heading).toBeInTheDocument()
  })

  it('should display subtitle', () => {
    const text = screen.getByText('Page Not Found')
    expect(text).toBeInTheDocument()
  })

  it('should display description', () => {
    const text = screen.getByText(/The page you're looking for does not seem to exist/)
    expect(text).toBeInTheDocument()
  })

  it('should display Go to Home button', () => {
    const button = screen.getByTestId('home-button')
    expect(button).toBeInTheDocument()
  })

})
