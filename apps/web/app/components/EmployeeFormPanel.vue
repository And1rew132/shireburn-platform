<script setup lang="ts">
import { employeeFormSchema, type Employee, type EmployeeFormInput } from '@purple-cross/shared'
import { reactive, ref, watch } from 'vue'

const props = defineProps<{ employee?: Employee | null; open: boolean }>()
const emit = defineEmits<{ close: []; submit: [input: EmployeeFormInput] }>()

interface EmployeeFormState {
  code: string
  fullName: string
  occupation: string
  department: string
  dateOfEmployment: string
  terminationDate?: string
  nationalId?: string
  salaryCents?: number
  emergencyContact?: string
  confidentialNotes?: string
}

const emptyForm = (): EmployeeFormState => ({
  code: '',
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: new Date().toISOString().slice(0, 10),
  terminationDate: undefined,
  nationalId: undefined,
  salaryCents: undefined,
  emergencyContact: undefined,
  confidentialNotes: undefined
})

const state = reactive<EmployeeFormState>(emptyForm())
const formError = ref<string | null>(null)

watch(
  () => props.employee,
  (employee) => {
    Object.assign(state, employee ? {
      code: employee.code,
      fullName: employee.fullName,
      occupation: employee.occupation,
      department: employee.department,
      dateOfEmployment: employee.dateOfEmployment,
      terminationDate: employee.terminationDate ?? undefined,
      nationalId: employee.nationalId ?? undefined,
      salaryCents: employee.salaryCents ?? undefined,
      emergencyContact: employee.emergencyContact ?? undefined,
      confidentialNotes: employee.confidentialNotes ?? undefined
    } : emptyForm())
    formError.value = null
  },
  { immediate: true }
)

function submit() {
  const parsed = employeeFormSchema.safeParse(state)
  if (!parsed.success) {
    formError.value = parsed.error.issues[0]?.message ?? 'Check the employee form'
    return
  }
  formError.value = null
  emit('submit', parsed.data)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex justify-end bg-black/30" @click.self="emit('close')">
      <aside class="h-full w-full max-w-3xl overflow-y-auto border-l border-default bg-default p-6 shadow-xl">
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold">{{ employee ? 'Edit employee' : 'Create employee' }}</h2>
            <p class="mt-1 text-sm text-muted">Maintain employee details and confidential HR fields.</p>
          </div>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" aria-label="Close" @click="emit('close')" />
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <UAlert v-if="formError" color="error" variant="subtle" icon="i-lucide-circle-alert" :title="formError" />

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField label="Employee code" required><UInput v-model="state.code" placeholder="EMP051" class="w-full" /></UFormField>
            <UFormField label="Full name" required><UInput v-model="state.fullName" placeholder="Jane Borg" class="w-full" /></UFormField>
            <UFormField label="Occupation" required><UInput v-model="state.occupation" placeholder="Pharmacist" class="w-full" /></UFormField>
            <UFormField label="Department" required><UInput v-model="state.department" placeholder="Research" class="w-full" /></UFormField>
            <UFormField label="Employment date" required><UInput v-model="state.dateOfEmployment" type="date" class="w-full" /></UFormField>
            <UFormField label="Termination date"><UInput v-model="state.terminationDate" type="date" class="w-full" /></UFormField>
            <UFormField label="National ID"><UInput v-model="state.nationalId" placeholder="Optional" class="w-full" /></UFormField>
            <UFormField label="Salary"><UInput v-model="state.salaryCents" type="number" min="0" step="100" placeholder="Cents" class="w-full" /></UFormField>
            <UFormField label="Emergency contact"><UInput v-model="state.emergencyContact" placeholder="Name and phone number" class="w-full" /></UFormField>
            <UFormField label="Confidential notes" class="sm:col-span-2"><UTextarea v-model="state.confidentialNotes" :rows="4" placeholder="Restricted HR notes" class="w-full" /></UFormField>
          </div>

          <div class="flex justify-end gap-2 border-t border-default pt-4">
            <UButton color="neutral" variant="ghost" type="button" @click="emit('close')">Cancel</UButton>
            <UButton icon="i-lucide-save" type="submit">Save employee</UButton>
          </div>
        </form>
      </aside>
    </div>
  </Teleport>
</template>
