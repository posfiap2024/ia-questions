export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth()
  const { data } = await useAsyncData(() => auth.check())

  if (to.path === '/login') {
    if (data.value) {
      return await navigateTo('/')
    }

    return
  }

  if (!data.value) {
    return await navigateTo('/login')
  }
})
