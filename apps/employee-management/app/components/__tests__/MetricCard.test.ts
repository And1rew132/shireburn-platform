import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MetricCard from '../MetricCard.vue'

describe('MetricCard', () => {
  it('renders the metric label and value', async () => {
    const wrapper = await mountSuspended(MetricCard, {
      props: {
        label: 'Active employees',
        value: 38,
        icon: 'i-lucide-users'
      }
    })

    expect(wrapper.text()).toContain('Active employees')
    expect(wrapper.text()).toContain('38')
  })
})
