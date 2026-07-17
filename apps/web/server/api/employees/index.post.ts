import { createEmployee } from '@purple-cross/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return createEmployee(body)
})
