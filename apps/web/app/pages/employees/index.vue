<script setup lang="ts">
import { formatSalary, type Employee, type EmployeeFormInput, type EmployeeSortField } from '@purple-cross/shared'

const {
  departments,
  employees,
  error,
  filters,
  pageCount,
  pending,
  total,
  createEmployee,
  importEmployees,
  removeEmployee,
  sort,
  updateEmployee
} = useEmployees()

const route = useRoute()
const selectedEmployee = ref<Employee | null>(null)
const panelOpen = ref(route.query.create === '1')
const importInput = ref<HTMLInputElement | null>(null)
const toast = useToast()

const departmentItems = computed(() => [
  { label: 'All departments', value: 'all' },
  ...departments.value.map((department: string) => ({ label: department, value: department }))
])

const statusItems = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Future', value: 'FUTURE' },
  { label: 'Terminated', value: 'TERMINATED' }
]

const pageSizeItems = [
  { label: '10 employees', value: 10 },
  { label: '15 employees', value: 15 },
  { label: '25 employees', value: 25 },
  { label: '50 employees', value: 50 }
]

const columns: { field: EmployeeSortField; label: string }[] = [
  { field: 'code', label: 'Code' },
  { field: 'fullName', label: 'Name' },
  { field: 'occupation', label: 'Occupation' },
  { field: 'department', label: 'Department' },
  { field: 'dateOfEmployment', label: 'Employed' },
  { field: 'terminationDate', label: 'Termination' },
  { field: 'status', label: 'Status' }
]

const activeFilters = computed(() => {
  const items: string[] = []
  if (filters.search) items.push(`Search: ${filters.search}`)
  if (filters.department !== 'all') items.push(`Department: ${filters.department}`)
  if (filters.status !== 'all') items.push(`Status: ${filters.status.toLowerCase()}`)
  return items
})

const firstVisibleRecord = computed(() => total.value === 0 ? 0 : ((filters.page - 1) * filters.pageSize) + 1)
const lastVisibleRecord = computed(() => Math.min(filters.page * filters.pageSize, total.value))

function createNewEmployee() {
  selectedEmployee.value = null
  panelOpen.value = true
}

function editEmployee(employee: Employee) {
  selectedEmployee.value = employee
  panelOpen.value = true
}

async function saveEmployee(input: EmployeeFormInput) {
  if (selectedEmployee.value) {
    await updateEmployee(selectedEmployee.value.id, input)
    toast.add({ title: 'Employee updated', color: 'success' })
  } else {
    await createEmployee(input)
    toast.add({ title: 'Employee created', color: 'success' })
  }
  panelOpen.value = false
}

async function confirmDelete(employee: Employee) {
  if (!window.confirm(`Delete ${employee.fullName}?`)) return
  await removeEmployee(employee.id)
  toast.add({ title: 'Employee deleted', color: 'success' })
}

async function exportEmployeeData() {
  const response = await fetch('/api/employees/export')
  if (!response.ok) {
    toast.add({ title: 'Export failed', color: 'error' })
    return
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'purple-cross-employees.json'
  link.click()
  URL.revokeObjectURL(url)
}

async function importEmployeeData(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const rows = JSON.parse(await file.text())
    await importEmployees(rows)
    toast.add({ title: 'Employee data imported', color: 'success' })
  } catch {
    toast.add({ title: 'Import failed', description: 'Choose a valid Purple Cross employee JSON file.', color: 'error' })
  } finally {
    input.value = ''
  }
}

function sortIcon(field: string) {
  if (filters.sortBy !== field) return 'i-lucide-chevrons-up-down'
  return filters.sortDirection === 'asc' ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex flex-wrap items-center gap-2 text-sm text-muted">
        <span>Server-side table controls</span>
        <UBadge v-if="activeFilters.length === 0" color="neutral" variant="subtle">No filters</UBadge>
        <UBadge v-for="filter in activeFilters" :key="filter" color="neutral" variant="subtle">
          {{ filter }}
        </UBadge>
      </div>

      <div class="flex flex-wrap justify-start gap-2 md:justify-end">
        <input ref="importInput" class="hidden" type="file" accept="application/json,.json" @change="importEmployeeData">
        <UButton icon="i-lucide-upload" color="neutral" variant="outline" class="whitespace-nowrap" @click="importInput?.click()">
          Import JSON
        </UButton>
        <UButton icon="i-lucide-download" color="neutral" variant="outline" class="whitespace-nowrap" @click="exportEmployeeData">
          Export JSON
        </UButton>
        <UButton icon="i-lucide-user-plus" class="whitespace-nowrap" @click="createNewEmployee">
          Create employee
        </UButton>
      </div>
    </div>

    <div class="rounded-lg border border-default bg-default shadow-sm">
      <div class="grid gap-3 border-b border-default p-4 md:grid-cols-[minmax(0,1fr)_13rem_11rem_11rem]">
        <UFormField label="Search employees">
          <UInput v-model="filters.search" icon="i-lucide-search" placeholder="Code, name, role, or department" class="w-full" />
        </UFormField>
        <UFormField label="Department">
          <USelect v-model="filters.department" :items="departmentItems" class="w-full" />
        </UFormField>
        <UFormField label="Status">
          <USelect v-model="filters.status" :items="statusItems" class="w-full" />
        </UFormField>
        <UFormField label="Items per page">
          <USelect v-model="filters.pageSize" :items="pageSizeItems" class="w-full" />
        </UFormField>
      </div>

      <div class="flex flex-col gap-2 border-b border-default px-4 py-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>Showing {{ firstVisibleRecord }}-{{ lastVisibleRecord }} of {{ total }} employees</span>
        <span>Sorted by {{ columns.find(column => column.field === filters.sortBy)?.label }} {{ filters.sortDirection === 'asc' ? 'ascending' : 'descending' }}</span>
      </div>

      <UAlert v-if="error" color="error" variant="subtle" icon="i-lucide-circle-alert" title="Unable to load employees" class="m-4" />

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-default text-sm">
          <thead class="bg-muted/30 text-left text-xs uppercase text-muted">
            <tr>
              <th v-for="column in columns" :key="column.field" class="px-4 py-3 font-medium">
                <button class="inline-flex items-center gap-1 whitespace-nowrap" @click="sort(column.field)">
                  {{ column.label }}
                  <UIcon :name="sortIcon(column.field)" class="size-3.5" />
                </button>
              </th>
              <th class="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-default">
            <tr v-if="pending">
              <td colspan="8" class="px-4 py-10 text-center text-muted">Loading employees...</td>
            </tr>
            <tr v-else-if="employees.length === 0">
              <td colspan="8" class="px-4 py-10 text-center text-muted">No employee records match the current filters.</td>
            </tr>
            <template v-else>
              <tr v-for="employee in employees" :key="employee.id" class="hover:bg-muted/30">
                <td class="whitespace-nowrap px-4 py-3 font-mono text-xs">{{ employee.code }}</td>
                <td class="px-4 py-3">
                  <div class="font-medium">{{ employee.fullName }}</div>
                  <div class="text-xs text-muted">{{ formatSalary(employee.salaryCents) }}</div>
                </td>
                <td class="px-4 py-3">{{ employee.occupation }}</td>
                <td class="px-4 py-3">{{ employee.department }}</td>
                <td class="whitespace-nowrap px-4 py-3">{{ employee.dateOfEmployment }}</td>
                <td class="whitespace-nowrap px-4 py-3">{{ employee.terminationDate ?? 'Current' }}</td>
                <td class="px-4 py-3"><EmployeeStatusBadge :status="employee.status" /></td>
                <td class="px-4 py-3">
                  <div class="flex justify-end gap-1">
                    <UTooltip text="Edit employee"><UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="sm" @click="editEmployee(employee)" /></UTooltip>
                    <UTooltip text="Delete employee"><UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="sm" @click="confirmDelete(employee)" /></UTooltip>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col gap-3 border-t border-default p-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-muted">Page {{ filters.page }} of {{ pageCount }}</p>
        <UPagination v-model:page="filters.page" :total="total" :items-per-page="filters.pageSize" />
      </div>
    </div>

    <EmployeeFormPanel :open="panelOpen" :employee="selectedEmployee" @close="panelOpen = false" @submit="saveEmployee" />
  </section>
</template>
