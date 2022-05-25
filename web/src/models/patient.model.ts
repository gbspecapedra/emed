import { Attendance } from './attendance.model'
import { HealthPlan } from './plan.model'

export type Patient = {
  id: number
  name: string
  socialNumber: number
  birthday: Date
  gender: string
  contact: string
  zipcode: string
  street: string
  number?: number
  complement?: string
  county: string
  city: string
  state: string
  country: string
  healthPlanId?: number
  healthPlanExpiration?: Date
  active: boolean
  createdAt: Date
  updatedAt: Date

  healthPlan: HealthPlan
  attendances: Attendance[]
}
