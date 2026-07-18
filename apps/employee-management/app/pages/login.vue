<script setup lang="ts">
definePageMeta({ layout: false })

const { loggedIn, login } = useAuth()
const email = ref('sarah.mallia@shireburn.com')
const password = ref('shireburn-demo')
const loading = ref(false)

watchEffect(() => {
  if (loggedIn.value) navigateTo('/employees')
})

async function submit() {
  loading.value = true
  await login(email.value)
  loading.value = false
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-muted/30 px-4 py-10 text-highlighted">
    <UCard class="w-full max-w-sm" :ui="{ body: 'space-y-5' }">
      <div class="space-y-1">
        <p class="text-sm font-semibold text-primary">Shireburn Platform</p>
        <h1 class="text-2xl font-semibold tracking-normal">Employee Management</h1>
        <p class="text-sm text-muted">Purple Cross Ltd.</p>
      </div>

      <form class="space-y-4" @submit.prevent="submit">
        <UFormField label="Email">
          <UInput v-model="email" type="email" autocomplete="email" class="w-full" />
        </UFormField>
        <UFormField label="Password">
          <UInput v-model="password" type="password" autocomplete="current-password" class="w-full" />
        </UFormField>
        <UButton type="submit" block icon="i-lucide-log-in" :loading="loading">
          Login
        </UButton>
      </form>
    </UCard>
  </main>
</template>
