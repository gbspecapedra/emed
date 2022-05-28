import ResetPassword from '../pages/reset-password'
import { render, act, screen, fireEvent, waitFor } from '@testing-library/react'

describe('ResetPassword page', () => {
  beforeEach(async () => {
    await act(async () => {
      render(<ResetPassword />)
    })
  })

  it('should display heading sign-in message', () => {
    const heading = screen.getByRole('heading', {
      name: 'Forgot your password?',
    })
    expect(heading).toBeInTheDocument()
  })

  it('should display email input', () => {
    const emailInput = screen.getByTestId('input-email')
    expect(emailInput).toBeInTheDocument()
  })

  it('should display request reset button', () => {
    const signInButton = screen.getByTestId('reset-button')
    expect(signInButton).toBeInTheDocument()
  })

  describe('when entering invalid form values', () => {
    it("should disable 'Request Reset' button if form is invalid", async () => {
      const signInButton = screen.getByTestId('reset-button')
      expect(signInButton).toBeInTheDocument()
      expect(signInButton).toBeDisabled()
    })

    it('should display error validation if no email address is not entered', async () => {
      const emailInput = screen.getByTestId('input-email')

      fireEvent.change(emailInput, { target: { value: 'aaa' } })
      fireEvent.change(emailInput, { target: { value: '' } })

      await waitFor(() => {
        const errorMessage = screen.getByText(/Email is required/i)
        expect(errorMessage).toBeInTheDocument()
      })
    })
  })

  describe('when entered valid form values', () => {
    it("should enabled 'Request Reset' button if form is valid", async () => {
      const emailInput = screen.getByTestId('input-email')

      fireEvent.change(emailInput, { target: { value: 'sample@email.com' } })

      await waitFor(() => {
        const signInButton = screen.getByTestId('reset-button')
        expect(signInButton).toBeInTheDocument()
        expect(signInButton).not.toBeDisabled()
      })
    })
  })
})
