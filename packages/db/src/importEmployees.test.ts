import { describe, expect, it } from 'vitest'
import { parseEmployeeImport, toEmployeeSeedRow } from './importEmployees'

describe('employee import', () => {
  it('parses source rows and derives a seed row', () => {
    const [employee] = parseEmployeeImport([
      {
        code: 'EMP001',
        fullName: 'Nicole Berry',
        occupation: 'IT Support',
        department: 'Research',
        dateOfEmployment: '2016-07-06',
        terminationDate: null
      }
    ])

    expect(employee?.code).toBe('EMP001')
    expect(toEmployeeSeedRow(employee!).status).toBe('ACTIVE')
  })

  it('rejects non-array imports', () => {
    expect(() => parseEmployeeImport({ code: 'EMP001' })).toThrow('array')
  })
})
