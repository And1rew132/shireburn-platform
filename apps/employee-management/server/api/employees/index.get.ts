import { listEmployees } from '@shireburn-platform/db'

export default defineEventHandler(async (event) => {
  return listEmployees(getQuery(event))
})
