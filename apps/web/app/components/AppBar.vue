<script setup lang="ts">
defineProps<{ pageTitle: string }>()

const { user, logout } = useAuth()
</script>

<template>
  <UDashboardNavbar class="bg-default/85 backdrop-blur">
    <template #left>
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold leading-5">{{ pageTitle }}</p>
      </div>
    </template>

    <template #right>
      <UBadge color="neutral" variant="subtle" class="hidden sm:inline-flex">Purple Cross Ltd.</UBadge>
      <UUser
        :name="user?.name ?? 'Shireburn User'"
        :description="user?.role ?? 'Product Admin'"
        :avatar="{ src: 'https://i.pravatar.cc/96?img=47' }"
      />
      <UTooltip text="Logout">
        <UButton icon="i-lucide-log-out" color="neutral" variant="ghost" aria-label="Logout" @click="logout" />
      </UTooltip>
    </template>
  </UDashboardNavbar>
</template>
