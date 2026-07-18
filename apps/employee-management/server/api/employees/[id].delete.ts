import { deleteEmployee } from '@shireburn-platform/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Employee id is required' })

  await deleteEmployee(id)
  return { ok: true }
})
