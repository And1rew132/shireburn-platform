import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { Employee } from '@purple-cross/shared'
import EmployeeFormPanel from './EmployeeFormPanel.vue'

const employee: Employee = {
  id: 'emp-001',
  code: 'EMP001',
  fullName: 'Maria Vella',
  occupation: 'Clinical Pharmacist',
  department: 'Research',
  status: 'ACTIVE',
  dateOfEmployment: '2024-01-15',
  terminationDate: null,
  nationalId: 'MT1234567',
  salaryCents: 4200000,
  emergencyContact: 'John Vella +356 2123 4567',
  confidentialNotes: 'Eligible for senior pharmacist review.',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
}

const meta = {
  title: 'Employees/EmployeeFormPanel',
  component: EmployeeFormPanel,
  tags: ['autodocs'],
  args: {
    open: true,
    employee: null
  },
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof EmployeeFormPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = {}
export const Edit: Story = { args: { employee } }
