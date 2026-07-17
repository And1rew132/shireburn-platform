export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  compatibilityDate: '2026-07-17',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  runtimeConfig: {
    sessionSecret: process.env.SESSION_SECRET,
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? 'Shireburn Platform - Employee Management'
    }
  },
  typescript: {
    strict: true
  },
  vite: {
    server: {
      fs: {
        allow: ['../..']
      }
    }
  }
})
