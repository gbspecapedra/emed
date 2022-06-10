import { Exam } from './exam.model'
import { Medicine } from './medicine.model'

export type MedicalRecord = {
  id: number
  description: string
  weight: number
  height: number
  bmi: string
  diastolicPressure: number
  systolicPressure: number
  temperature: number
  createdAt: Date
  updatedAt: Date

  exams: Exam[]
  medicines: Medicine[]
}
