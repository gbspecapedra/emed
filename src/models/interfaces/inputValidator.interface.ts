/**
 * For complete list of available validators:
 * https://react-hook-form.com/api/useform/register
 */

export interface IInputValidator {
  required?: boolean | string
  maxLength?: IValueMessage
  minLength?: IValueMessage
  pattern?: IRegExpMessage
  valueAsNumber?: boolean
  validate?(value?: string): boolean | string
}

export interface IValueMessage {
  value: number
  message: string
}

export interface IRegExpMessage {
  value: RegExp
  message: string
}
