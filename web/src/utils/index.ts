import { format } from 'date-fns'

export * from './constants'

export const nullsToUndefined = (obj: any) => {
  if (obj === null) {
    return undefined
  }
  if (typeof obj === 'object') {
    for (let key in obj) {
      obj[key] = nullsToUndefined(obj[key])
    }
  }
  return obj
}

export const saveAsExcelFile = (buffer: any, fileName: string) => {
  import('file-saver').then(module => {
    if (module && module.default) {
      let EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      let EXCEL_EXTENSION = '.xlsx'
      const data = new Blob([buffer], {
        type: EXCEL_TYPE,
      })

      module.default.saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION,
      )
    }
  })
}

export const formatDate = (date?: Date, dateFormat?: string) => {
  return date ? format(new Date(date), dateFormat ?? 'dd/MM/yyyy') : '-'
}

export const calculateBMI = (weight: number, height: number) => {
  const bmi = (weight / ((height * height) / 10000)).toFixed(2)

  let label = 'not defined'

  if (Number(bmi) < 18.5) label = 'slimness'
  if (Number(bmi) >= 18.5 && Number(bmi) <= 24.9) label = 'normal'
  if (Number(bmi) >= 25 && Number(bmi) <= 29.9) label = 'overweight'
  if (Number(bmi) >= 30 && Number(bmi) <= 39.9) label = 'severe obesity'
  if (Number(bmi) >= 40) label = ''

  return {
    bmi,
    label,
  }
}
