<script setup lang="ts">
interface NavigationLink {
  label: string
  icon: string
  to: string
}

defineProps<{ links: NavigationLink[] }>()
</script>

<template>
  <UDashboardSidebar
    mode="drawer"
    :menu="{
      title: 'Navigation',
      description: 'Shireburn Platform employee management'
    }"
    >
    <template #header>
      <div class="flex min-w-0 items-center gap-3">
        <div class="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-inverted">
          <UIcon name="i-lucide-building-2" class="size-5" />
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold leading-5">Shireburn Platform</p>
          <p class="truncate text-xs text-muted">Employee Management</p>
        </div>
      </div>
    </template>

    <template #default>
      <nav class="floating-action-safe-bottom space-y-1">
        <UButton v-for="link in links" :key="link.label" :to="link.to" :icon="link.icon" color="neutral" variant="ghost"
          block class="justify-start">
          {{ link.label }}
        </UButton>
      </nav>
    </template>
  </UDashboardSidebar>
</template>
