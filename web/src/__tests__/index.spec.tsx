import { render, act, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '../pages'

describe('Login page', () => {
  beforeEach(async () => {
    await act(async () => {
      render(<Home />)
    })
  })

  it('should display heading', () => {
    const heading = screen.getByRole('heading', {
      name: 'Welcome Back',
    })
    expect(heading).toBeInTheDocument()
  })

  it('should display email input', () => {
    const emailInput = screen.getByTestId('input-email')
    expect(emailInput).toBeInTheDocument()
  })

  it('should display password input', () => {
    const passwordInput = screen.getByTestId('input-password')
    expect(passwordInput).toBeInTheDocument()
  })

  it('should display sign-in button', () => {
    const signInButton = screen.getByTestId('signin-button')
    expect(signInButton).toBeInTheDocument()
  })

  it('should display forgot your password button', () => {
    const forgotPasswordButton = screen.getByTestId('text-link-button')
    expect(forgotPasswordButton).toBeInTheDocument()
  })

  describe('when entering invalid form values', () => {
    it("should disable 'Sign-in' button if form is invalid", async () => {
      const signInButton = screen.getByTestId('signin-button')
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

    it('should display error validation if no password is not entered', async () => {
      const passwordInput = screen.getByTestId('input-password')

      fireEvent.change(passwordInput, { target: { value: 'aaa' } })
      fireEvent.change(passwordInput, { target: { value: '' } })

      await waitFor(() => {
        const errorMessage = screen.getByText(/Password is required/i)
        expect(errorMessage).toBeInTheDocument()
      })
    })

    describe('when entered valid form values', () => {
      it("should enabled 'Sign-in' button if form is valid", async () => {
        const emailInput = screen.getByTestId('input-email')
        const passwordInput = screen.getByTestId('input-password')

        fireEvent.change(emailInput, { target: { value: 'sample@email.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password' } })

        await waitFor(() => {
          const signInButton = screen.getByTestId('signin-button')
          expect(signInButton).toBeInTheDocument()
          expect(signInButton).not.toBeDisabled()
        })
      })
    })
  })
})
