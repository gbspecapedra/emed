import { Attendance } from './attendance.model'
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

  attendances: Attendance[]

  registrationNumber?: number
  registrationState?: string
}
