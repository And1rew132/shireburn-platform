import type { Prisma, PrismaClient } from '@prisma/client'
import {
  deriveEmployeeStatus,
  employeeFormSchema,
  employeeQuerySchema,
  type Employee,
  type EmployeeFormInput,
  type EmployeeListResult,
  type EmployeeQuery,
  type EmployeeStatus
} from '@purple-cross/shared'
import { prisma } from './client'

export async function listEmployees(rawQuery: unknown, client: PrismaClient = prisma): Promise<EmployeeListResult> {
  const query = employeeQuerySchema.parse(rawQuery)
  const now = currentDateOnly()
  const where = buildWhere(query, now)
  const departmentsQuery = client.employee.findMany({
    distinct: ['department'],
    orderBy: { department: 'asc' },
    select: { department: true }
  })

  if (query.sortBy === 'status') {
    const [rows, total, departments] = await Promise.all([
      client.employee.findMany({ where, orderBy: { code: 'asc' } }),
      client.employee.count({ where }),
      departmentsQuery
    ])
    const sorted = sortEmployeesByDerivedStatus(rows.map((employee) => toEmployeeDto(employee, now)), query.sortDirection)

    return {
      data: paginate(sorted, query.page, query.pageSize),
      total,
      page: query.page,
      pageSize: query.pageSize,
      departments: departments.map((row: { department: string }) => row.department)
    }
  }

  const orderBy = buildOrder(query)
  const [rows, total, departments] = await Promise.all([
    client.employee.findMany({
      where,
      orderBy,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize
    }),
    client.employee.count({ where }),
    departmentsQuery
  ])

  return {
    data: rows.map((employee) => toEmployeeDto(employee, now)),
    total,
    page: query.page,
    pageSize: query.pageSize,
    departments: departments.map((row: { department: string }) => row.department)
  }
}

export async function getEmployee(id: string, client: PrismaClient = prisma): Promise<Employee | null> {
  const employee = await client.employee.findUnique({ where: { id } })
  return employee ? toEmployeeDto(employee) : null
}

export async function createEmployee(input: EmployeeFormInput, client: PrismaClient = prisma): Promise<Employee> {
  const data = employeeFormSchema.parse(input)
  const employee = await client.employee.create({ data: toPrismaMutation(data) })

  return toEmployeeDto(employee)
}

export async function updateEmployee(id: string, input: EmployeeFormInput, client: PrismaClient = prisma): Promise<Employee> {
  const data = employeeFormSchema.parse(input)
  const employee = await client.employee.update({
    where: { id },
    data: toPrismaMutation(data)
  })

  return toEmployeeDto(employee)
}

export async function deleteEmployee(id: string, client: PrismaClient = prisma): Promise<void> {
  await client.employee.delete({ where: { id } })
}

export async function exportEmployees(client: PrismaClient = prisma): Promise<Employee[]> {
  const employees = await client.employee.findMany({ orderBy: { code: 'asc' } })
  return employees.map((employee) => toEmployeeDto(employee))
}

function buildWhere(query: EmployeeQuery, today: Date): Prisma.EmployeeWhereInput {
  return {
    AND: [
      query.department === 'all' ? {} : { department: query.department },
      statusWhere(query.status, today),
      query.search
        ? {
            OR: [
              { code: { contains: query.search, mode: 'insensitive' } },
              { fullName: { contains: query.search, mode: 'insensitive' } },
              { occupation: { contains: query.search, mode: 'insensitive' } },
              { department: { contains: query.search, mode: 'insensitive' } }
            ]
          }
        : {}
    ]
  }
}

function buildOrder(query: EmployeeQuery): Prisma.EmployeeOrderByWithRelationInput {
  return { [query.sortBy]: query.sortDirection }
}

function toPrismaMutation(input: EmployeeFormInput) {
  return {
    code: input.code,
    fullName: input.fullName,
    occupation: input.occupation,
    department: input.department,
    dateOfEmployment: new Date(`${input.dateOfEmployment}T00:00:00.000Z`),
    terminationDate: input.terminationDate ? new Date(`${input.terminationDate}T00:00:00.000Z`) : null,
    nationalId: input.nationalId ?? null,
    salaryCents: input.salaryCents ?? null,
    emergencyContact: input.emergencyContact ?? null,
    confidentialNotes: input.confidentialNotes ?? null
  }
}

function statusWhere(status: EmployeeQuery['status'], today: Date): Prisma.EmployeeWhereInput {
  if (status === 'all') return {}
  if (status === 'TERMINATED') return { terminationDate: { lt: today } }
  if (status === 'FUTURE') return { dateOfEmployment: { gt: today } }

  return {
    dateOfEmployment: { lte: today },
    OR: [
      { terminationDate: null },
      { terminationDate: { gte: today } }
    ]
  }
}

function sortEmployeesByDerivedStatus(employees: Employee[], direction: EmployeeQuery['sortDirection']): Employee[] {
  const order: Record<EmployeeStatus, number> = { ACTIVE: 0, FUTURE: 1, TERMINATED: 2 }
  const multiplier = direction === 'asc' ? 1 : -1

  return [...employees].sort((left, right) => {
    const statusComparison = (order[left.status] - order[right.status]) * multiplier
    if (statusComparison !== 0) return statusComparison
    return left.code.localeCompare(right.code)
  })
}

function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

function currentDateOnly(now = new Date()): Date {
  return new Date(`${now.toISOString().slice(0, 10)}T00:00:00.000Z`)
}

function toEmployeeDto(employee: {
  id: string
  code: string
  fullName: string
  occupation: string
  department: string
  dateOfEmployment: Date
  terminationDate: Date | null
  nationalId: string | null
  salaryCents: number | null
  emergencyContact: string | null
  confidentialNotes: string | null
  createdAt: Date
  updatedAt: Date
}, now = currentDateOnly()): Employee {
  const dateOfEmployment = employee.dateOfEmployment.toISOString().slice(0, 10)
  const terminationDate = employee.terminationDate?.toISOString().slice(0, 10) ?? null

  return {
    id: employee.id,
    code: employee.code,
    fullName: employee.fullName,
    occupation: employee.occupation,
    department: employee.department,
    dateOfEmployment,
    terminationDate,
    status: deriveEmployeeStatus({ dateOfEmployment, terminationDate }, now),
    nationalId: employee.nationalId,
    salaryCents: employee.salaryCents,
    emergencyContact: employee.emergencyContact,
    confidentialNotes: employee.confidentialNotes,
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString()
  }
}
