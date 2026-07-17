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
  removeEmployee,
  sort,
  updateEmployee
} = useEmployees()

const route = useRoute()
const selectedEmployee = ref<Employee | null>(null)
const panelOpen = ref(route.query.create === '1')
const toast = useToast()

const departmentItems = computed(() => [
  { label: 'All departments', value: 'all' },
  ...departments.value.map((department) => ({ label: department, value: department }))
])

const statusItems = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Future', value: 'FUTURE' },
  { label: 'Terminated', value: 'TERMINATED' }
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

const metrics = computed(() => {
  const active = employees.value.filter((employee) => employee.status === 'ACTIVE').length
  const future = employees.value.filter((employee) => employee.status === 'FUTURE').length
  const terminated = employees.value.filter((employee) => employee.status === 'TERMINATED').length

  return { active, future, terminated }
})

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

function sortIcon(field: string) {
  if (filters.sortBy !== field) return 'i-lucide-chevrons-up-down'
  return filters.sortDirection === 'asc' ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 border-b border-default pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm font-medium text-primary">Purple Cross Ltd</p>
        <h1 class="mt-1 text-3xl font-semibold tracking-normal">Employee management</h1>
        <p class="mt-2 max-w-3xl text-sm text-muted">
          Centralized employee records with HR-only confidential fields, sortable grid controls, and import/export support.
        </p>
      </div>
      <div class="flex gap-2">
        <UButton to="/api/employees/export" icon="i-lucide-download" color="neutral" variant="outline">Export</UButton>
        <button type="button" class="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-inverted shadow-sm hover:bg-primary/90" @click="createNewEmployee"><UIcon name="i-lucide-user-plus" class="size-4" />Create employee</button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <MetricCard label="Matching records" :value="total" icon="i-lucide-database" />
      <MetricCard label="Active on page" :value="metrics.active" icon="i-lucide-badge-check" />
      <MetricCard label="Future starts" :value="metrics.future" icon="i-lucide-calendar-plus" />
      <MetricCard label="Terminated" :value="metrics.terminated" icon="i-lucide-archive" />
    </div>

    <div class="rounded-lg border border-default bg-default shadow-sm">
      <div class="grid gap-3 border-b border-default p-4 md:grid-cols-[minmax(0,1fr)_13rem_11rem_8rem]">
        <UInput v-model="filters.search" icon="i-lucide-search" placeholder="Search code, name, role, or department" />
        <USelect v-model="filters.department" :items="departmentItems" />
        <USelect v-model="filters.status" :items="statusItems" />
        <USelect v-model="filters.pageSize" :items="[10, 15, 25, 50]" />
      </div>

      <UAlert v-if="error" color="error" variant="subtle" icon="i-lucide-circle-alert" title="Unable to load employees" class="m-4" />

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-default text-sm">
          <thead class="bg-muted/30 text-left text-xs uppercase text-muted">
            <tr>
              <th v-for="column in columns" :key="column.field" class="px-4 py-3 font-medium">
                <button class="inline-flex items-center gap-1" @click="sort(column.field)">
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
        <p class="text-sm text-muted">Page {{ filters.page }} of {{ pageCount }} - {{ total }} records</p>
        <UPagination v-model:page="filters.page" :total="total" :items-per-page="filters.pageSize" />
      </div>
    </div>

    <EmployeeFormPanel :open="panelOpen" :employee="selectedEmployee" @close="panelOpen = false" @submit="saveEmployee" />
  </section>
</template>
