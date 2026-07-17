import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { createMemoryHistory, createRouter } from 'vue-router'
import '../app/assets/css/main.css'

setup((app) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }]
  })

  app.use(router)
})

const preview: Preview = {
  decorators: [
    (story) => ({
      components: { story },
      template: '<div class="min-h-screen bg-default p-6 text-highlighted"><story /></div>'
    })
  ],
  parameters: {
    controls: { expanded: true },
    a11y: { test: 'todo' }
  }
}

export default preview
