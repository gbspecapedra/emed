import { useState } from 'react'
import { ProfessionalRole } from '../../models/enums'
import { useAuth } from '../contexts/AuthContext'

type Roles = ProfessionalRole[]

export const useRoles = () => {
  const { professional, isAuthenticated } = useAuth()
  const isAdmin = professional?.role === ProfessionalRole.ADMIN

  const setDefaultRoles = (): Roles => {
    let defaultRoles: Roles = []

    if (isAuthenticated && professional?.role) {
      defaultRoles = [...defaultRoles, professional.role]
    }

    return defaultRoles
  }

  const [roles, setRoles] = useState<Roles>(setDefaultRoles())

  const checkRoles = (allowedRoles: Roles) =>
    roles.some((role: ProfessionalRole) => allowedRoles.includes(role))

  const canManageAppointments = () =>
    checkRoles([ProfessionalRole.RECEPTIONIST])

  const canManageAttendances = () =>
    checkRoles([ProfessionalRole.DOCTOR, ProfessionalRole.NURSE])

  const canManageMedicalRecords = () =>
    checkRoles([
      ProfessionalRole.RECEPTIONIST,
      ProfessionalRole.DOCTOR,
      ProfessionalRole.NURSE,
    ])

  return {
    isAdmin,
    roles,
    setRoles,
    canManageAppointments,
    canManageAttendances,
    canManageMedicalRecords,
  }
}
