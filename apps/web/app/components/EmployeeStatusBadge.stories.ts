import type { Meta, StoryObj } from '@storybook/vue3-vite'
import EmployeeStatusBadge from './EmployeeStatusBadge.vue'

const meta = {
  title: 'Employees/EmployeeStatusBadge',
  component: EmployeeStatusBadge,
  tags: ['autodocs'],
  args: {
    status: 'ACTIVE'
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['ACTIVE', 'FUTURE', 'TERMINATED']
    }
  }
} satisfies Meta<typeof EmployeeStatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = { args: { status: 'ACTIVE' } }
export const Future: Story = { args: { status: 'FUTURE' } }
export const Terminated: Story = { args: { status: 'TERMINATED' } }
