import { createEmployee } from '@shireburn-platform/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return createEmployee(body)
})
