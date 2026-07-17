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
    const hmrHost = process.env.STORYBOOK_HMR_HOST
    const hmrClientPort = process.env.STORYBOOK_HMR_CLIENT_PORT
      ? Number(process.env.STORYBOOK_HMR_CLIENT_PORT)
      : undefined

    config.server = {
      ...config.server,
      allowedHosts: true,
      hmr: hmrHost
        ? {
            ...(typeof config.server?.hmr === 'object' ? config.server.hmr : {}),
            host: hmrHost,
            protocol: process.env.STORYBOOK_HMR_PROTOCOL ?? 'wss',
            clientPort: hmrClientPort
          }
        : config.server?.hmr
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
