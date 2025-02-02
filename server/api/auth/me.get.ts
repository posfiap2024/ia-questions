export default defineProtectedHandler(async (event) => {
  const { user } = event.context

  return user
})
