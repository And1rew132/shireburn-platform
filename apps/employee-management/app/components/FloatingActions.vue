<script setup lang="ts">
import type { FloatingActionConfig } from '~/composables/useFloatingActions'

const props = defineProps<{ actions: FloatingActionConfig[] }>()

const open = ref(false)
const { runFloatingAction } = useFloatingActions()

const hasActions = computed(() => props.actions.length > 0)

async function run(action: FloatingActionConfig) {
  open.value = false
  await runFloatingAction(action.action)
}
</script>

<template>
  <div v-if="hasActions" class="fixed bottom-6 right-6 z-20 flex flex-col items-end gap-3">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div v-if="open" class="flex flex-col items-end gap-2">
        <UButton
          v-for="action in actions"
          :key="action.action"
          :icon="action.icon"
          :color="action.color ?? 'primary'"
          variant="solid"
          size="lg"
          class="shadow-lg"
          @click="run(action)"
        >
          {{ action.title }}
        </UButton>
      </div>
    </Transition>

    <UTooltip :text="open ? 'Close floating actions' : 'Open floating actions'">
      <UButton
        :icon="open ? 'i-lucide-x' : 'i-lucide-plus'"
        :aria-label="open ? 'Close floating actions' : 'Open floating actions'"
        color="primary"
        size="xl"
        class="size-14 justify-center rounded-full shadow-xl"
        @click="open = !open"
      />
    </UTooltip>
  </div>
</template>
