import type {
  Employee,
  EmployeeFormInput,
  EmployeeListResult,
  EmployeeSortDirection,
  EmployeeSortField,
  EmployeeStatus
} from '@purple-cross/shared'

export interface EmployeeFilters {
  page: number
  pageSize: number
  search: string
  department: string
  status: EmployeeStatus | 'all'
  sortBy: EmployeeSortField
  sortDirection: EmployeeSortDirection
}

export function useEmployees() {
  const filters = reactive<EmployeeFilters>({
    page: 1,
    pageSize: 15,
    search: '',
    department: 'all',
    status: 'all',
    sortBy: 'code',
    sortDirection: 'asc'
  })

  const query = computed(() => ({ ...filters }))
  const { data, pending, error, refresh } = useFetch<EmployeeListResult>('/api/employees', {
    query,
    default: () => ({
      data: [],
      total: 0,
      page: 1,
      pageSize: 15,
      departments: []
    })
  })

  const employees = computed(() => data.value.data)
  const total = computed(() => data.value.total)
  const departments = computed(() => data.value.departments)
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / filters.pageSize)))

  watch(
    () => [filters.search, filters.department, filters.status, filters.pageSize],
    () => {
      filters.page = 1
    }
  )

  async function createEmployee(input: EmployeeFormInput) {
    await $fetch<Employee>('/api/employees', { method: 'POST', body: input })
    await refresh()
  }

  async function updateEmployee(id: string, input: EmployeeFormInput) {
    await $fetch<Employee>(`/api/employees/${id}`, { method: 'PATCH', body: input })
    await refresh()
  }

  async function removeEmployee(id: string) {
    await $fetch(`/api/employees/${id}`, { method: 'DELETE' })
    await refresh()
  }

  async function importEmployees(rows: unknown) {
    await $fetch('/api/employees/import', { method: 'POST', body: rows as Record<string, unknown>[] })
    await refresh()
  }

  function sort(field: EmployeeSortField) {
    if (filters.sortBy === field) {
      filters.sortDirection = filters.sortDirection === 'asc' ? 'desc' : 'asc'
      return
    }
    filters.sortBy = field
    filters.sortDirection = 'asc'
  }

  return {
    departments,
    employees,
    error,
    filters,
    pageCount,
    pending,
    total,
    createEmployee,
    refresh,
    importEmployees,
    removeEmployee,
    sort,
    updateEmployee
  }
}
