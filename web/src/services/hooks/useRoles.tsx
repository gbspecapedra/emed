import { useState } from 'react'
import { ProfessionalType } from '../../models/enums'
import { useAuth } from '../contexts/AuthContext'

type Roles = ProfessionalType[]

export const useRoles = () => {
  const { professional, isAuthenticated } = useAuth()
  const isAdmin = professional?.type === ProfessionalType.ADMIN

  const setDefaultRoles = (): Roles => {
    let defaultRoles: Roles = []

    if (isAuthenticated && professional?.type) {
      defaultRoles = [...defaultRoles, professional.type]
    }

    return defaultRoles
  }

  const [roles, setRoles] = useState<Roles>(setDefaultRoles())

  const checkRoles = (allowedRoles: Roles) =>
    roles.some((role: ProfessionalType) => allowedRoles.includes(role))

  const canManageAppointments = () =>
    checkRoles([ProfessionalType.RECEPTIONIST])

  const canManageAttendances = () =>
    checkRoles([ProfessionalType.DOCTOR, ProfessionalType.NURSE])

  const canManageMedicalRecords = () =>
    checkRoles([
      ProfessionalType.RECEPTIONIST,
      ProfessionalType.DOCTOR,
      ProfessionalType.NURSE,
    ])

  return {
    roles,
    setRoles,
    canManageAppointments,
    canManageAttendances,
    canManageMedicalRecords,
  }
}
