import { z } from 'zod'

export const employeeStatusSchema = z.enum(['ACTIVE', 'TERMINATED', 'FUTURE'])
export type EmployeeStatus = z.infer<typeof employeeStatusSchema>

export const employeeSortFieldSchema = z.enum([
  'code',
  'fullName',
  'occupation',
  'department',
  'dateOfEmployment',
  'terminationDate',
  'status'
])

export const employeeSortDirectionSchema = z.enum(['asc', 'desc'])

export const employeeSchema = z.object({
  id: z.string(),
  code: z.string().min(1),
  fullName: z.string().min(1),
  occupation: z.string().min(1),
  department: z.string().min(1),
  dateOfEmployment: z.string().date(),
  terminationDate: z.string().date().nullable(),
  status: employeeStatusSchema,
  nationalId: z.string().nullable().optional(),
  salaryCents: z.number().int().nonnegative().nullable().optional(),
  emergencyContact: z.string().nullable().optional(),
  confidentialNotes: z.string().nullable().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
})

export const employeeImportSchema = z.object({
  code: z.string().min(1),
  fullName: z.string().min(1),
  occupation: z.string().min(1),
  department: z.string().min(1),
  dateOfEmployment: z.string().date(),
  terminationDate: z.string().date().nullable()
})

export const employeeFormSchema = z.object({
  code: z.string().trim().min(3).max(24),
  fullName: z.string().trim().min(2).max(120),
  occupation: z.string().trim().min(2).max(80),
  department: z.string().trim().min(2).max(80),
  dateOfEmployment: z.string().date(),
  terminationDate: z.string().date().nullable().optional(),
  nationalId: z.string().trim().max(64).nullable().optional(),
  salaryCents: z.coerce.number().int().nonnegative().nullable().optional(),
  emergencyContact: z.string().trim().max(160).nullable().optional(),
  confidentialNotes: z.string().trim().max(1000).nullable().optional()
}).refine((value) => {
  if (!value.terminationDate) return true
  return value.terminationDate >= value.dateOfEmployment
}, {
  message: 'Termination date cannot be before employment date',
  path: ['terminationDate']
})

export const employeeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(15),
  search: z.string().trim().default(''),
  department: z.string().trim().default('all'),
  status: z.union([employeeStatusSchema, z.literal('all')]).default('all'),
  sortBy: employeeSortFieldSchema.default('code'),
  sortDirection: employeeSortDirectionSchema.default('asc')
})

export type Employee = z.infer<typeof employeeSchema>
export type EmployeeFormInput = z.infer<typeof employeeFormSchema>
export type EmployeeImportInput = z.infer<typeof employeeImportSchema>
export type EmployeeQuery = z.infer<typeof employeeQuerySchema>
export type EmployeeSortField = z.infer<typeof employeeSortFieldSchema>
export type EmployeeSortDirection = z.infer<typeof employeeSortDirectionSchema>

export interface EmployeeListResult {
  data: Employee[]
  total: number
  page: number
  pageSize: number
  departments: string[]
}

export function deriveEmployeeStatus(employee: Pick<EmployeeImportInput, 'dateOfEmployment' | 'terminationDate'>, now = new Date()): EmployeeStatus {
  const start = dateOnly(employee.dateOfEmployment)
  const termination = employee.terminationDate ? dateOnly(employee.terminationDate) : null
  const current = dateOnly(now.toISOString().slice(0, 10))

  if (termination && termination < current) return 'TERMINATED'
  if (start > current) return 'FUTURE'
  return 'ACTIVE'
}

export function normalizeNullableText(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function formatSalary(cents?: number | null): string {
  if (cents === null || cents === undefined) return 'Not set'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(cents / 100)
}

export function filterAndSortEmployees(employees: Employee[], query: EmployeeQuery): Employee[] {
  const search = query.search.toLowerCase()
  const filtered = employees.filter((employee) => {
    const matchesSearch = !search || [
      employee.code,
      employee.fullName,
      employee.occupation,
      employee.department
    ].some((value) => value.toLowerCase().includes(search))

    const matchesDepartment = query.department === 'all' || employee.department === query.department
    const matchesStatus = query.status === 'all' || employee.status === query.status

    return matchesSearch && matchesDepartment && matchesStatus
  })

  return [...filtered].sort((left: Employee, right: Employee) => {
    const direction = query.sortDirection === 'asc' ? 1 : -1
    const leftValue = sortableValue(left, query.sortBy)
    const rightValue = sortableValue(right, query.sortBy)

    if (leftValue < rightValue) return -1 * direction
    if (leftValue > rightValue) return 1 * direction
    return left.code.localeCompare(right.code)
  })
}

export function paginateEmployees(employees: Employee[], page: number, pageSize: number): Employee[] {
  const start = (page - 1) * pageSize
  return employees.slice(start, start + pageSize)
}

function sortableValue(employee: Employee, field: EmployeeSortField): string {
  if (field === 'terminationDate') return employee.terminationDate ?? '9999-12-31'
  return String(employee[field] ?? '').toLowerCase()
}

function dateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`)
}
