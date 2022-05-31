import { AttendanceStatus, AttendanceType } from './enums'
import { Patient } from './patient.model'
import { Professional } from './professional.model'
import { MedicalRecord } from './record.model'

export type Attendance = {
  id: number
  type: AttendanceType
  professionalId: number
  patientId: number
  date: Date
  status: AttendanceStatus
  cancellationReason?: string
  createdAt: Date
  updatedAt: Date

  patient: Pick<Patient, 'name'>
  professional: Pick<Professional, 'name'>

  medicalRecord: MedicalRecord
}
