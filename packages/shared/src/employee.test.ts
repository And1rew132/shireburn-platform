import { describe, expect, it } from 'vitest'
import {
  deriveEmployeeStatus,
  employeeQuerySchema,
  filterAndSortEmployees,
  paginateEmployees,
  type Employee
} from './employee'

const employees: Employee[] = [
  {
    id: '1',
    code: 'EMP002',
    fullName: 'Dustin Fisher',
    occupation: 'Production Supervisor',
    department: 'IT',
    dateOfEmployment: '2020-03-26',
    terminationDate: null,
    status: 'ACTIVE'
  },
  {
    id: '2',
    code: 'EMP001',
    fullName: 'Nicole Berry',
    occupation: 'IT Support',
    department: 'Research',
    dateOfEmployment: '2016-07-06',
    terminationDate: null,
    status: 'ACTIVE'
  },
  {
    id: '3',
    code: 'EMP004',
    fullName: 'Matthew Figueroa',
    occupation: 'Production Supervisor',
    department: 'Logistics',
    dateOfEmployment: '2017-08-20',
    terminationDate: '2018-01-29',
    status: 'TERMINATED'
  }
]

describe('employee helpers', () => {
  it('derives active, future, and terminated status from employment dates', () => {
    const now = new Date('2026-07-17T00:00:00Z')

    expect(deriveEmployeeStatus({ dateOfEmployment: '2020-01-01', terminationDate: null }, now)).toBe('ACTIVE')
    expect(deriveEmployeeStatus({ dateOfEmployment: '2027-01-01', terminationDate: null }, now)).toBe('FUTURE')
    expect(deriveEmployeeStatus({ dateOfEmployment: '2020-01-01', terminationDate: '2024-01-01' }, now)).toBe('TERMINATED')
  })

  it('filters and sorts employees', () => {
    const query = employeeQuerySchema.parse({
      search: 'production',
      sortBy: 'fullName',
      sortDirection: 'desc'
    })

    expect(filterAndSortEmployees(employees, query).map((employee) => employee.fullName)).toEqual([
      'Matthew Figueroa',
      'Dustin Fisher'
    ])
  })

  it('paginates without mutating the source list', () => {
    expect(paginateEmployees(employees, 2, 2).map((employee) => employee.code)).toEqual(['EMP004'])
    expect(employees[0]?.code).toBe('EMP002')
  })
})
