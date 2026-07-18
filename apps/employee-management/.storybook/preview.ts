import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { createMemoryHistory, createRouter } from 'vue-router'
import NuxtUI from '@nuxt/ui/vue-plugin'
import '../app/assets/css/main.css'
import { computed } from 'vue'

setup((app) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }]
  })

  app.use(router)
  app.use(NuxtUI)
})

const preview: Preview = {
  globalTypes: {
    colorScheme: {
      description: 'Preview color scheme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ],
        dynamicTitle: true
      },
      defaultValue: 'dark'
    }
  },
  decorators: [
    (story, { globals }) => {
      return {
        components: { story },
        setup() {
          const scheme = computed(() => globals.colorScheme === 'dark' ? 'dark' : 'light');
          return { scheme };
        },
        template: `
        <div
          class="min-h-screen bg-default p-6 text-highlighted"
          :class="scheme"
        >
          <story />
        </div>
      `,
      }
    }
  ],
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
    a11y: { test: 'todo' }
  }
}

export default preview
