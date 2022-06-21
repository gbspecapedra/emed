import { render, act, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import Custom500 from '../pages/500'

describe('Custom500 page', () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <ChakraProvider>
          <Custom500 />
        </ChakraProvider>
      )
    })
  })

  it('should display heading', () => {
    const heading = screen.getByRole('heading', {
      name: '500',
    })
    expect(heading).toBeInTheDocument()
  })

  it('should display subtitle', () => {
    const text = screen.getByText('Server-side error occurred')
    expect(text).toBeInTheDocument()
  })

  it('should display description', () => {
    const text = screen.getByText(/We are working it out, please try again later/)
    expect(text).toBeInTheDocument()
  })

  it('should display Go to Home button', () => {
    const button = screen.getByTestId('home-button')
    expect(button).toBeInTheDocument()
  })

})
