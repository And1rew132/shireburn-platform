import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  resolve: {
    alias: {
      '#app-manifest': fileURLToPath(new URL('./test/app-manifest.ts', import.meta.url))
    }
  },
  test: {
    environment: 'nuxt',
    include: ['app/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['app/components/**/*.vue'],
      exclude: ['app/**/*.stories.ts']
    }
  }
})
