<script setup lang="ts">
defineEmits<{ toggleNavigation: [] }>()
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-default bg-default/85 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex min-w-0 items-center gap-3">
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          class="lg:hidden"
          aria-label="Open navigation"
          @click="$emit('toggleNavigation')"
        />

        <div class="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-inverted">
          <UIcon name="i-lucide-building-2" class="size-5" />
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold leading-5">Shireburn Platform</p>
          <p class="truncate text-xs text-muted">Employee Management</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <UBadge color="neutral" variant="subtle" class="hidden sm:inline-flex">Purple Cross Ltd.</UBadge>
        <UUser
          name="Sarah Mallia"
          description="Product Admin"
          :avatar="{ src: 'https://i.pravatar.cc/96?img=47' }"
        />
      </div>
    </div>
  </header>
</template>
