<script setup lang="ts">
interface NavigationLink {
  label: string
  icon: string
  to: string
}

defineProps<{ links: NavigationLink[]; open: boolean }>()
defineEmits<{ close: []; 'update:open': [open: boolean] }>()
</script>

<template>
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

  <UDrawer
    :open="open"
    direction="left"
    title="Navigation"
    description="Shireburn Platform employee management"
    :handle="false"
    :ui="{ content: 'max-w-72', body: 'p-4' }"
    class="lg:hidden"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <nav class="space-y-1">
        <UButton
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          :icon="link.icon"
          color="neutral"
          variant="ghost"
          block
          class="justify-start"
          @click="$emit('close')"
        >
          {{ link.label }}
        </UButton>
      </nav>
    </template>
  </UDrawer>
</template>
