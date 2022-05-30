export const useAttendanceActions = (refetch: any, redirect?: string) => {
  const onCreatePatient = () => {
    console.log('create')
  }

  return {
    onCreatePatient,
  }
}
