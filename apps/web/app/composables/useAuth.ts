interface DemoUser {
  name: string
  email: string
  role: string
}

const demoUser = {
  name: 'Sarah Mallia',
  role: 'Product Admin'
}

export function useAuth() {
  const sessionEmail = useCookie<string | null>('shireburn_demo_session', {
    default: () => null,
    sameSite: 'lax'
  })

  const user = computed<DemoUser | null>(() => {
    if (!sessionEmail.value) return null

    return {
      ...demoUser,
      email: sessionEmail.value
    }
  })
  const loggedIn = computed(() => Boolean(sessionEmail.value))

  async function login(email: string) {
    sessionEmail.value = email
    await navigateTo('/employees', { replace: true })
  }

  async function logout() {
    sessionEmail.value = null
    await navigateTo('/login', { replace: true })
  }

  return {
    user,
    loggedIn,
    login,
    logout
  }
}
