import { listEmployees } from '@purple-cross/db'

export default defineEventHandler(async (event) => {
  return listEmployees(getQuery(event))
})
