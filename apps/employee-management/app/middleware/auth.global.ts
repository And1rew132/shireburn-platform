export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/login') return

  const { loggedIn } = useAuth()
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
