import { prisma, parseEmployeeImport, toEmployeeSeedRow } from '@shireburn-platform/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const rows = parseEmployeeImport(body).map(toEmployeeSeedRow)

  for (const row of rows) {
    await prisma.employee.upsert({
      where: { code: row.code },
      update: row,
      create: row
    })
  }

  return { imported: rows.length }
})
