import { ProfessionalRole } from './enums'

export type Professional = {
  id: number
  role: ProfessionalRole
  name: string
  registration?: string
  specialty?: string
  email: string
  password?: string
  rememberMeToken?: string
  active: boolean
  createdAt: string
  updatedAt: string

  registrationNumber?: number
  registrationState?: string
}
