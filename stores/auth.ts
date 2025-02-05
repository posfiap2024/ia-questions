import consola from "consola"
import { useSessionStorage } from "@vueuse/core"

export const useAuth = defineStore('auth', () => {
  const fetch = useRequestFetch()
  const user = ref<User>()
  const token = useSessionStorage('token', '')

  function setUser(newUser: User | undefined) {
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

      setUser(response)
      return true
    } catch (error: any) {
      return false
    }
  }

  async function checkRoles(roles: string[]) {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'same-origin'
      })

      setUser(response)
      return roles.includes(response.role.name)
    } catch (error: any) {
      return false
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin'
      })

      setUser(undefined)
      setToken('')
      return true
    } catch (error) {
      return false
    }
  }

  return {
    user,
    token,
    login,
    logout,
    check,
    checkRoles
  }
})
