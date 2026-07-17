import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
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
