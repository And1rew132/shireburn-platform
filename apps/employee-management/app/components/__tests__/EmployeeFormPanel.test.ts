import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import EmployeeFormPanel from '../EmployeeFormPanel.vue'

describe('EmployeeFormPanel', () => {
  it('shows validation feedback when required fields are missing', async () => {
    const wrapper = await mountSuspended(EmployeeFormPanel, {
      props: { open: true, employee: null },
      attachTo: document.body
    })

    const form = document.body.querySelector('form')
    expect(form).not.toBeNull()
    form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await nextTick()

    expect(document.body.textContent).toContain('Create employee')
    expect(document.body.textContent).toContain('Too small')
    wrapper.unmount()
  })
})
