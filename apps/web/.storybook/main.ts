import type { StorybookConfig } from '@storybook/vue3-vite'
import vue from '@vitejs/plugin-vue'
import nuxtUi from '@nuxt/ui/vite'

const config: StorybookConfig = {
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  stories: ['../app/**/*.stories.@(ts|tsx|js|jsx|vue)'],
  addons: ['@storybook/addon-a11y'],
  docs: {
    autodocs: 'tag'
  },
  async viteFinal(config) {
    config.plugins = config.plugins ?? []
    config.server = {
      ...config.server,
      allowedHosts: true
    }
    const nuxtUiPlugins = nuxtUi({
      root: process.cwd(),
      colorMode: false,
      theme: {
        colors: ['primary', 'secondary', 'success', 'warning', 'error', 'neutral']
      },
      ui: {
        colors: {
          primary: 'violet',
          secondary: 'sky',
          success: 'emerald',
          warning: 'amber',
          error: 'rose',
          neutral: 'slate'
        }
      }
    })

    config.plugins.push(
      vue(),
      ...(Array.isArray(nuxtUiPlugins) ? nuxtUiPlugins : [nuxtUiPlugins])
    )
    return config
  }
}

export default config
