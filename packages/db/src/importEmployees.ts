import {
  deriveEmployeeStatus,
  employeeImportSchema,
  type EmployeeImportInput
} from '@purple-cross/shared'

export function parseEmployeeImport(input: unknown): EmployeeImportInput[] {
  if (!Array.isArray(input)) {
    throw new Error('Employee import file must contain an array')
  }

  return input.map((record, index) => {
    const parsed = employeeImportSchema.safeParse(record)
    if (!parsed.success) {
      throw new Error(`Invalid employee import row ${index + 1}: ${parsed.error.message}`)
    }
    return parsed.data
  })
}

export function toEmployeeSeedRow(input: EmployeeImportInput) {
  return {
    code: input.code,
    fullName: input.fullName,
    occupation: input.occupation,
    department: input.department,
    dateOfEmployment: new Date(`${input.dateOfEmployment}T00:00:00.000Z`),
    terminationDate: input.terminationDate ? new Date(`${input.terminationDate}T00:00:00.000Z`) : null,
    status: deriveEmployeeStatus(input),
    nationalId: null,
    salaryCents: null,
    emergencyContact: null,
    confidentialNotes: null
  }
}
