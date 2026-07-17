<script setup lang="ts">
const config = useRuntimeConfig()

const links = [
  { label: 'Employees', icon: 'i-lucide-users', to: '/employees' },
  { label: 'Import / Export', icon: 'i-lucide-database', to: '/employees?panel=import' },
  { label: 'Audit Trail', icon: 'i-lucide-clipboard-list', to: '/employees?panel=audit' }
]
</script>

<template>
  <div class="dashboard-shell text-highlighted">
    <header class="sticky top-0 z-20 border-b border-default bg-default/85 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-md bg-primary text-inverted">
            <UIcon name="i-lucide-cross" class="size-5" />
          </div>
          <div>
            <p class="text-sm font-semibold leading-5">{{ config.public.appName }}</p>
            <p class="text-xs text-muted">Purple Cross Ltd onboarding workspace</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <UButton
            icon="i-lucide-bell"
            color="neutral"
            variant="ghost"
            aria-label="Notifications"
          />
          <UUser
            name="Sarah Mallia"
            description="Product Admin"
            :avatar="{ src: 'https://i.pravatar.cc/96?img=47' }"
          />
        </div>
      </div>
    </header>

    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8">
      <aside class="hidden lg:block">
        <nav class="sticky top-24 space-y-1">
          <UButton
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            :icon="link.icon"
            color="neutral"
            variant="ghost"
            block
            class="justify-start"
          >
            {{ link.label }}
          </UButton>
        </nav>
      </aside>

      <main>
        <slot />
      </main>
    </div>
  </div>
</template>
