export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth()
  const { data } = await useAsyncData(() => auth.checkRoles(['admin', 'professor']))

  if (!data.value) {
    return await navigateTo('/')
  }
})
