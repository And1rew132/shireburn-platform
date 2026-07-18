import { describe, expect, it } from 'vitest'
import { deriveEmployeeStatus } from './employee'

describe('employee helpers', () => {
  it('derives active, future, and terminated status from employment dates', () => {
    const now = new Date('2026-07-17T15:30:00Z')

    expect(deriveEmployeeStatus({ dateOfEmployment: '2020-01-01', terminationDate: null }, now)).toBe('ACTIVE')
    expect(deriveEmployeeStatus({ dateOfEmployment: '2026-07-17', terminationDate: null }, now)).toBe('ACTIVE')
    expect(deriveEmployeeStatus({ dateOfEmployment: '2027-01-01', terminationDate: null }, now)).toBe('FUTURE')
    expect(deriveEmployeeStatus({ dateOfEmployment: '2020-01-01', terminationDate: '2026-07-17' }, now)).toBe('ACTIVE')
    expect(deriveEmployeeStatus({ dateOfEmployment: '2020-01-01', terminationDate: '2024-01-01' }, now)).toBe('TERMINATED')
  })
})
