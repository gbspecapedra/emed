import { format } from 'date-fns'

export * from './constants'

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
