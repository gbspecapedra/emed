import { render } from '@testing-library/react'
import Home from '../pages'

test('display welcome page', () => {
  const { getByRole } = render(<Home />)
  expect(
    getByRole('heading', {
      name: 'Welcome Back',
    }),
  ).toBeInTheDocument()
})
