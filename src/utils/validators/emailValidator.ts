import { REGEX } from '../constants'

export const emailValidator = {
  required: 'Email is required',
  pattern: {
    value: REGEX.EMAIL_FORMAT,
    message: 'Invalid email address format',
  },
}
