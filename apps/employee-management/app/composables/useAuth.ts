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
    sameSite: 'lax',
    path: '/'
  })
  const sessionState = useState<string | null>('shireburn_demo_session', () => sessionEmail.value)

  const user = computed<DemoUser | null>(() => {
    if (!sessionState.value) return null

    return {
      ...demoUser,
      email: sessionState.value
    }
  })
  const loggedIn = computed(() => Boolean(sessionState.value))

  async function login(email: string) {
    sessionState.value = email
    sessionEmail.value = email
    await navigateTo('/employees', { replace: true })
  }

  async function logout() {
    sessionState.value = null
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
