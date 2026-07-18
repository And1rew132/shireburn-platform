import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { createMemoryHistory, createRouter } from 'vue-router'
import NuxtUI from '@nuxt/ui/vue-plugin'
import '../app/assets/css/main.css'

setup((app) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }]
  })

  app.use(router)
  app.use(NuxtUI)
})

const applyColorScheme = (scheme: 'light' | 'dark') => {
  if (typeof document === 'undefined') return

  document.documentElement.classList.toggle('light', scheme === 'light')
  document.documentElement.classList.toggle('dark', scheme === 'dark')
  document.documentElement.style.colorScheme = scheme
}

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
      defaultValue: 'light'
    }
  },
  decorators: [
    (story, context) => {
      const scheme = context.globals.colorScheme === 'dark' ? 'dark' : 'light'
      applyColorScheme(scheme)

      return {
        components: { story },
        template: `<div class="${scheme} min-h-screen bg-default p-6 text-highlighted"><story /></div>`
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
