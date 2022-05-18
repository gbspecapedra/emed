import { ProfessionalType } from './enums'

export type Professional = {
  id: number
  type: ProfessionalType
  name: string
  registrationNumber?: number
  registrationState?: string
  specialty?: string
  email: string
  password: string
  rememberMeToken: string
  active: boolean
  createdAt: string
  updatedAt: string
}
