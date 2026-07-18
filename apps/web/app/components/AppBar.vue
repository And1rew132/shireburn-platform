<template>
  <UDashboardNavbar class="bg-default/85 backdrop-blur">
    <template #left>
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

    <template #right>
      <UBadge color="neutral" variant="subtle" class="hidden sm:inline-flex">Purple Cross Ltd.</UBadge>
      <UUser
        name="Sarah Mallia"
        description="Product Admin"
        :avatar="{ src: 'https://i.pravatar.cc/96?img=47' }"
      />
    </template>
  </UDashboardNavbar>
</template>
