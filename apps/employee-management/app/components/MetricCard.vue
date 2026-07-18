<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon: string
  tone?: 'primary' | 'success' | 'warning' | 'error' | 'neutral'
}>()
</script>

<template>
  <div class="rounded-lg border border-default bg-default p-4 shadow-sm">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-sm text-muted">{{ label }}</p>
        <p class="mt-1 text-2xl font-semibold">{{ value }}</p>
      </div>
      <div class="grid size-10 place-items-center rounded-md bg-elevated">
        <UIcon :name="icon" class="size-5 text-primary" />
      </div>
    </div>
  </div>
</template>
