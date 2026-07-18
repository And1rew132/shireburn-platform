import { getEmployee } from '@shireburn-platform/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Employee id is required' })

  const employee = await getEmployee(id)
  if (!employee) throw createError({ statusCode: 404, statusMessage: 'Employee not found' })

  return employee
})
