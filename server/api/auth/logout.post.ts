export default defineProtectedHandler(async (event) => {
  setResponseHeader(event, 'Set-Cookie', `token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
  return true
})
