<template>
  <div class="flex w-full min-h-svh items-center justify-center bg-indigo-300">
    <form
      action="/api/auth/login"
      class="flex flex-col gap-6 w-96 bg-neutral-100 drop-shadow-md p-6 rounded-2xl"
      @submit.prevent="handleSubmit"
    >
      <label class="flex flex-col gap-2">
        <span class="text-md font-bold">Usuário</span>
        <input
          type="text"
          class="w-full h-10 px-4 border border-neutral-300 rounded-md"
          v-model="username"
        />
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-md font-bold">Senha</span>
        <input
          type="password"
          class="w-full h-10 px-4 border border-neutral-300 rounded-md"
          v-model="password"
        />
      </label>

      <UiButton
        type="submit"
        variant="primary"
      >
        Entrar
      </UiButton>
    </form>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ middleware: ['auth'] })
  useHead({ title: 'Login' })

  const auth = useAuth()
  const username = ref('')
  const password = ref('')

  async function handleSubmit() {
    const response = await auth.login(username.value, password.value)

    if (!response) {
      return
    }

    redirect()
  }

  function redirect() {
    navigateTo('/')
  }
</script>
