import { ProfessionalRole } from '../../models/enums'
import { useAuth } from '../contexts/AuthContext'

export const useRoles = () => {
  const { role } = useAuth()

  const isAdmin = role === ProfessionalRole.ADMIN

  const canManageAppointments = role === ProfessionalRole.RECEPTIONIST

  const canManagePatients = isAdmin || role === ProfessionalRole.RECEPTIONIST

  const canManageAttendances =
    role === ProfessionalRole.DOCTOR || role === ProfessionalRole.NURSE

  //   role?.match(
  //   `^((?!(${ProfessionalRole.DOCTOR}|${ProfessionalRole.NURSE})).)*$`,
  // )

  return {
    isAdmin,
    canManagePatients,
    canManageAppointments,
    canManageAttendances,
  }
}
