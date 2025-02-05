<template>
  <header class="h-16 bg-neutral-100 border-b border-neutral-300">
    <div class="flex justify-between items-center h-full container mx-auto">
      <NuxtLink class="flex flex-col gap-1 cursor-pointer" to="/">
        <h1 class="text-md text-neutral-700 font-bold">IA Questions</h1>
      </NuxtLink>

      <UiButton
        as="button"
        type="button"
        variant="secondary"
        @click="handleLogout"
      >
        Sair
      </UiButton>
    </div>
  </header>
</template>

<script setup lang="ts">
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigateTo('/login')
  }
</script>
