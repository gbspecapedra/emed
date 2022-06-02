import { REGEX } from '../constants'

export const passwordStrengthValidator = {
  required: 'Password is required',
  minLength: {
    value: 7,
    message: 'Password must be 7+ characters',
  },
  maxLength: {
    value: 128,
    message: 'Password limit is 128 characters',
  },
  pattern: {
    value: REGEX.PASSWORD_STRENGTH,
    message:
      'Must contain numbers, symbols, uppercase and lowercase characters.',
  },
}
