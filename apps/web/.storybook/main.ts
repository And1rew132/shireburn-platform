import type { StorybookConfig } from '@storybook/vue3-vite'
import vue from '@vitejs/plugin-vue'

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
    config.plugins.push(vue())
    return config
  }
}

export default config
