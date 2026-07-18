<script setup lang="ts">
import type { EmployeeStatus } from '@shireburn-platform/shared'
import { computed } from 'vue'

const props = defineProps<{ status: EmployeeStatus }>()

const color = computed(() => {
  if (props.status === 'ACTIVE') return 'success'
  if (props.status === 'FUTURE') return 'warning'
  return 'neutral'
})

const label = computed(() => props.status.replace('_', ' ').toLowerCase())
</script>

<template>
  <UBadge :color="color" variant="subtle" class="capitalize">
    {{ label }}
  </UBadge>
</template>
