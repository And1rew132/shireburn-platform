import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MetricCard from './MetricCard.vue'

const meta = {
  title: 'Dashboard/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  args: {
    label: 'Active employees',
    value: 42,
    icon: 'i-lucide-users',
    tone: 'primary'
  },
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof MetricCard>

export default meta
type Story = StoryObj<typeof meta>

export const ActiveEmployees: Story = {}
export const PendingOnboarding: Story = {
  args: {
    label: 'Pending onboarding',
    value: 8,
    icon: 'i-lucide-user-plus',
    tone: 'warning'
  }
}
