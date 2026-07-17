import { prisma, parseEmployeeImport, toEmployeeSeedRow } from '@purple-cross/db'

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

  await prisma.auditLog.create({
    data: {
      entityCode: 'IMPORT',
      action: 'IMPORT',
      summary: `Imported ${rows.length} employee records`,
      actor: 'demo.admin@purplecross.test'
    }
  })

  return { imported: rows.length }
})
