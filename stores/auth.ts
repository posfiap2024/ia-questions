import consola from "consola"
import { useSessionStorage } from "@vueuse/core"

export const useAuth = defineStore('auth', () => {
  const fetch = useRequestFetch()
  const user = ref<User>()
  const token = useSessionStorage('token', '')

  function setUser(newUser: User) {
    user.value = newUser
  }

  function setToken(newToken: string) {
    token.value = newToken
  }

  async function login(username: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: { username, password }
      })

      setUser(response.user)
      setToken(response.token)
      return true
    } catch (error: any) {
      consola.error(error)
      return false
    }
  }

  async function check() {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'same-origin'
      })

      setUser(response.user)
      return true
    } catch (error: any) {
      return false
    }
  }

  return {
    user,
    token,
    login,
    check
  }
})
