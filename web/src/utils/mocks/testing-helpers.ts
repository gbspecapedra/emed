import { screen } from '@testing-library/react'

/**
 * Helper functions
 */

export const wait = (period: number) => {
  return new Promise(resolve => setTimeout(resolve, period))
}
