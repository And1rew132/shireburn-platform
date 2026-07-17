import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { prisma } from '../src/client'
import { parseEmployeeImport, toEmployeeSeedRow } from '../src/importEmployees'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const sourcePath = resolve(projectRoot, 'purple_cross_employees.json')
const source = JSON.parse(await readFile(sourcePath, 'utf8'))
const employees = parseEmployeeImport(source).map(toEmployeeSeedRow)

for (const employee of employees) {
  await prisma.employee.upsert({
    where: { code: employee.code },
    update: employee,
    create: employee
  })
}

await prisma.auditLog.create({
  data: {
    entityCode: 'IMPORT',
    action: 'IMPORT',
    summary: `Imported ${employees.length} Purple Cross employees from JSON`,
    actor: 'seed'
  }
})

await prisma.$disconnect()

console.log(`Seeded ${employees.length} employees`)
