import type { Prisma, PrismaClient } from '@prisma/client'
import {
  employeeFormSchema,
  employeeQuerySchema,
  type Employee,
  type EmployeeFormInput,
  type EmployeeListResult,
  type EmployeeQuery
} from '@purple-cross/shared'
import { prisma } from './client'

export async function listEmployees(rawQuery: unknown, client: PrismaClient = prisma): Promise<EmployeeListResult> {
  const query = employeeQuerySchema.parse(rawQuery)
  const where = buildWhere(query)
  const orderBy = buildOrder(query)
  const [rows, total, departments] = await Promise.all([
    client.employee.findMany({
      where,
      orderBy,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize
    }),
    client.employee.count({ where }),
    client.employee.findMany({
      distinct: ['department'],
      orderBy: { department: 'asc' },
      select: { department: true }
    })
  ])

  return {
    data: rows.map(toEmployeeDto),
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
  const employee = await client.employee.create({
    data: {
      ...toPrismaMutation(data),
      status: deriveStatusForMutation(data)
    }
  })

  await client.auditLog.create({
    data: {
      entityCode: employee.code,
      action: 'CREATE',
      summary: `Created employee ${employee.fullName}`,
      actor: 'demo.admin@purplecross.test'
    }
  })

  return toEmployeeDto(employee)
}

export async function updateEmployee(id: string, input: EmployeeFormInput, client: PrismaClient = prisma): Promise<Employee> {
  const data = employeeFormSchema.parse(input)
  const employee = await client.employee.update({
    where: { id },
    data: {
      ...toPrismaMutation(data),
      status: deriveStatusForMutation(data)
    }
  })

  await client.auditLog.create({
    data: {
      entityCode: employee.code,
      action: 'UPDATE',
      summary: `Updated employee ${employee.fullName}`,
      actor: 'demo.admin@purplecross.test'
    }
  })

  return toEmployeeDto(employee)
}

export async function deleteEmployee(id: string, client: PrismaClient = prisma): Promise<void> {
  const employee = await client.employee.delete({ where: { id } })
  await client.auditLog.create({
    data: {
      entityCode: employee.code,
      action: 'DELETE',
      summary: `Deleted employee ${employee.fullName}`,
      actor: 'demo.admin@purplecross.test'
    }
  })
}

export async function exportEmployees(client: PrismaClient = prisma): Promise<Employee[]> {
  const employees = await client.employee.findMany({ orderBy: { code: 'asc' } })
  return employees.map(toEmployeeDto)
}

function buildWhere(query: EmployeeQuery): Prisma.EmployeeWhereInput {
  return {
    AND: [
      query.department === 'all' ? {} : { department: query.department },
      query.status === 'all' ? {} : { status: query.status },
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
  if (query.sortBy === 'status') return { status: query.sortDirection }
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

function deriveStatusForMutation(input: EmployeeFormInput) {
  const today = new Date()
  const start = new Date(`${input.dateOfEmployment}T00:00:00.000Z`)
  const termination = input.terminationDate ? new Date(`${input.terminationDate}T00:00:00.000Z`) : null

  if (termination && termination < today) return 'TERMINATED'
  if (start > today) return 'FUTURE'
  return 'ACTIVE'
}

function toEmployeeDto(employee: {
  id: string
  code: string
  fullName: string
  occupation: string
  department: string
  dateOfEmployment: Date
  terminationDate: Date | null
  status: 'ACTIVE' | 'TERMINATED' | 'FUTURE'
  nationalId: string | null
  salaryCents: number | null
  emergencyContact: string | null
  confidentialNotes: string | null
  createdAt: Date
  updatedAt: Date
}): Employee {
  return {
    id: employee.id,
    code: employee.code,
    fullName: employee.fullName,
    occupation: employee.occupation,
    department: employee.department,
    dateOfEmployment: employee.dateOfEmployment.toISOString().slice(0, 10),
    terminationDate: employee.terminationDate?.toISOString().slice(0, 10) ?? null,
    status: employee.status,
    nationalId: employee.nationalId,
    salaryCents: employee.salaryCents,
    emergencyContact: employee.emergencyContact,
    confidentialNotes: employee.confidentialNotes,
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString()
  }
}
