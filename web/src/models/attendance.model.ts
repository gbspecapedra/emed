import { AttendanceStatus, AttendanceType } from './enums'
import { Patient } from './patient.model'
import { Professional } from './professional.model'

export type Attendance = {
  id: number
  type: AttendanceType
  professionalId: number
  patientId: number
  date: string
  status: AttendanceStatus
  cancellationReason?: string
  createdAt: string
  updatedAt: string

  patient: Pick<Patient, 'name'>
  professional: Pick<Professional, 'name'>
}
