import { render } from '@testing-library/react'
import Home from '.'

test('display welcome page', () => {
  const { getByRole } = render(<Home />)
  expect(
    getByRole('heading', {
      name: 'Welcome to Next.js!',
    }),
  ).toBeInTheDocument()
})
