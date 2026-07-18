<script setup lang="ts">
const links = [
  { label: 'Employees', icon: 'i-lucide-users', to: '/employees' }
]
</script>

<template>
  <UDashboardGroup class="dashboard-shell text-highlighted">
    <LeftDrawer :links="links" />

    <UDashboardPanel>
      <AppBar />

      <div class="flex-1 overflow-y-auto">
        <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <slot />
        </main>
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
