<script setup lang="ts">
import type { FloatingActionConfig } from '~/composables/useFloatingActions'

const props = withDefaults(defineProps<{
  pageTitle?: string
  floatingActions?: FloatingActionConfig[]
}>(), {
  pageTitle: 'Employee Management',
  floatingActions: () => []
})

const links = [
  { label: 'Employees', icon: 'i-lucide-users', to: '/employees' }
]
</script>

<template>
  <UDashboardGroup class="dashboard-shell text-highlighted">
    <LeftDrawer :links="links" />

    <UDashboardPanel>
      <AppBar :page-title="props.pageTitle" />

      <div class="flex-1 overflow-y-auto">
        <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <slot />
        </main>
      </div>
    </UDashboardPanel>

    <FloatingActions :actions="props.floatingActions" />
  </UDashboardGroup>
</template>
