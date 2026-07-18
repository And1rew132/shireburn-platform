<script setup lang="ts">
const navigationOpen = ref(false)

const links = [
  { label: 'Employees', icon: 'i-lucide-users', to: '/employees' }
]
</script>

<template>
  <div class="dashboard-shell text-highlighted">
    <AppBar @toggle-navigation="navigationOpen = true" />

    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8">
      <LeftDrawer
        v-model:open="navigationOpen"
        :links="links"
        @close="navigationOpen = false"
      />

      <main>
        <slot />
      </main>
    </div>
  </div>
</template>
