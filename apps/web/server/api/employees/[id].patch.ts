import { updateEmployee } from '@purple-cross/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Employee id is required' })

  const body = await readBody(event)
  return updateEmployee(id, body)
})
