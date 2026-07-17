import { exportEmployees } from '@purple-cross/db'

export default defineEventHandler(async (event) => {
  const employees = await exportEmployees()
  setHeader(event, 'content-disposition', 'attachment; filename="purple-cross-employees.json"')
  return employees
})
