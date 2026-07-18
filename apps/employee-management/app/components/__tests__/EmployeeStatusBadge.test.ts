import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EmployeeStatusBadge from '../EmployeeStatusBadge.vue'

describe('EmployeeStatusBadge', () => {
  it('renders readable labels for employee statuses', async () => {
    const wrapper = await mountSuspended(EmployeeStatusBadge, {
      props: { status: 'TERMINATED' }
    })

    expect(wrapper.text()).toContain('terminated')
  })

  it('maps future employees to a warning badge', async () => {
    const wrapper = await mountSuspended(EmployeeStatusBadge, {
      props: { status: 'FUTURE' }
    })

    expect(wrapper.attributes('data-color') ?? wrapper.html()).toContain('warning')
  })
})
