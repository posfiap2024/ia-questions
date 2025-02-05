export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth()
  const { data } = await useAsyncData(() => auth.checkRoles(['student']))

  if (!data.value) {
    return await navigateTo('/admin')
  }
})
