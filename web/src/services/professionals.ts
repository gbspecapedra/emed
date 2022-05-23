import { Professional } from '../models'

export const formatProfessional = (professionals: Professional[]) => {
  return professionals.map(
    ({ registrationNumber, registrationState, specialty, ...professional }) => {
      return {
        ...professional,
        registration: registrationNumber
          ? `${registrationNumber}/${registrationState}`
          : 'not applicable',
        specialty: specialty ?? 'not applicable',
      }
    },
  )
}
